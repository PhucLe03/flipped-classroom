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

interface CellInserterProps {
  index: number;
  label?: string;
  onInsert: (type: ContentBlockType, atIndex: number) => void;
}

const CellInserter: React.FC<CellInserterProps> = ({ index, label, onInsert }) => {
  return (
    <div className="group relative my-3 flex items-center justify-center py-1">
      {/* Horizontal Divider Line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dashed border-slate-200 group-hover:border-brand-blue/40 transition-colors" />
      </div>

      {/* Action Buttons Centered Pill */}
      <div className="relative flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1 shadow-2xs backdrop-blur-xs transition-all group-hover:border-brand-blue/40 group-hover:shadow-xs">
        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-brand-blue transition-colors mr-0.5">
          <Plus className="h-3 w-3" />
          <span>{label || 'Chèn cell:'}</span>
        </span>

        <button
          type="button"
          onClick={() => onInsert('rich_text', index)}
          className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-brand-blue active:scale-95 transition-all"
          title="Chèn khối văn bản tại vị trí này"
        >
          <FileText className="h-3.5 w-3.5 text-brand-blue" />
          <span>Văn bản</span>
        </button>

        <button
          type="button"
          onClick={() => onInsert('youtube', index)}
          className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all"
          title="Chèn khối video YouTube tại vị trí này"
        >
          <Youtube className="h-3.5 w-3.5 text-red-600" />
          <span>YouTube</span>
        </button>

        <button
          type="button"
          onClick={() => onInsert('gdrive', index)}
          className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800 active:scale-95 transition-all"
          title="Chèn khối tài liệu Google Drive tại vị trí này"
        >
          <FolderOpen className="h-3.5 w-3.5 text-amber-600" />
          <span>Drive</span>
        </button>
      </div>
    </div>
  );
};

export const BlockManager: React.FC<BlockManagerProps> = ({ blocks, onChange }) => {
  const insertBlock = (type: ContentBlockType, atIndex: number) => {
    const newBlock: ContentBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      order: atIndex,
      title: '',
      richTextHtml: type === 'rich_text' ? '<p></p>' : undefined,
      youtubeUrl: type === 'youtube' ? '' : undefined,
      gdriveUrl: type === 'gdrive' ? '' : undefined,
    };
    const updated = [...blocks];
    updated.splice(atIndex, 0, newBlock);
    const reordered = updated.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  };

  const addBlock = (type: ContentBlockType) => {
    insertBlock(type, blocks.length);
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
            Nội dung bài học theo khối (Cells)
          </h3>
          <p className="text-sm text-slate-600">
            Bố cục linh hoạt tương tự Jupyter Notebook. Thêm cell mới ở đầu, giữa các cell hoặc ở cuối bài học.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
            Tổng cộng: <strong className="text-slate-900">{blocks.length}</strong> cell(s)
          </span>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
          <p className="text-base font-semibold text-slate-700 mb-1">
            Chưa có khối nội dung nào trong bài học
          </p>
          <p className="text-sm text-slate-500 mb-5">
            Chọn một trong các loại cell bên dưới để bắt đầu soạn thảo nội dung bài học:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => insertBlock('rich_text', 0)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-blue-dark active:scale-95 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>+ Cell Văn bản (Rich Text)</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('youtube', 0)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 shadow-xs hover:bg-red-100/70 active:scale-95 transition-all"
            >
              <Youtube className="h-4 w-4 text-red-600" />
              <span>+ Cell Video YouTube</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('gdrive', 0)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 shadow-xs hover:bg-amber-100/70 active:scale-95 transition-all"
            >
              <FolderOpen className="h-4 w-4 text-amber-600" />
              <span>+ Cell Google Drive</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Top Inserter (Index 0) */}
          <CellInserter
            index={0}
            label="Chèn ở đầu:"
            onInsert={insertBlock}
          />

          {blocks.map((block, index) => {
            const isLast = index === blocks.length - 1;

            return (
              <React.Fragment key={block.id}>
                <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-slate-400">
                  {/* Block Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-700 border border-slate-200/60">
                        Cell [{index + 1}]
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

            {/* Middle or Bottom Inserter */}
            <CellInserter
              index={index + 1}
              label={isLast ? 'Thêm ở cuối:' : 'Chèn cell:'}
              onInsert={insertBlock}
            />
          </React.Fragment>
        );
      })}
    </div>
  )}
    </div>
  );
};

export default BlockManager;
