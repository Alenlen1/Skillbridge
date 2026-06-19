import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAnalytics = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [portfolio, totalEvents, recentEvents, applications] =
      await Promise.all([
        prisma.portfolio.findUnique({
          where: { userId },
          select: { views: true },
        }),
        prisma.analyticsEvent.count({
          where: { userId },
        }),
        prisma.analyticsEvent.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.application.findMany({
          where: { userId },
          select: { status: true },
        }),
      ]);

    // Count applications by status
    const applicationStats: Record<string, number> = {};
    for (const app of applications) {
      applicationStats[app.status] = (applicationStats[app.status] || 0) + 1;
    }

    res.json({
      success: true,
      data: {
        portfolioViews: portfolio?.views || 0,
        totalEvents,
        recentEvents,
        applicationStats,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
