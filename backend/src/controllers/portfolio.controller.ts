import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
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
    const {
      about,
      headline,
      location,
      website,
      phone,
      theme,
      accentColor,
      isPublic,
    } = req.body;

    const portfolio = await prisma.portfolio.update({
      where: { userId: req.user!.id },
      data: {
        ...(about !== undefined && { about }),
        ...(headline !== undefined && { headline }),
        ...(phone !== undefined && { phone }),
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
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        emailVerified: true,
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
            endorsements: {
              where: { status: "APPROVED" },
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                endorserName: true,
                endorserRole: true,
                message: true,
                createdAt: true,
                // endorserEmail intentionally omitted — never shown publicly
              },
            },
          },
        },
      },
    });

    if (!user || !user.portfolio || !user.emailVerified) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    const isOwnerViewing = req.user?.username === username;

    if (!user.portfolio.isPublic && !isOwnerViewing) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Portfolio not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
export const incrementPortfolioView = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const username = String(req.params.username);

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        portfolio: true,
      },
    });

    if (!user || !user.portfolio) {
      res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
      return;
    }

    // Don't count your own visit
    if (req.user?.username === username) {
      res.json({ success: true });
      return;
    }

    await prisma.portfolio.update({
      where: {
        id: user.portfolio.id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Increment portfolio view error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to increment portfolio view",
    });
  }
};
// POST /api/v1/portfolio/me/skills
export const addSkill = async (
  req: AuthRequest,
  res: Response,
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
  res: Response,
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
  res: Response,
): Promise<void> => {
  try {
    const { title, description, techStack, liveUrl, githubUrl, featured } =
      req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Project title is required",
        },
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
  res: Response,
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
  res: Response,
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
// POST /api/v1/portfolio/me/experience
export const addExperience = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate,
      current,
      description,
    } = req.body;

    if (!company || !role) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Company and role are required",
        },
      });
      return;
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: req.user!.id,
      },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Portfolio not found",
        },
      });
      return;
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        employmentType: employmentType || null,
        location: location || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: current ? null : endDate ? new Date(endDate) : null,
        current: current || false,
        description: description || null,
        portfolioId: portfolio.id,
      },
    });

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Add experience error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
};
// PUT /api/v1/portfolio/me/experience/:id
export const updateExperience = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const {
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate,
      current,
      description,
    } = req.body;

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: req.user!.id,
      },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Portfolio not found",
        },
      });
      return;
    }

    const experience = await prisma.experience.updateMany({
      where: {
        id,
        portfolioId: portfolio.id,
      },
      data: {
        ...(company !== undefined && { company }),
        ...(role !== undefined && { role }),
        ...(employmentType !== undefined && {
          employmentType,
        }),
        ...(location !== undefined && { location }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: current ? null : endDate ? new Date(endDate) : null,
        }),
        ...(current !== undefined && { current }),
        ...(description !== undefined && { description }),
      },
    });

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
};
// DELETE /api/v1/portfolio/me/education/:id
export const deleteEducation = async (
  req: AuthRequest,
  res: Response,
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
// DELETE /api/v1/portfolio/me/experience/:id
export const deleteExperience = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: req.user!.id,
      },
    });

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Portfolio not found",
        },
      });
      return;
    }

    await prisma.experience.deleteMany({
      where: {
        AND: [{ id }, { portfolioId: portfolio.id }],
      },
    });

    res.json({
      success: true,
      data: {
        message: "Experience deleted",
      },
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
};

// POST /api/v1/portfolio/me/social-links
export const addSocialLink = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Platform and URL are required",
        },
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

    const socialLink = await prisma.socialLink.create({
      data: { platform, url, portfolioId: portfolio.id },
    });

    res.status(201).json({ success: true, data: socialLink });
  } catch (error) {
    console.error("Add social link error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/portfolio/me/social-links/:id
export const deleteSocialLink = async (
  req: AuthRequest,
  res: Response,
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

    await prisma.socialLink.deleteMany({
      where: { AND: [{ id }, { portfolioId: portfolio.id }] },
    });

    res.json({ success: true, data: { message: "Social link deleted" } });
  } catch (error) {
    console.error("Delete social link error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// POST /api/v1/portfolio/:username/endorsements
// Public, unauthenticated — anyone visiting a portfolio can submit one
export const submitEndorsement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const username = req.params["username"] as string;
    const { endorserName, endorserRole, endorserEmail, message } = req.body;

    if (!endorserName?.trim() || !endorserEmail?.trim() || !message?.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, email, and message are required",
        },
      });
      return;
    }

    if (message.trim().length > 500) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Message must be 500 characters or less",
        },
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { portfolio: true },
    });

    if (!user || !user.portfolio || !user.portfolio.isPublic) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Portfolio not found" },
      });
      return;
    }

    const endorsement = await prisma.endorsement.create({
      data: {
        portfolioId: user.portfolio.id,
        endorserName: endorserName.trim(),
        endorserRole: (endorserRole || "").trim(),
        endorserEmail: endorserEmail.trim(),
        message: message.trim(),
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      data: {
        message: "Endorsement submitted — pending the owner's approval",
        id: endorsement.id,
      },
    });
  } catch (error) {
    console.error("Submit endorsement error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// GET /api/v1/portfolio/me/endorsements
// Owner-only — lists all endorsements (pending, approved, rejected)
export const getMyEndorsements = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
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

    const endorsements = await prisma.endorsement.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: { endorsements } });
  } catch (error) {
    console.error("Get endorsements error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// PATCH /api/v1/portfolio/me/endorsements/:id
// Owner-only — approve or reject a pending endorsement
export const updateEndorsementStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid status" },
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

    const result = await prisma.endorsement.updateMany({
      where: { id, portfolioId: portfolio.id },
      data: { status },
    });

    if (result.count === 0) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Endorsement not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: { message: `Endorsement ${status.toLowerCase()}` },
    });
  } catch (error) {
    console.error("Update endorsement status error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// DELETE /api/v1/portfolio/me/endorsements/:id
// Owner-only — permanently remove an endorsement
export const deleteEndorsement = async (
  req: AuthRequest,
  res: Response,
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

    await prisma.endorsement.deleteMany({
      where: { id, portfolioId: portfolio.id },
    });

    res.json({ success: true, data: { message: "Endorsement deleted" } });
  } catch (error) {
    console.error("Delete endorsement error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
export const browsePortfolios = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const search = (req.query.search as string)?.trim() || "";
    const skillsParam = (req.query.skills as string)?.trim() || "";
    const selectedSkills = skillsParam
      ? skillsParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const sort = (req.query.sort as string) || "recent";
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 20),
    );
    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      user: { emailVerified: true },
      // Every selected skill must be present (AND) — a portfolio has to
      // match ALL chosen chips, not just one of them
      AND: [
        ...selectedSkills.map((skill) => ({
          skills: {
            some: {
              name: { equals: skill, mode: "insensitive" as const },
            },
          },
        })),
        ...(search
          ? [
              {
                OR: [
                  {
                    user: {
                      emailVerified: true,
                      name: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                  {
                    headline: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    skills: {
                      some: {
                        name: {
                          contains: search,
                          mode: "insensitive" as const,
                        },
                      },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const orderBy =
      sort === "name"
        ? { user: { name: "asc" as const } }
        : sort === "skills"
          ? { skills: { _count: "desc" as const } }
          : { updatedAt: "desc" as const };

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        select: {
          headline: true,
          location: true,
          updatedAt: true,
          user: {
            select: { name: true, username: true, avatar: true },
          },
          skills: {
            select: { name: true },
            take: 6,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.portfolio.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        portfolios,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Browse portfolios error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};

// GET /api/v1/portfolio/explore/top-skills
// Returns the most common skill names among public portfolios, for filter chips
export const getTopSkills = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const skills = await prisma.skill.groupBy({
      by: ["name"],
      where: {
        portfolio: {
          isPublic: true,
          user: { emailVerified: true },
        },
      },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 10,
    });

    res.json({
      success: true,
      data: { skills: skills.map((s) => s.name) },
    });
  } catch (error) {
    console.error("Get top skills error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
