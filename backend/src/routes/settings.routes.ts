import { Router } from "express";
import {
  updateProfile,
  updatePassword,
  updateVisibility,
} from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.patch("/profile", authenticate, updateProfile);
router.patch("/password", authenticate, updatePassword);
router.patch("/visibility", authenticate, updateVisibility);

export default router;
