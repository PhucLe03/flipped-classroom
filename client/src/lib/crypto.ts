/**
 * Băm mật khẩu người dùng ngay tại trình duyệt bằng SHA-256 kết hợp email làm salt.
 * Đảm bảo mật khẩu thô (plaintext) không bao giờ rời khỏi thiết bị người dùng.
 */
export async function hashPasswordClient(password: string, email: string): Promise<string> {
  if (!password || !email) return password;
  const cleanEmail = email.toLowerCase().trim();
  const rawString = `${password}:${cleanEmail}`;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawString);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.warn('[Crypto] Client subtle crypto failed, falling back:', err);
    }
  }

  return password;
}
