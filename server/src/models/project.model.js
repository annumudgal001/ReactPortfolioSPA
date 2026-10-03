import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: /^[a-z0-9-]+$/,
    },
    description: { type: String, required: true, trim: true },
    details: { type: String, default: "", trim: true },
    highlights: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    thumbnail: { type: String, default: "", trim: true },
    repoUrl: { type: String, default: "", trim: true },
    liveUrl: { type: String, default: "", trim: true },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
