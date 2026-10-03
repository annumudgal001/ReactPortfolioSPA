import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const { Schema } = mongoose;

const text = (extra = {}) => ({ type: String, default: '', trim: true, ...extra });

const experienceSchema = new Schema(
  {
    id: text({ default: randomUUID }),
    company: text({ required: true }),
    role: text({ required: true }),
    type: text(),
    period: text(),
    location: text(),
    industry: text(),
    summary: text(),
    logo: text(),
    current: { type: Boolean, default: false },
  },
  { _id: false },
);

const educationSchema = new Schema(
  {
    id: text({ default: randomUUID }),
    degree: text({ required: true }),
    institution: text(),
    period: text(),
    score: text(),
    logo: text(),
    coursework: { type: [String], default: [] },
    summary: text(),
  },
  { _id: false },
);

const skillItemSchema = new Schema(
  {
    id: text({ default: randomUUID }), name: text({ required: true }), description: text() },
  { _id: false },
);

const skillGroupSchema = new Schema(
  {
    id: text({ default: randomUUID }),
    category: text({ required: true }),
    items: { type: [skillItemSchema], default: [] },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    id: text({ default: randomUUID }),
    title: text({ required: true }),
    description: text(),
    icon: text(),
    tags: { type: [String], default: [] },
  },
  { _id: false },
);

const certificationSchema = new Schema(
  {
    id: text({ default: randomUUID }), title: text({ required: true }), issuer: text(), image: text() },
  { _id: false },
);

const testimonialSchema = new Schema(
  {
    id: text({ default: randomUUID }), quote: text({ required: true }), author: text({ required: true }), role: text() },
  { _id: false },
);

const quoteSchema = new Schema(
  {
    id: text({ default: randomUUID }), title: text({ required: true }), text: text({ required: true }) },
  { _id: false },
);

const socialsSchema = new Schema(
  {
    github: text(),
    linkedin: text(),
    leetcode: text(),
    twitter: text(),
    instagram: text(),
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    name: text({ required: true }),
    headline: text({ required: true }),
    jargon: { type: [String], default: [] },
    summary: text({ required: true }),
    location: text(),
    email: text(),
    phone: text(),
    resumeUrl: text(),
    photoUrl: text(),
    seoDescription: text(),
    socials: { type: socialsSchema, default: () => ({}) },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skillGroups: { type: [skillGroupSchema], default: [] },
    services: { type: [serviceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    quotes: { type: [quoteSchema], default: [] },
  },
  { timestamps: true },
);

export const Profile = mongoose.model('Profile', profileSchema);
