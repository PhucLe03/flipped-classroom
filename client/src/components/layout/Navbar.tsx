'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  PlusCircle,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tài liệu học tập', href: '/tai-lieu' },
    { name: 'Môn học', href: '/mon-hoc' },
    { name: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-brand-yellow shadow-md transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-brand-blue leading-tight">
              Học Liệu Số
            </span>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Lớp Học Đảo Ngược
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'text-brand-blue bg-blue-50 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & Profile Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3.5 text-sm font-medium text-slate-700 shadow-sm hover:border-brand-blue-light transition-all focus:outline-none"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-sm uppercase">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[130px]">
                    {user.fullName}
                  </span>
                  <span className="text-xs text-brand-blue capitalize font-semibold">
                    {user.role === 'admin'
                      ? 'Quản trị viên'
                      : user.role === 'teacher'
                      ? 'Giáo viên'
                      : 'Học sinh'}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500">Đăng nhập với email</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                  </div>

                  {user.role === 'teacher' && (
                    <>
                      <Link
                        href="/dashboard/giao-vien"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-blue"
                      >
                        <LayoutDashboard className="h-4 w-4 text-brand-blue" />
                        Dashboard Giáo viên
                      </Link>
                      <Link
                        href="/dashboard/giao-vien/tao-tai-lieu"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <PlusCircle className="h-4 w-4 text-amber-500" />
                        Tạo tài liệu mới
                      </Link>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <Link
                        href="/dashboard/quan-tri"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-blue"
                      >
                        <ShieldAlert className="h-4 w-4 text-brand-blue" />
                        Dashboard Quản trị
                      </Link>
                      <Link
                        href="/dashboard/giao-vien/tao-tai-lieu"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <PlusCircle className="h-4 w-4 text-amber-500" />
                        Tạo tài liệu mới
                      </Link>
                    </>
                  )}

                  <Link
                    href="/tai-lieu"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <BookOpen className="h-4 w-4 text-slate-500" />
                    Kho học liệu số
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/dang-nhap"
                className="px-4 py-2 text-sm font-medium text-brand-blue hover:text-brand-blue-dark transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-brand-yellow-hover transition-all transform active:scale-95"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-brand-blue font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-sm text-slate-800">{user.fullName}</p>
                  <p className="text-xs text-brand-blue capitalize font-medium">{user.role}</p>
                </div>
                {user.role === 'teacher' && (
                  <Link
                    href="/dashboard/giao-vien"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50"
                  >
                    Dashboard Giáo viên
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/dashboard/quan-tri"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50"
                  >
                    Dashboard Quản trị
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dang-nhap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-yellow py-2.5 text-sm font-bold text-slate-900 shadow hover:bg-brand-yellow-hover"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
