import { Request, Response, NextFunction } from "express";

// Protects endpoints meant to be called only by scheduled jobs (e.g. the
// GitHub Actions cron workflow), not by regular logged-in users.
export const verifyCronSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers["x-cron-secret"];

  if (!secret) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "CRON_SECRET is not configured.",
      },
    });
    return;
  }

  if (provided !== secret) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid cron secret." },
    });
    return;
  }

  next();
};
