import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service";

const generateAccessToken = (user: {
  id: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
};

const generateRefreshToken = (user: {
  id: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

// POST /api/v1/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, name } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email, username and password are required",
        },
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be at least 8 characters",
        },
      });
      return;
    }

    // Check if a real account already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message:
            existing.email === email
              ? "Email already in use"
              : "Username already taken",
        },
      });
      return;
    }

    // Also clear out any previous pending registration for this email/username
    // so someone can retry signing up if they never clicked the first link.
    await prisma.verificationToken.deleteMany({
      where: {
        type: "PENDING_REGISTRATION",
        OR: [{ pendingEmail: email }, { pendingUsername: username }],
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const pendingToken = crypto.randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        token: pendingToken,
        type: "PENDING_REGISTRATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        pendingEmail: email,
        pendingUsername: username,
        pendingPasswordHash: hashedPassword,
        pendingName: name || null,
      },
    });

    try {
      await sendVerificationEmail(email, name || username, pendingToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({
        success: false,
        error: {
          code: "EMAIL_FAILED",
          message: "Failed to send verification email. Please try again.",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        message: "Check your email to confirm your account",
        pending: true,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
// POST /api/v1/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
      return;
    }

    const payload = { id: user.id, email: user.email, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/auth/refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "No refresh token" },
      });
      return;
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });

    if (!stored || stored.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Refresh token expired or invalid",
        },
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
      email: string;
      username: string;
    };

    await prisma.refreshToken.delete({ where: { token } });

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User not found" },
      });
      return;
    }

    const payload = { id: user.id, email: user.email, username: user.username };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { accessToken: newAccessToken, user } });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
    });
  }
};

// DELETE /api/v1/auth/logout
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, data: { message: "Logged out successfully" } });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
// GET /api/v1/auth/verify-email?token=...
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.query["token"] as string | undefined;

    if (!token) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Token is required" },
      });
      return;
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expiresAt < new Date()) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
      });
      return;
    }

    // Case 1: This is a brand new account being confirmed for the first time
    if (record.type === "PENDING_REGISTRATION") {
      if (
        !record.pendingEmail ||
        !record.pendingUsername ||
        !record.pendingPasswordHash
      ) {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_TOKEN", message: "Token data is incomplete" },
        });
        return;
      }

      // Guard against a race where someone else grabbed the email/username
      // while this token was pending.
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { email: record.pendingEmail },
            { username: record.pendingUsername },
          ],
        },
      });

      if (existing) {
        await prisma.verificationToken.delete({ where: { token } });
        res.status(409).json({
          success: false,
          error: {
            code: "CONFLICT",
            message: "This email or username was taken before you confirmed",
          },
        });
        return;
      }

      const user = await prisma.user.create({
        data: {
          email: record.pendingEmail,
          username: record.pendingUsername,
          password: record.pendingPasswordHash,
          name: record.pendingName,
          emailVerified: true,
          portfolio: { create: {} },
        },
      });

      await prisma.verificationToken.delete({ where: { token } });

      const payload = { id: user.id, email: user.email, username: user.username };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            emailVerified: user.emailVerified,
          },
        },
      });
      return;
    }

    // Case 2: An existing logged-in user is verifying their email
    // (kept for the "resend verification" flow on already-registered accounts)
    if (record.type === "EMAIL_VERIFY" && record.userId) {
      await prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      });

      await prisma.verificationToken.delete({ where: { token } });

      res.json({ success: true, data: { message: "Email verified successfully" } });
      return;
    }

    res.status(400).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/auth/resend-verification
export const resendVerification = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({
        success: false,
        error: { code: "ALREADY_VERIFIED", message: "Email is already verified" },
      });
      return;
    }

    // Remove any old tokens for this user before creating a new one
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "EMAIL_VERIFY" },
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        token: verifyToken,
        userId: user.id,
        type: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(user.email, user.name || user.username, verifyToken);

    res.json({ success: true, data: { message: "Verification email sent" } });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email is required" },
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success, even if the user doesn't exist.
    // This prevents attackers from using this endpoint to discover
    // which emails are registered.
    if (!user) {
      res.json({
        success: true,
        data: { message: "If that email exists, a reset link has been sent" },
      });
      return;
    }

    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "PASSWORD_RESET" },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(user.email, user.name || user.username, resetToken);

    res.json({
      success: true,
      data: { message: "If that email exists, a reset link has been sent" },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Token and password are required" },
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be at least 8 characters",
        },
      });
      return;
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !record ||
      record.type !== "PASSWORD_RESET" ||
      record.expiresAt < new Date() ||
      !record.userId
    ) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
      });
      return;
    }

    const userId = record.userId;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({ where: { token } });

    // Log the user out of all existing sessions for security
    await prisma.refreshToken.deleteMany({ where: { userId } });

    res.json({ success: true, data: { message: "Password reset successfully" } });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};