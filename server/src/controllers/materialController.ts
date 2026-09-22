import { Request, Response, NextFunction } from 'express';
import mongoose from 'express';
import { StudyMaterial, IContentBlock } from '../models/StudyMaterial';
import { Category } from '../models/Category';
import { AuthRequest } from '../middlewares/auth';
import {
  extractYouTubeId,
  extractGDriveId,
  sanitizeRichText,
  generateSlug,
} from '../utils/parsers';

/**
 * Process content blocks: sanitize rich text, parse YouTube & GDrive URLs
 */
const processBlocks = (rawBlocks: any[]): IContentBlock[] => {
  if (!Array.isArray(rawBlocks)) return [];

  return rawBlocks.map((block, index) => {
    const id = block.id || `block_${Date.now()}_${index}`;
    const type = block.type;
    const order = typeof block.order === 'number' ? block.order : index;
    const title = block.title || '';

    if (type === 'rich_text') {
      return {
        id,
        type: 'rich_text',
        order,
        title,
        richTextHtml: sanitizeRichText(block.richTextHtml || ''),
      };
    } else if (type === 'youtube') {
      const url = block.youtubeUrl || '';
      const videoId = extractYouTubeId(url);
      return {
        id,
        type: 'youtube',
        order,
        title,
        youtubeUrl: url,
        youtubeVideoId: videoId,
      };
    } else if (type === 'gdrive') {
      const url = block.gdriveUrl || '';
      const fileId = extractGDriveId(url);
      return {
        id,
        type: 'gdrive',
        order,
        title: block.gdriveTitle || title,
        gdriveUrl: url,
        gdriveFileId: fileId,
        gdriveTitle: block.gdriveTitle || title,
      };
    }

    return {
      id,
      type: 'rich_text',
      order,
      title,
      richTextHtml: '',
    };
  });
};

/**
 * Get public/authorized list of materials with search & filtering
 */
export const getMaterials = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      subject,
      teacher,
      level,
      format,
      sort = 'newest',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const query: any = { status: 'published' };

    // Search query
    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    // Filter by subject (id or slug)
    if (subject && typeof subject === 'string') {
      if (subject.match(/^[0-9a-fA-F]{24}$/)) {
        query.subjectId = subject;
      } else {
        const foundCat = await Category.findOne({ slug: subject });
        if (foundCat) {
          query.subjectId = foundCat._id;
        }
      }
    }

    // Filter by teacher
    if (teacher && typeof teacher === 'string') {
      query.authorId = teacher;
    }

    // Filter by educational level
    if (level && typeof level === 'string') {
      query.educationalLevel = level;
    }

    // Filter by content format (youtube, gdrive, rich_text)
    if (format && typeof format === 'string') {
      query['blocks.type'] = format;
    }

    // Sorting
    let sortOptions: any = { publishedAt: -1, createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { viewCount: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { publishedAt: 1, createdAt: 1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const [materials, total] = await Promise.all([
      StudyMaterial.find(query)
        .populate('subjectId', 'name slug icon')
        .populate('authorId', 'fullName email avatar bio')
        .sort(sortOptions)
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

/**
 * Get single study material by slug (increments view count)
 */
export const getMaterialBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const material = await StudyMaterial.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('subjectId', 'name slug icon description')
      .populate('authorId', 'fullName email avatar bio');

    if (!material) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài liệu học tập hoặc tài liệu chưa được xuất bản',
      });
      return;
    }

    // Sort blocks by order
    const sortedBlocks = (material.blocks || []).sort(
      (a: IContentBlock, b: IContentBlock) => a.order - b.order
    );

    res.json({
      success: true,
      data: {
        ...material.toObject(),
        blocks: sortedBlocks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single study material by ID (for edit/preview by author or admin)
 */
export const getMaterialById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id)
      .populate('subjectId', 'name slug icon')
      .populate('authorId', 'fullName email avatar');

    if (!material) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
      return;
    }

    // Check authorization: author or admin
    if (
      req.user?.role !== 'admin' &&
      material.authorId._id.toString() !== req.user?._id.toString()
    ) {
      res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem chi tiết quản trị của tài liệu này',
      });
      return;
    }

    res.json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new study material (Teacher or Admin)
 */
export const createMaterial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    const {
      title,
      description,
      subjectId,
      status = 'published',
      coverImage,
      educationalLevel,
      blocks = [],
    } = req.body;

    if (!title || !description || !subjectId) {
      res.status(400).json({
        success: false,
        message: 'Tiêu đề, mô tả ngắn và môn học là bắt buộc',
      });
      return;
    }

    // Verify category exists
    const categoryExists = await Category.findById(subjectId);
    if (!categoryExists) {
      res.status(400).json({ success: false, message: 'Danh mục môn học không tồn tại' });
      return;
    }

    // Generate unique slug
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await StudyMaterial.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Process blocks
    const processedBlocks = processBlocks(blocks);

    const material = await StudyMaterial.create({
      title,
      slug,
      description,
      subjectId,
      authorId: req.user._id,
      status,
      coverImage: coverImage || '',
      educationalLevel: educationalLevel || 'Chung',
      blocks: processedBlocks,
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài liệu học tập thành công',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing study material (Author teacher or Admin)
 */
export const updateMaterial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id);

    if (!material) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
      return;
    }

    // RBAC: author or admin
    if (
      req.user?.role !== 'admin' &&
      material.authorId.toString() !== req.user?._id.toString()
    ) {
      res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể chỉnh sửa tài liệu do chính bạn tạo',
      });
      return;
    }

    const {
      title,
      description,
      subjectId,
      status,
      coverImage,
      educationalLevel,
      blocks,
    } = req.body;

    if (title && title !== material.title) {
      material.title = title;
      let baseSlug = generateSlug(title);
      let slug = baseSlug;
      let counter = 1;
      while (await StudyMaterial.findOne({ slug, _id: { $ne: material._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      material.slug = slug;
    }

    if (description !== undefined) material.description = description;
    if (subjectId !== undefined) material.subjectId = subjectId;
    if (coverImage !== undefined) material.coverImage = coverImage;
    if (educationalLevel !== undefined) material.educationalLevel = educationalLevel;

    if (status !== undefined && status !== material.status) {
      material.status = status;
      if (status === 'published' && !material.publishedAt) {
        material.publishedAt = new Date();
      }
    }

    if (blocks !== undefined) {
      material.blocks = processBlocks(blocks);
    }

    await material.save();

    res.json({
      success: true,
      message: 'Cập nhật tài liệu thành công',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete study material (Author teacher or Admin)
 */
export const deleteMaterial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id);

    if (!material) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
      return;
    }

    // RBAC: author or admin
    if (
      req.user?.role !== 'admin' &&
      material.authorId.toString() !== req.user?._id.toString()
    ) {
      res.status(403).json({
        success: false,
        message: 'Bạn chỉ có quyền xóa tài liệu của chính mình',
      });
      return;
    }

    await StudyMaterial.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Đã xóa tài liệu học tập thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get teacher's own materials with metrics
 */
export const getMyMaterials = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực' });
      return;
    }

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { authorId: req.user._id };
    if (status && ['draft', 'published', 'unpublished'].includes(status as string)) {
      filter.status = status;
    }

    const [materials, total, draftCount, publishedCount, viewsResult] = await Promise.all([
      StudyMaterial.find(filter)
        .populate('subjectId', 'name slug icon')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      StudyMaterial.countDocuments(filter),
      StudyMaterial.countDocuments({ authorId: req.user._id, status: 'draft' }),
      StudyMaterial.countDocuments({ authorId: req.user._id, status: 'published' }),
      StudyMaterial.aggregate([
        { $match: { authorId: req.user._id } },
        { $group: { _id: null, totalViews: { $sum: '$viewCount' } } },
      ]),
    ]);

    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    res.json({
      success: true,
      data: materials,
      metrics: {
        totalMaterials: draftCount + publishedCount,
        published: publishedCount,
        drafts: draftCount,
        totalViews,
      },
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
