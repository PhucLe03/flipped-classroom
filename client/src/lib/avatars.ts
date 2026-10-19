/**
 * Bộ danh mục Avatar tuyển chọn (Xbox Gamerpic style).
 * Database chỉ lưu duy nhất ID (ví dụ: 'fox', 'panda', 'rocket').
 * Khi Frontend load, nó lấy file SVG từ thư mục public/avatars/<id>.svg.
 */

export interface AvatarPreset {
  id: string;
  emoji: string;
  label: string;
  from: string;
  to: string;
}

export interface AvatarCategory {
  key: string;
  label: string;
  icon: string;
  items: AvatarPreset[];
}

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  {
    key: 'animals',
    label: 'Động vật',
    icon: '🐾',
    items: [
      { id: 'fox', emoji: '🦊', label: 'Cáo lửa', from: '#fb923c', to: '#ea580c' },
      { id: 'panda', emoji: '🐼', label: 'Gấu trúc', from: '#cbd5e1', to: '#475569' },
      { id: 'tiger', emoji: '🐯', label: 'Hổ con', from: '#fcd34d', to: '#f59e0b' },
      { id: 'koala', emoji: '🐨', label: 'Koala', from: '#a5b4fc', to: '#6366f1' },
      { id: 'owl', emoji: '🦉', label: 'Cú thông thái', from: '#d6b48a', to: '#92400e' },
      { id: 'penguin', emoji: '🐧', label: 'Chim cánh cụt', from: '#7dd3fc', to: '#0369a1' },
      { id: 'frog', emoji: '🐸', label: 'Ếch xanh', from: '#86efac', to: '#16a34a' },
      { id: 'unicorn', emoji: '🦄', label: 'Kỳ lân', from: '#f9a8d4', to: '#a855f7' },
    ],
  },
  {
    key: 'space',
    label: 'Khám phá',
    icon: '🚀',
    items: [
      { id: 'rocket', emoji: '🚀', label: 'Tên lửa', from: '#818cf8', to: '#312e81' },
      { id: 'astronaut', emoji: '🧑‍🚀', label: 'Phi hành gia', from: '#60a5fa', to: '#1e3a8a' },
      { id: 'alien', emoji: '👽', label: 'Người ngoài hành tinh', from: '#a3e635', to: '#15803d' },
      { id: 'robot', emoji: '🤖', label: 'Robot', from: '#94a3b8', to: '#334155' },
      { id: 'planet', emoji: '🪐', label: 'Hành tinh', from: '#fdba74', to: '#9a3412' },
      { id: 'comet', emoji: '☄️', label: 'Sao chổi', from: '#f87171', to: '#7f1d1d' },
      { id: 'ufo', emoji: '🛸', label: 'Đĩa bay', from: '#5eead4', to: '#0f766e' },
      { id: 'satellite', emoji: '🛰️', label: 'Vệ tinh', from: '#c4b5fd', to: '#4c1d95' },
    ],
  },
  {
    key: 'study',
    label: 'Học tập',
    icon: '📚',
    items: [
      { id: 'scholar', emoji: '🧑‍🎓', label: 'Tân cử nhân', from: '#38bdf8', to: '#006199' },
      { id: 'scientist', emoji: '🧑‍🔬', label: 'Nhà khoa học', from: '#67e8f9', to: '#0e7490' },
      { id: 'artist', emoji: '🧑‍🎨', label: 'Họa sĩ', from: '#fda4af', to: '#be123c' },
      { id: 'books', emoji: '📚', label: 'Mọt sách', from: '#fde68a', to: '#d97706' },
      { id: 'microscope', emoji: '🔬', label: 'Kính hiển vi', from: '#99f6e4', to: '#0d9488' },
      { id: 'abacus', emoji: '🧮', label: 'Bàn tính', from: '#fca5a5', to: '#b91c1c' },
      { id: 'globe', emoji: '🌏', label: 'Địa cầu', from: '#6ee7b7', to: '#047857' },
      { id: 'lightbulb', emoji: '💡', label: 'Ý tưởng', from: '#fef08a', to: '#FFD444' },
    ],
  },
  {
    key: 'hobbies',
    label: 'Sở thích',
    icon: '🎮',
    items: [
      { id: 'soccer', emoji: '⚽', label: 'Bóng đá', from: '#bbf7d0', to: '#15803d' },
      { id: 'basketball', emoji: '🏀', label: 'Bóng rổ', from: '#fdba74', to: '#c2410c' },
      { id: 'guitar', emoji: '🎸', label: 'Guitar', from: '#f0abfc', to: '#a21caf' },
      { id: 'gamepad', emoji: '🎮', label: 'Game thủ', from: '#86efac', to: '#107c10' },
      { id: 'chess', emoji: '♟️', label: 'Cờ vua', from: '#e2e8f0', to: '#1e293b' },
      { id: 'palette', emoji: '🎨', label: 'Bảng màu', from: '#fbcfe8', to: '#db2777' },
      { id: 'camera', emoji: '📷', label: 'Nhiếp ảnh', from: '#a5f3fc', to: '#155e75' },
      { id: 'headphones', emoji: '🎧', label: 'Âm nhạc', from: '#ddd6fe', to: '#6d28d9' },
    ],
  },
];

export const PRESET_MAP: Record<string, AvatarPreset> = Object.fromEntries(
  AVATAR_CATEGORIES.flatMap((c) => c.items).map((p) => [p.id, p])
);

/**
 * Làm sạch avatar ID (hỗ trợ cả ID thuần 'fox' và định dạng cũ 'preset:fox').
 */
export function cleanAvatarId(value?: string | null): string | null {
  if (!value) return null;
  const raw = value.startsWith('preset:') ? value.slice(7) : value;
  const trimmed = raw.trim().toLowerCase();
  return PRESET_MAP[trimmed] ? trimmed : null;
}

/**
 * Trả về ID avatar để lưu vào cơ sở dữ liệu (chỉ lưu ID, ví dụ: 'fox').
 */
export function toAvatarValue(id: string): string {
  const cleaned = cleanAvatarId(id);
  return cleaned || id;
}

/**
 * Lấy preset chi tiết theo ID.
 */
export function getAvatarPreset(value?: string | null): AvatarPreset | null {
  const id = cleanAvatarId(value);
  if (!id) return null;
  return PRESET_MAP[id] || null;
}

/**
 * Lấy đường dẫn URL của file SVG avatar từ thư mục public/avatars/.
 * Tự động hỗ trợ biến môi trường NEXT_PUBLIC_BASE_PATH khi deploy GitHub Pages.
 */
export function getAvatarUrl(value?: string | null): string | null {
  const id = cleanAvatarId(value);
  if (!id) return null;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/avatars/${id}.svg`;
}
