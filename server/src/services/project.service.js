import { Project } from "../models/project.model.js";

export function getProjects() {
  return Project.find({ published: { $ne: false } }).sort({ order: 1, createdAt: -1 }).select("title slug description details highlights technologies thumbnail repoUrl liveUrl featured order").limit(500).lean();
}
