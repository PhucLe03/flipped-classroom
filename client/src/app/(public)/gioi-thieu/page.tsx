import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, CheckCircle2, Video, FileText, FolderOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-brand-yellow shadow-md mb-4">
            <GraduationCap className="h-7 w-7 stroke-[2.5]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Giới Thiệu Mô Hình Lớp Học Đảo Ngược (Flipped Classroom)
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8">
            <strong>Lớp học đảo ngược</strong> là mô hình sư phạm tiến bộ, trong đó quy trình học tập truyền thống được đảo ngược: học sinh tự nghiên cứu kiến thức mới tại nhà thông qua các học liệu số (Video bài giảng, tài liệu đọc, bài tập rèn luyện) trước giờ lên lớp; thời gian trên lớp được dành cho các hoạt động tương tác sâu như thảo luận, làm bài tập vận dụng và giải quyết vấn đề dưới sự hướng dẫn của giáo viên.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-brand-blue mb-4">Lợi ích cốt lõi</h2>
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <strong>Chủ động tốc độ học:</strong> Học sinh có thể dừng, xem lại video bài giảng nhiều lần tùy theo năng lực tiếp thu cá nhân.
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <strong>Tối đa hóa thời gian tương tác:</strong> Giáo viên không còn phải mất 80% thời gian đứng lớp chỉ để đọc chép lý thuyết mà dành thời gian kèm cặp từng học sinh.
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <strong>Tài liệu tập trung và an toàn:</strong> Mọi bài giảng, đề thi và phiếu bài tập trên Google Drive được phân loại khoa học theo từng môn học.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-6 sm:p-7 mb-10">
            <h3 className="text-base sm:text-lg font-bold text-brand-blue mb-2.5">Đặc điểm công nghệ nền tảng</h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Hệ thống được phát triển với công nghệ <strong>Next.js</strong>, <strong>Node.js Express</strong> và cơ sở dữ liệu <strong>MongoDB</strong>. Giao diện trực quan dựa trên bảng màu chuẩn <strong>Xanh dương - Vàng</strong> (`#006199` & `#FFD444`), tối ưu hóa trải nghiệm gõ tiếng Việt có dấu với trình biên tập TipTap hiện đại.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/tai-lieu"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-brand-blue-dark transition-all"
            >
              <span>Truy cập kho học liệu số</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
