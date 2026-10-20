'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import UserAvatar from '@/components/user/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { AVATAR_CATEGORIES, getAvatarPreset, toAvatarValue, getAvatarUrl } from '@/lib/avatars';
import {
  Check,
  Loader2,
  Save,
  RotateCcw,
  UserRound,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

const ROLE_LABEL: Record<string, string> = {
  admin: '👑 Quản trị viên',
  teacher: '👨‍🏫 Giáo viên',
  student: '🎒 Học sinh',
};

function ProfileEditor() {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [activeCategory, setActiveCategory] = useState(AVATAR_CATEGORIES[0].key);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Đồng bộ dữ liệu ban đầu từ tài khoản
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setAvatar(user.avatar || '');
      const preset = getAvatarPreset(user.avatar);
      if (preset) {
        const cat = AVATAR_CATEGORIES.find((c) => c.items.some((i) => i.id === preset.id));
        if (cat) setActiveCategory(cat.key);
      }
    }
  }, [user]);

  const selectedPreset = getAvatarPreset(avatar);
  const category = AVATAR_CATEGORIES.find((c) => c.key === activeCategory) || AVATAR_CATEGORIES[0];

  const trimmedName = fullName.trim().replace(/\s+/g, ' ');
  const nameError =
    trimmedName.length < 2
      ? 'Họ và tên phải có ít nhất 2 ký tự'
      : trimmedName.length > 100
        ? 'Họ và tên không được vượt quá 100 ký tự'
        : /[<>]/.test(trimmedName)
          ? 'Họ và tên chứa ký tự không hợp lệ'
          : '';

  const isDirty = useMemo(
    () => !!user && (trimmedName !== user.fullName || avatar !== (user.avatar || '')),
    [user, trimmedName, avatar]
  );

  if (!user) return null;

  const handleReset = () => {
    setFullName(user.fullName || '');
    setAvatar(user.avatar || '');
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError || !isDirty) return;
    setSaving(true);
    setError('');
    setSuccess('');
    const res = await updateProfile({ fullName: trimmedName, avatar });
    setSaving(false);
    if (res.success) {
      setSuccess('Đã lưu thay đổi hồ sơ của bạn');
    } else {
      setError(res.message || 'Không thể lưu thay đổi');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!currentPassword) {
      setPwdError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword === currentPassword) {
      setPwdError('Mật khẩu mới không được trùng với mật khẩu hiện tại');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Xác nhận mật khẩu mới không trùng khớp');
      return;
    }

    setPwdLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPwdLoading(false);

    if (res.success) {
      setPwdSuccess(res.message || 'Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwdError(res.message || 'Đổi mật khẩu không thành công');
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Tài khoản</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Cài đặt tài khoản</h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Tùy chỉnh tên hiển thị, chọn avatar  và đổi mật khẩu bảo mật.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
          {/* Cột trái: xem trước hồ sơ */}
          <aside className="lg:sticky lg:top-24 self-start rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-xl">
            <div
              className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full transition-all duration-500"
              style={{
                background: selectedPreset
                  ? `radial-gradient(circle, ${selectedPreset.from}55 0%, transparent 70%)`
                  : 'radial-gradient(circle, #a8edea88 0%, transparent 70%)',
              }}
            >
              <div key={avatar} className="animate-avatar-pop">
                <UserAvatar avatar={avatar} name={trimmedName || user.fullName} size={136} className="ring-4" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-xl font-extrabold text-slate-900 break-words">{trimmedName || 'Tên của bạn'}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {selectedPreset ? selectedPreset.label : 'Chưa chọn avatar'}
              </p>
            </div>

            <div className="mt-6 space-y-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 text-sm">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="h-4 w-4 text-brand-blue shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <ShieldCheck className="h-4 w-4 text-brand-blue shrink-0" />
                <span>{ROLE_LABEL[user.role] || user.role}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400 text-center">
              Địa chỉ Gmail và vai trò do Quản trị viên cấp độc quyền, không thể tự thay đổi.
            </p>
          </aside>

          {/* Cột phải: chỉnh sửa hồ sơ & đổi mật khẩu */}
          <section className="space-y-6">
            {/* Form chỉnh sửa tên và avatar */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Tên hiển thị */}
              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-6 sm:p-7 shadow-lg">
                <label htmlFor="profile-fullname" className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <UserRound className="h-4 w-4 text-brand-blue" />
                  Họ và tên hiển thị
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={fullName}
                  maxLength={100}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${nameError ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:border-brand-blue focus:ring-brand-blue/20'
                    }`}
                />
                <div className="mt-1.5 flex justify-between text-xs">
                  <span className="text-red-600">{nameError}</span>
                  <span className="text-slate-400">{trimmedName.length}/100</span>
                </div>
              </div>

              {/* Bộ chọn avatar Xbox style */}
              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-6 sm:p-7 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Chọn Avatar có sẵn</h2>
                    <p className="text-xs text-slate-500">Bộ avatar vector Xbox độc quyền, tải trực tiếp từ hệ thống</p>
                  </div>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="self-start sm:self-auto text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
                    >
                      Gỡ avatar (dùng chữ cái đầu)
                    </button>
                  )}
                </div>

                {/* Tab danh mục */}
                <div role="tablist" aria-label="Danh mục avatar" className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
                  {AVATAR_CATEGORIES.map((cat) => {
                    const active = cat.key === activeCategory;
                    const hasSelected = cat.items.some((i) => toAvatarValue(i.id) === avatar);
                    return (
                      <button
                        key={cat.key}
                        id={`avatar-tab-${cat.key}`}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${active
                          ? 'bg-brand-blue text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        <span aria-hidden="true">{cat.icon}</span>
                        {cat.label}
                        {hasSelected && !active && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lưới avatar */}
                <div role="radiogroup" aria-label={`Avatar ${category.label}`} className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                  {category.items.map((preset) => {
                    const value = toAvatarValue(preset.id);
                    const selected = value === avatar;
                    return (
                      <button
                        key={preset.id}
                        id={`avatar-option-${preset.id}`}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={preset.label}
                        onClick={() => setAvatar(value)}
                        className={`group relative flex flex-col items-center gap-2 rounded-2xl p-3 sm:p-4 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 ${selected
                          ? 'bg-brand-blue/10 ring-[3px] ring-brand-blue shadow-lg scale-[1.03]'
                          : 'bg-white/70 ring-1 ring-slate-200 hover:ring-brand-blue-light hover:shadow-md hover:-translate-y-1'
                          }`}
                      >
                        <div className="flex aspect-square w-full items-center justify-center rounded-2xl shadow-inner transition-transform duration-200 group-hover:scale-105 overflow-hidden p-1.5">
                          <img
                            src={getAvatarUrl(preset.id)!}
                            alt={preset.label}
                            className="h-full w-full object-contain drop-shadow-md select-none pointer-events-none"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src && target.src.includes('/flipped-classroom/avatars/')) {
                                target.src = target.src.replace('/flipped-classroom/avatars/', '/avatars/');
                              }
                            }}
                          />
                        </div>
                        <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight ${selected ? 'text-brand-blue font-bold' : 'text-slate-600'}`}>
                          {preset.label}
                        </span>
                        {selected && (
                          <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-white shadow-md ring-2 ring-white">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thanh lưu hồ sơ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/92 backdrop-blur-md p-4 shadow-xl">
                <div className="text-sm min-h-[20px]">
                  {error ? (
                    <span className="flex items-center gap-1.5 font-medium text-red-600">
                      <AlertCircle className="h-4 w-4" /> {error}
                    </span>
                  ) : success && !isDirty ? (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> {success}
                    </span>
                  ) : isDirty ? (
                    <span className="font-medium text-amber-700">Bạn có thay đổi chưa lưu</span>
                  ) : (
                    <Link href="/tai-lieu" className="font-medium text-slate-500 hover:text-brand-blue">
                      ← Quay lại kho học liệu
                    </Link>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!isDirty || saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-40 transition-all"
                  >
                    <RotateCcw className="h-4 w-4" /> Hoàn tác
                  </button>
                  <button
                    id="profile-save"
                    type="submit"
                    disabled={!isDirty || !!nameError || saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-blue-dark active:scale-95 disabled:opacity-40 transition-all"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            </form>

            {/* Thẻ Đổi Mật Khẩu Riêng Biệt */}
            <form onSubmit={handleChangePassword} className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-6 sm:p-7 shadow-lg space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-sm">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Đổi mật khẩu tài khoản</h2>
                  <p className="text-xs text-slate-500">Thay đổi mật khẩu tài khoản của bạn.</p>
                </div>
              </div>

              {/* Thông báo lỗi / thành công */}
              {pwdError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700 border border-red-200 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800 border border-emerald-200 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              {/* Trường: Mật khẩu hiện tại */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    title={showCurrentPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showCurrentPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trường: Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showNewPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Trường: Xác nhận mật khẩu mới */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showConfirmPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={pwdLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-md active:scale-95 disabled:opacity-40 transition-all"
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Cập nhật mật khẩu mới</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileEditor />
    </ProtectedRoute>
  );
}
