import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateStructuredResponse } from "../services/gemini.service";
import {
  buildResumePrompt,
  ResumeReviewResult,
} from "../prompts/resume.prompt";
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

    const prompt = buildResumePrompt({
      template: templateLabel,
      resumeText,
    });

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
        error: {
          code: "PARSE_ERROR",
          message: error.message,
        },
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
