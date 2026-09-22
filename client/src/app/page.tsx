import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  FolderOpen,
  Search,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  BrainCircuit,
} from 'lucide-react';

export default function HomePage() {
  const subjects = [
    { name: 'Toán học', slug: 'toan-hoc', count: '15+ tài liệu', color: 'from-blue-500 to-indigo-600', icon: 'Calculator' },
    { name: 'Vật lý', slug: 'vat-ly', count: '12+ tài liệu', color: 'from-cyan-500 to-blue-600', icon: 'Atom' },
    { name: 'Hóa học', slug: 'hoa-hoc', count: '10+ tài liệu', color: 'from-emerald-500 to-teal-600', icon: 'Flask' },
    { name: 'Tiếng Anh', slug: 'tieng-anh', count: '18+ tài liệu', color: 'from-amber-500 to-orange-600', icon: 'Languages' },
    { name: 'Tin học', slug: 'tin-hoc', count: '8+ tài liệu', color: 'from-purple-500 to-violet-600', icon: 'Laptop' },
    { name: 'Sinh học', slug: 'sinh-hoc', count: '9+ tài liệu', color: 'from-green-500 to-emerald-600', icon: 'Dna' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Yellow-Blue Identity */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-brand-blue to-brand-blue-dark text-white py-20 lg:py-28">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-brand-blue-light/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold text-brand-yellow-light border border-white/15 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-brand-yellow" />
              <span>Phương pháp giảng dạy hiện đại & hiệu quả</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              Học Liệu Số <br />
              <span className="text-brand-yellow">Lớp Học Đảo Ngược</span>
            </h1>

            <p className="text-base sm:text-lg text-sky-100 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              Nền tảng học tập tập trung giúp học sinh chủ động nghiên cứu lý thuyết qua{' '}
              <strong className="text-brand-yellow">Video YouTube</strong>,{' '}
              <strong className="text-white">Bài đọc lý thuyết</strong> và{' '}
              <strong className="text-brand-yellow">Tài liệu Google Drive</strong> trước giờ lên lớp.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/tai-lieu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-yellow-500/20 hover:bg-brand-yellow-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Khám phá tài liệu học tập</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dang-nhap"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
              >
                <span>Đăng nhập hệ thống</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Flipped Classroom */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Mô hình Lớp học đảo ngược hoạt động thế nào?
            </h2>
            <p className="text-sm text-slate-600">
              Chuyển đổi từ cách học thụ động truyền thống sang tiếp cận chủ động, tối ưu thời gian thảo luận cùng thầy cô.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-brand-blue font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tự học trước tại nhà</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Học sinh xem video bài giảng, đọc tóm tắt công thức và tải phiếu bài tập từ Google Drive theo hướng dẫn của giáo viên.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Thảo luận trên lớp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thời gian trên lớp được dành trọn vẹn để giải đáp thắc mắc, làm việc nhóm, thực hành các câu hỏi vận dụng cao.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Củng cố & Bứt phá</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nắm chắc kiến thức nền tảng, tự tin giải quyết các dạng đề thi tốt nghiệp THPT và kỳ thi học sinh giỏi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subjects Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 block">
                Chương trình học
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Các môn học trọng tâm
              </h2>
            </div>
            <Link
              href="/tai-lieu"
              className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark"
            >
              <span>Xem tất cả môn học</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((sub) => (
              <Link
                key={sub.slug}
                href={`/tai-lieu?subject=${sub.slug}`}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-blue-light hover:shadow-md transition-all duration-200"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                  {sub.name}
                </h3>
                <span className="text-[11px] text-slate-500 mt-1">
                  {sub.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Format Content Showcase */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 block">
                Học liệu phong phú
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Tích hợp đa định dạng trong cùng một bài học
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Giáo viên có thể xây dựng một bài học trọn gói gồm video trực quan, nội dung lý thuyết chi tiết với trình soạn thảo TipTap mượt mà hỗ trợ gõ tiếng Việt, kèm liên kết kho tài nguyên Google Drive.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Video bài giảng YouTube nhúng trực tiếp</h4>
                    <p className="text-xs text-slate-500">Xem video bài giảng độ phân giải cao, tương thích mọi kích thước màn hình.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-brand-blue shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Nội dung Rich Text chuẩn sư phạm</h4>
                    <p className="text-xs text-slate-500">Định dạng tiêu đề, công thức, trích dẫn, danh sách ghi chú trực quan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Kho tài liệu Google Drive an toàn</h4>
                    <p className="text-xs text-slate-500">Xem trước tài liệu trực tiếp hoặc mở trong Drive để tải về máy.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/tai-lieu"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-blue-dark transition-all"
                >
                  <span>Bắt đầu học ngay hôm nay</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Visual Demo Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400 ml-2 font-mono">tai-lieu/toan-hoc/gioi-thieu-giai-tich</span>
                </div>
              </div>
              <div className="space-y-4 text-xs font-mono">
                <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                  <p className="text-sky-400 font-bold mb-1">▶ Video bài giảng YouTube:</p>
                  <p className="text-slate-300">Bản chất hình học của Đạo hàm (3Blue1Brown)</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                  <p className="text-brand-yellow font-bold mb-1">📝 Lý thuyết trọng tâm:</p>
                  <p className="text-slate-300">y - y₀ = f'(x₀)(x - x₀)</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                  <p className="text-emerald-400 font-bold mb-1">📁 Google Drive PDF:</p>
                  <p className="text-slate-300">Phieu_bai_tap_giai_tich_12.pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
