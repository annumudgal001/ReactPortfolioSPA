import { Router } from 'express';
import { z } from 'zod';
import { requireOwner, requireCsrf, trustedOrigin } from '../auth/auth.middleware.js';
import { Profile } from '../models/profile.model.js';
import { Project } from '../models/project.model.js';
import { Message } from '../models/message.model.js';
import { Feedback } from '../models/feedback.model.js';
import { objectId, projectSchema, projectWrite, profileWrite, validate } from './validation.js';
const router = Router();
router.use(requireOwner);
router.use((req, res, next) => ['GET', 'HEAD'].includes(req.method) ? next() : trustedOrigin(req, res, () => requireCsrf(req, res, next)));
const conflict = res => res.status(409).json({ success: false, message: 'This record changed or was removed. Reload before saving.' });
const dto = doc => { const { __v = 0, ...data } = doc; return { ...data, revision: __v }; };
router.get('/profile', async (req, res) => {
  const profile = await Profile.findOne().lean();
  if (!profile) return res.status(404).json({ success: false, message: 'Initialize content before using the editor.' });
  res.json({ success: true, data: dto(profile) });
});
router.put('/profile', async (req, res) => {
  const input = validate(profileWrite, req.body, res);
  if (!input) return;
  const target = await Profile.findOne().select('_id').lean();
  if (!target) return conflict(res);
  const record = await Profile.findOneAndUpdate({ _id: target._id, __v: input.revision }, { $set: input.data, $inc: { __v: 1 } }, { new: true, runValidators: true }).lean();
  if (!record) return conflict(res);
  res.json({ success: true, data: dto(record) });
});
router.get('/projects', async (req, res) => res.json({ success: true, data: (await Project.find().sort({ order: 1, createdAt: -1 }).limit(500).lean()).map(dto) }));
router.post('/projects', async (req, res) => {
  const data = validate(projectSchema, req.body, res);
  if (!data) return;
  const project = await Project.create(data);
  res.status(201).json({ success: true, data: dto(project.toObject()) });
});
router.put('/projects/:id', async (req, res) => {
  if (!validate(objectId, req.params.id, res)) return;
  const input = validate(projectWrite, req.body, res);
  if (!input) return;
  const project = await Project.findOneAndUpdate({ _id: req.params.id, __v: input.revision }, { $set: input.data, $inc: { __v: 1 } }, { new: true, runValidators: true }).lean();
  if (!project) return conflict(res);
  res.json({ success: true, data: dto(project) });
});
router.delete('/projects/:id', async (req, res) => {
  if (!validate(objectId, req.params.id, res)) return;
  const input = validate(z.object({ revision: z.number().int().min(0) }).strict(), req.body, res);
  if (!input) return;
  const result = await Project.deleteOne({ _id: req.params.id, __v: input.revision });
  if (!result.deletedCount) return conflict(res);
  res.json({ success: true });
});
const pagination = z.object({ page: z.coerce.number().int().min(1).max(10000).default(1) }).strict();
for (const [path, model, flag] of [['messages', Message, 'read'], ['feedback', Feedback, 'approved']]) {
  router.get(`/${path}`, async (req, res) => {
    const query = validate(pagination, req.query, res);
    if (!query) return;
    const [items, total] = await Promise.all([model.find().sort({ createdAt: -1 }).skip((query.page - 1) * 20).limit(20).lean(), model.countDocuments()]);
    res.json({ success: true, data: { items, total, page: query.page } });
  });
  router.patch(`/${path}/:id`, async (req, res) => {
    if (!validate(objectId, req.params.id, res)) return;
    const input = validate(z.object({ [flag]: z.boolean() }).strict(), req.body, res);
    if (!input) return;
    const item = await model.findByIdAndUpdate(req.params.id, { $set: input }, { new: true }).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: item });
  });
  router.delete(`/${path}/:id`, async (req, res) => {
    if (!validate(objectId, req.params.id, res)) return;
    const result = await model.deleteOne({ _id: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true });
  });
}
export default router;
