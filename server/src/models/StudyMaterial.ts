import mongoose, { Document, Schema, Model } from 'mongoose';

export type MaterialStatus = 'draft' | 'published' | 'unpublished';
export type ContentBlockType = 'rich_text' | 'youtube' | 'gdrive';

export interface IContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  title?: string;
  // Rich Text
  richTextHtml?: string;
  // YouTube
  youtubeUrl?: string;
  youtubeVideoId?: string;
  // Google Drive
  gdriveUrl?: string;
  gdriveFileId?: string;
  gdriveTitle?: string;
}

export interface IStudyMaterial extends Document {
  title: string;
  slug: string;
  description: string;
  subjectId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  status: MaterialStatus;
  coverImage?: string;
  educationalLevel?: string;
  blocks: IContentBlock[];
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['rich_text', 'youtube', 'gdrive'],
      required: true,
    },
    order: { type: Number, default: 0 },
    title: { type: String, default: '' },
    richTextHtml: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    youtubeVideoId: { type: String, default: '' },
    gdriveUrl: { type: String, default: '' },
    gdriveFileId: { type: String, default: '' },
    gdriveTitle: { type: String, default: '' },
  },
  { _id: false }
);

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề tài liệu là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tiêu đề không quá 200 ký tự'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Mô tả ngắn là bắt buộc'],
      trim: true,
      maxlength: [1000, 'Mô tả không quá 1000 ký tự'],
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục/Môn học là bắt buộc'],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tác giả/Giáo viên là bắt buộc'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished'],
      default: 'draft',
    },
    coverImage: {
      type: String,
      default: '',
    },
    educationalLevel: {
      type: String,
      enum: ['Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Chung'],
      default: 'Chung',
    },
    blocks: {
      type: [ContentBlockSchema],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

StudyMaterialSchema.index({ subjectId: 1, status: 1 });
StudyMaterialSchema.index({ authorId: 1 });
StudyMaterialSchema.index({ title: 'text', description: 'text' });

export const StudyMaterial: Model<IStudyMaterial> =
  mongoose.models.StudyMaterial ||
  mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
