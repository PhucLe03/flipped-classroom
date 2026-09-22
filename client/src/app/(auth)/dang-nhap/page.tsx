'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/tai-lieu';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      setErrorMessage(res.message || 'Đăng nhập không thành công');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setLoading(true);
    setErrorMessage('');
    const res = await login(demoEmail, '123456');
    setLoading(false);
    if (res.success) {
      router.push(redirectPath);
    } else {
      setErrorMessage(res.message || 'Đăng nhập không thành công');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-brand-yellow shadow-md mb-3">
            <GraduationCap className="h-7 w-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Đăng nhập tài khoản
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Vui lòng đăng nhập để truy cập kho tài liệu học tập
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-xs font-bold text-white shadow-md hover:bg-brand-blue-dark active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Demo Accounts Helper */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-amber-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Tài khoản thử nghiệm nhanh (Mật khẩu: 123456)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('hocsinh@flippedclassroom.edu.vn')}
              className="rounded-lg bg-white border border-amber-300 px-2 py-1.5 text-[11px] font-semibold text-slate-800 hover:bg-amber-100/50 shadow-xs"
            >
              Học sinh
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('thaynam.toan@flippedclassroom.edu.vn')}
              className="rounded-lg bg-white border border-amber-300 px-2 py-1.5 text-[11px] font-semibold text-slate-800 hover:bg-amber-100/50 shadow-xs"
            >
              Giáo viên
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@flippedclassroom.edu.vn')}
              className="rounded-lg bg-white border border-amber-300 px-2 py-1.5 text-[11px] font-semibold text-slate-800 hover:bg-amber-100/50 shadow-xs"
            >
              Quản trị
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" className="font-bold text-brand-blue hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
