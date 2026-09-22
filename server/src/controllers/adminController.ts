import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { StudyMaterial } from '../models/StudyMaterial';
import { Category } from '../models/Category';

export const getPlatformStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalMaterials,
      publishedMaterials,
      totalCategories,
      viewsAggregation,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      StudyMaterial.countDocuments(),
      StudyMaterial.countDocuments({ status: 'published' }),
      Category.countDocuments({ isActive: true }),
      StudyMaterial.aggregate([{ $group: { _id: null, totalViews: { $sum: '$viewCount' } } }]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalMaterials,
        publishedMaterials,
        draftMaterials: totalMaterials - publishedMaterials,
        totalCategories,
        totalViews: viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, q, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (role && ['student', 'teacher', 'admin'].includes(role as string)) {
      query.role = role;
    }
    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'teacher', 'admin'].includes(role)) {
      res.status(400).json({ success: false, message: 'Vai trò không hợp lệ' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      return;
    }

    res.json({
      success: true,
      message: `Cập nhật vai trò của ${user.fullName} thành ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Tài khoản hiện đang ${user.isActive ? 'hoạt động' : 'bị khóa'}`,
      data: { id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMaterialsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, subject, q, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (status && ['draft', 'published', 'unpublished'].includes(status as string)) {
      query.status = status;
    }
    if (subject) {
      query.subjectId = subject;
    }
    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    const [materials, total] = await Promise.all([
      StudyMaterial.find(query)
        .populate('subjectId', 'name slug')
        .populate('authorId', 'fullName email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      StudyMaterial.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
