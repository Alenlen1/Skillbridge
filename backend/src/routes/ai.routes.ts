import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { reviewResume } from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

// POST /api/v1/ai/resume-review
router.post("/resume-review", upload.single("resume"), reviewResume);

export default router;
