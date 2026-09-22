'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import MaterialCard from '@/components/materials/MaterialCard';
import { StudyMaterial, Category, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  BookOpen,
  Video,
  FolderOpen,
  FileText,
  SlidersHorizontal,
  Loader2,
  X,
} from 'lucide-react';

function MaterialsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<ApiResponse<Category[]>>('/categories');
        if (res.data.success && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch materials with filters
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (selectedSubject) params.append('subject', selectedSubject);
        if (selectedFormat) params.append('format', selectedFormat);
        if (selectedLevel) params.append('level', selectedLevel);
        if (selectedSort) params.append('sort', selectedSort);

        const res = await api.get<ApiResponse<StudyMaterial[]>>(`/materials?${params.toString()}`);
        if (res.data.success && res.data.data) {
          setMaterials(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [searchQuery, selectedSubject, selectedFormat, selectedLevel, selectedSort]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
    setSelectedFormat('');
    setSelectedLevel('');
    setSelectedSort('newest');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedSubject) ||
    Boolean(selectedFormat) ||
    Boolean(selectedLevel) ||
    selectedSort !== 'newest';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-brand-blue to-sky-700 p-6 sm:p-10 text-white shadow-lg">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-yellow mb-2 block">
              Thư viện số Flipped Classroom
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Kho Tài Liệu Học Tập
            </h1>
            <p className="text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
              Học sinh tra cứu bài học, chuẩn bị kiến thức và tải tài liệu tự học theo môn học và chuyên đề.
            </p>

            {/* Search Input in Banner */}
            <div className="mt-6 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tiêu đề bài học, từ khóa, tên giáo viên..."
                  className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-12 text-base text-slate-900 shadow-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            {/* Subject Buttons */}
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
                Môn học
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedSubject('')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    selectedSubject === ''
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất cả môn
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedSubject(cat.slug)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      selectedSubject === cat.slug
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                    {cat.materialCount !== undefined && cat.materialCount > 0 && (
                      <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
                        {cat.materialCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Format & Grade Filters */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-bold text-slate-600 mr-1">Định dạng:</span>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('')}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                    selectedFormat === '' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('youtube')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium ${
                    selectedFormat === 'youtube'
                      ? 'bg-red-600 text-white'
                      : 'text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>Video YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('gdrive')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium ${
                    selectedFormat === 'gdrive'
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Google Drive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('rich_text')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium ${
                    selectedFormat === 'rich_text'
                      ? 'bg-brand-blue text-white'
                      : 'text-brand-blue bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Lý thuyết</span>
                </button>
              </div>

              {/* Grade Level & Sort */}
              <div className="flex flex-wrap items-center gap-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">Khối:</span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white py-1.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">Tất cả khối</option>
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12">Lớp 12</option>
                    <option value="Đại học">Đại học</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">Sắp xếp:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white py-1.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-brand-blue"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Xem nhiều nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title">Tên A-Z</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between text-sm text-slate-600">
            <span>
              Tìm thấy <strong className="text-slate-900">{materials.length}</strong> bài học phù hợp
            </span>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((item) => (
                <MaterialCard key={item._id} material={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Không tìm thấy bài học nào
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Hãy thử điều chỉnh lại từ khóa hoặc xóa bớt tiêu chí bộ lọc.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-blue-dark"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function MaterialsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      }
    >
      <MaterialsCatalogContent />
    </Suspense>
  );
}
