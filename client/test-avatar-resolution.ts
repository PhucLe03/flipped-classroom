import fs from 'fs';
import path from 'path';
import { AVATAR_CATEGORIES, getAvatarUrl, cleanAvatarId } from './src/lib/avatars';

async function runAvatarResolutionTests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: ĐỘ PHÂN GIẢI ĐƯỜNG DẪN AVATAR TRÊN FRONTEND');
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

  // Khối 1: Kiểm tra tính tồn tại của toàn bộ 32 file SVG
  console.log('--- KHỐI 1: KIỂM TRA FILE SVG TRONG public/avatars ---');
  const avatarsDir = path.resolve(__dirname, 'public/avatars');
  const allItems = AVATAR_CATEGORIES.flatMap((c) => c.items);
  assert(allItems.length === 32, `Tổng số 32 avatar được cấu hình trong 4 danh mục (hiện có: ${allItems.length})`);

  let missingFiles = 0;
  for (const item of allItems) {
    const filePath = path.join(avatarsDir, `${item.id}.svg`);
    if (!fs.existsSync(filePath)) {
      missingFiles++;
      console.error(`Thiếu file: ${filePath}`);
    }
  }
  assert(missingFiles === 0, '100% các file SVG tương ứng với preset ID đều tồn tại trong public/avatars/');

  // Khối 2: Kiểm tra hàm cleanAvatarId
  console.log('\n--- KHỐI 2: CHUẨN HÓA VÀ NHẬN DIỆN AVATAR ID ---');
  assert(cleanAvatarId('fox') === 'fox', 'Nhận diện đúng ID chuẩn: "fox"');
  assert(cleanAvatarId('preset:fox') === 'fox', 'Làm sạch tiền tố cũ: "preset:fox" -> "fox"');
  assert(cleanAvatarId('  ROCKET  ') === 'rocket', 'Tự động trim và lowercase: "  ROCKET  " -> "rocket"');
  assert(cleanAvatarId('unknown_invalid_id') === null, 'Từ chối ID không hợp lệ');

  // Khối 3: Kiểm tra cơ chế tự thích ứng của getAvatarUrl
  console.log('\n--- KHỐI 3: KIỂM THỬ ĐỘNG getAvatarUrl TRÊN CÁC MÔI TRƯỜNG ---');

  // 3.1: Khi không có basePath (Custom domain hoặc chạy local)
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  (global as any).window = undefined;
  const urlDefault = getAvatarUrl('fox');
  assert(urlDefault === '/avatars/fox.svg', `Môi trường gốc trả về đúng: "${urlDefault}"`);

  // 3.2: Khi có biến môi trường nhưng người dùng đang truy cập ở Root / Custom domain
  process.env.NEXT_PUBLIC_BASE_PATH = '/flipped-classroom';
  (global as any).window = {
    location: {
      pathname: '/tai-khoan/',
      origin: 'https://flippedclassroom.site',
    },
  };
  const urlCustomDomain = getAvatarUrl('fox');
  assert(
    urlCustomDomain === '/avatars/fox.svg',
    `Custom Domain tự động bỏ tiền tố /flipped-classroom: "${urlCustomDomain}"`
  );

  // 3.3: Khi truy cập đúng qua subpath GitHub Pages (phucle03.github.io/flipped-classroom/tai-khoan/)
  (global as any).window = {
    location: {
      pathname: '/flipped-classroom/tai-khoan/',
      origin: 'https://phucle03.github.io',
    },
  };
  const urlSubpath = getAvatarUrl('fox');
  assert(
    urlSubpath === '/flipped-classroom/avatars/fox.svg',
    `Truy cập qua subpath giữ nguyên tiền tố chính xác: "${urlSubpath}"`
  );

  // Khối 4: Kiểm tra trực tiếp URL trên domain thực tế flippedclassroom.site
  console.log('\n--- KHỐI 4: KIỂM THỬ TRỰC TIẾP TRÊN DOMAIN THỰC TẾ ---');
  try {
    const liveRes = await fetch('https://flippedclassroom.site/avatars/fox.svg', { method: 'GET' });
    assert(
      liveRes.status === 200,
      `Avatar SVG trên custom domain https://flippedclassroom.site/avatars/fox.svg trả về HTTP ${liveRes.status} OK`
    );
    const contentType = liveRes.headers.get('content-type') || '';
    assert(
      contentType.includes('image/svg+xml') || contentType.includes('xml'),
      `Content-Type trả về chuẩn SVG: "${contentType}"`
    );
  } catch (err: any) {
    console.warn('Bỏ qua test live nếu không có internet:', err.message);
  }

  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TIÊU CHÍ HIỂN THỊ AVATAR ĐÃ ĐẠT CHUẨN XUẤT SẮC!');
  } else {
    process.exit(1);
  }
}

runAvatarResolutionTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
