import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import {
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getSessionDetail,
} from "../controllers/interview.controller";

const router = Router();

router.use(authenticate);

router.post("/start", upload.single("resume"), startSession);
router.get("/history", getHistory);
router.get("/:sessionId", getSessionDetail);
router.post("/:sessionId/questions/:questionId/answer", submitAnswer);
router.post("/:sessionId/complete", completeSession);

export default router;
