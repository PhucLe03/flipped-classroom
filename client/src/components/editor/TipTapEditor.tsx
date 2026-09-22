'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Minus,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Nhập nội dung bài giảng, lý thuyết, hướng dẫn học tập...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-blue underline',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap ProseMirror min-h-[220px] focus:outline-none text-slate-800 text-base sm:text-[17px] leading-relaxed p-4 sm:p-5',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập đường dẫn liên kết URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/80 p-2 text-slate-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-brand-blue text-white' : ''
          }`}
          title="Tiêu đề 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-brand-blue text-white' : ''
          }`}
          title="Tiêu đề 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-brand-blue text-white' : ''
          }`}
          title="Tiêu đề 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-slate-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('bold') ? 'bg-brand-blue text-white' : ''
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('italic') ? 'bg-brand-blue text-white' : ''
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('underline') ? 'bg-brand-blue text-white' : ''
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-slate-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('bulletList') ? 'bg-brand-blue text-white' : ''
          }`}
          title="Danh sách dấu chấm"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('orderedList') ? 'bg-brand-blue text-white' : ''
          }`}
          title="Danh sách đánh số"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('blockquote') ? 'bg-brand-blue text-white' : ''
          }`}
          title="Trích dẫn"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`rounded p-1.5 hover:bg-slate-200 ${
            editor.isActive('link') ? 'bg-brand-blue text-white' : ''
          }`}
          title="Thêm liên kết"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded p-1.5 hover:bg-slate-200"
          title="Đường phân cách"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-slate-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded p-1.5 hover:bg-slate-200 disabled:opacity-30"
          title="Hoàn tác (Undo)"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded p-1.5 hover:bg-slate-200 disabled:opacity-30"
          title="Làm lại (Redo)"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
