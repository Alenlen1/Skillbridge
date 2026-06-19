import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

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

    // Check if user exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user + portfolio in one transaction
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        portfolio: { create: {} },
      },
    });

    const payload = { id: user.id, email: user.email, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token
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

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
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
      select: { id: true, email: true, username: true, name: true },
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
