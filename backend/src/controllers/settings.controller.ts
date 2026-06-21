import { Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// PATCH /api/v1/settings/profile
// Updates name only, for now — kept separate from password/email changes
// since those need extra verification steps.
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim().length < 2)
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name must be at least 2 characters",
        },
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name: name?.trim() },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        emailVerified: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// PATCH /api/v1/settings/password
// Requires the current password to confirm identity before changing it.
export const updatePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Current and new password are required",
        },
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "New password must be at least 8 characters",
        },
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.password) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Current password is incorrect",
        },
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Log out of all other sessions for security, keeping this request's
    // flow simple — the frontend will need to log in again.
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    res.json({
      success: true,
      data: { message: "Password updated successfully" },
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// PATCH /api/v1/settings/visibility
// Toggles the portfolio's public/private state.
export const updateVisibility = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "isPublic must be true or false",
        },
      });
      return;
    }

    const portfolio = await prisma.portfolio.update({
      where: { userId: req.user!.id },
      data: { isPublic },
    });

    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Update visibility error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
