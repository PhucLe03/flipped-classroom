'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { User, Category, StudyMaterial, ApiResponse } from '@/types';
import { api } from '@/lib/api';
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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'materials'>('users');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users Tab
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

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
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1 block">
              Khu vực Quản trị tối cao
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dashboard Quản Trị Hệ Thống
            </h1>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng người dùng</span>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                <span className="text-[11px] text-slate-400">
                  {stats.totalTeachers} GV / {stats.totalStudents} HS
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng bài học</span>
                <p className="text-2xl font-bold text-brand-blue">{stats.totalMaterials}</p>
                <span className="text-[11px] text-slate-400">
                  {stats.publishedMaterials} đã đăng / {stats.draftMaterials} nháp
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Môn học</span>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalCategories}</p>
                <span className="text-[11px] text-slate-400">Đang kích hoạt</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Lượt truy cập</span>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalViews}</p>
                <span className="text-[11px] text-slate-400">Lượt xem tài liệu</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Hệ thống</span>
                <p className="text-lg font-bold text-emerald-600">Online</p>
                <span className="text-[11px] text-slate-400">Hoạt động bình thường</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Quản lý Người dùng ({users.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
                activeTab === 'categories'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>Quản lý Môn học ({categories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
                activeTab === 'materials'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Toàn bộ Học liệu ({materials.length})</span>
            </button>
          </div>

          {/* Tab 1: Users */}
          {activeTab === 'users' && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Họ và tên</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5">Vai trò</th>
                      <th className="px-4 py-3.5">Trạng thái</th>
                      <th className="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3.5 font-bold text-slate-900">{u.fullName}</td>
                        <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={actionLoading === u.id}
                            className="rounded-lg border border-slate-300 py-1 px-2 text-xs font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="student">Học sinh</option>
                            <option value="teacher">Giáo viên</option>
                            <option value="admin">Quản trị viên</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              (u as any).isActive !== false
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {(u as any).isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id)}
                            disabled={actionLoading === u.id}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                          >
                            {(u as any).isActive !== false ? 'Khóa tài khoản' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Create Category Form */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Thêm Môn học / Danh mục mới</h3>
                <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Tên môn học (Ví dụ: Lịch sử, Địa lý...)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
                  />
                  <input
                    type="text"
                    placeholder="Mô tả ngắn"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading === 'create-cat'}
                    className="rounded-xl bg-brand-blue px-5 py-2 text-xs font-bold text-white hover:bg-brand-blue-dark shadow-xs"
                  >
                    Thêm môn học
                  </button>
                </form>
              </div>

              {/* Categories List */}
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Tên môn học</th>
                      <th className="px-4 py-3.5">Đường dẫn Slug</th>
                      <th className="px-4 py-3.5">Số bài học</th>
                      <th className="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3.5 font-bold text-slate-900">{c.name}</td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{c.slug}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{c.materialCount || 0}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            disabled={actionLoading === c.id}
                            className="rounded p-1 text-red-500 hover:bg-red-50"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="h-4 w-4" />
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
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Tiêu đề bài học</th>
                    <th className="px-4 py-3.5">Môn học</th>
                    <th className="px-4 py-3.5">Tác giả / Giáo viên</th>
                    <th className="px-4 py-3.5">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materials.map((m) => {
                    const subject = typeof m.subjectId === 'object' ? (m.subjectId as any) : null;
                    const author = typeof m.authorId === 'object' ? (m.authorId as any) : null;

                    return (
                      <tr key={m._id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                          {m.title}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-brand-blue">
                            {subject?.name || 'Môn học'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {author?.fullName || 'Giáo viên'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              m.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {m.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/tai-lieu/${m.slug}`}
                              target="_blank"
                              className="rounded p-1 text-slate-400 hover:text-brand-blue"
                              title="Xem bài học"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(m._id, m.title)}
                              disabled={actionLoading === m._id}
                              className="rounded p-1 text-red-400 hover:text-red-600"
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
