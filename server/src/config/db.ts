import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flipped_classroom';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] MongoDB connection at ${mongoUri} failed: ${(error as Error).message}`);
    console.log('[MongoDB] Starting in-memory MongoDB instance fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[MongoDB] Failed to initialize in-memory MongoDB:', memErr);
    }
  }
};
