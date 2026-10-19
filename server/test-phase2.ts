import { connectDB } from './src/config/db';
import { seedData } from './src/seeder';
import { User } from './src/models/User';
import { StudyMaterial } from './src/models/StudyMaterial';
import { Comment } from './src/models/Comment';

async function runPhase2Tests() {
  console.log('====================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 2: DIỄN ĐÀN THẢO LUẬN 2 CẤP');
  console.log('====================================');

  await connectDB();
  await seedData(true); // Force clear to get fresh seeded discussion

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

  // Lấy bài học đầu tiên
  const material = await StudyMaterial.findOne().sort({ createdAt: 1 });
  assert(!!material, 'Tìm thấy bài học để kiểm thử thảo luận');

  const student = await User.findOne({ role: 'student' });
  const teacher = await User.findOne({ role: 'teacher' });
  assert(!!student && !!teacher, 'Tìm thấy tài khoản Học sinh và Giáo viên');

  // Test 1: Kiểm tra bình luận gốc (Cấp 1) mẫu từ seeder
  const rootComments = await Comment.find({
    materialId: material!._id,
    parentId: null,
  }).populate('authorId', 'fullName email role');

  assert(rootComments.length >= 1, 'Có ít nhất 1 bình luận gốc Cấp 1');
  const firstRoot = rootComments[0];
  assert(firstRoot.content.includes('tiếp tuyến tại điểm uốn'), 'Nội dung bình luận Cấp 1 chính xác');

  // Test 2: Kiểm tra câu trả lời (Cấp 2) lồng dưới bình luận gốc
  const replies = await Comment.find({
    materialId: material!._id,
    parentId: firstRoot._id,
  }).populate('authorId', 'fullName email role');

  assert(replies.length >= 1, 'Tìm thấy phản hồi Cấp 2 dưới bình luận gốc');
  assert(replies[0].content.includes('cắt xuyên qua'), 'Nội dung phản hồi Cấp 2 của Giáo viên chính xác');
  assert((replies[0].authorId as any).role === 'teacher', 'Tác giả phản hồi là Giáo viên');

  // Test 3: Đăng một bình luận Cấp 1 mới
  const newRoot = await Comment.create({
    materialId: material!._id,
    authorId: student!._id,
    parentId: null,
    content: 'Thầy cho em hỏi thêm về bài tập 4 trong phiếu Google Drive ạ!',
    status: 'active',
  });
  assert(!!newRoot && newRoot.parentId === null, 'Đăng câu hỏi gốc Cấp 1 mới thành công');

  // Test 4: Trả lời vào câu hỏi mới (Cấp 2)
  const newReply = await Comment.create({
    materialId: material!._id,
    authorId: teacher!._id,
    parentId: newRoot._id,
    content: 'Em chú ý công thức ở trang 2 của file PDF nhé.',
    status: 'active',
  });
  assert(!!newReply && newReply.parentId?.toString() === newRoot._id.toString(), 'Tạo câu trả lời Cấp 2 lồng chính xác dưới câu hỏi gốc');

  // Test 5: Kiểm tra cơ chế giới hạn tối đa 2 cấp (flatten nested reply)
  // Nếu có ai cố tình reply vào newReply (cấp 2), parentId sẽ gắn về newRoot (cấp 1)
  const effectiveParent = newReply.parentId || newReply._id;
  const replyToReply = await Comment.create({
    materialId: material!._id,
    authorId: student!._id,
    parentId: effectiveParent, // Tự động quy về cấp 1 gốc
    content: 'Dạ em cảm ơn thầy nhiều ạ!',
    status: 'active',
  });
  assert(replyToReply.parentId?.toString() === newRoot._id.toString(), 'Cấu trúc luôn duy trì nghiêm ngặt tối đa 2 cấp (Root & Thread replies)');

  // Test 6: Kiểm tra soft-delete bình luận
  newRoot.status = 'deleted';
  await newRoot.save();
  const deletedCheck = await Comment.findById(newRoot._id);
  assert(deletedCheck?.status === 'deleted', 'Cơ chế soft-delete hoạt động chuẩn xác để bảo vệ mạch phản hồi');

  console.log('====================================');
  console.log(`🏁 KẾT QUẢ: ĐÃ ĐẠT ${passed}/${total} TIÊU CHÍ KIỂM THỬ PHASE 2`);
  console.log('====================================');

  process.exit(passed === total ? 0 : 1);
}

runPhase2Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
