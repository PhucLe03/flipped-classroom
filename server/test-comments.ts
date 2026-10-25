process.env.ALLOW_MEMORY_DB = 'true';

import http from 'http';
import jwt from 'jsonwebtoken';
import app from './src/index';
import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';
import { StudyMaterial } from './src/models/StudyMaterial';
import { Comment } from './src/models/Comment';

const JWT_SECRET = process.env.JWT_SECRET || 'flipped_classroom_secret_jwt_key_2026_super_secure';

function createToken(userId: any): string {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, { expiresIn: '1d' });
}

async function runCommentTests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: TÍNH NĂNG BÌNH LUẬN & PHÂN QUYỀN XÓA (AUTHOR-ONLY)');
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

  // 1. Kết nối DB và chuẩn bị dữ liệu
  await connectDB();
  await seedData(false);

  const student = await User.findOne({ role: 'student' });
  const teacher = await User.findOne({ role: 'teacher' });
  const admin = await User.findOne({ role: 'admin' });
  const material = await StudyMaterial.findOne();

  assert(!!student, 'Tìm thấy tài khoản Học sinh kiểm thử: ' + student?.email);
  assert(!!teacher, 'Tìm thấy tài khoản Giáo viên kiểm thử: ' + teacher?.email);
  assert(!!admin, 'Tìm thấy tài khoản Quản trị viên kiểm thử: ' + admin?.email);
  assert(!!material, 'Tìm thấy bài học kiểm thử: ' + material?.title);

  const studentToken = createToken(student!._id);
  const teacherToken = createToken(teacher!._id);
  const adminToken = createToken(admin!._id);

  // 2. Khởi động HTTP server test
  const TEST_PORT = 5098;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;

  try {
    // 3. Học sinh tạo bình luận Cấp 1
    console.log('\n--- KHỐI 1: TẠO BÌNH LUẬN GỐC (CẤP 1) & TRẢ LỜI (CẤP 2) ---');
    const rootRes = await fetch(`${baseUrl}/api/comments/materials/${material!._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        content: 'Câu hỏi kiểm thử tự động của học sinh về đồ thị hàm số.',
      }),
    });
    assert(rootRes.status === 201, 'Học sinh đăng bình luận cấp 1 thành công (HTTP 201)');
    const rootData: any = await rootRes.json();
    const rootCommentId = rootData.data.id || rootData.data._id;
    assert(!!rootCommentId, 'Bình luận cấp 1 trả về mã định danh hợp lệ');

    // 4. Giáo viên trả lời vào bình luận Cấp 1
    const replyRes = await fetch(`${baseUrl}/api/comments/${rootCommentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        content: 'Câu trả lời giải đáp từ giáo viên cho học sinh.',
      }),
    });
    assert(replyRes.status === 201, 'Giáo viên gửi câu trả lời (Cấp 2) thành công (HTTP 201)');
    const replyData: any = await replyRes.json();
    const replyId = replyData.data.id || replyData.data._id;
    assert(!!replyId, 'Câu trả lời cấp 2 trả về mã định danh hợp lệ');

    // 5. Kiểm tra danh sách bình luận đã gom nhóm 2 cấp
    const listRes = await fetch(`${baseUrl}/api/comments/materials/${material!._id}`);
    assert(listRes.status === 200, 'Lấy danh sách bình luận bài học thành công (HTTP 200)');
    const listData: any = await listRes.json();
    const foundRoot = listData.data.find((c: any) => c.id === rootCommentId || c._id === rootCommentId);
    assert(!!foundRoot, 'Tìm thấy bình luận cấp 1 trong danh sách');
    assert(
      foundRoot && foundRoot.replies && foundRoot.replies.length >= 1,
      `Bình luận cấp 1 chứa ${foundRoot?.replies?.length || 0} câu trả lời phản hồi`
    );

    // 6. KIỂM TRA PHÂN QUYỀN XÓA (RBAC: ONLY AUTHOR CAN DELETE)
    console.log('\n--- KHỐI 2: KIỂM THỬ NGHIÊM NGẶT QUYỀN XÓA BÌNH LUẬN (CHỈ CHÍNH CHỦ) ---');

    // 6.1 Giáo viên cố tình xóa bình luận của Học sinh -> PHẢI BỊ CHẶN 403
    const teacherDeleteRoot = await fetch(`${baseUrl}/api/comments/${rootCommentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert(
      teacherDeleteRoot.status === 403,
      'Chặn Giáo viên xóa bình luận của Học sinh (HTTP 403 Forbidden)'
    );

    // 6.2 Quản trị viên cố tình xóa bình luận của Học sinh -> PHẢI BỊ CHẶN 403
    const adminDeleteRoot = await fetch(`${baseUrl}/api/comments/${rootCommentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      adminDeleteRoot.status === 403,
      'Chặn Quản trị viên xóa bình luận của Học sinh (HTTP 403 Forbidden)'
    );

    // 6.3 Học sinh tự xóa bình luận của CHÍNH MÌNH -> PHẢI THÀNH CÔNG 200
    const studentDeleteRoot = await fetch(`${baseUrl}/api/comments/${rootCommentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(
      studentDeleteRoot.status === 200,
      'Học sinh tự xóa bình luận của chính mình thành công (HTTP 200 OK)'
    );

    // 6.4 Kiểm tra nội dung bình luận sau khi xóa
    const verifyListRes = await fetch(`${baseUrl}/api/comments/materials/${material!._id}`);
    const verifyListData: any = await verifyListRes.json();
    const deletedRoot = verifyListData.data.find(
      (c: any) => c.id === rootCommentId || c._id === rootCommentId
    );
    assert(
      deletedRoot && deletedRoot.status === 'deleted',
      'Trạng thái bình luận chuyển sang "deleted"'
    );
    assert(
      deletedRoot && deletedRoot.content === 'Bình luận này đã được xóa bởi người gửi.',
      'Nội dung hiển thị chuẩn: "Bình luận này đã được xóa bởi người gửi."'
    );
    assert(
      deletedRoot && deletedRoot.replies && deletedRoot.replies.length >= 1,
      'Các câu trả lời cấp 2 vẫn được bảo tồn toàn vẹn khi bình luận gốc bị xóa'
    );

    // 7. KIỂM TRA PHÂN QUYỀN XÓA CÂU TRẢ LỜI (REPLY)
    console.log('\n--- KHỐI 3: KIỂM THỬ QUYỀN XÓA CÂU TRẢ LỜI CẤP 2 ---');

    // 7.1 Học sinh thử xóa câu trả lời của Giáo viên -> PHẢI BỊ CHẶN 403
    const studentDeleteReply = await fetch(`${baseUrl}/api/comments/${replyId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(
      studentDeleteReply.status === 403,
      'Chặn Học sinh xóa câu trả lời của Giáo viên (HTTP 403 Forbidden)'
    );

    // 7.2 Quản trị viên thử xóa câu trả lời của Giáo viên -> PHẢI BỊ CHẶN 403
    const adminDeleteReply = await fetch(`${baseUrl}/api/comments/${replyId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      adminDeleteReply.status === 403,
      'Chặn Quản trị viên xóa câu trả lời của Giáo viên (HTTP 403 Forbidden)'
    );

    // 7.3 Giáo viên tự xóa câu trả lời của CHÍNH MÌNH -> PHẢI THÀNH CÔNG 200
    const teacherDeleteReply = await fetch(`${baseUrl}/api/comments/${replyId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert(
      teacherDeleteReply.status === 200,
      'Giáo viên tự xóa câu trả lời của chính mình thành công (HTTP 200 OK)'
    );

  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TIÊU CHÍ PHÂN QUYỀN & TÍNH NĂNG BÌNH LUẬN ĐÃ ĐẠT CHUẨN 100%!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runCommentTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
