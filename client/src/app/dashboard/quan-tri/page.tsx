'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { User, Category, StudyMaterial, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import { hashPasswordClient } from '@/lib/crypto';
import {
  ShieldAlert,
  Users,
  BookOpen,
  FolderTree,
  Eye,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  UserPlus,
  UserX,
  Lock,
  Mail,
  X,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'materials'>('users');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users Tab
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // Categories Tab
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Materials Tab
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get<ApiResponse>('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get<ApiResponse<User[]>>('/admin/users');
      if (res.data.success && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get<ApiResponse<Category[]>>('/categories');
      if (res.data.success && res.data.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load all materials
  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get<ApiResponse<StudyMaterial[]>>('/admin/materials');
      if (res.data.success && res.data.data) {
        setMaterials(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCategories();
    fetchMaterials();
  }, []);

  // User Actions
  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to change user role:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    setActionLoading(userId);
    try {
      await api.patch(`/admin/users/${userId}/status`);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) {
      setUserError('Vui lòng điền đầy đủ họ tên, Gmail và mật khẩu khởi tạo');
      return;
    }

    const cleanEmail = newUserEmail.toLowerCase().trim();
    if (!cleanEmail.endsWith('@gmail.com')) {
      setUserError('Địa chỉ email bắt buộc phải có định dạng @gmail.com');
      return;
    }

    if (newUserPassword.length < 6) {
      setUserError('Mật khẩu khởi tạo phải có ít nhất 6 ký tự');
      return;
    }

    setActionLoading('create-user');
    try {
      // Băm mật khẩu phía client với email salt
      const clientHash = await hashPasswordClient(newUserPassword, cleanEmail);

      const res = await api.post<ApiResponse>('/admin/users', {
        fullName: newUserName.trim(),
        email: cleanEmail,
        password: clientHash,
        role: newUserRole,
      });

      if (res.data.success) {
        setUserSuccess(`Đã tạo thành công tài khoản cho ${newUserName} (${cleanEmail})`);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('student');
        setShowAddUserModal(false);
        await fetchUsers();
        await fetchStats();
      } else {
        setUserError(res.data.message || 'Lỗi khi tạo tài khoản');
      }
    } catch (err: any) {
      setUserError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string, name: string) => {
    if (email === 'hailua112003@gmail.com') {
      alert('Không thể xóa tài khoản Quản trị viên tối cao của hệ thống!');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${name}" (${email}) khỏi hệ thống?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
      await fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi xóa người dùng');
    } finally {
      setActionLoading(null);
    }
  };

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setActionLoading('create-cat');
    try {
      await api.post('/categories', { name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      await fetchCategories();
      await fetchStats();
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục môn học "${name}"?`)) return;
    setActionLoading(id);
    try {
      await api.delete(`/categories/${id}`);
      await fetchCategories();
      await fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi xóa danh mục');
    } finally {
      setActionLoading(null);
    }
  };

  // Material Actions
  const handleDeleteMaterial = async (id: string, title: string) => {
    if (!window.confirm(`Xóa vĩnh viễn bài học "${title}" khỏi hệ thống?`)) return;
    setActionLoading(id);
    try {
      await api.delete(`/materials/${id}`);
      await fetchMaterials();
      await fetchStats();
    } catch (err) {
      console.error('Failed to delete material:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 mb-1 block">
              Khu vực Quản trị tối cao
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Dashboard Quản Trị Hệ Thống
            </h1>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-5 shadow-sm">
                <span className="text-sm font-semibold text-slate-600 block mb-1">Tổng người dùng</span>
                <p className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</p>
                <span className="text-xs text-slate-500 font-medium">
                  {stats.totalTeachers} GV / {stats.totalStudents} HS
                </span>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-5 shadow-sm">
                <span className="text-sm font-semibold text-slate-600 block mb-1">Tổng bài học</span>
                <p className="text-3xl font-extrabold text-brand-blue">{stats.totalMaterials}</p>
                <span className="text-xs text-slate-500 font-medium">
                  {stats.publishedMaterials} đã đăng / {stats.draftMaterials} nháp
                </span>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-5 shadow-sm">
                <span className="text-sm font-semibold text-slate-600 block mb-1">Môn học</span>
                <p className="text-3xl font-extrabold text-emerald-600">{stats.totalCategories}</p>
                <span className="text-xs text-slate-500 font-medium">Đang kích hoạt</span>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-5 shadow-sm">
                <span className="text-sm font-semibold text-slate-600 block mb-1">Lượt truy cập</span>
                <p className="text-3xl font-extrabold text-indigo-600">{stats.totalViews}</p>
                <span className="text-xs text-slate-500 font-medium">Lượt xem tài liệu</span>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/92 backdrop-blur-md p-5 shadow-sm">
                <span className="text-sm font-semibold text-slate-600 block mb-1">Hệ thống</span>
                <p className="text-xl font-extrabold text-emerald-600">Online</p>
                <span className="text-xs text-slate-500 font-medium">Hoạt động bình thường</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm sm:text-base font-bold transition-all ${
                activeTab === 'users'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Quản lý Người dùng ({users.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm sm:text-base font-bold transition-all ${
                activeTab === 'categories'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderTree className="h-4.5 w-4.5" />
              <span>Quản lý Môn học ({categories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm sm:text-base font-bold transition-all ${
                activeTab === 'materials'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>Toàn bộ Học liệu ({materials.length})</span>
            </button>
          </div>

          {/* Tab 1: Users */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Danh Sách Tài Khoản Hệ Thống
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Chỉ Quản trị viên mới có quyền tạo và phân vai trò cho Giáo viên và Học sinh qua Gmail.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(!showAddUserModal);
                    setUserError('');
                    setUserSuccess('');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-brand-blue-dark transition-all shrink-0"
                >
                  <UserPlus className="h-4.5 w-4.5" />
                  <span>{showAddUserModal ? 'Đóng biểu mẫu' : 'Cấp tài khoản Gmail mới'}</span>
                </button>
              </div>

              {/* Notification Alerts */}
              {userSuccess && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-800">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{userSuccess}</span>
                </div>
              )}
              {userError && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-700">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <span>{userError}</span>
                </div>
              )}

              {/* Create User Form Panel */}
              {showAddUserModal && (
                <form
                  onSubmit={handleCreateUser}
                  className="rounded-3xl border border-blue-200 bg-blue-50/40 p-6 sm:p-7 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                    <div className="flex items-center gap-2 text-brand-blue font-bold text-base">
                      <UserPlus className="h-5 w-5" />
                      <span>Cấp tài khoản Gmail mới</span>
                    </div>
                    <span className="text-xs text-slate-500">Mật khẩu được băm SHA-256 + Bcrypt an toàn</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Họ và tên người dùng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Trần Văn Nam"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Địa chỉ Gmail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tennguoidung@gmail.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mật khẩu khởi tạo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Tối thiểu 6 ký tự"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-blue font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phân quyền vai trò <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-blue font-semibold"
                      >
                        <option value="student">Học sinh</option>
                        <option value="teacher">Giáo viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading === 'create-user'}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-yellow px-5 py-2 text-sm font-bold text-slate-950 shadow-xs hover:bg-brand-yellow-hover disabled:opacity-50"
                    >
                      {actionLoading === 'create-user' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang tạo tài khoản...</span>
                        </>
                      ) : (
                        <span>Lưu & Cấp tài khoản</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table */}
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="border-b border-slate-100 bg-slate-50/70 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="px-5 py-4">Họ và tên</th>
                        <th className="px-4 py-4">Địa chỉ Gmail</th>
                        <th className="px-4 py-4">Vai trò</th>
                        <th className="px-4 py-4">Trạng thái</th>
                        <th className="px-5 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => {
                        const isSuperAdmin = u.email === 'hailua112003@gmail.com';

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/60">
                            <td className="px-5 py-4 font-bold text-slate-900 text-sm sm:text-base">
                              <div className="flex items-center gap-2">
                                <span>{u.fullName}</span>
                                {isSuperAdmin && (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                                    Super Admin
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-600 font-mono text-xs sm:text-sm">
                              {u.email}
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                disabled={actionLoading === u.id || isSuperAdmin}
                                className="rounded-lg border border-slate-300 py-1.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none disabled:opacity-60"
                              >
                                <option value="student">Học sinh</option>
                                <option value="teacher">Giáo viên</option>
                                <option value="admin">Quản trị viên</option>
                              </select>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  (u as any).isActive !== false
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {(u as any).isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  disabled={actionLoading === u.id || isSuperAdmin}
                                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
                                >
                                  {(u as any).isActive !== false ? 'Khóa' : 'Mở'}
                                </button>
                                {!isSuperAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id, u.email, u.fullName)}
                                    disabled={actionLoading === u.id}
                                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    title="Xóa tài khoản này"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Create Category Form */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Thêm Môn học / Danh mục mới</h3>
                <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Tên môn học (Ví dụ: Lịch sử, Địa lý...)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-brand-blue"
                  />
                  <input
                    type="text"
                    placeholder="Mô tả ngắn"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading === 'create-cat'}
                    className="rounded-xl bg-brand-blue px-6 py-3 text-sm sm:text-base font-bold text-white hover:bg-brand-blue-dark shadow-xs"
                  >
                    Thêm môn học
                  </button>
                </form>
              </div>

              {/* Categories List */}
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-5 py-4">Tên môn học</th>
                      <th className="px-4 py-4">Đường dẫn Slug</th>
                      <th className="px-4 py-4">Số bài học</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-bold text-slate-900 text-sm sm:text-base">{c.name}</td>
                        <td className="px-4 py-4 font-mono text-xs sm:text-sm text-slate-500">{c.slug}</td>
                        <td className="px-4 py-4 font-semibold text-slate-800 text-sm">{c.materialCount || 0}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            disabled={actionLoading === c.id}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Materials */}
          {activeTab === 'materials' && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Tiêu đề bài học</th>
                    <th className="px-4 py-4">Môn học</th>
                    <th className="px-4 py-4">Tác giả / Giáo viên</th>
                    <th className="px-4 py-4">Trạng thái</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materials.map((m) => {
                    const subject = typeof m.subjectId === 'object' ? (m.subjectId as any) : null;
                    const author = typeof m.authorId === 'object' ? (m.authorId as any) : null;

                    return (
                      <tr key={m._id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-bold text-slate-900 max-w-xs truncate text-sm sm:text-base">
                          {m.title}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs sm:text-sm font-semibold text-brand-blue">
                            {subject?.name || 'Môn học'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs sm:text-sm text-slate-600">
                          {author?.fullName || 'Giáo viên'}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              m.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {m.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/tai-lieu/chi-tiet?slug=${m.slug}`}
                              target="_blank"
                              className="rounded-lg p-2 text-slate-400 hover:text-brand-blue"
                              title="Xem bài học"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(m._id, m.title)}
                              disabled={actionLoading === m._id}
                              className="rounded-lg p-2 text-red-400 hover:text-red-600"
                              title="Xóa bài học"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
