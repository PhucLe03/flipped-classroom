import { Router } from 'express';
import {
  getPlatformStats,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  getAllMaterialsAdmin,
} from '../controllers/adminController';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// All routes require Admin role
router.use(protect, requireRole('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/materials', getAllMaterialsAdmin);

export default router;
