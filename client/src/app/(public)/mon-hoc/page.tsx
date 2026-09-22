import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calculator, Atom, FlaskConical, Languages, Laptop, Dna } from 'lucide-react';

export default function SubjectsPage() {
  const subjects = [
    {
      name: 'Toán học',
      slug: 'toan-hoc',
      description: 'Đại số, Giải tích 12, Hình học không gian, Xác suất thống kê',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Vật lý',
      slug: 'vat-ly',
      description: 'Dao động cơ học, Sóng cơ, Điện xoay chiều, Sóng ánh sáng',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Hóa học',
      slug: 'hoa-hoc',
      description: 'Hóa hữu cơ Este-Lipit, Kim loại kiềm, Thí nghiệm ảo',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Tiếng Anh',
      slug: 'tieng-anh',
      description: 'Chuyên đề ngữ pháp, Câu điều kiện, Mệnh đề quan hệ, Đọc hiểu',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Tin học',
      slug: 'tin-hoc',
      description: 'Lập trình Python, Cấu trúc dữ liệu, Giải thuật nâng cao',
      color: 'from-purple-500 to-violet-600',
    },
    {
      name: 'Sinh học',
      slug: 'sinh-hoc',
      description: 'Cơ chế di truyền và biến dị, Quy luật Menđen, Sinh thái học',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 block">
            Chương trình đào tạo
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
            Danh Mục Môn Học
          </h1>
          <p className="text-sm text-slate-600">
            Lựa chọn môn học bạn muốn nghiên cứu để truy cập video bài giảng và phiếu bài tập.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <Link
              key={sub.slug}
              href={`/tai-lieu?subject=${sub.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-blue-light hover:shadow-lg transition-all"
            >
              <div>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue mb-2">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-brand-blue group-hover:translate-x-1 transition-transform">
                <span>Vào kho tài liệu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
