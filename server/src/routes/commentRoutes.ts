import { Router } from 'express';
import {
  getCommentsByMaterial,
  createRootComment,
  replyToComment,
  deleteComment,
} from '../controllers/commentController';
import { protect } from '../middlewares/auth';

const router = Router();

// Xem bình luận của bài học (mọi người đều xem được)
router.get('/materials/:materialId', getCommentsByMaterial);

// Tạo bình luận gốc (yêu cầu đăng nhập)
router.post('/materials/:materialId', protect, createRootComment);

// Phản hồi trực tiếp vào bình luận (yêu cầu đăng nhập)
router.post('/:commentId/reply', protect, replyToComment);

// Xóa bình luận (yêu cầu đăng nhập và có quyền)
router.delete('/:commentId', protect, deleteComment);

export default router;
