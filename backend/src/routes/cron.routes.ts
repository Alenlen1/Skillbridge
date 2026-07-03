import { Router } from "express";
import { verifyCronSecret } from "../middleware/cron.middleware";
import {
  cleanupStaleSessions,
  sendInterviewReminders,
} from "../controllers/cron.controller";

const router = Router();

router.use(verifyCronSecret);

router.post("/cleanup-stale-sessions", cleanupStaleSessions);
router.post("/interview-reminders", sendInterviewReminders);

export default router;
