import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { encrypt, decrypt } from "../lib/crypto.service";
import jwt from "jsonwebtoken";

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

interface GithubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

const generateAccessToken = (user: {
  id: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
};

const generateRefreshToken = (user: {
  id: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

// GET /api/v1/github/connect
// - Unauthenticated: state = "login" (social login / register)
export const connectGithub = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const state = req.user?.id || "login";

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "read:user user:email repo",
    state,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

// GET /api/v1/github/callback
// Shared callback for both social login and repo-connect flows.
// Reads "state" to decide which path to take.
export const githubCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.query["code"] as string | undefined;
    const state = req.query["state"] as string | undefined;

    if (!code) {
      res.redirect(`${FRONTEND_URL}/login?github=error`);
      return;
    }

    // Exchange code for GitHub access token
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

    const githubAccessToken = tokenRes.data.access_token as string | undefined;

    if (!githubAccessToken) {
      res.redirect(`${FRONTEND_URL}/login?github=error`);
      return;
    }

   const profileRes = await axios.get<GithubProfile>(
     "https://api.github.com/user",
     { headers: { Authorization: `Bearer ${githubAccessToken}` } },
   );

   const profile = profileRes.data;

   // If GitHub didn't return a public email, fetch from the emails endpoint
   let githubEmail = profile.email;
   if (!githubEmail) {
     const emailsRes = await axios.get<
       { email: string; primary: boolean; verified: boolean }[]
     >("https://api.github.com/user/emails", {
       headers: { Authorization: `Bearer ${githubAccessToken}` },
     });
     const primary = emailsRes.data.find((e) => e.primary && e.verified);
     githubEmail = primary?.email || null;
   }
    const githubId = String(profile.id);
    const encryptedToken = encrypt(githubAccessToken);

    // ── PATH A: Connect repos to an existing logged-in account ──────────
    if (state && state !== "login") {
      await prisma.user.update({
        where: { id: state },
        data: { githubId, githubToken: encryptedToken },
      });
      res.redirect(`${FRONTEND_URL}/portfolio?github=connected`);
      return;
    }

    // ── PATH B: Social login / register ─────────────────────────────────

    // Try to find an existing account linked to this GitHub id
    let user = await prisma.user.findUnique({ where: { githubId } });

    if (!user) {
      // Try to find an existing account with the same email (account linking)
      if (githubEmail) {
        user = await prisma.user.findUnique({ where: { email: githubEmail } });
      }

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { githubId, githubToken: encryptedToken },
        });
      } else {
        let username = profile.login.toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const taken = await prisma.user.findUnique({ where: { username } });
        if (taken) {
          username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
        }

        const email =
          githubEmail || `${githubId}@github.skillbridge.placeholder`;

        user = await prisma.user.create({
          data: {
            email,
            username,
            name: profile.name || profile.login,
            avatar: profile.avatar_url,
            githubId,
            githubToken: encryptedToken,
            emailVerified: true,
            portfolio: { create: {} },
          },
        });
      }
    } else {
      // Existing GitHub-linked user — refresh the token in case it changed
      await prisma.user.update({
        where: { id: user.id },
        data: { githubToken: encryptedToken },
      });
    }

    // Issue SkillBridge tokens and log the user in
    const payload = { id: user.id, email: user.email, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to a frontend page that reads the token from the URL and
    // stores it in the auth store. We pass it as a query param since we
    // can't set localStorage from a server-side redirect.
    res.redirect(`${FRONTEND_URL}/auth/github-callback?token=${accessToken}`);
  } catch (error) {
    console.error("GitHub callback error:", error);
    res.redirect(`${FRONTEND_URL}/login?github=error`);
  }
};

// GET /api/v1/github/repos
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
        headers: { Authorization: `Bearer ${decrypt(user.githubToken)}` },
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
