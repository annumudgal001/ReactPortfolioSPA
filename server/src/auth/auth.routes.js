import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { Owner, AdminSession } from './auth.models.js';
import { verifyPassword } from './password.js';
import { cookieName, cookieOptions, digest, trustedOrigin, requireOwner, requireCsrf } from './auth.middleware.js';
import { createFormLimiter } from '../middleware/rate-limit.middleware.js';
const router = Router();
const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(120), password: z.string().min(1).max(256) }).strict();
router.post('/login', trustedOrigin, createFormLimiter({ message: 'Too many sign-in attempts. Wait up to 15 minutes before trying again.' }), async (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, message: 'Enter a valid email and password.' });
  const owner = await Owner.findOne({ email: input.data.email }).select('+passwordHash');
  const valid = await verifyPassword(input.data.password, owner?.passwordHash);
  if (!owner || !valid) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
  const token = randomBytes(32).toString('hex');
  const csrfToken = randomBytes(32).toString('hex');
  const duration = 8 * 60 * 60 * 1000;
  await AdminSession.create({ tokenHash: digest(token), csrfToken, ownerId: owner._id, expiresAt: new Date(Date.now() + duration) });
  res.cookie(cookieName, token, { ...cookieOptions(), maxAge: duration });
  res.json({ success: true, data: { email: owner.email, csrfToken } });
});
router.get('/session', requireOwner, (req, res) => res.json({ success: true, data: { email: req.admin.owner.email, csrfToken: req.admin.session.csrfToken } }));
router.post('/logout', trustedOrigin, requireOwner, requireCsrf, async (req, res) => {
  await AdminSession.deleteOne({ _id: req.admin.session._id });
  res.clearCookie(cookieName, cookieOptions());
  res.json({ success: true });
});
export default router;
