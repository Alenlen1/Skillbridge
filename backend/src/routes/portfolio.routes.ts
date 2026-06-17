import { Router } from "express";
import {
  getMyPortfolio,
  updateMyPortfolio,
  getPublicPortfolio,
} from "../controllers/portfolio.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyPortfolio);
router.put("/me", authenticate, updateMyPortfolio);
router.get("/:username", getPublicPortfolio);

export default router;
