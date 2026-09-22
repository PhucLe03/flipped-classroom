'use client';

import React, { useState } from 'react';
import { ContentBlock } from '@/types';
import { Youtube, ExternalLink, FileText, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import MovieClip from './MovieClip';

interface BlockRendererProps {
  block: ContentBlock;
  index: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, index }) => {
  const [showDrivePreview, setShowDrivePreview] = useState<boolean>(true);

  if (block.type === 'youtube') {
    return (
      <div className="my-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        {block.title && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Youtube className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{block.title}</h3>
          </div>
        )}

        {block.youtubeVideoId ? (
          <MovieClip videoId={block.youtubeVideoId} title={block.title} />
        ) : (
          <div className="rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-500">
            Không thể tải video YouTube từ đường dẫn đã cung cấp.
          </div>
        )}

        {block.youtubeUrl && (
          <div className="mt-3 flex justify-end">
            <a
              href={block.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark hover:underline"
            >
              <span>Xem trực tiếp trên YouTube</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    );
  }

  if (block.type === 'gdrive') {
    return (
      <div className="my-6 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-700 shrink-0">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l4.29 7.5H22.8l-4.29-7.5h-7.37zm7.69 9.5l-3.43 6H4.58l3.43-6h10.82z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Tài liệu Google Drive đính kèm
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {block.gdriveTitle || block.title || 'Tài liệu học tập trên Google Drive'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {block.gdriveFileId && (
              <button
                type="button"
                onClick={() => setShowDrivePreview(!showDrivePreview)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-amber-900 hover:bg-amber-50 shadow-xs"
              >
                <Eye className="h-4 w-4" />
                <span>{showDrivePreview ? 'Thu gọn xem trước' : 'Xem trước tài liệu'}</span>
                {showDrivePreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}

            {block.gdriveUrl && (
              <a
                href={block.gdriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 shadow-sm hover:bg-brand-yellow-hover"
              >
                <span>Mở trong Drive</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Embedded Drive Preview if file ID is available */}
        {block.gdriveFileId && showDrivePreview && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <iframe
              src={`https://drive.google.com/file/d/${block.gdriveFileId}/preview`}
              title={block.gdriveTitle || 'Xem trước Google Drive'}
              className="h-[520px] w-full border-0"
              allow="autoplay"
            />
          </div>
        )}
      </div>
    );
  }

  // Rich Text block
  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {block.title && (
        <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-brand-blue">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{block.title}</h3>
        </div>
      )}
      <div
        className="tiptap-content prose-educational max-w-none text-slate-800 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.richTextHtml || '<p>Chưa có nội dung văn bản.</p>' }}
      />
    </div>
  );
};

export default BlockRenderer;
