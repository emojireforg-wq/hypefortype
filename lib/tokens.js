import crypto from 'crypto';

const SECRET = process.env.DOWNLOAD_SECRET || 'hft_fallback_secret';
const TOKEN_STORE = new Map(); // In production use Redis/KV

export function generateToken(orderData) {
  const tokenId = crypto.randomUUID();
  const expires = Date.now() + 48 * 60 * 60 * 1000; // 48 hours
  const payload = { tokenId, orderData, expires, used: false, createdAt: Date.now() };
  TOKEN_STORE.set(tokenId, payload);
  const sig = crypto.createHmac('sha256', SECRET).update(tokenId + expires).digest('hex');
  return `${tokenId}.${sig}`;
}

export function validateToken(token) {
  try {
    const [tokenId, sig] = token.split('.');
    if (!tokenId || !sig) return { valid: false, error: 'Invalid token format' };
    const expected = crypto.createHmac('sha256', SECRET).update(tokenId + (TOKEN_STORE.get(tokenId)?.expires || '')).digest('hex');
    if (sig !== expected) return { valid: false, error: 'Invalid signature' };
    const payload = TOKEN_STORE.get(tokenId);
    if (!payload) return { valid: false, error: 'Token not found' };
    if (payload.used) return { valid: false, error: 'Token already used' };
    if (Date.now() > payload.expires) return { valid: false, error: 'Token expired' };
    payload.used = true;
    TOKEN_STORE.set(tokenId, payload);
    return { valid: true, orderData: payload.orderData };
  } catch (e) {
    return { valid: false, error: 'Token validation failed' };
  }
}
