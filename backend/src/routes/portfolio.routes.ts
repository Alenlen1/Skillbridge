import { Router } from "express";
import {
  getMyPortfolio,
  updateMyPortfolio,
  getPublicPortfolio,
  addSkill,
  deleteSkill,
  addProject,
  deleteProject,
  addEducation,
  deleteEducation,
} from "../controllers/portfolio.controller";
import { authenticate } from "../middleware/auth.middleware";
import { optionalAuthenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/me", authenticate, getMyPortfolio);
router.put("/me", authenticate, updateMyPortfolio);
router.post("/me/skills", authenticate, addSkill);
router.delete("/me/skills/:id", authenticate, deleteSkill);
router.post("/me/projects", authenticate, addProject);
router.delete("/me/projects/:id", authenticate, deleteProject);
router.get("/:username", optionalAuthenticate, getPublicPortfolio);
router.post("/me/education", authenticate, addEducation);
router.delete("/me/education/:id", authenticate, deleteEducation);

export default router;
