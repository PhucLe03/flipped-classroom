'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { StudyMaterial, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Eye,
  FileCheck,
  FileEdit,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle,
  Clock,
  Video,
  FolderOpen,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [metrics, setMetrics] = useState({
    totalMaterials: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMyMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<StudyMaterial[]>>('/materials/teacher/mine');
      if (res.data.success && res.data.data) {
        setMaterials(res.data.data);
        if ((res.data as any).metrics) {
          setMetrics((res.data as any).metrics);
        }
      }
    } catch (err) {
      console.error('Error fetching teacher materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const toggleStatus = async (material: StudyMaterial) => {
    const newStatus = material.status === 'published' ? 'draft' : 'published';
    setActionLoading(material._id);
    try {
      await api.put(`/materials/${material._id}`, { status: newStatus });
      await fetchMyMaterials();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}" không?`)) {
      return;
    }
    setActionLoading(id);
    try {
      await api.delete(`/materials/${id}`);
      await fetchMyMaterials();
    } catch (err) {
      console.error('Failed to delete material:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 block">
                Không gian giáo viên
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dashboard Quản Lý Tài Liệu
              </h1>
            </div>

            <Link
              href="/dashboard/giao-vien/tao-tai-lieu"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-5 py-2.5 text-xs font-bold text-slate-950 shadow hover:bg-brand-yellow-hover transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Tạo tài liệu mới</span>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Tổng số tài liệu</span>
                <BookOpen className="h-5 w-5 text-brand-blue" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{metrics.totalMaterials}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Đã xuất bản</span>
                <FileCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{metrics.published}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Bản nháp</span>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{metrics.drafts}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Tổng lượt xem</span>
                <Eye className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-indigo-600">{metrics.totalViews}</p>
            </div>
          </div>

          {/* Materials Table */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Danh sách bài học của bạn ({materials.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              </div>
            ) : materials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Tiêu đề bài học</th>
                      <th className="px-4 py-3.5">Môn học</th>
                      <th className="px-4 py-3.5">Khối lớp</th>
                      <th className="px-4 py-3.5">Khối nội dung</th>
                      <th className="px-4 py-3.5">Lượt xem</th>
                      <th className="px-4 py-3.5">Trạng thái</th>
                      <th className="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {materials.map((m) => {
                      const subject = typeof m.subjectId === 'object' ? (m.subjectId as any) : null;
                      const hasVideo = m.blocks?.some((b) => b.type === 'youtube');
                      const hasDrive = m.blocks?.some((b) => b.type === 'gdrive');

                      return (
                        <tr key={m._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs truncate">
                            <Link
                              href={`/tai-lieu/${m.slug}`}
                              className="hover:text-brand-blue hover:underline"
                            >
                              {m.title}
                            </Link>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-brand-blue">
                              {subject?.name || 'Môn học'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {m.educationalLevel || 'Chung'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <span>{m.blocks?.length || 0} khối</span>
                              {hasVideo && <Video className="h-3.5 w-3.5 text-red-500" />}
                              {hasDrive && <FolderOpen className="h-3.5 w-3.5 text-amber-500" />}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-600">
                            {m.viewCount || 0}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => toggleStatus(m)}
                              disabled={actionLoading === m._id}
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                                m.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              }`}
                            >
                              {m.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/tai-lieu/${m.slug}`}
                                target="_blank"
                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-blue"
                                title="Xem trang học sinh"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/dashboard/giao-vien/chinh-sua/${m._id}`}
                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                                title="Chỉnh sửa bài học"
                              >
                                <FileEdit className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(m._id, m.title)}
                                disabled={actionLoading === m._id}
                                className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
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
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Bạn chưa tạo tài liệu nào
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Bắt đầu tạo bài học đầu tiên với các khối video YouTube, rich text và tài liệu Drive.
                </p>
                <Link
                  href="/dashboard/giao-vien/tao-tai-lieu"
                  className="rounded-xl bg-brand-yellow px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-brand-yellow-hover"
                >
                  Tạo tài liệu mới ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
