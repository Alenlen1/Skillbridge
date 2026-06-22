import { Router } from "express";
import {
  updateProfile,
  updatePassword,
  updateVisibility,
  updateUsername,
  deleteAccount,
} from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.patch("/profile", authenticate, updateProfile);
router.patch("/password", authenticate, updatePassword);
router.patch("/visibility", authenticate, updateVisibility);
router.patch("/username", authenticate, updateUsername);
router.delete("/account", authenticate, deleteAccount);

export default router;
