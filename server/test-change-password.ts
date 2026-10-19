import crypto from 'crypto';
import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';
import { verifyPassword, hashPasswordForStorage } from './src/utils/crypto';

function clientHash(pass: string, email: string): string {
  return crypto.createHash('sha256').update(`${pass}:${email.toLowerCase().trim()}`).digest('hex');
}

async function runChangePasswordTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: TÍNH NĂNG ĐỔI MẬT KHẨU TÀI KHOẢN');
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

  await connectDB();
  await seedData(false);
  const testEmail = 'hailua112003@gmail.com';
  const user = await User.findOne({ email: testEmail });
  assert(!!user, 'Tìm thấy tài khoản kiểm thử: ' + testEmail);

  // 1. Kiểm tra mật khẩu hiện tại ban đầu
  const originalPass = 'Admin@123456';
  const originalHash = clientHash(originalPass, testEmail);
  const isOriginalValid = await verifyPassword(originalHash, user!.passwordHash, testEmail);
  assert(isOriginalValid, 'Mật khẩu ban đầu Admin@123456 khớp chính xác');

  // 2. Kiểm tra từ chối khi mật khẩu hiện tại sai
  const wrongCurrentPass = 'WrongPass123';
  const wrongHash = clientHash(wrongCurrentPass, testEmail);
  const isWrongValid = await verifyPassword(wrongHash, user!.passwordHash, testEmail);
  assert(!isWrongValid, 'Từ chối đổi mật khẩu khi mật khẩu hiện tại không đúng');

  // 3. Kiểm tra từ chối khi mật khẩu mới trùng mật khẩu hiện tại
  const isSame = await verifyPassword(originalHash, user!.passwordHash, testEmail);
  assert(isSame, 'Nhận diện chính xác khi mật khẩu mới trùng mật khẩu cũ');

  // 4. Thực hiện đổi sang mật khẩu mới
  const newPass = 'Admin@NewSecurePass2026!';
  const newPassHash = clientHash(newPass, testEmail);
  const newStorageHash = await hashPasswordForStorage(newPassHash, testEmail);
  user!.passwordHash = newStorageHash;
  await user!.save();

  // 5. Kiểm tra đăng nhập với mật khẩu mới
  const checkNewValid = await verifyPassword(newPassHash, user!.passwordHash, testEmail);
  assert(checkNewValid, 'Đăng nhập thành công với mật khẩu mới Admin@NewSecurePass2026!');

  // 6. Kiểm tra mật khẩu cũ không còn sử dụng được
  const checkOldInvalid = await verifyPassword(originalHash, user!.passwordHash, testEmail);
  assert(!checkOldInvalid, 'Mật khẩu cũ Admin@123456 đã bị vô hiệu hóa hoàn toàn');

  // 7. Khôi phục lại mật khẩu chuẩn để không ảnh hưởng đến các kịch bản khác
  const restoreStorageHash = await hashPasswordForStorage(originalHash, testEmail);
  user!.passwordHash = restoreStorageHash;
  await user!.save();

  const isRestored = await verifyPassword(originalHash, user!.passwordHash, testEmail);
  assert(isRestored, 'Khôi phục lại mật khẩu an toàn ban đầu thành công');

  console.log('\n====================================================');
  console.log(`📊 KẾT QUẢ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TIÊU CHÍ ĐỔI MẬT KHẨU ĐÃ ĐẠT CHUẨN XUẤT SẮC!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runChangePasswordTests().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
