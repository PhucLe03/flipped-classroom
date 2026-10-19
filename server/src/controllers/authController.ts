import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { verifyPassword, hashPasswordForStorage } from '../utils/crypto';
import { isValidAvatar, normalizeAvatarId } from '../utils/avatars';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'flipped_classroom_secret_jwt_key_2026_super_secure',
    { expiresIn: '7d' }
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Vô hiệu hóa đăng ký công khai: chỉ Quản trị viên mới có quyền tạo tài khoản
    res.status(403).json({
      success: false,
      message: 'Tính năng đăng ký công khai đã bị khóa. Toàn bộ tài khoản Giáo viên và Học sinh được cấp độc quyền bởi Quản trị viên.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập địa chỉ Gmail và mật khẩu',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Bắt buộc đăng nhập bằng tài khoản Gmail
    if (!cleanEmail.endsWith('@gmail.com')) {
      res.status(400).json({
        success: false,
        message: 'Hệ thống yêu cầu đăng nhập bằng tài khoản Gmail (@gmail.com)',
      });
      return;
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản Gmail hoặc mật khẩu không chính xác',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
      });
      return;
    }

    // Xác thực mật khẩu thông qua cơ chế verifyPassword bảo mật 2 lớp
    const isMatch = await verifyPassword(password, user.passwordHash, cleanEmail);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản Gmail hoặc mật khẩu không chính xác',
      });
      return;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        bio: req.user.bio,
        phone: req.user.phone,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    const { fullName, avatar, bio, phone } = req.body;

    if (fullName !== undefined) {
      const cleanName = typeof fullName === 'string' ? fullName.trim().replace(/\s+/g, ' ') : '';
      if (cleanName.length < 2 || cleanName.length > 100) {
        res.status(400).json({ success: false, message: 'Họ và tên phải từ 2 đến 100 ký tự' });
        return;
      }
      if (/[<>]/.test(cleanName)) {
        res.status(400).json({ success: false, message: 'Họ và tên chứa ký tự không hợp lệ' });
        return;
      }
    }

    // Chỉ chấp nhận avatar trong danh sách có sẵn
    if (avatar !== undefined && !isValidAvatar(avatar)) {
      res.status(400).json({ success: false, message: 'Avatar không hợp lệ. Vui lòng chọn từ danh sách có sẵn.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Người dùng không tìm thấy' });
      return;
    }

    if (fullName !== undefined) user.fullName = fullName.trim().replace(/\s+/g, ' ');
    if (avatar !== undefined) {
      const cleanId = normalizeAvatarId(avatar);
      user.avatar = cleanId || undefined;
    }
    if (bio !== undefined) user.bio = String(bio).slice(0, 500);
    if (phone !== undefined) user.phone = String(phone).slice(0, 20);

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới',
      });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Người dùng không tìm thấy' });
      return;
    }

    // 1. Xác thực mật khẩu hiện tại
    const isMatch = await verifyPassword(currentPassword, user.passwordHash, user.email);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác',
      });
      return;
    }

    // 2. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    const isSamePassword = await verifyPassword(newPassword, user.passwordHash, user.email);
    if (isSamePassword) {
      res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
      });
      return;
    }

    // 3. Kiểm tra độ dài mật khẩu mới (nếu gửi dạng thô thì tối thiểu 6 ký tự)
    const isClientHash = /^[a-f0-9]{64}$/i.test(newPassword);
    if (!isClientHash && newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
      return;
    }

    // 4. Băm mật khẩu mới và lưu vào cơ sở dữ liệu
    const newPasswordHash = await hashPasswordForStorage(newPassword, user.email);
    user.passwordHash = newPasswordHash;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công. Vui lòng ghi nhớ mật khẩu mới của bạn.',
    });
  } catch (error) {
    next(error);
  }
};

