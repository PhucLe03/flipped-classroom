import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Category } from './models/Category';
import { StudyMaterial } from './models/StudyMaterial';
import { Comment } from './models/Comment';
import { extractYouTubeId, extractGDriveId, generateSlug } from './utils/parsers';
import { hashPasswordForStorage } from './utils/crypto';
import { connectDB, getDbInfo, isConnectedToLocalDb, isProductionRuntime } from './config/db';

dotenv.config();

/**
 * Luôn đảm bảo tài khoản Super Admin hailua112003@gmail.com tồn tại (không phá huỷ dữ liệu).
 */
export const ensureSuperAdmin = async (): Promise<void> => {
  const existingAdmin = await User.findOne({ email: 'hailua112003@gmail.com' });
  if (!existingAdmin) {
    const adminPasswordHash = await hashPasswordForStorage('Admin@123456', 'hailua112003@gmail.com');
    await User.create({
      fullName: 'Quản Trị Viên (Super Admin)',
      email: 'hailua112003@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Quản trị viên tối cao nền tảng Học Liệu Số Flipped Classroom',
      isActive: true,
    });
    console.log('[Seeder] Super Admin hailua112003@gmail.com created successfully.');
  }
};

/**
 * Có tự động seed dữ liệu mẫu khi server khởi động hay không.
 * - AUTO_SEED=true  : luôn bật
 * - AUTO_SEED=false : luôn tắt
 * - Mặc định       : chỉ bật khi KHÔNG ở production VÀ đang dùng DB local/in-memory
 */
export const shouldAutoSeed = (): boolean => {
  if (process.env.AUTO_SEED === 'true') return true;
  if (process.env.AUTO_SEED === 'false') return false;
  return !isProductionRuntime() && isConnectedToLocalDb();
};

/**
 * Chặn thao tác xoá dữ liệu (forceClear) trên DB remote/production.
 * Chỉ cho phép khi đang kết nối DB local/in-memory, hoặc ép bằng ALLOW_DESTRUCTIVE_SEED=true.
 */
const assertDestructiveSeedAllowed = (): void => {
  if (process.env.ALLOW_DESTRUCTIVE_SEED === 'true') {
    console.warn('[Seeder] ⚠️ ALLOW_DESTRUCTIVE_SEED=true — bỏ qua cơ chế bảo vệ dữ liệu!');
    return;
  }
  const info = getDbInfo();
  if (isProductionRuntime() || !isConnectedToLocalDb()) {
    throw new Error(
      `[Seeder] TỪ CHỐI forceClear trên database ${info.mode} (${info.host}/${info.name}). ` +
        'Chỉ được xoá dữ liệu trên MongoDB local/in-memory. Đặt ALLOW_DESTRUCTIVE_SEED=true nếu thực sự muốn.'
    );
  }
};

export const seedData = async (forceClear = false): Promise<void> => {
  try {
    if (forceClear) {
      assertDestructiveSeedAllowed();
    }

    await ensureSuperAdmin();

    const userCount = await User.countDocuments();
    if (!forceClear && userCount > 1) {
      console.log(`[Seeder] Database already populated with ${userCount} users. Auto-seed skipped.`);
      return;
    }

    if (forceClear) {
      console.log('[Seeder] Clearing old collections...');
      await User.deleteMany({ email: { $ne: 'hailua112003@gmail.com' } });
      await Category.deleteMany({});
      await StudyMaterial.deleteMany({});
    }

    // 1. Seed Users (sử dụng tài khoản Gmail và cơ chế bảo mật hash 2 lớp)
    console.log('[Seeder] Creating sample Gmail users with 2-layer hash...');

    // Đảm bảo admin chính
    let admin = await User.findOne({ email: 'hailua112003@gmail.com' });
    if (!admin) {
      const adminHash = await hashPasswordForStorage('Admin@123456', 'hailua112003@gmail.com');
      admin = await User.create({
        fullName: 'Quản Trị Viên (Super Admin)',
        email: 'hailua112003@gmail.com',
        passwordHash: adminHash,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Quản trị viên tối cao nền tảng Học Liệu Số Flipped Classroom',
      });
    }

    const teacherNamHash = await hashPasswordForStorage('123456', 'thaynam.toan.fc@gmail.com');
    const teacherNam = await User.findOneAndUpdate(
      { email: 'thaynam.toan.fc@gmail.com' },
      {
        fullName: 'Thầy Nguyễn Hải Nam',
        email: 'thaynam.toan.fc@gmail.com',
        passwordHash: teacherNamHash,
        role: 'teacher',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Giáo viên Toán Chuyên, 12 năm kinh nghiệm luyện thi THPT Quốc gia',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const teacherLienHash = await hashPasswordForStorage('123456', 'colien.ly.fc@gmail.com');
    const teacherLien = await User.findOneAndUpdate(
      { email: 'colien.ly.fc@gmail.com' },
      {
        fullName: 'Cô Trần Mỹ Liên',
        email: 'colien.ly.fc@gmail.com',
        passwordHash: teacherLienHash,
        role: 'teacher',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        bio: 'Giáo viên Vật lý, Thạc sĩ Sư phạm Vật lý Ứng dụng',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const studentHash = await hashPasswordForStorage('123456', 'hocsinh.fc@gmail.com');
    const student = await User.findOneAndUpdate(
      { email: 'hocsinh.fc@gmail.com' },
      {
        fullName: 'Nguyễn Văn Minh',
        email: 'hocsinh.fc@gmail.com',
        passwordHash: studentHash,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bio: 'Học sinh lớp 12A1',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log('[Seeder] Created/verified sample users successfully');

    // 2. Seed Categories
    console.log('[Seeder] Creating categories...');
    const categoriesData = [
      { name: 'Toán học', slug: 'toan-hoc', icon: 'Calculator', order: 1, description: 'Đại số, Giải tích, Hình học không gian và Xác suất' },
      { name: 'Vật lý', slug: 'vat-ly', icon: 'Atom', order: 2, description: 'Cơ học, Nhiệt học, Điện xoay chiều, Sóng ánh sáng' },
      { name: 'Hóa học', slug: 'hoa-hoc', icon: 'FlaskConical', order: 3, description: 'Hóa học vô cơ, Hóa học hữu cơ và Thí nghiệm' },
      { name: 'Tiếng Anh', slug: 'tieng-anh', icon: 'Languages', order: 4, description: 'Ngữ pháp, Từ vựng chuyên đề, Luyện đọc và Viết học thuật' },
      { name: 'Tin học', slug: 'tin-hoc', icon: 'Laptop', order: 5, description: 'Lập trình Python, C++, Cấu trúc dữ liệu và Giải thuật' },
      { name: 'Sinh học', slug: 'sinh-hoc', icon: 'Dna', order: 6, description: 'Di truyền học, Tiến hóa, Sinh thái và Sinh học tế bào' },
      { name: 'Ngữ văn', slug: 'ngu-van', icon: 'BookOpen', order: 7, description: 'Văn học hiện đại, Nghị luận xã hội và Kỹ năng phân tích tác phẩm' },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`[Seeder] Created ${seededCategories.length} categories`);

    const toanCat = seededCategories.find((c) => c.slug === 'toan-hoc')!;
    const lyCat = seededCategories.find((c) => c.slug === 'vat-ly')!;
    const anhCat = seededCategories.find((c) => c.slug === 'tieng-anh')!;

    // 3. Seed Study Materials with dynamic, ordered blocks
    console.log('[Seeder] Creating study materials with ordered blocks...');
    const materialsData = [
      {
        title: 'Giới thiệu về Giải tích và Bản chất của Đạo hàm',
        slug: generateSlug('Giới thiệu về Giải tích và Bản chất của Đạo hàm'),
        description: 'Khái niệm nền tảng về đạo hàm, ý nghĩa hình học của tiếp tuyến và ứng dụng thực tiễn trong việc khảo sát hàm số lớp 12.',
        subjectId: toanCat._id,
        authorId: teacherNam._id,
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
        educationalLevel: 'Lớp 12',
        viewCount: 142,
        publishedAt: new Date(),
        blocks: [
          {
            id: 'block_1',
            type: 'youtube',
            order: 0,
            title: 'Video 1: Bản chất hình học của Đạo hàm (Khái niệm trực quan)',
            youtubeUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
            youtubeVideoId: extractYouTubeId('https://www.youtube.com/watch?v=WUvTyaaNkzM'),
          },
          {
            id: 'block_2',
            type: 'rich_text',
            order: 1,
            title: 'Tóm tắt lý thuyết trọng tâm',
            richTextHtml: `
              <h3>1. Định nghĩa đạo hàm tại một điểm</h3>
              <p>Cho hàm số <strong>y = f(x)</strong> xác định trên khoảng (a; b) và <em>x₀ ∈ (a; b)</em>. Nếu tồn tại giới hạn hữu hạn:</p>
              <blockquote><strong>f'(x₀) = lim (Δx → 0) [f(x₀ + Δx) - f(x₀)] / Δx</strong></blockquote>
              <p>thì giới hạn đó được gọi là <strong>đạo hàm</strong> của hàm số y = f(x) tại điểm x₀.</p>
              <h3>2. Ý nghĩa hình học</h3>
              <p>Đạo hàm f'(x₀) chính là <em>hệ số góc k</em> của tiếp tuyến với đồ thị hàm số tại điểm M₀(x₀; f(x₀)):</p>
              <ul>
                <li>Phương trình tiếp tuyến: <code>y - y₀ = f'(x₀)(x - x₀)</code></li>
                <li>Nếu f'(x₀) > 0, tiếp tuyến dốc lên (hàm số đồng biến cục bộ).</li>
                <li>Nếu f'(x₀) < 0, tiếp tuyến dốc xuống (hàm số nghịch biến cục bộ).</li>
              </ul>
            `,
          },
          {
            id: 'block_3',
            type: 'gdrive',
            order: 2,
            title: 'Tài liệu bài tập rèn luyện (Google Drive PDF)',
            gdriveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
            gdriveFileId: extractGDriveId('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view'),
            gdriveTitle: 'Phiếu bài tập Giải tích 12 - Chuyên đề Đạo hàm nâng cao.pdf',
          },
          {
            id: 'block_4',
            type: 'rich_text',
            order: 3,
            title: 'Hướng dẫn tự học tại nhà (Mô hình Flipped Classroom)',
            richTextHtml: `
              <p>Các em học sinh vui lòng hoàn thành các bước trước buổi học trực tiếp trên lớp:</p>
              <ol>
                <li>Xem kĩ video bài giảng trực quan ở phần trên (dừng lại và ghi chép các mốc thời gian quan trọng).</li>
                <li>Đọc phần lý thuyết tóm tắt và thuộc công thức đạo hàm cơ bản.</li>
                <li>Tải tài liệu bài tập Google Drive và làm trước từ <strong>Câu 1 đến Câu 15</strong>.</li>
              </ol>
            `,
          },
        ],
      },
      {
        title: 'Khảo sát Dao động Điều hòa và Con lắc Lò xo',
        slug: generateSlug('Khảo sát Dao động Điều hòa và Con lắc Lò xo'),
        description: 'Tổng hợp phương trình li độ, vận tốc, gia tốc, năng lượng dao động và các dạng bài toán con lắc lò xo treo thẳng đứng.',
        subjectId: lyCat._id,
        authorId: teacherLien._id,
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
        educationalLevel: 'Lớp 12',
        viewCount: 98,
        publishedAt: new Date(),
        blocks: [
          {
            id: 'block_ly_1',
            type: 'youtube',
            order: 0,
            title: 'Video Thí nghiệm mô phỏng Dao động điều hòa của Con lắc lò xo',
            youtubeUrl: 'https://www.youtube.com/watch?v=fjxmjPyu6UY',
            youtubeVideoId: extractYouTubeId('https://www.youtube.com/watch?v=fjxmjPyu6UY'),
          },
          {
            id: 'block_ly_2',
            type: 'rich_text',
            order: 1,
            title: 'Hệ thống công thức then chốt',
            richTextHtml: `
              <h3>1. Phương trình dao động điều hòa</h3>
              <p>Phương trình li độ: <strong>x = A cos(ωt + φ)</strong></p>
              <p>Vận tốc: <strong>v = x' = -ωA sin(ωt + φ) = ωA cos(ωt + φ + π/2)</strong> (sớm pha π/2 so với li độ)</p>
              <p>Gia tốc: <strong>a = v' = -ω²x = ω²A cos(ωt + φ + π)</strong> (ngược pha so với li độ)</p>
              <h3>2. Chu kỳ và Tần số con lắc lò xo</h3>
              <p>Tần số góc: <code>ω = √(k / m)</code></p>
              <p>Chu kỳ: <code>T = 2π √(m / k)</code></p>
              <p>Cơ năng bảo toàn: <code>W = Wđ + Wt = (1/2) k A² = (1/2) m ω² A²</code></p>
            `,
          },
          {
            id: 'block_ly_3',
            type: 'gdrive',
            order: 2,
            title: 'Bảng tra cứu công thức nhanh & Đề thi thử',
            gdriveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
            gdriveFileId: extractGDriveId('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view'),
            gdriveTitle: 'Bo_de_on_tap_vat_ly_12_chuong_dao_dong.pdf',
          },
        ],
      },
      {
        title: 'Chuyên đề Câu Điều Kiện Toàn Diện (Conditionals Type 1, 2, 3 & Mixed)',
        slug: generateSlug('Chuyên đề Câu Điều Kiện Toàn Diện'),
        description: 'Quy tắc ngữ pháp, cấu trúc đảo ngữ (Inversion) và mẹo phân biệt câu điều kiện hỗn hợp trong bài thi THPT Quốc gia.',
        subjectId: anhCat._id,
        authorId: teacherNam._id,
        status: 'published',
        coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
        educationalLevel: 'Lớp 10',
        viewCount: 76,
        publishedAt: new Date(),
        blocks: [
          {
            id: 'block_anh_1',
            type: 'rich_text',
            order: 0,
            title: 'Lý thuyết cấu trúc cơ bản',
            richTextHtml: `
              <h3>Bảng so sánh 3 loại câu điều kiện chính</h3>
              <p><strong>Type 1 (Real in Present/Future):</strong></p>
              <p>If + S + V(s/es), S + will/can + V-bare</p>
              <p><em>Ví dụ: If it rains tomorrow, we will stay at home.</em></p>
              <hr />
              <p><strong>Type 2 (Unreal in Present):</strong></p>
              <p>If + S + V2/ed (were), S + would/could + V-bare</p>
              <p><em>Ví dụ: If I had a million dollars, I would travel around the world.</em></p>
              <hr />
              <p><strong>Type 3 (Unreal in Past):</strong></p>
              <p>If + S + had + V3/ed, S + would/could + have + V3/ed</p>
              <p><em>Ví dụ: If you had studied harder, you would have passed the exam.</em></p>
            `,
          },
          {
            id: 'block_anh_2',
            type: 'youtube',
            order: 1,
            title: 'Video Bài giảng: Phân biệt nhanh và Cấu trúc đảo ngữ trong 10 phút',
            youtubeUrl: 'https://www.youtube.com/watch?v=h05B_3F4V7g',
            youtubeVideoId: extractYouTubeId('https://www.youtube.com/watch?v=h05B_3F4V7g'),
          },
          {
            id: 'block_anh_3',
            type: 'gdrive',
            order: 2,
            title: 'Bài tập trắc nghiệm có đáp án chi tiết',
            gdriveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
            gdriveFileId: extractGDriveId('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view'),
            gdriveTitle: '100_cau_trac_nghiem_cau_dieu_kien.pdf',
          },
        ],
      },
    ];

    const seededMaterials = await StudyMaterial.insertMany(materialsData);
    console.log('[Seeder] Created 3 high-quality study materials with multi-format blocks');

    // 4. Seed sample 2-tier discussion comments
    const firstMaterial = seededMaterials[0];
    if (firstMaterial && student && teacherNam) {
      const rootComment = await Comment.create({
        materialId: firstMaterial._id,
        authorId: student._id,
        parentId: null,
        content: 'Thưa thầy, ở phút 03:20 của video, tiếp tuyến tại điểm uốn f\'\'(x)=0 có gì đặc biệt so với các tiếp tuyến tại các điểm khác trên đồ thị ạ?',
        status: 'active',
      });

      await Comment.create({
        materialId: firstMaterial._id,
        authorId: teacherNam._id,
        parentId: rootComment._id,
        content: 'Chào em Minh! Câu hỏi rất sâu sắc. Tại điểm uốn, tiếp tuyến "cắt xuyên qua" đồ thị hàm số thay vì chỉ tiếp xúc và nằm về một phía như tại các điểm cực trị thông thường. Thầy sẽ minh họa chi tiết thêm bằng đồ thị động GeoGebra trong buổi thảo luận trên lớp ngày mai nhé!',
        status: 'active',
      });
      console.log('[Seeder] Created sample 2-tier discussion thread');
    }

    console.log('[Seeder] --- SEED COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('[Seeder] Seed failed:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  (async () => {
    try {
      console.log('[Seeder CLI] Connecting to MongoDB...');
      await connectDB();
      console.log('[Seeder CLI] Connected');
      await seedData(true);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[Seeder CLI] Error:', err);
      process.exit(1);
    }
  })();
}
