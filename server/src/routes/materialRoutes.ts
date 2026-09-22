import { Router } from 'express';
import {
  getMaterials,
  getMaterialBySlug,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMyMaterials,
} from '../controllers/materialController';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// Protected routes (Authorized users only per requirements)
router.get('/', protect, getMaterials);
router.get('/slug/:slug', protect, getMaterialBySlug);

// Teacher and Admin routes
router.get('/teacher/mine', protect, requireRole('teacher', 'admin'), getMyMaterials);
router.get('/:id', protect, getMaterialById);
router.post('/', protect, requireRole('teacher', 'admin'), createMaterial);
router.put('/:id', protect, requireRole('teacher', 'admin'), updateMaterial);
router.delete('/:id', protect, requireRole('teacher', 'admin'), deleteMaterial);

export default router;
