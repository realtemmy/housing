import { Request, Response, NextFunction } from "express";
import { AuthUtil } from "../lib/auth";
import { UnauthorizedError } from "../lib/errors";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Bearer token is required in Authorization header"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = AuthUtil.verifyToken(token);
    if (payload.type && payload.type !== "access") {
      return next(new UnauthorizedError("Invalid token type: access token required"));
    }
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err: any) {
    next(new UnauthorizedError(err.message || "Invalid or expired token"));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = AuthUtil.verifyToken(token);
    if (!payload.type || payload.type === "access") {
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
}
