import { Router } from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// Admin only
router.post('/', protect, requireRole('admin'), createCategory);
router.put('/:id', protect, requireRole('admin'), updateCategory);
router.delete('/:id', protect, requireRole('admin'), deleteCategory);

export default router;
