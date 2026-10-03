import 'dotenv/config';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { connectDB } from '../config/db.js';
import { Profile } from '../models/profile.model.js';
import { Project } from '../models/project.model.js';
export async function migrateContent() {
  const profiles = await Profile.find().lean();
  for (const profile of profiles) {
    const updates = {};
    for (const key of ['experience', 'education', 'services', 'certifications', 'testimonials', 'quotes', 'skillGroups']) {
      const current = profile[key] || [];
      if (current.some(x => !x.id || (key === 'skillGroups' && x.items.some(i => !i.id)))) {
        updates[key] = current.map(x => ({ ...x, id: x.id || randomUUID(), ...(key === 'skillGroups' ? { items: x.items.map(i => ({ ...i, id: i.id || randomUUID() })) } : {}) }));
      }
    }
    if (!profile.photoUrl) updates.photoUrl = '/profile.jpg';
    if (profile.seoDescription === undefined) updates.seoDescription = profile.summary || '';
    if (Object.keys(updates).length) await Profile.updateOne({ _id: profile._id, __v: profile.__v || 0 }, { $set: updates, $inc: { __v: 1 } });
  }
  await Project.updateMany({ published: { $exists: false } }, { $set: { published: true }, $inc: { __v: 1 } });
}
if (process.argv[1]?.endsWith('migrate-content.js')) {
  try { await connectDB(); await migrateContent(); console.log('Content migration complete; existing content preserved.'); }
  catch (error) { console.error('Migration failed:', error.name); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
}
