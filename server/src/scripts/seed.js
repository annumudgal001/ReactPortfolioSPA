import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import { Profile } from "../models/profile.model.js";
import { Project } from "../models/project.model.js";
import { profile, projects } from "./seed-data.js";

try {
  await connectDB();

  if (await Profile.exists({}) || await Project.exists({})) {
    throw new Error("Content already exists. Use /admin to edit it; seed will not overwrite records.");
  }
  await Profile.create({ ...profile, photoUrl: '/profile.jpg', seoDescription: profile.summary });
  await Project.insertMany(projects);

  console.log("Seed complete: profile and projects saved");
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
