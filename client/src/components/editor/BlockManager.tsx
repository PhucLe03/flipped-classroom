'use client';

import React from 'react';
import { ContentBlock, ContentBlockType } from '@/types';
import TipTapEditor from './TipTapEditor';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  Youtube,
  FolderOpen,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BlockManagerProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export const BlockManager: React.FC<BlockManagerProps> = ({ blocks, onChange }) => {
  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      order: blocks.length,
      title: '',
      richTextHtml: type === 'rich_text' ? '<p></p>' : undefined,
      youtubeUrl: type === 'youtube' ? '' : undefined,
      gdriveUrl: type === 'gdrive' ? '' : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updatedFields: Partial<ContentBlock>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange(updated);
  };

  const removeBlock = (index: number) => {
    const filtered = blocks.filter((_, i) => i !== index);
    // Re-index order
    const reordered = filtered.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    // Re-assign order
    const reordered = updated.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  };

  const extractYouTubeId = (url?: string) => {
    if (!url) return '';
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Nội dung bài học theo khối (Content Blocks)
          </h3>
          <p className="text-sm text-slate-600">
            Sắp xếp linh hoạt các phần: Video bài giảng, Lý thuyết văn bản, Tài liệu Google Drive.
          </p>
        </div>

        {/* Add Block Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => addBlock('rich_text')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-blue shadow-xs transition-all"
          >
            <FileText className="h-4 w-4 text-brand-blue" />
            <span>+ Văn bản (Rich Text)</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('youtube')}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-100/60 shadow-xs transition-all"
          >
            <Youtube className="h-4 w-4 text-red-600" />
            <span>+ Video YouTube</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('gdrive')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100/60 shadow-xs transition-all"
          >
            <FolderOpen className="h-4 w-4 text-amber-600" />
            <span>+ Google Drive</span>
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
          <p className="text-base font-semibold text-slate-700 mb-1">
            Chưa có khối nội dung nào được thêm
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Nhấn các nút phía trên để thêm Video, Bài giảng văn bản hoặc Tài liệu Google Drive.
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => addBlock('rich_text')}
              className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-blue-dark"
            >
              Thêm khối Văn bản đầu tiên
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-slate-400"
            >
              {/* Block Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-700">
                    {index + 1}
                  </span>
                  {block.type === 'rich_text' && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs sm:text-sm font-semibold text-brand-blue">
                      <FileText className="h-4 w-4" />
                      Văn bản lý thuyết
                    </span>
                  )}
                  {block.type === 'youtube' && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs sm:text-sm font-semibold text-red-700">
                      <Youtube className="h-4 w-4 text-red-600" />
                      Video YouTube
                    </span>
                  )}
                  {block.type === 'gdrive' && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs sm:text-sm font-semibold text-amber-800">
                      <FolderOpen className="h-4 w-4 text-amber-600" />
                      Google Drive
                    </span>
                  )}
                </div>

                {/* Actions: Reorder & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <div className="mx-1 h-4 w-[1px] bg-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Xóa khối này"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Block Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tiêu đề phụ của phần này (không bắt buộc):
                  </label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => updateBlock(index, { title: e.target.value })}
                    placeholder="Ví dụ: Phần 1 - Đặt vấn đề và giới thiệu phương pháp"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                {/* Rich Text Editor */}
                {block.type === 'rich_text' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nội dung văn bản (soạn thảo định dạng, hỗ trợ gõ tiếng Việt có dấu):
                    </label>
                    <TipTapEditor
                      content={block.richTextHtml || ''}
                      onChange={(html) => updateBlock(index, { richTextHtml: html })}
                    />
                  </div>
                )}

                {/* YouTube URL input */}
                {block.type === 'youtube' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Đường dẫn URL Video YouTube:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={block.youtubeUrl || ''}
                        onChange={(e) => updateBlock(index, { youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                        className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                    {block.youtubeUrl && (
                      <div className="mt-2.5">
                        {extractYouTubeId(block.youtubeUrl) ? (
                          <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              Hợp lệ! Video ID:{' '}
                              <strong>{extractYouTubeId(block.youtubeUrl)}</strong>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                            <AlertCircle className="h-4 w-4" />
                            <span>Vui lòng kiểm tra lại định dạng URL YouTube</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Google Drive URL input */}
                {block.type === 'gdrive' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Tên tệp / Tài liệu Drive:
                      </label>
                      <input
                        type="text"
                        value={block.gdriveTitle || ''}
                        onChange={(e) => updateBlock(index, { gdriveTitle: e.target.value })}
                        placeholder="Ví dụ: Phieu_bai_tap_chuong_1.pdf"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Đường dẫn chia sẻ Google Drive (Link Share):
                      </label>
                      <input
                        type="url"
                        value={block.gdriveUrl || ''}
                        onChange={(e) => updateBlock(index, { gdriveUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        * Lưu ý: Hãy đảm bảo tài liệu Drive được chia sẻ ở chế độ "Bất kỳ ai có đường liên kết đều có thể xem".
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockManager;
