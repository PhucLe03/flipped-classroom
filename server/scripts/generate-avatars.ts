import fs from 'fs';
import path from 'path';

const AVATARS = [
  // Động vật
  { id: 'fox', emoji: '🦊', label: 'Cáo lửa', from: '#fb923c', to: '#ea580c' },
  { id: 'panda', emoji: '🐼', label: 'Gấu trúc', from: '#cbd5e1', to: '#475569' },
  { id: 'tiger', emoji: '🐯', label: 'Hổ con', from: '#fcd34d', to: '#f59e0b' },
  { id: 'koala', emoji: '🐨', label: 'Koala', from: '#a5b4fc', to: '#6366f1' },
  { id: 'owl', emoji: '🦉', label: 'Cú thông thái', from: '#d6b48a', to: '#92400e' },
  { id: 'penguin', emoji: '🐧', label: 'Chim cánh cụt', from: '#7dd3fc', to: '#0369a1' },
  { id: 'frog', emoji: '🐸', label: 'Ếch xanh', from: '#86efac', to: '#16a34a' },
  { id: 'unicorn', emoji: '🦄', label: 'Kỳ lân', from: '#f9a8d4', to: '#a855f7' },

  // Khám phá
  { id: 'rocket', emoji: '🚀', label: 'Tên lửa', from: '#818cf8', to: '#312e81' },
  { id: 'astronaut', emoji: '🧑‍🚀', label: 'Phi hành gia', from: '#60a5fa', to: '#1e3a8a' },
  { id: 'alien', emoji: '👽', label: 'Người ngoài hành tinh', from: '#a3e635', to: '#15803d' },
  { id: 'robot', emoji: '🤖', label: 'Robot', from: '#94a3b8', to: '#334155' },
  { id: 'planet', emoji: '🪐', label: 'Hành tinh', from: '#fdba74', to: '#9a3412' },
  { id: 'comet', emoji: '☄️', label: 'Sao chổi', from: '#f87171', to: '#7f1d1d' },
  { id: 'ufo', emoji: '🛸', label: 'Đĩa bay', from: '#5eead4', to: '#0f766e' },
  { id: 'satellite', emoji: '🛰️', label: 'Vệ tinh', from: '#c4b5fd', to: '#4c1d95' },

  // Học tập
  { id: 'scholar', emoji: '🧑‍🎓', label: 'Tân cử nhân', from: '#38bdf8', to: '#006199' },
  { id: 'scientist', emoji: '🧑‍🔬', label: 'Nhà khoa học', from: '#67e8f9', to: '#0e7490' },
  { id: 'artist', emoji: '🧑‍🎨', label: 'Họa sĩ', from: '#fda4af', to: '#be123c' },
  { id: 'books', emoji: '📚', label: 'Mọt sách', from: '#fde68a', to: '#d97706' },
  { id: 'microscope', emoji: '🔬', label: 'Kính hiển vi', from: '#99f6e4', to: '#0d9488' },
  { id: 'abacus', emoji: '🧮', label: 'Bàn tính', from: '#fca5a5', to: '#b91c1c' },
  { id: 'globe', emoji: '🌏', label: 'Địa cầu', from: '#6ee7b7', to: '#047857' },
  { id: 'lightbulb', emoji: '💡', label: 'Ý tưởng', from: '#fef08a', to: '#FFD444' },

  // Sở thích
  { id: 'soccer', emoji: '⚽', label: 'Bóng đá', from: '#bbf7d0', to: '#15803d' },
  { id: 'basketball', emoji: '🏀', label: 'Bóng rổ', from: '#fdba74', to: '#c2410c' },
  { id: 'guitar', emoji: '🎸', label: 'Guitar', from: '#f0abfc', to: '#a21caf' },
  { id: 'gamepad', emoji: '🎮', label: 'Game thủ', from: '#86efac', to: '#107c10' },
  { id: 'chess', emoji: '♟️', label: 'Cờ vua', from: '#e2e8f0', to: '#1e293b' },
  { id: 'palette', emoji: '🎨', label: 'Bảng màu', from: '#fbcfe8', to: '#db2777' },
  { id: 'camera', emoji: '📷', label: 'Nhiếp ảnh', from: '#a5f3fc', to: '#155e75' },
  { id: 'headphones', emoji: '🎧', label: 'Âm nhạc', from: '#ddd6fe', to: '#6d28d9' },
];

const targetDir = path.resolve(__dirname, '../../client/public/avatars');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (const a of AVATARS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="g_${a.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a.from}" />
      <stop offset="100%" stop-color="${a.to}" />
    </linearGradient>
    <radialGradient id="glow_${a.id}" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Background Circle with Gradient -->
  <circle cx="60" cy="60" r="58" fill="url(#g_${a.id})" stroke="#ffffff" stroke-width="2" />
  <!-- Glossy Highlight -->
  <circle cx="60" cy="60" r="58" fill="url(#glow_${a.id})" />
  <!-- Emoji Graphic -->
  <text x="60" y="66" font-size="58" text-anchor="middle" dominant-baseline="central" font-family="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif">
    ${a.emoji}
  </text>
</svg>`;

  fs.writeFileSync(path.join(targetDir, `${a.id}.svg`), svg, 'utf8');
}

console.log(`Generated ${AVATARS.length} SVG avatars in ${targetDir}`);
