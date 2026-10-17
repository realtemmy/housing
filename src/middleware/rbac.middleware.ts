import { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma/client";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden: Requires one of [${allowedRoles.join(", ")}]. Your role is '${req.user.role}'.`
        )
      );
    }

    next();
  };
}
