import http from 'http';
import app from './src/index';
import { runKeepAlive, normalizeHealthUrl } from './scripts/keep-alive';

async function runKeepAliveTests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG: GIẢI PHÁP CRON JOB & KEEP-ALIVE BACKEND');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS ${total}] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL ${total}] ${testName}`);
    }
  }

  // 1. Kiểm tra thuật toán chuẩn hóa URL
  console.log('--- KHỐI 1: CHUẨN HÓA URL MỤC TIÊU (URL NORMALIZER) ---');
  const u1 = normalizeHealthUrl('https://flipped-classroom.onrender.com');
  assert(u1 === 'https://flipped-classroom.onrender.com/api/health', 'Chuẩn hóa domain gốc thành endpoint /api/health');

  const u2 = normalizeHealthUrl('flipped-classroom.onrender.com/api/health/');
  assert(u2 === 'https://flipped-classroom.onrender.com/api/health', 'Tự động thêm https:// và loại bỏ trailing slashes');

  const u3 = normalizeHealthUrl('http://127.0.0.1:5000/api/health');
  assert(u3 === 'http://127.0.0.1:5000/api/health', 'Giữ nguyên giao thức http:// khi test local');

  // 2. Khởi động server cục bộ để kiểm thử Endpoint /api/health
  console.log('\n--- KHỐI 2: KIỂM THỬ LOCAL ENDPOINT /api/health ---');
  const TEST_PORT = 5099;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      resolve();
    });
  });

  try {
    const localUrl = `http://127.0.0.1:${TEST_PORT}/api/health`;

    // 2.1 Test GET request
    const getRes = await fetch(localUrl, { method: 'GET' });
    assert(getRes.status === 200, 'Endpoint GET /api/health phản hồi mã HTTP 200 OK');

    const body: any = await getRes.json();
    assert(body.status === 'ok', 'Body trả về status: "ok"');
    assert(typeof body.uptime === 'number' && body.uptime >= 0, 'Body trả về thông tin uptime chuẩn số nguyên');
    assert(typeof body.database === 'string', `Body trả về trạng thái cơ sở dữ liệu: "${body.database}"`);
    assert(Boolean(body.timestamp && !isNaN(Date.parse(body.timestamp))), 'Body trả về timestamp chuẩn định dạng ISO 8601');

    // 2.2 Test HEAD request
    const headRes = await fetch(localUrl, { method: 'HEAD' });
    assert(headRes.status === 200, 'Endpoint hỗ trợ request HEAD mã HTTP 200 (cho các dịch vụ ping siêu nhẹ)');

    // 2.3 Test Ping Script với Local Server
    console.log('\n--- KHỐI 3: KIỂM THỬ SCRIPT KEEP-ALIVE ENGINE (LOCAL) ---');
    const localPingResult = await runKeepAlive(localUrl, { maxRetries: 2, timeoutMs: 5000 });
    assert(localPingResult.success === true, 'Kịch bản keep-alive.ts thực thi thành công với server local');
    assert(localPingResult.durationMs >= 0, `Đo lường thời gian phản hồi local thành công: ${localPingResult.durationMs}ms`);

    // 2.4 Test Live Ping thực tế đến Render Backend
    console.log('\n--- KHỐI 4: KIỂM THỬ LIVE PING ĐẾN RENDER BACKEND THỰC TẾ ---');
    console.log('Đang kiểm tra kết nối tới https://flipped-classroom.onrender.com/api/health...');
    const livePingResult = await runKeepAlive('https://flipped-classroom.onrender.com', {
      maxRetries: 2,
      timeoutMs: 30000,
    });
    assert(livePingResult.success === true, `Render backend phản hồi thành công (HTTP ${livePingResult.statusCode || 200}) trong ${livePingResult.durationMs}ms`);

  } finally {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }

  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TIÊU CHÍ GIẢI PHÁP KEEP-ALIVE ĐÃ HOÀN TOÀN ĐẠT CHUẨN!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runKeepAliveTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
