import rateLimit from "express-rate-limit";

// Strict limiter for auth endpoints that are common brute-force targets.
// 10 attempts per 15 minutes per IP is generous enough for a real user
// who mistypes their password a few times, but blocks automated attacks.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many attempts. Please try again in 15 minutes.",
    },
  },
});

// Looser limiter for general API usage — protects against runaway scripts
// or scraping without affecting normal usage patterns.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please slow down.",
    },
  },
});

// Very strict limiter specifically for password-reset and email-verification
// requests, since these trigger outbound emails (cost money / can be abused
// to spam someone's inbox).
export const emailActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many email requests. Please try again in an hour.",
    },
  },
});
