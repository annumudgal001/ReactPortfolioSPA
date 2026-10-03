import { Router } from "express";
import { showProfile } from "../controllers/profile.controller.js";

const router = Router();
router.get("/", showProfile);

export default router;
