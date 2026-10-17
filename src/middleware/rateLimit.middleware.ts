import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

interface RateRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateRecord>();

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipMap.entries()) {
    if (now > record.resetTime) {
      ipMap.delete(ip);
    }
  }
}, 300000).unref();

export function rateLimiter(
  windowMs = config.RATE_LIMIT_WINDOW_MS,
  maxRequests = config.RATE_LIMIT_MAX
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip rate limiting in test environment
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const record = ipMap.get(ip);

    if (!record || now > record.resetTime) {
      ipMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests. Please try again later.",
          retryAfterMs: record.resetTime - now,
        },
      });
      return;
    }

    record.count++;
    next();
  };
}
