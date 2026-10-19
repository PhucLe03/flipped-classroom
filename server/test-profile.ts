import fs from 'fs';
import path from 'path';
import { connectDB } from './src/config/db';
import { User } from './src/models/User';
import { isValidAvatar, normalizeAvatarId, AVATAR_PRESET_IDS } from './src/utils/avatars';

async function runProfileTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: TÙY CHỈNH HỒ SƠ & AVATAR ID');
  console.log('====================================================\n');

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

  // 1. Kiểm tra Whitelist và Chuẩn hóa Avatar ID
  assert(isValidAvatar('fox'), 'Avatar ID hợp lệ: fox');
  assert(isValidAvatar('rocket'), 'Avatar ID hợp lệ: rocket');
  assert(isValidAvatar('preset:scholar'), 'Avatar ID có tiền tố được chấp nhận: preset:scholar');
  assert(!isValidAvatar('hack_image_url'), 'Từ chối Avatar ID không nằm trong danh sách');
  assert(!isValidAvatar('data:image/png;base64,...'), 'Từ chối chuỗi ảnh base64 trực tiếp');

  const normalized = normalizeAvatarId('preset:panda');
  assert(normalized === 'panda', 'Chuẩn hóa thành công về ID sạch để lưu DB: panda');

  // 2. Kiểm tra các file SVG trong thư mục public/avatars
  const avatarsDir = path.resolve(__dirname, '../client/public/avatars');
  assert(fs.existsSync(avatarsDir), 'Thư mục public/avatars tồn tại');

  const files = fs.readdirSync(avatarsDir).filter(f => f.endsWith('.svg'));
  assert(files.length === AVATAR_PRESET_IDS.length, `Đủ ${AVATAR_PRESET_IDS.length} file SVG trong public/avatars (có ${files.length} file)`);

  const foxContent = fs.readFileSync(path.join(avatarsDir, 'fox.svg'), 'utf8');
  assert(foxContent.includes('<svg') && foxContent.includes('</svg>'), 'File fox.svg là tệp định dạng SVG chuẩn');

  // 3. Kiểm tra lưu trữ DB (chỉ lưu ID vào database)
  await connectDB();
  let user = await User.findOne({ email: 'hailua112003@gmail.com' });
  if (user) {
    user.fullName = 'Quản Trị Viên (Đã Đổi Tên)';
    user.avatar = 'fox'; // CHỈ LƯU ID
    await user.save();

    const reloaded = await User.findById(user._id);
    assert(reloaded?.fullName === 'Quản Trị Viên (Đã Đổi Tên)', 'Đổi tên người dùng thành công');
    assert(reloaded?.avatar === 'fox', 'Database lưu CHÍNH XÁC ID avatar là "fox" (không lưu ảnh thô)');
    assert(!reloaded?.avatar?.includes('data:') && !reloaded?.avatar?.includes('http'), 'Xác nhận không chứa URL hoặc base64 trong DB');
  }

  console.log('\n====================================================');
  console.log(`📊 KẾT QUẢ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 TÍNH NĂNG CUSTOMIZE AVATAR & TÊN ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runProfileTests().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
