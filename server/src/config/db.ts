import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export type DbMode = 'remote' | 'local' | 'memory' | 'disconnected';

const LOCAL_HOSTS = ['127.0.0.1', 'localhost', '::1', '0.0.0.0'];
const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/flipped_classroom';

let isConnected = false;
let dbMode: DbMode = 'disconnected';
let connectingPromise: Promise<void> | null = null;

/**
 * Môi trường triển khai thật (Render / Vercel / NODE_ENV=production).
 * Lưu ý: Render KHÔNG tự đặt NODE_ENV=production, nhưng luôn đặt biến RENDER=true.
 */
export const isProductionRuntime = (): boolean =>
  process.env.NODE_ENV === 'production' || !!process.env.RENDER || !!process.env.VERCEL;

const isLocalUri = (uri: string): boolean => {
  try {
    if (uri.startsWith('mongodb+srv://')) return false;
    const hostPart = uri.replace(/^mongodb:\/\//, '').split('/')[0].split('@').pop() || '';
    const hosts = hostPart.split(',').map((h) => h.replace(/:\d+$/, '').replace(/^\[|\]$/g, ''));
    return hosts.every((h) => LOCAL_HOSTS.includes(h));
  } catch {
    return false;
  }
};

/**
 * Chỉ cho phép fallback sang MongoMemoryServer (dữ liệu mất khi restart) khi:
 * - KHÔNG chạy trên môi trường production (Render/Vercel/NODE_ENV=production), VÀ
 * - URI đang trỏ tới MongoDB local (không phải Atlas/remote).
 * Có thể ép bật bằng ALLOW_MEMORY_DB=true (chỉ dùng cho test).
 */
const canUseMemoryFallback = (uri: string): boolean => {
  if (process.env.ALLOW_MEMORY_DB === 'true') return true;
  if (isProductionRuntime()) return false;
  return isLocalUri(uri);
};

/** Thông tin kết nối DB hiện tại (không lộ credentials) */
export const getDbInfo = () => {
  const conn = mongoose.connection;
  const connected = conn.readyState === 1;
  return {
    connected,
    mode: connected ? dbMode : ('disconnected' as DbMode),
    host: connected ? conn.host : null,
    name: connected ? conn.name : null,
    persistent: connected && dbMode !== 'memory',
  };
};

/** true nếu đang kết nối tới DB local/in-memory (an toàn để xoá/seed lại) */
export const isConnectedToLocalDb = (): boolean => {
  const { connected, mode } = getDbInfo();
  return connected && (mode === 'local' || mode === 'memory');
};

const doConnect = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;

  if (!process.env.MONGODB_URI && isProductionRuntime()) {
    throw new Error('[MongoDB] MONGODB_URI chưa được cấu hình trên môi trường production. Từ chối khởi động để tránh mất dữ liệu.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    dbMode = isLocalUri(mongoUri) ? 'local' : 'remote';
    console.log(`[MongoDB] Connected successfully (${dbMode}) to: ${conn.connection.host}/${conn.connection.name}`);
    return;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${(error as Error).message}`);

    if (!canUseMemoryFallback(mongoUri)) {
      // Production / remote URI: KHÔNG fallback sang RAM, báo lỗi để deploy thất bại rõ ràng
      throw new Error('[MongoDB] Không thể kết nối database. In-memory fallback bị tắt ở production/remote URI để tránh mất dữ liệu.');
    }
  }

  console.warn('[MongoDB] ⚠️ Starting in-memory MongoDB fallback (DEV ONLY — dữ liệu sẽ MẤT khi restart)...');
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const memoryUri = mongod.getUri();
  await mongoose.connect(memoryUri);
  isConnected = true;
  dbMode = 'memory';
  console.warn(`[MongoDB] Connected to in-memory MongoDB at: ${memoryUri}`);
};

export const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  // Tránh nhiều request đồng thời cùng mở kết nối
  if (!connectingPromise) {
    connectingPromise = doConnect().finally(() => {
      connectingPromise = null;
    });
  }
  return connectingPromise;
};
