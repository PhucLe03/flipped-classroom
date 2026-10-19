import { Router } from 'express';
import {
  getPlatformStats,
  getUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllMaterialsAdmin,
} from '../controllers/adminController';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// All routes require Admin role
router.use(protect, requireRole('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/materials', getAllMaterialsAdmin);

export default router;
