import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const PEPPER = process.env.PASSWORD_PEPPER || 'flipped_classroom_secret_pepper_2026';

/**
 * Tính SHA-256 hash với salt là email người dùng
 */
export function computeClientHashOnServer(plainPassword: string, email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  return crypto.createHash('sha256').update(`${plainPassword}:${cleanEmail}`).digest('hex');
}

/**
 * Băm mật khẩu để lưu vào MongoDB bằng Bcrypt kết hợp Server Pepper.
 * Tự động nhận diện mật khẩu gửi lên là chuỗi client-hash (64 hex chars) hay plaintext.
 */
export async function hashPasswordForStorage(passwordOrClientHash: string, email: string = ''): Promise<string> {
  const isClientHash = /^[a-f0-9]{64}$/i.test(passwordOrClientHash);
  const clientHash = isClientHash
    ? passwordOrClientHash.toLowerCase()
    : computeClientHashOnServer(passwordOrClientHash, email);

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(clientHash + PEPPER, salt);
}

/**
 * So sánh mật khẩu người dùng gửi lên với passwordHash đã lưu trong DB.
 * Hỗ trợ:
 * 1. Client SHA-256 hash + Pepper đối chiếu Bcrypt
 * 2. Plaintext tính SHA-256 + Pepper đối chiếu Bcrypt
 * 3. Fallback đối chiếu trực tiếp (hỗ trợ chuyển đổi từ hệ thống cũ nếu có)
 */
export async function verifyPassword(
  passwordOrClientHash: string,
  storedHash: string,
  email: string = ''
): Promise<boolean> {
  const isClientHash = /^[a-f0-9]{64}$/i.test(passwordOrClientHash);
  const clientHash = isClientHash
    ? passwordOrClientHash.toLowerCase()
    : computeClientHashOnServer(passwordOrClientHash, email);

  // 1. Kiểm tra theo chuẩn 2 lớp: ClientHash + Pepper
  try {
    const matchesTwoLayer = await bcrypt.compare(clientHash + PEPPER, storedHash);
    if (matchesTwoLayer) return true;
  } catch (err) {
    // continue
  }

  // 2. Fallback: Nếu DB lưu hash trực tiếp không kèm Pepper
  try {
    const matchesHashWithoutPepper = await bcrypt.compare(clientHash, storedHash);
    if (matchesHashWithoutPepper) return true;
  } catch (err) {
    // continue
  }

  // 3. Fallback: Nếu DB lưu mật khẩu dạng bcrypt thô cũ
  try {
    const matchesDirect = await bcrypt.compare(passwordOrClientHash, storedHash);
    if (matchesDirect) return true;
  } catch (err) {
    // continue
  }

  return false;
}
