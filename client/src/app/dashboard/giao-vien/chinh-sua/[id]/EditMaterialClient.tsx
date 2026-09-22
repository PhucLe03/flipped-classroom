'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BlockManager from '@/components/editor/BlockManager';
import { Category, ContentBlock, StudyMaterial, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface EditMaterialClientProps {
  id?: string;
}

export default function EditMaterialClient({ id: propId }: EditMaterialClientProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = propId || (params?.id as string) || (searchParams?.get('id') as string) || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [material, setMaterial] = useState<StudyMaterial | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('Lớp 12');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        const [catsRes, matRes] = await Promise.all([
          api.get<ApiResponse<Category[]>>('/categories'),
          api.get<ApiResponse<StudyMaterial>>(`/materials/${id}`),
        ]);

        if (catsRes.data.success && catsRes.data.data) {
          setCategories(catsRes.data.data);
        }

        if (matRes.data.success && matRes.data.data) {
          const m = matRes.data.data;
          setMaterial(m);
          setTitle(m.title);
          setDescription(m.description);
          setSubjectId(typeof m.subjectId === 'object' ? (m.subjectId as any)._id : m.subjectId);
          setEducationalLevel(m.educationalLevel || 'Lớp 12');
          setCoverImage(m.coverImage || '');
          setStatus(m.status === 'published' ? 'published' : 'draft');
          setBlocks(m.blocks || []);
        } else {
          router.push('/dashboard/giao-vien');
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        router.push('/dashboard/giao-vien');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id && id !== 'sample') {
      fetchData();
    } else {
      setInitialLoading(false);
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !description.trim() || !subjectId) {
      setErrorMessage('Vui lòng điền đầy đủ Tiêu đề, Mô tả ngắn và Môn học');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put<ApiResponse>(`/materials/${id}`, {
        title,
        description,
        subjectId,
        educationalLevel,
        coverImage,
        status,
        blocks,
      });

      if (res.data.success) {
        router.push('/dashboard/giao-vien');
      } else {
        setErrorMessage(res.data.message || 'Lỗi khi cập nhật bài học');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật'
      );
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header & Back */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/dashboard/giao-vien"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-blue transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Dashboard</span>
            </Link>

            {material?.slug && (
              <Link
                href={`/tai-lieu/chi-tiet?slug=${material.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
              >
                <span>Xem trang công khai</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Chỉnh sửa bài học
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Cập nhật thông tin tiêu đề, mô tả và cấu trúc các khối nội dung học tập.
              </p>

              {errorMessage && (
                <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Tiêu đề bài học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Mô tả ngắn gọn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3.5 text-base text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Môn học <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 px-3.5 text-base text-slate-900 focus:border-brand-blue focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Khối lớp
                    </label>
                    <select
                      value={educationalLevel}
                      onChange={(e) => setEducationalLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 px-3.5 text-base text-slate-900 focus:border-brand-blue focus:outline-none"
                    >
                      <option value="Lớp 10">Lớp 10</option>
                      <option value="Lớp 11">Lớp 11</option>
                      <option value="Lớp 12">Lớp 12</option>
                      <option value="Đại học">Đại học</option>
                      <option value="Chung">Chung</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Đường dẫn ảnh bìa (Thumbnail URL)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Trạng thái xuất bản
                  </label>
                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === 'published'}
                        onChange={() => setStatus('published')}
                        className="text-brand-blue h-4 w-4"
                      />
                      <span className="font-semibold text-emerald-700">Đã đăng công khai</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === 'draft'}
                        onChange={() => setStatus('draft')}
                        className="text-amber-600 h-4 w-4"
                      />
                      <span className="font-medium text-slate-600">Lưu bản nháp</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content Block Manager */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <BlockManager blocks={blocks} onChange={setBlocks} />
            </div>

            {/* Submit Action Footer */}
            <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-xl">
              <Link
                href="/dashboard/giao-vien"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-7 py-3 text-sm sm:text-base font-bold text-slate-950 shadow hover:bg-brand-yellow-hover disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
