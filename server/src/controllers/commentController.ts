import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Comment, IComment } from '../models/Comment';
import { StudyMaterial } from '../models/StudyMaterial';
import { AuthRequest } from '../middlewares/auth';

/**
 * Lấy danh sách bình luận thảo luận theo bài học (đã gom nhóm 2 cấp)
 */
export const getCommentsByMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { materialId } = req.params;

    // Cho phép truyền vào cả ObjectId hoặc Slug bài học
    let resolvedMaterialId = materialId;
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const material = await StudyMaterial.findOne({ slug: materialId }).select('_id');
      if (!material) {
        res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
        return;
      }
      resolvedMaterialId = material._id.toString();
    }

    // Lấy toàn bộ bình luận của bài học (loại trừ bình luận đã ẩn/xóa hẳn)
    const allComments = await Comment.find({
      materialId: resolvedMaterialId,
      status: { $in: ['active', 'deleted'] },
    })
      .populate('authorId', 'fullName email role avatar')
      .sort({ createdAt: 1 })
      .lean();

    // Gom nhóm cấu trúc 2 cấp: Root comments (Cấp 1) và Replies (Cấp 2)
    const rootComments: any[] = [];
    const replyMap = new Map<string, any[]>();

    allComments.forEach((c) => {
      const commentObj = {
        ...c,
        id: c._id.toString(),
        author: c.authorId,
        content: c.status === 'deleted' ? 'Bình luận này đã được xóa bởi người gửi.' : c.content,
      };

      if (!c.parentId) {
        rootComments.push({ ...commentObj, replies: [] });
      } else {
        const parentKey = c.parentId.toString();
        if (!replyMap.has(parentKey)) {
          replyMap.set(parentKey, []);
        }
        replyMap.get(parentKey)!.push(commentObj);
      }
    });

    // Gắn replies vào từng root comment
    rootComments.forEach((root) => {
      root.replies = replyMap.get(root.id) || [];
    });

    // Sắp xếp bình luận gốc mới nhất lên đầu
    rootComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: rootComments,
      totalRoot: rootComments.length,
      totalComments: allComments.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng bình luận gốc mới (Cấp 1)
 */
export const createRootComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { materialId } = req.params;
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để bình luận' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
      return;
    }

    let resolvedMaterialId = materialId;
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const material = await StudyMaterial.findOne({ slug: materialId }).select('_id');
      if (!material) {
        res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
        return;
      }
      resolvedMaterialId = material._id.toString();
    }

    const newComment = await Comment.create({
      materialId: resolvedMaterialId,
      authorId: req.user._id,
      parentId: null,
      content: content.trim(),
      status: 'active',
    });

    const populated = await Comment.findById(newComment._id)
      .populate('authorId', 'fullName email role avatar')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Đăng bình luận thành công',
      data: {
        ...populated,
        id: populated!._id.toString(),
        author: populated!.authorId,
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Trả lời trực tiếp vào một bình luận (Cấp 2)
 */
export const replyToComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để trả lời' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Nội dung câu trả lời không được để trống' });
      return;
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      res.status(404).json({ success: false, message: 'Bình luận gốc không tồn tại' });
      return;
    }

    // Đảm bảo cấu trúc chỉ tối đa 2 cấp: nếu bình luận được reply vốn là cấp 2, gắn vào cấp 1 gốc của nó
    const effectiveParentId = parentComment.parentId || parentComment._id;

    const newReply = await Comment.create({
      materialId: parentComment.materialId,
      authorId: req.user._id,
      parentId: effectiveParentId,
      content: content.trim(),
      status: 'active',
    });

    const populated = await Comment.findById(newReply._id)
      .populate('authorId', 'fullName email role avatar')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Gửi phản hồi thành công',
      data: {
        ...populated,
        id: populated!._id.toString(),
        author: populated!.authorId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa/Ẩn bình luận (Chỉ duy nhất tác giả mới có quyền xóa)
 */
export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
      return;
    }

    const isAuthor = comment.authorId.toString() === req.user._id.toString();

    if (!isAuthor) {
      res.status(403).json({ success: false, message: 'Chỉ chính tác giả mới có quyền xóa bình luận này' });
      return;
    }

    // Đổi trạng thái sang deleted (giữ vị trí để không làm đứt mạch câu trả lời cấp 2)
    comment.status = 'deleted';
    await comment.save();

    res.json({
      success: true,
      message: 'Bình luận đã được xóa',
      data: { id: comment._id, status: 'deleted' },
    });
  } catch (error) {
    next(error);
  }
};
