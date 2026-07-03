import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendInterviewReminderEmail } from "../services/email.service";

const STALE_ABANDON_DAYS = 7;
const REMINDER_INACTIVITY_DAYS = 7;
const REMINDER_COOLDOWN_DAYS = 7;

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// POST /api/v1/cron/cleanup-stale-sessions
// Marks interview sessions left "in_progress" for too long as "abandoned"
// so they stop cluttering the user's active history.
export const cleanupStaleSessions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cutoff = daysAgo(STALE_ABANDON_DAYS);

    const result = await prisma.interviewSession.updateMany({
      where: {
        status: "in_progress",
        createdAt: { lt: cutoff },
      },
      data: { status: "abandoned" },
    });

    res.json({
      success: true,
      data: { abandonedCount: result.count },
    });
  } catch (error) {
    console.error("Cleanup stale sessions error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while cleaning up stale sessions",
      },
    });
  }
};

// POST /api/v1/cron/interview-reminders
// Emails users who haven't started or completed an interview practice
// session recently, skipping anyone reminded within the cooldown window.
export const sendInterviewReminders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inactivityCutoff = daysAgo(REMINDER_INACTIVITY_DAYS);
    const cooldownCutoff = daysAgo(REMINDER_COOLDOWN_DAYS);

    const candidates = await prisma.user.findMany({
      where: {
        emailVerified: true,
        AND: [
          {
            OR: [
              { lastInterviewReminderAt: null },
              { lastInterviewReminderAt: { lt: cooldownCutoff } },
            ],
          },
          {
            interviewSessions: {
              none: { createdAt: { gte: inactivityCutoff } },
            },
          },
        ],
      },
      select: { id: true, email: true, name: true, username: true },
    });

    let sentCount = 0;
    for (const user of candidates) {
      try {
        await sendInterviewReminderEmail(
          user.email,
          user.name || user.username,
        );
        await prisma.user.update({
          where: { id: user.id },
          data: { lastInterviewReminderAt: new Date() },
        });
        sentCount++;
      } catch (emailError) {
        console.error(
          `Failed to send interview reminder to ${user.email}:`,
          emailError,
        );
      }
    }

    res.json({
      success: true,
      data: { candidateCount: candidates.length, sentCount },
    });
  } catch (error) {
    console.error("Send interview reminders error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while sending interview reminders",
      },
    });
  }
};
