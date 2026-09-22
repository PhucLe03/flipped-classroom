'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BlockManager from '@/components/editor/BlockManager';
import { Category, ContentBlock, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function CreateMaterialPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('Lớp 12');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: 'initial_text',
      type: 'rich_text',
      order: 0,
      title: 'Tóm tắt nội dung lý thuyết',
      richTextHtml: '<p>Nhập tóm tắt kiến thức cốt lõi của bài học tại đây...</p>',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<ApiResponse<Category[]>>('/categories');
        if (res.data.success && res.data.data) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setSubjectId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !description.trim() || !subjectId) {
      setErrorMessage('Vui lòng điền đầy đủ Tiêu đề, Mô tả ngắn và chọn Môn học');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ApiResponse>('/materials', {
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
        setErrorMessage(res.data.message || 'Lỗi khi tạo tài liệu');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Có lỗi xảy ra trong quá trình lưu bài học'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header & Back */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/dashboard/giao-vien"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Dashboard</span>
            </Link>

            <span className="text-xs text-slate-500 font-medium">
              Chế độ tạo bài học đảo ngược
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Info Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Thông tin chung về bài học
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Cung cấp các thông tin cơ bản để học sinh dễ dàng tìm kiếm và nhận diện bài học.
              </p>

              {errorMessage && (
                <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Tiêu đề bài học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Bài 2 - Khảo sát sự biến thiên và vẽ đồ thị hàm số bậc 3"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Mô tả ngắn gọn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả mục tiêu bài học, kiến thức cần chuẩn bị trước khi đến lớp..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Môn học <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-900 focus:border-brand-blue focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Khối lớp
                    </label>
                    <select
                      value={educationalLevel}
                      onChange={(e) => setEducationalLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-900 focus:border-brand-blue focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Đường dẫn ảnh bìa (Thumbnail URL - không bắt buộc)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... hoặc để trống để dùng ảnh mặc định theo môn"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Trạng thái xuất bản
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === 'published'}
                        onChange={() => setStatus('published')}
                        className="text-brand-blue"
                      />
                      <span className="font-semibold text-emerald-700">Đăng công khai ngay</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === 'draft'}
                        onChange={() => setStatus('draft')}
                        className="text-amber-600"
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
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-6 py-2.5 text-xs font-bold text-slate-950 shadow hover:bg-brand-yellow-hover disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang lưu bài học...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{status === 'published' ? 'Đăng bài học' : 'Lưu bản nháp'}</span>
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
