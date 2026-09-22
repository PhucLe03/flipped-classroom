import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-brand-yellow shadow">
                <GraduationCap className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-brand-blue">
                Học Liệu Số
              </span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Nền tảng học tập theo mô hình <strong>Lớp học đảo ngược (Flipped Classroom)</strong>.
              Cung cấp kho học liệu số đa phương tiện giúp học sinh chủ động tiếp cận kiến thức trước khi đến lớp.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Hệ thống hoạt động ổn định</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Khám phá
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tai-lieu" className="text-slate-600 hover:text-brand-blue">
                  Kho tài liệu học tập
                </Link>
              </li>
              <li>
                <Link href="/mon-hoc" className="text-slate-600 hover:text-brand-blue">
                  Danh mục môn học
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-slate-600 hover:text-brand-blue">
                  Mô hình Lớp học đảo ngược
                </Link>
              </li>
              <li>
                <Link href="/dang-nhap" className="text-slate-600 hover:text-brand-blue">
                  Đăng nhập tài khoản
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Subjects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Môn học trọng tâm
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Toán học (Giải tích & Hình học)</li>
              <li>Vật lý (Dao động & Sóng ánh sáng)</li>
              <li>Hóa học (Hữu cơ & Vô cơ)</li>
              <li>Tiếng Anh (Ngữ pháp & Luyện đề)</li>
              <li>Tin học (Lập trình thuật toán)</li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Hỗ trợ & Liên hệ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-blue shrink-0" />
                <span>hotro@flippedclassroom.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-blue shrink-0" />
                <span>(+84) 024 3869 xxxx</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                <span>Hà Nội / TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Nền tảng Học Liệu Số. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> phục vụ giáo dục Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
