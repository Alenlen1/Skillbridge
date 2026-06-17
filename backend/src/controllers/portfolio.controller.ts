import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/v1/portfolio/me
export const getMyPortfolio = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
      include: {
        skills: true,
        education: true,
        experience: true,
        projects: true,
        socialLinks: true,
      },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// PUT /api/v1/portfolio/me
export const updateMyPortfolio = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { about, location, website, theme, accentColor, isPublic } = req.body;

    const portfolio = await prisma.portfolio.update({
      where: { userId: req.user!.id },
      data: {
        ...(about !== undefined && { about }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(theme !== undefined && { theme }),
        ...(accentColor !== undefined && { accentColor }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Update portfolio error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
export const getPublicPortfolio = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const username = req.params["username"] as string;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        username: true,
        avatar: true,
        bio: true,
        portfolio: {
          include: {
            skills: true,
            education: true,
            experience: true,
            projects: { orderBy: { order: "asc" } },
            socialLinks: true,
          },
        },
      },
    });

    if (!user || !user.portfolio || !user.portfolio.isPublic) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};