import React, { useState } from 'react';
import { getAvatarPreset, getAvatarUrl } from '@/lib/avatars';

interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  /** Kích thước tính bằng px */
  size?: number;
  className?: string;
}

/**
 * Hiển thị avatar người dùng:
 * 1. Tải file vector SVG từ sub-folder public/avatars/<id>.svg trên frontend.
 * 2. Fallback chữ cái đầu nếu không có avatar hoặc tải ảnh thất bại.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, name, size = 40, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const preset = getAvatarPreset(avatar);
  const avatarUrl = getAvatarUrl(avatar);
  const initial = name?.trim().charAt(0).toUpperCase() || 'U';

  // 1. Nếu avatar là ID trong danh sách (lấy file từ public/avatars/<id>.svg)
  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={preset?.label || name || 'Avatar'}
        title={preset?.label || name}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={`inline-block shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white/80 select-none ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 2. Fallback nếu là link HTTP trực tiếp
  if (avatar && (avatar.startsWith('http://') || avatar.startsWith('https://')) && !imgError) {
    return (
      <img
        src={avatar}
        alt={name || 'Avatar'}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={`inline-block shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white/80 select-none ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 3. Fallback: chữ cái đầu của tên
  return (
    <div
      role="img"
      aria-label={name ? `Avatar ${name}` : 'Avatar'}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white shadow-sm ring-2 ring-white/80 select-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.42)) }}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
