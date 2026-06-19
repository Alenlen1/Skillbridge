import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAnalytics);

export default router;
