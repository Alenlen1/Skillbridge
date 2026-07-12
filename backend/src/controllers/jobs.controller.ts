import { Request, Response } from "express";

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

// Simple in-memory cache so repeated identical searches (very common —
// lots of users searching "developer" or "intern") don't burn through
// Jooble's free-tier rate limits unnecessarily. Not persisted across
// server restarts, and only works within a single instance — fine at
// this scale, would need something like Redis if that changes.
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCacheKey(query: string, location: string, page: number): string {
  return `${query.toLowerCase().trim()}|${location.toLowerCase().trim()}|${page}`;
}

function getFromCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Periodic sweep so expired entries don't just sit in memory forever
// if nobody happens to re-search that exact term again
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}, CACHE_TTL_MS);

// Keywords that indicate a job is actually IT/tech-related — used to
// filter out unrelated noise (Server, Bartender, Host/Hostess, etc.)
// that sometimes comes back even for tech-ish searches.
const IT_KEYWORDS = [
  "developer",
  "engineer",
  "programmer",
  "software",
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "full stack",
  "full-stack",
  "web dev",
  "mobile dev",
  "ios",
  "android",
  "devops",
  "sysadmin",
  "system administrator",
  "network",
  "it support",
  "it specialist",
  "help desk",
  "database",
  "data analyst",
  "data scientist",
  "data engineer",
  "qa engineer",
  "quality assurance",
  "tester",
  "cybersecurity",
  "security engineer",
  "cloud engineer",
  "ui/ux",
  "ux designer",
  "ui designer",
  "product designer",
  "technical support",
  "computer science",
  "java",
  "python",
  "javascript",
  "react",
  "node",
  ".net",
  "php",
  "sql",
  "information technology",
  "technical writer",
  "network administrator",
  "systems analyst",
];

function isItRelated(title: string): boolean {
  const lower = title.toLowerCase();
  const hasStandaloneIT = /\bit\b/.test(lower);
  return (
    hasStandaloneIT || IT_KEYWORDS.some((keyword) => lower.includes(keyword))
  );
}

interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  tags: string[];
  url: string;
  postedAt: string | null;
  source: "Jooble";
}

interface JoobleJob {
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
}

async function searchJooble(
  query: string,
  location: string,
): Promise<NormalizedJob[]> {
  if (!JOOBLE_API_KEY) return [];

  try {
    const res = await fetch(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: query, location }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `Jooble request failed: ${res.status} ${res.statusText} — ${body}`,
      );
      return [];
    }

    const json = (await res.json()) as { jobs: JoobleJob[] };
    return (json.jobs || []).map((job, i) => ({
      id: `jooble-${i}-${job.link}`,
      title: job.title,
      company: job.company || "Not specified",
      location: job.location || "Not specified",
      remote: /remote/i.test(job.location) || /remote/i.test(job.title),
      tags: job.type ? [job.type] : [],
      url: job.link,
      postedAt: job.updated || null,
      source: "Jooble" as const,
    }));
  } catch (error) {
    console.error("Jooble search error:", error);
    return [];
  }
}

// GET /api/v1/jobs/search?q=react&location=manila&page=1
export const searchJobs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = ((req.query.q as string) || "").trim();
    const location = ((req.query.location as string) || "").trim();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    if (!JOOBLE_API_KEY) {
      res.status(500).json({
        success: false,
        error: {
          code: "NOT_CONFIGURED",
          message:
            "Job search isn't configured yet. Set JOOBLE_API_KEY in your backend .env",
        },
      });
      return;
    }

    const cacheKey = getCacheKey(query, location, page);
    const cached = getFromCache(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const jooble = await searchJooble(query, location);
    const jobs = jooble.filter((job) => isItRelated(job.title));
    const responseData = { jobs };

    setCache(cacheKey, responseData);

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Job search error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
};
