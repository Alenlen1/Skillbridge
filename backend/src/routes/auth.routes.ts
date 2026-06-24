import { Router } from "express";
import {
  connectGithub,
  githubCallback,
} from "../controllers/github.controller";
import {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  authLimiter,
  emailActionLimiter,
} from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.delete("/logout", authenticate, logout);
router.get("/verify-email", verifyEmail);
router.post(
  "/resend-verification",
  authenticate,
  emailActionLimiter,
  resendVerification,
);
router.post("/forgot-password", emailActionLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/me", authenticate, getMe);
router.get("/github/connect", connectGithub);
router.get("/github/callback", githubCallback);
export default router;
