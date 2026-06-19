import { Response } from "express";
import { prisma } from "../lib/prisma";
import cloudinary from "../lib/cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/v1/certificates
export const getCertificates = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/certificates
export const uploadCertificate = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, issuer, category, issuedAt } = req.body;
    const file = req.file;

    if (!title || !issuer || !category) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Title, issuer, and category are required",
        },
      });
      return;
    }

    if (!file) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "A file is required" },
      });
      return;
    }

    // Upload to Cloudinary
   const uploadResult = await new Promise<{ secure_url: string }>(
     (resolve, reject) => {
       const stream = cloudinary.uploader.upload_stream(
         {
           folder: "skillbridge/certificates",
           resource_type: "image",
         },
         (error, result) => {
           if (error || !result) return reject(error);
           resolve(result);
         },
       );
       stream.end(file.buffer);
     },
   );

    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        category,
        fileUrl: uploadResult.secure_url,
        issuedAt: issuedAt ? new Date(issuedAt) : null,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    console.error("Upload certificate error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/certificates/:id
export const deleteCertificate = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    await prisma.certificate.deleteMany({
      where: { id, userId: req.user!.id },
    });

    res.json({ success: true, data: { message: "Certificate deleted" } });
  } catch (error) {
    console.error("Delete certificate error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
