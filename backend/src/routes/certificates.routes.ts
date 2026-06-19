import { Router } from "express";
import {
  getCertificates,
  uploadCertificate,
  deleteCertificate,
} from "../controllers/certificates.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", authenticate, getCertificates);
router.post("/", authenticate, upload.single("file"), uploadCertificate);
router.delete("/:id", authenticate, deleteCertificate);

export default router;
