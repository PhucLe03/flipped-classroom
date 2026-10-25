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

// Algorithmic pagination function mirror
function getPaginationItems(current: number, total: number): (number | '...')[] {
  if (total <= 1) return [1];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let left = Math.max(2, current - 1);
  let right = Math.min(total - 1, current + 1);

  if (current <= 2) {
    left = 2;
    right = 3;
  } else if (current >= total - 1) {
    left = total - 2;
    right = total - 1;
  }

  const items: (number | '...')[] = [1];

  if (left > 2) {
    items.push('...');
  }

  for (let i = left; i <= right; i++) {
    items.push(i);
  }

  if (right < total - 1) {
    items.push('...');
  }

  items.push(total);

  return items;
}

async function runAdminUsersTabsPaginationTests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: SUB-TABS VAI TRÒ & PHÂN TRANG NÂNG CAO (ADMIN)');
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

  // 1. Kết nối DB và seed dữ liệu
  await connectDB();
  await seedData(false);

  const admin = await User.findOne({ role: 'admin' });
  const teacher = await User.findOne({ role: 'teacher' });
  const student = await User.findOne({ role: 'student' });

  assert(!!admin, 'Tìm thấy tài khoản Quản trị viên: ' + admin?.email);
  assert(!!teacher, 'Tìm thấy tài khoản Giáo viên: ' + teacher?.email);
  assert(!!student, 'Tìm thấy tài khoản Học sinh: ' + student?.email);

  const adminToken = createToken(admin!._id);
  const teacherToken = createToken(teacher!._id);

  // 2. Khởi động HTTP server test
  const TEST_PORT = 5098;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;

  try {
    // 3. Khối 1: Thống kê stats có totalAdmins
    console.log('\n--- KHỐI 1: KIỂM TRA THỐNG KÊ STATS CÓ TRƯỜNG TOTALADMINS ---');
    const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200, 'GET /api/admin/stats trả về HTTP 200');
    assert(statsData.success === true, 'Response stats success === true');
    assert(typeof statsData.data.totalAdmins === 'number', 'Trường totalAdmins tồn tại và là number: ' + statsData.data.totalAdmins);
    assert(statsData.data.totalAdmins >= 1, 'Số lượng Quản trị viên >= 1');
    assert(statsData.data.totalStudents >= 1, 'Số lượng Học sinh >= 1');
    assert(statsData.data.totalTeachers >= 1, 'Số lượng Giáo viên >= 1');

    // 4. Khối 2: Mặc định limit = 10 trong getUsers
    console.log('\n--- KHỐI 2: KIỂM TRA MẶC ĐỊNH LIMIT = 10 TRONG GET /api/admin/users ---');
    const defaultUsersRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const defaultUsersData = await defaultUsersRes.json();
    assert(defaultUsersRes.status === 200, 'GET /api/admin/users trả về HTTP 200');
    assert(defaultUsersData.pagination.limit === 10, 'Phân trang mặc định limit = 10 (thay vì 20)');
    assert(defaultUsersData.pagination.page === 1, 'Phân trang mặc định page = 1');
    assert(defaultUsersData.data.length <= 10, 'Số lượng record trả về <= 10');

    // 5. Khối 3: Lọc người dùng theo 3 Sub-Tabs (student, teacher, admin)
    console.log('\n--- KHỐI 3: LỌC THEO SUB-TABS (STUDENT, TEACHER, ADMIN) ---');
    
    // Tab Học sinh
    const studentsRes = await fetch(`${baseUrl}/api/admin/users?role=student`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const studentsData = await studentsRes.json();
    assert(studentsRes.status === 200, 'Lọc role=student trả về HTTP 200');
    assert(studentsData.data.every((u: any) => u.role === 'student'), 'Tất cả users trong tab student đều có role === "student"');
    assert(studentsData.pagination.total === statsData.data.totalStudents, 'Tổng số lượng student khớp với stats.totalStudents: ' + studentsData.pagination.total);

    // Tab Giáo viên
    const teachersRes = await fetch(`${baseUrl}/api/admin/users?role=teacher`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const teachersData = await teachersRes.json();
    assert(teachersRes.status === 200, 'Lọc role=teacher trả về HTTP 200');
    assert(teachersData.data.every((u: any) => u.role === 'teacher'), 'Tất cả users trong tab teacher đều có role === "teacher"');
    assert(teachersData.pagination.total === statsData.data.totalTeachers, 'Tổng số lượng teacher khớp với stats.totalTeachers: ' + teachersData.pagination.total);

    // Tab Quản trị viên
    const adminsRes = await fetch(`${baseUrl}/api/admin/users?role=admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminsData = await adminsRes.json();
    assert(adminsRes.status === 200, 'Lọc role=admin trả về HTTP 200');
    assert(adminsData.data.every((u: any) => u.role === 'admin'), 'Tất cả users trong tab admin đều có role === "admin"');
    assert(adminsData.pagination.total === statsData.data.totalAdmins, 'Tổng số lượng admin khớp với stats.totalAdmins: ' + adminsData.pagination.total);

    // 6. Khối 4: Tùy chọn Page Size (10, 20, 50, 100) và điều hướng trang
    console.log('\n--- KHỐI 4: TÙY CHỌN PAGE SIZE (10, 20, 50, 100) & PHÂN TRANG ---');
    const limit20Res = await fetch(`${baseUrl}/api/admin/users?limit=20`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const limit20Data = await limit20Res.json();
    assert(limit20Data.pagination.limit === 20, 'Nhận limit=20 chính xác');

    const limit50Res = await fetch(`${baseUrl}/api/admin/users?limit=50`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const limit50Data = await limit50Res.json();
    assert(limit50Data.pagination.limit === 50, 'Nhận limit=50 chính xác');

    const limit100Res = await fetch(`${baseUrl}/api/admin/users?limit=100`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const limit100Data = await limit100Res.json();
    assert(limit100Data.pagination.limit === 100, 'Nhận limit=100 chính xác');

    // Test phân trang page 2 với limit nhỏ (ví dụ limit=1)
    const p1Res = await fetch(`${baseUrl}/api/admin/users?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const p1Data = await p1Res.json();
    const p2Res = await fetch(`${baseUrl}/api/admin/users?page=2&limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const p2Data = await p2Res.json();
    assert(p1Data.data.length === 1 && p2Data.data.length === 1, 'Mỗi trang trả về đúng 1 record khi limit=1');
    assert(p1Data.data[0].id !== p2Data.data[0].id, 'Trang 1 và Trang 2 trả về record khác nhau (phân trang hoạt động)');

    // 7. Khối 5: Bảo vệ quyền Quản trị viên
    console.log('\n--- KHỐI 5: BẢO VỆ QUYỀN TRUY CẬP ADMIN ---');
    const teacherDeniedRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert(teacherDeniedRes.status === 403, 'Giáo viên bị từ chối truy cập danh sách user (403 Forbidden)');

    // 8. Khối 6: Kiểm thử thuật toán phân trang getPaginationItems
    console.log('\n--- KHỐI 6: KIỂM THỬ THUẬT TOÁN PHÂN TRANG (PAGINATION ALGORITHM) ---');
    
    // Case 1: Total <= 7 (Hiển thị đầy đủ không có '...')
    const res7 = getPaginationItems(3, 5);
    assert(JSON.stringify(res7) === JSON.stringify([1, 2, 3, 4, 5]), 'Total <= 7: hiển thị đầy đủ [1, 2, 3, 4, 5]');

    // Case 2: Total = 10, current = 1 (Trang đầu)
    const res10_c1 = getPaginationItems(1, 10);
    assert(JSON.stringify(res10_c1) === JSON.stringify([1, 2, 3, '...', 10]), 'Total 10, page 1: [1, 2, 3, "...", 10]');

    // Case 3: Total = 10, current = 2
    const res10_c2 = getPaginationItems(2, 10);
    assert(JSON.stringify(res10_c2) === JSON.stringify([1, 2, 3, '...', 10]), 'Total 10, page 2: [1, 2, 3, "...", 10]');

    // Case 4: Total = 10, current = 5 (Ở giữa, có 3 trang xung quanh [4, 5, 6] và dấu '...' 2 bên)
    const res10_c5 = getPaginationItems(5, 10);
    assert(JSON.stringify(res10_c5) === JSON.stringify([1, '...', 4, 5, 6, '...', 10]), 'Total 10, page 5: [1, "...", 4, 5, 6, "...", 10]');

    // Case 5: Total = 10, current = 9
    const res10_c9 = getPaginationItems(9, 10);
    assert(JSON.stringify(res10_c9) === JSON.stringify([1, '...', 8, 9, 10]), 'Total 10, page 9: [1, "...", 8, 9, 10]');

    // Case 6: Total = 10, current = 10 (Trang cuối)
    const res10_c10 = getPaginationItems(10, 10);
    assert(JSON.stringify(res10_c10) === JSON.stringify([1, '...', 8, 9, 10]), 'Total 10, page 10: [1, "...", 8, 9, 10]');

    // Case 7: Luôn chứa trang 1 và trang cuối cùng (totalPages)
    const res50_c25 = getPaginationItems(25, 50);
    assert(res50_c25[0] === 1 && res50_c25[res50_c25.length - 1] === 50, 'Total 50, page 25: luôn có trang đầu 1 và trang cuối 50');
    assert(res50_c25.includes(25), 'Luôn bao gồm trang hiện tại 25');

  } finally {
    server.close();
  }

  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} BÀI TEST THÀNH CÔNG (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed !== total) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdminUsersTabsPaginationTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
