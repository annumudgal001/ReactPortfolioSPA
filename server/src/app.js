import express from "express";
import helmet from "helmet";

import contactRoutes from "./routes/contact.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import healthRoutes from "./routes/health.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./auth/auth.routes.js";
import adminRoutes from "./admin/admin.routes.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use("/api/admin", (req, res, next) => { res.set("Cache-Control", "no-store"); next(); }, authRoutes, adminRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
