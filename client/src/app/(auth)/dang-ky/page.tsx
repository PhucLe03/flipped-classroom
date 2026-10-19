'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function RegisterNoticePage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-8 sm:p-10 shadow-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm mb-4">
          <ShieldAlert className="h-9 w-9 stroke-[2.2]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Chính Sách Cấp Tài Khoản
        </h2>

        <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-5 text-left text-sm text-amber-950 space-y-3 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Lock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="font-semibold">
              Hệ thống không mở đăng ký tự do để bảo đảm môi trường giáo dục an toàn và bảo mật.
            </p>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm pl-7">
            Toàn bộ tài khoản <strong>Học sinh</strong> và <strong>Giáo viên</strong> được cấp phát độc quyền bởi <strong>Quản trị viên nhà trường</strong> thông qua địa chỉ Gmail chính thức.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-600 flex items-center gap-3 text-left">
          <Mail className="h-5 w-5 text-brand-blue shrink-0" />
          <span>
            Nếu bạn là học sinh hoặc giáo viên chưa có tài khoản, vui lòng liên hệ quản trị viên.
          </span>
        </div>

        <div className="pt-2">
          <Link
            href="/dang-nhap"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3.5 px-4 text-base font-bold text-white shadow-md hover:bg-brand-blue-dark transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại trang Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

