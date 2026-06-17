import { Router } from "express";
import {
  getMyPortfolio,
  updateMyPortfolio,
  getPublicPortfolio,
  addSkill,
  deleteSkill,
} from "../controllers/portfolio.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyPortfolio);
router.put("/me", authenticate, updateMyPortfolio);
router.post("/me/skills", authenticate, addSkill);
router.delete("/me/skills/:id", authenticate, deleteSkill);
router.get("/:username", getPublicPortfolio);

export default router;
