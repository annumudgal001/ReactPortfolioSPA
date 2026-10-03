import { createHash, timingSafeEqual } from 'node:crypto';
import { AdminSession, Owner } from './auth.models.js';
export const digest = token => createHash('sha256').update(token).digest('hex');
export const cookieName = 'portfolio_admin';
export const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/admin' });
export function trustedOrigin(req, res, next) {
  const allowed = (process.env.ADMIN_ORIGINS || 'http://localhost:4200,http://127.0.0.1:4200').split(',').map(x => x.trim());
  if (!allowed.includes(req.get('origin'))) return res.status(403).json({ success: false, message: 'Untrusted request origin' });
  next();
}
export async function requireOwner(req, res, next) {
  const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return res.status(401).json({ success: false, message: 'Owner login required' });
  const session = await AdminSession.findOne({ tokenHash: digest(token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return res.status(401).json({ success: false, message: 'Session expired. Please sign in.' });
  const owner = await Owner.findById(session.ownerId).lean();
  if (!owner || owner.role !== 'owner') return res.status(403).json({ success: false, message: 'Owner permission required' });
  req.admin = { session, owner };
  next();
}
export function requireCsrf(req, res, next) {
  const actual = req.get('x-csrf-token') || '';
  const expected = req.admin.session.csrfToken;
  const supplied = Buffer.from(actual);
  const required = Buffer.from(expected);
  if (supplied.length !== required.length || !timingSafeEqual(supplied, required)) return res.status(403).json({ success: false, message: 'Invalid request token. Refresh and try again.' });
  next();
}
