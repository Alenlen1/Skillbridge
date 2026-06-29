import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import {
  reviewResume,
  reviewPortfolio,
  analyzeSkillGap,
  generateCoverLetter,
  generateRoadmap,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/resume-review", upload.single("resume"), reviewResume);
router.post("/portfolio-review", reviewPortfolio);
router.post("/skill-gap", analyzeSkillGap);
router.post("/cover-letter", upload.single("resume"), generateCoverLetter);
router.post("/roadmap", generateRoadmap);

export default router;
