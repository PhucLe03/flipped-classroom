'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BlockRenderer from '@/components/materials/BlockRenderer';
import { StudyMaterial, Category, User, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Calendar,
  Eye,
  BookOpen,
  GraduationCap,
  Share2,
  Check,
  Loader2,
} from 'lucide-react';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMaterial = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<StudyMaterial>>(`/materials/slug/${slug}`);
        if (res.data.success && res.data.data) {
          setMaterial(res.data.data);
        } else {
          router.push('/tai-lieu');
        }
      } catch (err) {
        console.error('Failed to load study material:', err);
        router.push('/tai-lieu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMaterial();
    }
  }, [slug, router]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!material) {
    return null;
  }

  const subject = typeof material.subjectId === 'object' ? (material.subjectId as Category) : null;
  const author = typeof material.authorId === 'object' ? (material.authorId as User) : null;

  const formattedDate = material.publishedAt
    ? new Date(material.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/tai-lieu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-blue"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại kho học liệu</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">Đã sao chép liên kết</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-slate-500" />
                  <span>Chia sẻ bài học</span>
                </>
              )}
            </button>
          </div>

          {/* Article Header Card */}
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {subject && (
                <span className="rounded-full bg-brand-blue px-3.5 py-1 text-xs sm:text-sm font-bold text-white shadow-xs">
                  {subject.name}
                </span>
              )}
              {material.educationalLevel && material.educationalLevel !== 'Chung' && (
                <span className="rounded-full bg-amber-400 px-3.5 py-1 text-xs sm:text-sm font-bold text-slate-900 shadow-xs">
                  {material.educationalLevel}
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm font-medium text-slate-600">
                Lớp học đảo ngược
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {material.title}
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-normal">
              {material.description}
            </p>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
              {/* Author Info */}
              <div className="flex items-center gap-3.5">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.fullName}
                    className="h-11 w-11 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-base">
                    {author?.fullName ? author.fullName.charAt(0) : 'G'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {author?.fullName || 'Giáo viên'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                    {author?.bio || 'Giáo viên phụ trách môn học'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{formattedDate}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-slate-400" />
                  <span>{material.viewCount} lượt xem</span>
                </span>
              </div>
            </div>
          </article>

          {/* Dynamic Content Blocks Section */}
          <div className="space-y-3">
            {material.blocks && material.blocks.length > 0 ? (
              material.blocks.map((block, index) => (
                <BlockRenderer key={block.id || index} block={block} index={index} />
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Bài học này hiện chưa có khối nội dung nào.
              </div>
            )}
          </div>

          {/* Bottom Footer Guidance */}
          <div className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-7">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="text-sm text-amber-950 leading-relaxed">
                <h4 className="font-bold mb-1 text-base">Ghi nhớ tự học tại nhà</h4>
                <p>
                  Hãy hoàn thành việc xem video, đọc lý thuyết và làm bài tập trên phiếu Google Drive trước buổi học.
                  Chuẩn bị sẵn các câu hỏi để cùng thầy cô và bạn bè thảo luận trong giờ học tiếp theo nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
