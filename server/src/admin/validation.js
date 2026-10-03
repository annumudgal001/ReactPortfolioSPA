import { z } from 'zod';
import { APP_SERVICE_ICONS } from './icons.js';
const text = z.string().trim().max(2000);
const short = z.string().trim().max(200);
const required = short.min(1);
const list = z.array(short.min(1)).max(50);
// Accept local public assets or HTTPS links; never executable/data URLs or traversal.
export const assetUrl = z.string().trim().max(1000).refine(value => {
  if (!value) return true;
  if (/^\/(?!\/)/.test(value)) return !value.includes('..') && !/[\\\x00-\x20]/.test(value);
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}, 'Use a local /path or an HTTPS URL.');
const externalUrl = assetUrl.refine(value => !value || value.startsWith('https://'), 'Use an HTTPS URL.');
const entry = { id: z.string().uuid() };
const experience = z.object({ ...entry, company: required, role: required, type: short, period: short, location: short, industry: short, summary: text, logo: assetUrl, current: z.boolean() }).strict();
const education = z.object({ ...entry, degree: required, institution: short, period: short, score: short, logo: assetUrl, coursework: list, summary: text }).strict();
const skill = z.object({ ...entry, name: required, description: text }).strict();
const group = z.object({ ...entry, category: required, items: z.array(skill).max(100) }).strict();
const service = z.object({ ...entry, title: required, description: text, icon: z.enum(APP_SERVICE_ICONS).or(z.literal('')), tags: list }).strict();
const certificate = z.object({ ...entry, title: required, issuer: short, image: assetUrl }).strict();
const testimonial = z.object({ ...entry, quote: text.min(1), author: required, role: short }).strict();
const quote = z.object({ ...entry, title: required, text: text.min(1) }).strict();
export const profileSchema = z.object({
  name: required, headline: required, summary: text.min(1), jargon: z.array(short.min(1)).max(50),
  location: short, email: z.string().trim().email().max(120).or(z.literal('')), phone: short,
  photoUrl: assetUrl, resumeUrl: assetUrl, seoDescription: text,
  socials: z.object({ github: externalUrl, linkedin: externalUrl, leetcode: externalUrl, twitter: externalUrl, instagram: externalUrl }).strict(),
  experience: z.array(experience).max(100), education: z.array(education).max(100), skillGroups: z.array(group).max(50),
  services: z.array(service).max(100), certifications: z.array(certificate).max(100), testimonials: z.array(testimonial).max(100), quotes: z.array(quote).max(100),
}).strict().superRefine((value, ctx) => {
  for (const field of ['experience', 'education', 'skillGroups', 'services', 'certifications', 'testimonials', 'quotes']) {
    const ids = value[field].map(x => x.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: [field], message: 'Entry IDs must be unique.' });
  }
});
export const profileWrite = z.object({ revision: z.number().int().min(0), data: profileSchema }).strict();
export const projectSchema = z.object({
  title: required, slug: z.string().trim().max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: text.min(1), details: z.string().trim().max(10000),
  highlights: list, technologies: list, thumbnail: assetUrl, repoUrl: externalUrl, liveUrl: externalUrl,
  featured: z.boolean(), order: z.number().int().min(0).max(10000), published: z.boolean(),
}).strict();
export const projectWrite = z.object({ revision: z.number().int().min(0), data: projectSchema }).strict();
export const objectId = z.string().regex(/^[a-f0-9]{24}$/i);
export function validate(schema, data, res) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Check the highlighted fields.', errors: parsed.error.issues.map(x => ({ field: x.path.join('.'), message: x.message })) });
    return null;
  }
  return parsed.data;
}
