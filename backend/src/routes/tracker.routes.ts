import { Router } from "express";
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/tracker.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getApplications);
router.post("/", authenticate, addApplication);
router.patch("/:id", authenticate, updateApplication);
router.delete("/:id", authenticate, deleteApplication);

export default router;
