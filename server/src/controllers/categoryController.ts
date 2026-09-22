import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { StudyMaterial } from '../models/StudyMaterial';
import { generateSlug } from '../utils/parsers';

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Aggregate material count per category
    const counts = await StudyMaterial.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$subjectId', count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const result = categories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      materialCount: countMap[cat._id.toString()] || 0,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      res.status(404).json({ success: false, message: 'Danh mục môn học không tồn tại' });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc' });
      return;
    }

    const slug = generateSlug(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Danh mục với tên này đã tồn tại' });
      return;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'BookOpen',
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục môn học thành công',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, icon, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
      return;
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = generateSlug(name);
    }
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const materialsCount = await StudyMaterial.countDocuments({ subjectId: id });
    if (materialsCount > 0) {
      res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục này vì đang có ${materialsCount} tài liệu liên kết. Hãy chuyển tài liệu sang danh mục khác trước.`,
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Đã xóa danh mục thành công',
    });
  } catch (error) {
    next(error);
  }
};
