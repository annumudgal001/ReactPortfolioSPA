import { Router } from "express";

import { submitFeedback } from "../controllers/feedback.controller.js";
import { createFormLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();
router.post("/", createFormLimiter(), submitFeedback);

export default router;
