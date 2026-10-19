import mongoose, { Document, Schema, Model } from 'mongoose';

export type CommentStatus = 'active' | 'hidden' | 'deleted';

export interface IComment extends Document {
  materialId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    materialId: {
      type: Schema.Types.ObjectId,
      ref: 'StudyMaterial',
      required: [true, 'Mã bài học là bắt buộc'],
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tác giả bình luận là bắt buộc'],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Nội dung bình luận không được để trống'],
      trim: true,
      maxlength: [2000, 'Bình luận không vượt quá 2000 ký tự'],
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ materialId: 1, parentId: 1, createdAt: -1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
