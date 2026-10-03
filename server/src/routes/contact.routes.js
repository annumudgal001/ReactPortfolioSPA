import { Router } from "express";

import { submitContact } from "../controllers/contact.controller.js";
import { createFormLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();
router.post("/", createFormLimiter(), submitContact);

export default router;
