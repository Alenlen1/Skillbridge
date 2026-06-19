import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const VALID_STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

// GET /api/v1/applications
export const getApplications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user!.id },
      orderBy: { appliedDate: "desc" },
    });
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/applications
export const addApplication = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { company, role, status, notes } = req.body;

    if (!company || !role) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Company and role are required",
        },
      });
      return;
    }

    const application = await prisma.application.create({
      data: {
        company,
        role,
        status: status || "Applied",
        notes: notes || null,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error("Add application error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// PATCH /api/v1/applications/:id
export const updateApplication = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;
    const { status, notes, company, role } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid status" },
      });
      return;
    }

    const application = await prisma.application.updateMany({
      where: { id, userId: req.user!.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(company && { company }),
        ...(role && { role }),
      },
    });

    res.json({ success: true, data: application });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/applications/:id
export const deleteApplication = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    await prisma.application.deleteMany({
      where: { id, userId: req.user!.id },
    });

    res.json({ success: true, data: { message: "Application deleted" } });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
