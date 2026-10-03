import mongoose from 'mongoose';
const { Schema } = mongoose;
export const Owner = mongoose.model('Owner', new Schema({
  singleton: { type: String, default: 'owner', unique: true, immutable: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['owner'], default: 'owner' },
}, { timestamps: true }));
export const AdminSession = mongoose.model('AdminSession', new Schema({
  tokenHash: { type: String, required: true, unique: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
  csrfToken: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true }));
