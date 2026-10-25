process.env.ALLOW_MEMORY_DB = 'true';

import http from 'http';
import jwt from 'jsonwebtoken';
import app from './src/index';
import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'flipped_classroom_secret_jwt_key_2026_super_secure';

function createToken(userId: any): string {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, { expiresIn: '1d' });
}

async function runAdminEditUserTests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: TÍNH NĂNG CHỈNH SỬA TÀI KHOẢN NGƯỜI DÙNG (ADMIN)');
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

  // 1. Kết nối DB và nạp dữ liệu
  await connectDB();
  await seedData(false);

  const admin = await User.findOne({ role: 'admin' });
  const student = await User.findOne({ role: 'student' });
  const superAdmin = await User.findOne({ email: 'hailua112003@gmail.com' });

  assert(!!admin, 'Tìm thấy tài khoản Quản trị viên kiểm thử: ' + admin?.email);
  assert(!!student, 'Tìm thấy tài khoản Học sinh kiểm thử: ' + student?.email);
  assert(!!superAdmin, 'Tìm thấy tài khoản Quản trị viên tối cao: ' + superAdmin?.email);

  const adminToken = createToken(admin!._id);
  const studentToken = createToken(student!._id);

  // 2. Khởi động HTTP server test
  const TEST_PORT = 5097;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;

  try {
    // 3. Kiểm tra GET /api/admin/users trả về trường `id` hợp lệ
    console.log('\n--- KHỐI 1: KIỂM TRA MAPPING TRƯỜNG ID TRONG DANH SÁCH USER ---');
    const getRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(getRes.status === 200, 'Admin lấy danh sách người dùng thành công (HTTP 200)');
    const getData: any = await getRes.json();
    assert(Array.isArray(getData.data) && getData.data.length > 0, 'Danh sách người dùng trả về mảng không rỗng');
    const firstUser = getData.data[0];
    assert(typeof firstUser.id === 'string' && firstUser.id.length > 0, 'User có trường id dạng string hợp lệ: ' + firstUser.id);
    assert(firstUser.id === firstUser._id?.toString(), 'Trường id khớp chính xác với _id');

    // 4. Kiểm tra PUT /api/admin/users/:id - Cập nhật thông tin thành công
    console.log('\n--- KHỐI 2: CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (PUT /api/admin/users/:id) ---');
    const targetUserId = student!._id.toString();
    const updateRes = await fetch(`${baseUrl}/api/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        fullName: 'Học sinh Nguyễn Văn An Cập Nhật',
        role: 'teacher',
        isActive: false,
      }),
    });
    assert(updateRes.status === 200, 'Admin cập nhật thông tin người dùng thành công (HTTP 200)');
    const updateData: any = await updateRes.json();
    assert(updateData.data.fullName === 'Học sinh Nguyễn Văn An Cập Nhật', 'Họ tên được cập nhật thành công');
    assert(updateData.data.role === 'teacher', 'Vai trò được nâng cấp thành teacher thành công');
    assert(updateData.data.isActive === false, 'Trạng thái chuyển sang bị khóa (isActive=false) thành công');

    // Kiểm tra trong DB
    const updatedInDb = await User.findById(targetUserId);
    assert(updatedInDb?.fullName === 'Học sinh Nguyễn Văn An Cập Nhật', 'DB ghi nhận họ tên mới chuẩn xác');
    assert(updatedInDb?.role === 'teacher', 'DB ghi nhận vai trò mới chuẩn xác');
    assert(updatedInDb?.isActive === false, 'DB ghi nhận trạng thái mới chuẩn xác');

    // 5. Kiểm tra phân quyền: User không phải admin không được phép sửa
    console.log('\n--- KHỐI 3: KIỂM TRA BẢO MẬT PHÂN QUYỀN VÀ VALIDATION DỮ LIỆU ---');
    const teacher = await User.findOne({ role: 'teacher', isActive: true });
    assert(!!teacher, 'Tìm thấy tài khoản Giáo viên đang hoạt động: ' + teacher?.email);
    const teacherToken = createToken(teacher!._id);

    const unauthorizedRes = await fetch(`${baseUrl}/api/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({ fullName: 'Hacker Name' }),
    });
    assert(unauthorizedRes.status === 403, 'Chặn người dùng không có quyền admin chỉnh sửa user (HTTP 403)');

    // 6. Kiểm tra validation: Họ tên rỗng hoặc vai trò không hợp lệ
    const invalidNameRes = await fetch(`${baseUrl}/api/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ fullName: '   ' }),
    });
    assert(invalidNameRes.status === 400, 'Từ chối cập nhật khi họ tên để khoảng trắng rỗng (HTTP 400)');

    const invalidRoleRes = await fetch(`${baseUrl}/api/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: 'superhero' }),
    });
    assert(invalidRoleRes.status === 400, 'Từ chối cập nhật khi vai trò không hợp lệ (HTTP 400)');

    // 7. Kiểm tra cơ chế bảo vệ Super Admin
    console.log('\n--- KHỐI 4: BẢO VỆ TÀI KHOẢN QUẢN TRỊ VIÊN TỐI CAO (SUPER ADMIN) ---');
    const superAdminId = superAdmin!._id.toString();

    // 7.1 Cố tình hạ quyền Super Admin
    const downgradeSuperAdminRes = await fetch(`${baseUrl}/api/admin/users/${superAdminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: 'student' }),
    });
    assert(downgradeSuperAdminRes.status === 400, 'Chặn không cho phép hạ quyền Super Admin (HTTP 400)');

    // 7.2 Cố tình khóa Super Admin
    const deactivateSuperAdminRes = await fetch(`${baseUrl}/api/admin/users/${superAdminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isActive: false }),
    });
    assert(deactivateSuperAdminRes.status === 400, 'Chặn không cho phép khóa tài khoản Super Admin (HTTP 400)');

    // 8. Revert test user
    await fetch(`${baseUrl}/api/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        fullName: student!.fullName,
        role: 'student',
        isActive: true,
      }),
    });

  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TIÊU CHÍ CHỈNH SỬA USER & BẢO VỆ RBAC ĐÃ HOÀN TOÀN ĐẠT CHUẨN!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAdminEditUserTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
