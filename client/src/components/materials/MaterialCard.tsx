import React from 'react';
import Link from 'next/link';
import { StudyMaterial, Category, User } from '@/types';
import { Video, FileText, FolderOpen, Eye, Clock, User as UserIcon } from 'lucide-react';

interface MaterialCardProps {
  material: StudyMaterial;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const subject = typeof material.subjectId === 'object' ? (material.subjectId as Category) : null;
  const author = typeof material.authorId === 'object' ? (material.authorId as User) : null;

  // Detect content types available in blocks
  const hasYouTube = material.blocks?.some((b) => b.type === 'youtube');
  const hasGDrive = material.blocks?.some((b) => b.type === 'gdrive');
  const hasRichText = material.blocks?.some((b) => b.type === 'rich_text');

  const formattedDate = material.publishedAt
    ? new Date(material.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      href={`/tai-lieu/${material.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue-light hover:shadow-lg"
    >
      {/* Cover / Image Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-blue to-sky-700">
        {material.coverImage ? (
          <img
            src={material.coverImage}
            alt={material.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-white">
            <span className="text-3xl font-bold opacity-80 mb-1">
              {subject ? subject.name : 'Tài liệu'}
            </span>
            <span className="text-xs text-sky-200 font-medium">Học Liệu Số</span>
          </div>
        )}

        {/* Subject & Grade Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {subject && (
            <span className="rounded-full bg-brand-blue/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-sm">
              {subject.name}
            </span>
          )}
          {material.educationalLevel && material.educationalLevel !== 'Chung' && (
            <span className="rounded-full bg-amber-500/90 backdrop-blur px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {material.educationalLevel}
            </span>
          )}
        </div>

        {/* Formats Icons Bar */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-xs text-white">
          {hasYouTube && (
            <span title="Có video bài giảng" className="flex items-center gap-1 text-red-400 font-medium">
              <Video className="h-4 w-4" />
            </span>
          )}
          {hasGDrive && (
            <span title="Có tài liệu Google Drive" className="flex items-center gap-1 text-amber-300 font-medium">
              <FolderOpen className="h-4 w-4" />
            </span>
          )}
          {hasRichText && (
            <span title="Có bài đọc lý thuyết" className="flex items-center gap-1 text-sky-300 font-medium">
              <FileText className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      {/* Content Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug mb-2.5">
          {material.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {material.description}
        </p>

        {/* Author & Stats Footer */}
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            {author?.avatar ? (
              <img
                src={author.avatar}
                alt={author.fullName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue-light/30 text-brand-blue font-bold text-xs">
                {author?.fullName ? author.fullName.charAt(0) : 'G'}
              </div>
            )}
            <span className="font-semibold text-slate-800 truncate max-w-[130px] text-xs sm:text-sm">
              {author?.fullName || 'Giáo viên'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-medium">
            <span className="flex items-center gap-1" title="Lượt xem">
              <Eye className="h-4 w-4 text-slate-400" />
              {material.viewCount || 0}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1" title="Ngày đăng">
                <Clock className="h-4 w-4 text-slate-400" />
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MaterialCard;
