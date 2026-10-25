import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { StudyMaterial } from '../models/StudyMaterial';
import { Category } from '../models/Category';
import { hashPasswordForStorage } from '../utils/crypto';

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
      totalAdmins,
      totalMaterials,
      publishedMaterials,
      totalCategories,
      viewsAggregation,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
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
        totalAdmins,
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
    const { role, q, page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (role && ['student', 'teacher', 'admin'].includes(role as string)) {
      query.role = role;
    }
    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const [rawUsers, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    const users = rawUsers.map((u) => ({
      ...u,
      id: u._id.toString(),
    }));

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

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      return;
    }

    const isSuperAdmin = user.email === 'hailua112003@gmail.com';

    if (fullName !== undefined) {
      if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        res.status(400).json({ success: false, message: 'Họ và tên không được để trống' });
        return;
      }
      user.fullName = fullName.trim();
    }

    if (role !== undefined) {
      if (!['student', 'teacher', 'admin'].includes(role)) {
        res.status(400).json({ success: false, message: 'Vai trò không hợp lệ' });
        return;
      }
      if (isSuperAdmin && role !== 'admin') {
        res.status(400).json({
          success: false,
          message: 'Không thể thay đổi vai trò của Quản trị viên tối cao',
        });
        return;
      }
      user.role = role;
    }

    if (isActive !== undefined) {
      if (isSuperAdmin && !isActive) {
        res.status(400).json({
          success: false,
          message: 'Không thể khóa tài khoản của Quản trị viên tối cao',
        });
        return;
      }
      user.isActive = Boolean(isActive);
    }

    await user.save();

    res.json({
      success: true,
      message: `Cập nhật thông tin tài khoản ${user.fullName} thành công`,
      data: {
        id: user._id.toString(),
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
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

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ họ tên, Gmail và mật khẩu khởi tạo',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.endsWith('@gmail.com')) {
      res.status(400).json({
        success: false,
        message: 'Địa chỉ email bắt buộc phải có định dạng Gmail (@gmail.com)',
      });
      return;
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Địa chỉ Gmail này đã tồn tại trong hệ thống',
      });
      return;
    }

    const validRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';
    const passwordHash = await hashPasswordForStorage(password, cleanEmail);

    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash,
      role: validRole,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `Tạo tài khoản ${validRole === 'teacher' ? 'Giáo viên' : validRole === 'admin' ? 'Quản trị viên' : 'Học sinh'} thành công`,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
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

    // Không cho phép tự xóa tài khoản admin gốc
    if (user.email === 'hailua112003@gmail.com') {
      res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Quản trị viên tối cao của hệ thống' });
      return;
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Đã xóa tài khoản ${user.fullName} (${user.email}) khỏi hệ thống`,
    });
  } catch (error) {
    next(error);
  }
};

