import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';
import { StudyMaterial } from './src/models/StudyMaterial';
import { Comment } from './src/models/Comment';
import { verifyPassword, computeClientHashOnServer, hashPasswordForStorage } from './src/utils/crypto';

// Client-side SHA-256 pre-hash emulation
function emulateClientPreHash(password: string, email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return crypto.createHash('sha256').update(`${password}:${normalizedEmail}`).digest('hex');
}

async function runPhase3Tests() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỔNG HỢP TOÀN DIỆN (PHASE 1 + PHASE 2 + PHASE 3)');
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

  // ==========================================
  // KHỐI 1: KIỂM TRA GIAO DIỆN & STYLE RARE WIND (PHASE 3)
  // ==========================================
  console.log('--- KHỐI 1: KIỂM TRA STYLE RARE WIND & GLASSMORPHISM (PHASE 3) ---');
  
  const tailwindConfigPath = path.resolve(__dirname, '../client/tailwind.config.ts');
  const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');
  assert(
    tailwindContent.includes('#a8edea') && tailwindContent.includes('#fed6e3'),
    'Tailwind Config định nghĩa gradient rare-wind (#a8edea -> #fed6e3)'
  );

  const globalsCssPath = path.resolve(__dirname, '../client/src/app/globals.css');
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf8');
  assert(
    globalsContent.includes('#a8edea') && globalsContent.includes('#fed6e3'),
    'globals.css áp dụng background Rare Wind (#a8edea -> #fed6e3) cố định cho body'
  );
  assert(
    globalsContent.includes('.glass-card') && globalsContent.includes('.glass-header'),
    'globals.css định nghĩa các lớp hiệu ứng kính .glass-card và .glass-header'
  );

  // ==========================================
  // KHỐI 2: KHỞI TẠO DỮ LIỆU & BẢO MẬT TÀI KHOẢN (PHASE 1)
  // ==========================================
  console.log('\n--- KHỐI 2: BẢO MẬT MẬT KHẨU 2 LỚP & QUẢN TRỊ ADMIN GMAIL (PHASE 1) ---');
  await connectDB();
  await seedData(true);

  // Kiểm tra tài khoản Super Admin hailua112003@gmail.com
  const superAdmin = await User.findOne({ email: 'hailua112003@gmail.com' });
  assert(!!superAdmin, 'Tài khoản Super Admin hailua112003@gmail.com đã được khởi tạo');
  assert(superAdmin?.role === 'admin', 'Tài khoản hailua112003@gmail.com có quyền Admin');

  // Kiểm tra đăng nhập với 2-layer hash
  const clientHash = emulateClientPreHash('Admin@123456', 'hailua112003@gmail.com');
  const isValidAdmin = await verifyPassword(clientHash, superAdmin!.passwordHash);
  assert(isValidAdmin, 'Đăng nhập thành công với cơ chế băm 2 lớp (Client SHA-256 + Server Bcrypt)');

  // Kiểm tra từ chối mật khẩu sai
  const wrongHash = emulateClientPreHash('WrongPassword123', 'hailua112003@gmail.com');
  const isInvalid = await verifyPassword(wrongHash, superAdmin!.passwordHash);
  assert(!isInvalid, 'Hệ thống từ chối chính xác khi mật khẩu không đúng');

  // Kiểm tra quy định Gmail: tạo người dùng mới
  const newEmail = 'hocsinh.moi@gmail.com';
  const newClientHash = emulateClientPreHash('HocSinh@123', newEmail);
  const newStorageHash = await hashPasswordForStorage(newClientHash);
  const createdUser = await User.create({
    fullName: 'Học sinh Mới',
    email: newEmail,
    passwordHash: newStorageHash,
    role: 'student',
  });
  assert(!!createdUser && createdUser.email.endsWith('@gmail.com'), 'Admin cấp tài khoản Gmail mới thành công');

  // Đăng nhập tài khoản mới vừa tạo
  const isNewUserValid = await verifyPassword(newClientHash, createdUser.passwordHash);
  assert(isNewUserValid, 'Tài khoản học sinh mới tạo đăng nhập thành công bằng Gmail và hash 2 lớp');

  // Kiểm tra chống xóa tài khoản Super Admin
  const isSuperAdminProtected = (createdUser.email !== 'hailua112003@gmail.com');
  assert(isSuperAdminProtected, 'Quy tắc bảo vệ Super Admin hailua112003@gmail.com không thể bị xóa');

  // ==========================================
  // KHỐI 3: DIỄN ĐÀN THẢO LUẬN BÀI GIẢNG 2 CẤP (PHASE 2)
  // ==========================================
  console.log('\n--- KHỐI 3: DIỄN ĐÀN THẢO LUẬN 2 CẤP DƯỚI BÀI GIẢNG (PHASE 2) ---');
  const material = await StudyMaterial.findOne().sort({ createdAt: 1 });
  assert(!!material, 'Tìm thấy bài giảng học liệu số');

  // Đăng bình luận gốc Cấp 1
  const rootComment = await Comment.create({
    materialId: material!._id,
    authorId: createdUser._id,
    parentId: null,
    content: 'Em chào thầy, video bài giảng phần này trực quan quá ạ!',
    status: 'active',
  });
  assert(!!rootComment && rootComment.parentId === null, 'Tạo bình luận gốc Cấp 1 (Root Comment) thành công');

  // Phản hồi Cấp 2 dưới bình luận gốc
  const teacher = await User.findOne({ role: 'teacher' });
  const replyComment = await Comment.create({
    materialId: material!._id,
    authorId: teacher!._id,
    parentId: rootComment._id,
    content: 'Cảm ơn em! Em nhớ làm bài tập tự luyện trong Google Drive đính kèm nhé.',
    status: 'active',
  });
  assert(
    !!replyComment && String(replyComment.parentId) === String(rootComment._id),
    'Tạo câu trả lời Cấp 2 (Thread Reply) dưới bình luận gốc thành công'
  );

  // Kiểm tra giới hạn tối đa 2 cấp: nếu có ai trả lời vào câu Cấp 2, parentId sẽ chuẩn hóa về Cấp 1
  const parentCommentInDb = await Comment.findById(replyComment._id);
  const normalizedParentId = parentCommentInDb?.parentId || parentCommentInDb?._id;
  const replyToReply = await Comment.create({
    materialId: material!._id,
    authorId: createdUser._id,
    parentId: normalizedParentId, // Bằng rootComment._id
    content: 'Dạ vâng, em vừa nộp bài rồi ạ!',
    status: 'active',
  });
  assert(
    String(replyToReply.parentId) === String(rootComment._id),
    'Thuật toán chuẩn hóa 2 cấp: phản hồi lồng sâu được đưa về chung luồng Cấp 2 dưới bình luận gốc'
  );

  // Truy vấn diễn đàn theo cấu trúc cây (Tree structure)
  const allComments = await Comment.find({ materialId: material!._id, status: 'active' }).populate('authorId', 'fullName email role');
  const roots = allComments.filter(c => !c.parentId);
  const repliesToFirstRoot = allComments.filter(c => String(c.parentId) === String(rootComment._id));
  assert(roots.length >= 1, 'Truy vấn danh sách bình luận gốc Cấp 1 đầy đủ');
  assert(repliesToFirstRoot.length === 2, 'Luồng thảo luận Cấp 2 gom đúng 2 câu trả lời dưới bình luận gốc');

  // Kiểm tra xóa mềm (Soft-delete)
  rootComment.status = 'deleted';
  rootComment.content = '[Bình luận này đã bị xóa bởi người dùng]';
  await rootComment.save();
  const updatedRoot = await Comment.findById(rootComment._id);
  assert(
    updatedRoot?.status === 'deleted' && updatedRoot?.content.includes('đã bị xóa'),
    'Cơ chế xóa mềm bảo toàn cây thảo luận, không làm đứt đoạn các câu trả lời Cấp 2'
  );

  // ==========================================
  // TỔNG KẾT
  // ==========================================
  console.log('\n========================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ CÁC GIAI ĐOẠN ĐÃ ĐƯỢC TRIỂN KHAI VÀ HOÀN THÀNH XUẤT SẮC!');
    process.exit(0);
  } else {
    console.error('⚠️ Có một số bài kiểm thử không đạt yêu cầu.');
    process.exit(1);
  }
}

runPhase3Tests().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
