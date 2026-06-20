import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL as string;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

// GET /api/v1/github/connect
// Redirects the logged-in user to GitHub's OAuth authorization page.
// We pass the userId in "state" so the callback knows who to attach the token to.
export const connectGithub = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "read:user repo",
    state: userId,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

// GET /api/v1/github/callback
// GitHub redirects here after the user approves. We exchange the code for an
// access token, fetch their GitHub profile, and save it to the User record.
export const githubCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.query["code"] as string | undefined;
    const userId = req.query["state"] as string | undefined;

    if (!code || !userId) {
      res.redirect(`${FRONTEND_URL}/portfolio?github=error`);
      return;
    }

    // Exchange the temporary code for an access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_CALLBACK_URL,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenRes.data.access_token as string | undefined;

    if (!accessToken) {
      res.redirect(`${FRONTEND_URL}/portfolio?github=error`);
      return;
    }

    // Fetch the GitHub user's profile so we can store their GitHub id
    const profileRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubId = String(profileRes.data.id);

    await prisma.user.update({
      where: { id: userId },
      data: {
        githubId,
        githubToken: accessToken,
      },
    });

    res.redirect(`${FRONTEND_URL}/portfolio?github=connected`);
  } catch (error) {
    console.error("GitHub callback error:", error);
    res.redirect(`${FRONTEND_URL}/portfolio?github=error`);
  }
};

// GET /api/v1/github/repos
// Returns the connected user's GitHub repos, sorted by most recently updated.
export const getRepos = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { githubToken: true },
    });

    if (!user?.githubToken) {
      res.status(400).json({
        success: false,
        error: {
          code: "NOT_CONNECTED",
          message: "GitHub account is not connected",
        },
      });
      return;
    }

    const reposRes = await axios.get<GithubRepo[]>(
      "https://api.github.com/user/repos",
      {
        headers: { Authorization: `Bearer ${user.githubToken}` },
        params: { sort: "updated", per_page: 30 },
      },
    );

    const repos = reposRes.data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      }));

    res.json({ success: true, data: repos });
  } catch (error) {
    console.error("Get repos error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch GitHub repos" },
    });
  }
};

// POST /api/v1/github/import
// Imports a selected GitHub repo as a Project in the user's portfolio.
export const importRepo = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, url, language } = req.body;

    if (!name || !url) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Repo name and url are required",
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

    // Prevent importing the same repo twice
    const existing = await prisma.project.findFirst({
      where: { portfolioId: portfolio.id, githubUrl: url },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: "ALREADY_IMPORTED",
          message: "This repo has already been imported",
        },
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title: name,
        description: description || null,
        techStack: language ? [language] : [],
        githubUrl: url,
        isGithub: true,
        portfolioId: portfolio.id,
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Import repo error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
