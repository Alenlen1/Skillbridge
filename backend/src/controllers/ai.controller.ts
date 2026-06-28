import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateStructuredResponse } from "../services/gemini.service";
import {
  buildResumePrompt,
  ResumeReviewResult,
} from "../prompts/resume.prompt";
import {
  buildPortfolioPrompt,
  PortfolioReviewResult,
} from "../prompts/portfolio.prompt";
import {
  buildSkillGapPrompt,
  SkillGapResult,
} from "../prompts/skillGap.prompt";
import {
  extractTextFromBuffer,
  SUPPORTED_MIME_TYPES,
} from "../services/resume-parser.service";

const VALID_TEMPLATES = ["ats", "student", "developer"] as const;
type ValidTemplate = (typeof VALID_TEMPLATES)[number];

// POST /api/v1/ai/resume-review
export const reviewResume = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { template } = req.body as { template?: string };
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            "A resume file is required. Please upload a PDF or DOCX file.",
        },
      });
      return;
    }

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

    const normalizedTemplate = (
      template || "ats"
    ).toLowerCase() as ValidTemplate;
    if (!VALID_TEMPLATES.includes(normalizedTemplate)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Invalid template. Must be one of: ${VALID_TEMPLATES.join(", ")}`,
        },
      });
      return;
    }

    const resumeText = await extractTextFromBuffer(file.buffer, file.mimetype);

    if (resumeText.length < 100) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            "The extracted resume content is too short. Make sure your file contains readable text.",
        },
      });
      return;
    }

    const templateLabel =
      normalizedTemplate.charAt(0).toUpperCase() + normalizedTemplate.slice(1);

    const prompt = buildResumePrompt({ template: templateLabel, resumeText });
    const result = await generateStructuredResponse<ResumeReviewResult>(prompt);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Resume review error:", error);

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
        message: "Something went wrong while reviewing your resume",
      },
    });
  }
};

// POST /api/v1/ai/portfolio-review
export const reviewPortfolio = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
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
        error: {
          code: "NOT_FOUND",
          message: "Portfolio not found. Please set up your portfolio first.",
        },
      });
      return;
    }

    const hasMinimalContent =
      portfolio.skills.length > 0 ||
      portfolio.projects.length > 0 ||
      portfolio.experience.length > 0 ||
      portfolio.about;

    if (!hasMinimalContent) {
      res.status(400).json({
        success: false,
        error: {
          code: "INSUFFICIENT_CONTENT",
          message:
            "Your portfolio doesn't have enough content to review yet. Add some skills, projects, or experience first.",
        },
      });
      return;
    }

    const prompt = buildPortfolioPrompt({
      name: user?.name ?? null,
      headline: portfolio.headline,
      about: portfolio.about,
      location: portfolio.location,
      website: portfolio.website,
      skills: portfolio.skills,
      experience: portfolio.experience,
      education: portfolio.education,
      projects: portfolio.projects,
      socialLinks: portfolio.socialLinks,
    });

    const result =
      await generateStructuredResponse<PortfolioReviewResult>(prompt);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Portfolio review error:", error);

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
        message: "Something went wrong while reviewing your portfolio",
      },
    });
  }
};

// POST /api/v1/ai/skill-gap
export const analyzeSkillGap = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { targetRole, jobDescription } = req.body as {
      targetRole?: string;
      jobDescription?: string;
    };

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

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
      include: { skills: true },
    });

    const currentSkills = portfolio?.skills ?? [];

    const prompt = buildSkillGapPrompt({
      targetRole: targetRole.trim(),
      jobDescription: jobDescription?.trim() || null,
      currentSkills,
    });

    const result = await generateStructuredResponse<SkillGapResult>(prompt);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Skill gap analysis error:", error);

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
        message: "Something went wrong during skill gap analysis",
      },
    });
  }
};
