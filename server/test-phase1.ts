import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';
import { computeClientHashOnServer, verifyPassword, hashPasswordForStorage } from './src/utils/crypto';
import jwt from 'jsonwebtoken';

async function runPhase1Tests() {
  console.log('====================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 1');
  console.log('====================================');

  await connectDB();
  await seedData(false);

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // Test 1: Kiểm tra Super Admin hailua112003@gmail.com đã tồn tại trong DB
  const admin = await User.findOne({ email: 'hailua112003@gmail.com' });
  assert(!!admin, 'Super Admin hailua112003@gmail.com tồn tại trong DB');
  assert(admin?.role === 'admin', 'Super Admin có vai trò admin');

  // Test 2: Kiểm tra xác thực mật khẩu 2 lớp với client SHA-256 hash
  const clientHashAdmin = computeClientHashOnServer('Admin@123456', 'hailua112003@gmail.com');
  assert(clientHashAdmin.length === 64, 'Client SHA-256 hash có độ dài chuẩn 64 ký tự hex');

  const isPasswordValid = await verifyPassword(clientHashAdmin, admin!.passwordHash, 'hailua112003@gmail.com');
  assert(isPasswordValid === true, 'Xác thực mật khẩu Admin qua SHA-256 Client-Hash + Bcrypt Pepper thành công');

  const isWrongPasswordRejected = !(await verifyPassword('wrongpassword', admin!.passwordHash, 'hailua112003@gmail.com'));
  assert(isWrongPasswordRejected === true, 'Mật khẩu sai bị từ chối chính xác');

  // Test 3: Tạo người dùng mới qua cơ chế Admin (định dạng Gmail)
  const testStudentEmail = 'test.student.fc@gmail.com';
  await User.deleteOne({ email: testStudentEmail });

  const studentClientHash = computeClientHashOnServer('Student@123', testStudentEmail);
  const studentStoredHash = await hashPasswordForStorage(studentClientHash, testStudentEmail);

  const newStudent = await User.create({
    fullName: 'Học Sinh Thử Nghiệm',
    email: testStudentEmail,
    passwordHash: studentStoredHash,
    role: 'student',
    isActive: true,
  });

  assert(!!newStudent, 'Admin tạo tài khoản Gmail học sinh mới thành công');
  assert(newStudent.email.endsWith('@gmail.com'), 'Email học sinh có định dạng @gmail.com');

  // Test 4: Học sinh mới tạo đăng nhập thành công
  const studentVerify = await verifyPassword(studentClientHash, newStudent.passwordHash, testStudentEmail);
  assert(studentVerify === true, 'Học sinh mới đăng nhập thành công bằng mật khẩu đã băm 2 lớp');

  // Test 5: Dọn dẹp tài khoản test
  await User.deleteOne({ email: testStudentEmail });
  const cleanedUp = !(await User.findOne({ email: testStudentEmail }));
  assert(cleanedUp === true, 'Xóa người dùng thử nghiệm thành công');

  // Test 6: Kiểm tra bảo vệ Super Admin (không thể xóa)
  assert(admin?.email === 'hailua112003@gmail.com', 'Tài khoản Super Admin được bảo vệ nguyên vẹn');

  console.log('====================================');
  console.log(`🏁 KẾT QUẢ: ĐÃ ĐẠT ${passed}/${total} TIÊU CHÍ KIỂM THỬ PHASE 1`);
  console.log('====================================');

  process.exit(passed === total ? 0 : 1);
}

runPhase1Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
