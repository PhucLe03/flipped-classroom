import dotenv from 'dotenv';
dotenv.config();

interface HealthResponse {
  status?: string;
  service?: string;
  uptime?: number;
  database?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface PingResult {
  success: boolean;
  statusCode?: number;
  durationMs: number;
  attempt: number;
  data?: HealthResponse;
  error?: string;
}

/**
 * Chuẩn hóa URL mục tiêu để luôn trỏ tới /api/health
 */
export function normalizeHealthUrl(rawUrl: string): string {
  let clean = rawUrl.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  // Loại bỏ slash thừa ở cuối
  clean = clean.replace(/\/+$/, '');
  if (!clean.endsWith('/api/health')) {
    clean = `${clean}/api/health`;
  }
  return clean;
}

/**
 * Thực hiện 1 lượt ping với timeout kiểm soát
 */
async function singlePing(url: string, timeoutMs: number): Promise<{ statusCode: number; durationMs: number; data: HealthResponse }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const startTime = Date.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'FlippedClassroom-KeepAliveBot/1.0',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    const durationMs = Date.now() - startTime;
    clearTimeout(timer);

    let data: HealthResponse = {};
    try {
      data = await res.json();
    } catch {
      // Bỏ qua nếu body không phải JSON
    }

    return {
      statusCode: res.status,
      durationMs,
      data,
    };
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Chạy quy trình Keep-Alive với cơ chế tự động thử lại (Retry)
 */
export async function runKeepAlive(
  targetUrlInput?: string,
  options: { maxRetries?: number; timeoutMs?: number; delayBetweenRetriesMs?: number } = {}
): Promise<PingResult> {
  const maxRetries = options.maxRetries ?? 3;
  const timeoutMs = options.timeoutMs ?? 60000; // 60s cho Render cold start
  const delayMs = options.delayBetweenRetriesMs ?? 3000;

  const rawUrl =
    targetUrlInput ||
    process.env.TARGET_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://flipped-classroom.onrender.com';

  const healthUrl = normalizeHealthUrl(rawUrl);

  console.log('====================================================');
  console.log('🚀 FLIPPED CLASSROOM - BACKEND KEEP-ALIVE PING');
  console.log('====================================================');
  console.log(`🎯 URL Mục tiêu : ${healthUrl}`);
  console.log(`⏱️ Timeout      : ${timeoutMs / 1000}s`);
  console.log(`🔁 Số lần thử tối đa: ${maxRetries}`);
  console.log(`📅 Thời gian    : ${new Date().toISOString()}`);
  console.log('----------------------------------------------------');

  let lastError = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\n📡 [Lần ${attempt}/${maxRetries}] Đang gửi tín hiệu đánh thức...`);

    try {
      const { statusCode, durationMs, data } = await singlePing(healthUrl, timeoutMs);

      if (statusCode === 200 && data?.status === 'ok') {
        console.log(`✅ [THÀNH CÔNG] Backend phản hồi HTTP ${statusCode} trong ${durationMs}ms`);
        console.log(`   - Dịch vụ       : ${data.service || 'N/A'}`);
        console.log(`   - Cơ sở dữ liệu : ${data.database || 'N/A'}`);
        console.log(`   - Uptime        : ${data.uptime !== undefined ? `${data.uptime}s` : 'N/A'}`);
        console.log(`   - Timestamp     : ${data.timestamp || 'N/A'}`);
        console.log('====================================================');
        console.log('🎉 Backend đã thức dậy và hoạt động ổn định!');
        console.log('====================================================\n');

        return {
          success: true,
          statusCode,
          durationMs,
          attempt,
          data,
        };
      } else {
        console.warn(`⚠️ [CẢNH BÁO] Phản hồi bất thường HTTP ${statusCode} trong ${durationMs}ms`);
        lastError = `HTTP ${statusCode}`;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`⏳ [TIMEOUT] Request bị quá hạn sau ${timeoutMs / 1000}s (Instance có thể đang khởi động từ Cold Start)`);
        lastError = 'Request Timeout (Cold Start)';
      } else {
        console.warn(`❌ [LỖI KẾT NỐI] ${err.message || err}`);
        lastError = err.message || String(err);
      }
    }

    if (attempt < maxRetries) {
      console.log(`⏳ Chờ ${delayMs / 1000}s trước khi thử lại...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.error(`\n❌ [THẤT BẠI] Không thể đánh thức backend sau ${maxRetries} lần thử. Lỗi cuối: ${lastError}`);
  return {
    success: false,
    durationMs: 0,
    attempt: maxRetries,
    error: lastError,
  };
}

// Chạy trực tiếp từ dòng lệnh
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/keep-alive.ts')) {
  const customUrl = process.argv[2];
  runKeepAlive(customUrl)
    .then((result) => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Fatal keep-alive error:', err);
      process.exit(1);
    });
}
