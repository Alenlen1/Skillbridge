import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import {
  reviewResume,
  reviewPortfolio,
  analyzeSkillGap,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/resume-review", upload.single("resume"), reviewResume);
router.post("/portfolio-review", reviewPortfolio);
router.post("/skill-gap", analyzeSkillGap);

export default router;
