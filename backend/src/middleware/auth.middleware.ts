import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const queryToken = req.query["token"] as string | undefined;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (queryToken) {
    // Fallback for browser redirects (e.g. GitHub OAuth connect) that
    // can't set custom headers.
    token = queryToken;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "No token provided" },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      id: string;
      email: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
    });
  }
};
// Optional authentication — attaches req.user if a valid token is present,
// but never blocks the request if there isn't one. Used for public routes
// that want to know who's viewing without requiring login (e.g. portfolio
// view counts that should skip the owner's own visits).
export const optionalAuthenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        id: string;
        email: string;
        username: string;
      };
      req.user = decoded;
    } catch {
      // Invalid or expired token — just continue without req.user
    }
  }

  next();
};