import { Router } from "express";
import {
  connectGithub,
  githubCallback,
  getRepos,
  importRepo,
} from "../controllers/github.controller";
import {
  authenticate,
  optionalAuthenticate,
} from "../middleware/auth.middleware";
const router = Router();

router.get("/connect", optionalAuthenticate, connectGithub);
router.get("/callback", githubCallback);
router.get("/repos", authenticate, getRepos);
router.post("/import", authenticate, importRepo);

export default router;
