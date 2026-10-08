import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWT secret (should match the one in authController)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token is required",
    });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    // Attach user info to request object
    req.user = user;
    next();
  });
};

/**
 * Middleware to check user role
 */
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

export default { authenticateToken, authorizeRole };