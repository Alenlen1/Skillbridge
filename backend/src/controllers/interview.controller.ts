import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateStructuredResponse } from "../services/gemini.service";
import {
  extractTextFromBuffer,
  SUPPORTED_MIME_TYPES,
} from "../services/resume-parser.service";
import {
  buildInterviewQuestionsPrompt,
  GenerateQuestionsResult,
  GeneratedQuestion,
  buildAnswerFeedbackPrompt,
  GradeAnswerResult,
  buildSessionSummaryPrompt,
  SessionSummaryResult,
} from "../prompts/interview.prompt";

// POST /api/v1/interview/start
export const startSession = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { targetRole, jobDescription, questions } = req.body as {
      targetRole?: string;
      jobDescription?: string;
      questions?: Array<{ question: string; type: string; tip?: string }>;
    };
    const file = req.file;

    if (
      !targetRole ||
      typeof targetRole !== "string" ||
      targetRole.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Target role is required.",
        },
      });
      return;
    }
    if (targetRole.trim().length > 100) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Target role must be under 100 characters.",
        },
      });
      return;
    }

    let resumeText: string | null = null;
    if (file) {
      if (
        !SUPPORTED_MIME_TYPES.includes(
          file.mimetype as (typeof SUPPORTED_MIME_TYPES)[number],
        )
      ) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid file type. Please upload a PDF or DOCX file.",
          },
        });
        return;
      }
      resumeText = await extractTextFromBuffer(file.buffer, file.mimetype);
    }

    // If the caller already has questions (e.g. from Interview Prep),
    // reuse them and skip the extra Gemini call.
    let questionsToUse: GeneratedQuestion[];
    const hasValidPreGeneratedQuestions =
      Array.isArray(questions) &&
      questions.length > 0 &&
      questions.every(
        (q) =>
          q && typeof q.question === "string" && typeof q.type === "string",
      );

    if (hasValidPreGeneratedQuestions) {
      questionsToUse = questions!.map((q) => ({
        question: q.question,
        type: q.type as GeneratedQuestion["type"],
        tip: q.tip ?? "",
      }));
    } else {
      const prompt = buildInterviewQuestionsPrompt({
        targetRole: targetRole.trim(),
        jobDescription: jobDescription?.trim() || null,
        resumeText,
      });
      const result =
        await generateStructuredResponse<GenerateQuestionsResult>(prompt);
      questionsToUse = result.questions;
    }

    const session = await prisma.interviewSession.create({
      data: {
        userId: req.user!.id,
        targetRole: targetRole.trim(),
        jobDescription: jobDescription?.trim() || null,
        resumeText,
        status: "in_progress",
        questions: {
          create: questionsToUse.map((q, index) => ({
            question: q.question,
            type: q.type,
            tip: q.tip,
            order: index,
          })),
        },
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error("Start interview session error:", error);
    if (error instanceof SyntaxError) {
      res.status(502).json({
        success: false,
        error: {
          code: "AI_PARSE_ERROR",
          message: "The AI returned an unexpected response. Please try again.",
        },
      });
      return;
    }
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: { code: "PARSE_ERROR", message: error.message },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while starting your interview session",
      },
    });
  }
};

// POST /api/v1/interview/:sessionId/questions/:questionId/answer
export const submitAnswer = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;
    const questionId = req.params.questionId as string;
    const { answer } = req.body as { answer?: string };

    if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "An answer is required." },
      });
      return;
    }

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: req.user!.id },
    });
    if (!session) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Interview session not found." },
      });
      return;
    }

    const attempt = await prisma.interviewQuestionAttempt.findFirst({
      where: { id: questionId, sessionId },
    });
    if (!attempt) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Question not found." },
      });
      return;
    }

    const prompt = buildAnswerFeedbackPrompt({
      targetRole: session.targetRole,
      question: attempt.question,
      questionType: attempt.type,
      answer: answer.trim(),
    });
    const result = await generateStructuredResponse<GradeAnswerResult>(prompt);

    const updated = await prisma.interviewQuestionAttempt.update({
      where: { id: attempt.id },
      data: {
        userAnswer: answer.trim(),
        feedback: result.feedback,
        score: result.score,
        strengths: result.strengths,
        improvements: result.improvements,
        answeredAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Submit answer error:", error);
    if (error instanceof SyntaxError) {
      res.status(502).json({
        success: false,
        error: {
          code: "AI_PARSE_ERROR",
          message: "The AI returned an unexpected response. Please try again.",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while grading your answer",
      },
    });
  }
};

// POST /api/v1/interview/:sessionId/complete
export const completeSession = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: req.user!.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!session) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Interview session not found." },
      });
      return;
    }

    const prompt = buildSessionSummaryPrompt({
      targetRole: session.targetRole,
      attempts: session.questions.map((q) => ({
        question: q.question,
        type: q.type,
        answer: q.userAnswer,
        score: q.score,
      })),
    });
    const result =
      await generateStructuredResponse<SessionSummaryResult>(prompt);

    const updated = await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: "completed",
        overallScore: result.overallScore,
        overallFeedback: result.overallFeedback,
        strengths: result.strengths,
        improvements: result.improvements,
        completedAt: new Date(),
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Complete interview session error:", error);
    if (error instanceof SyntaxError) {
      res.status(502).json({
        success: false,
        error: {
          code: "AI_PARSE_ERROR",
          message: "The AI returned an unexpected response. Please try again.",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while completing your session",
      },
    });
  }
};

// GET /api/v1/interview/history
export const getHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        targetRole: true,
        status: true,
        overallScore: true,
        createdAt: true,
        completedAt: true,
        _count: { select: { questions: true } },
      },
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error("Get interview history error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while fetching your interview history",
      },
    });
  }
};

// GET /api/v1/interview/:sessionId
export const getSessionDetail = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: req.user!.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!session) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Interview session not found." },
      });
      return;
    }

    res.json({ success: true, data: session });
  } catch (error) {
    console.error("Get interview session detail error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while fetching your session",
      },
    });
  }
};

// DELETE /api/v1/interview/:sessionId
export const deleteSession = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: req.user!.id },
    });
    if (!session) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Interview session not found." },
      });
      return;
    }

    // InterviewQuestionAttempt rows are removed automatically via
    // onDelete: Cascade defined in the schema.
    await prisma.interviewSession.delete({ where: { id: session.id } });

    res.json({ success: true, data: { id: session.id } });
  } catch (error) {
    console.error("Delete interview session error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while deleting this session",
      },
    });
  }
};
