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
// PATCH /api/v1/settings/username
// Changes the user's username, which also changes their public portfolio
// URL (skillbridge.app/username). Requires the new username to be free.
export const updateUsername = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Username is required" },
      });
      return;
    }

    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 20) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Username must be 3-20 characters",
        },
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Username can only contain letters, numbers, and underscores",
        },
      });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { username: trimmed } });

    if (existing && existing.id !== req.user!.id) {
      res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Username is already taken" },
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { username: trimmed },
      select: { id: true, email: true, username: true, name: true, emailVerified: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update username error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/settings/account
// Permanently deletes the user's account and all related data. Requires
// the current password to confirm identity, since this is irreversible.
export const deleteAccount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password is required to delete your account",
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

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Password is incorrect" },
      });
      return;
    }

    // The schema's onDelete: Cascade on every related model (Portfolio,
    // Certificate, Application, AnalyticsEvent, RefreshToken,
    // VerificationToken) means this single delete removes everything
    // tied to this user automatically.
    await prisma.user.delete({ where: { id: user.id } });

    res.clearCookie("refreshToken");
    res.json({ success: true, data: { message: "Account deleted successfully" } });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};