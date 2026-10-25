export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  materialCount?: number;
}

export type ContentBlockType = 'rich_text' | 'youtube' | 'gdrive';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  title?: string;
  // Rich Text
  richTextHtml?: string;
  // YouTube
  youtubeUrl?: string;
  youtubeVideoId?: string;
  // Google Drive
  gdriveUrl?: string;
  gdriveFileId?: string;
  gdriveTitle?: string;
}

export type MaterialStatus = 'draft' | 'published' | 'unpublished';

export interface StudyMaterial {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subjectId: Category | string;
  authorId: User | string;
  status: MaterialStatus;
  coverImage?: string;
  educationalLevel: string;
  blocks: ContentBlock[];
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  _id?: string;
  materialId: string;
  authorId: User | string;
  author?: User;
  parentId?: string | null;
  content: string;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: string;
  updatedAt: string;
  replies?: CommentItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  totalRoot?: number;
  totalComments?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
