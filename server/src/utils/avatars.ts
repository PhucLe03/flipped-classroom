/**
 * Danh sách ID avatar có sẵn (whitelist).
 * Database chỉ lưu duy nhất ID này (ví dụ: 'fox', 'panda', 'rocket'...).
 * Không lưu dữ liệu ảnh base64 hay URL trong database.
 * Khi Frontend load, nó sẽ lấy file avatar từ thư mục public/avatars/<id>.svg.
 */
export const AVATAR_PRESET_IDS = [
  // Động vật
  'fox', 'panda', 'tiger', 'koala', 'owl', 'penguin', 'frog', 'unicorn',
  // Khám phá
  'rocket', 'astronaut', 'alien', 'robot', 'planet', 'comet', 'ufo', 'satellite',
  // Học tập
  'scholar', 'scientist', 'artist', 'books', 'microscope', 'abacus', 'globe', 'lightbulb',
  // Thể thao & sở thích
  'soccer', 'basketball', 'guitar', 'gamepad', 'chess', 'palette', 'camera', 'headphones',
] as const;

export type AvatarPresetId = (typeof AVATAR_PRESET_IDS)[number];

export const AVATAR_PREFIX = 'preset:';

/**
 * Chuẩn hóa avatar ID: loại bỏ tiền tố thừa nếu có, trả về ID sạch (ví dụ: 'fox').
 * Trả về '' nếu người dùng muốn gỡ avatar.
 * Trả về null nếu ID không nằm trong danh sách cho phép.
 */
export function normalizeAvatarId(value: unknown): string | null {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value !== 'string') return null;
  const cleanId = value.startsWith(AVATAR_PREFIX) ? value.slice(AVATAR_PREFIX.length) : value;
  const trimmed = cleanId.trim().toLowerCase();
  return (AVATAR_PRESET_IDS as readonly string[]).includes(trimmed) ? trimmed : null;
}

export function isValidAvatar(value: unknown): boolean {
  return normalizeAvatarId(value) !== null;
}
