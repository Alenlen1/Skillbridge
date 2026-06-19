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
    const { about, headline, location, website, theme, accentColor, isPublic } = req.body;

    const portfolio = await prisma.portfolio.update({
      where: { userId: req.user!.id },
      data: {
        ...(about !== undefined && { about }),
        ...(headline !== undefined && { headline }),
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
        certificates: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
        },
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
// POST /api/v1/portfolio/me/skills
export const addSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, level, category } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Skill name is required" },
      });
      return;
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level: level || null,
        category: category || null,
        portfolioId: portfolio.id,
      },
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/portfolio/me/skills/:id
export const deleteSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    await prisma.skill.deleteMany({
      where: { id, portfolioId: portfolio.id },
    });

    res.json({ success: true, data: { message: "Skill deleted" } });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
// POST /api/v1/portfolio/me/projects
export const addProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, techStack, liveUrl, githubUrl, featured } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Project title is required" },
      });
      return;
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        techStack: techStack || [],
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        featured: featured || false,
        portfolioId: portfolio.id,
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/portfolio/me/projects/:id
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    await prisma.project.deleteMany({
      where: {
        AND: [{ id }, { portfolioId: portfolio.id }],
      },
    });

    res.json({ success: true, data: { message: "Project deleted" } });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
// POST /api/v1/portfolio/me/education
export const addEducation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { school, degree, field, startYear, endYear, current } = req.body;

    if (!school) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "School name is required" },
      });
      return;
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    const education = await prisma.education.create({
      data: {
        school,
        degree: degree || null,
        field: field || null,
        startYear: startYear ? parseInt(startYear) : null,
        endYear: endYear ? parseInt(endYear) : null,
        current: current || false,
        portfolioId: portfolio.id,
      },
    });

    res.status(201).json({ success: true, data: education });
  } catch (error) {
    console.error("Add education error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/portfolio/me/education/:id
export const deleteEducation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user!.id },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    await prisma.education.deleteMany({
      where: {
        AND: [{ id }, { portfolioId: portfolio.id }],
      },
    });

    res.json({ success: true, data: { message: "Education deleted" } });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};