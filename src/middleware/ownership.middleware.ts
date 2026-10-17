import { Request, Response, NextFunction } from "express";
import { getPrismaClient } from "../lib/db";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../lib/errors";

/**
 * Checks if the authenticated user is an ADMIN, or the OWNER of the property,
 * or an AGENT assigned to manage the property.
 */
export async function verifyPropertyAccess(
  propertyId: string,
  userId: string,
  requiredPermission?: "canManageListings" | "canManageApplications" | "canManageMaintenance" | "canRecordPayments"
): Promise<boolean> {
  const prisma = await getPrismaClient();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      agentAssignments: {
        where: { agentId: userId, isActive: true },
      },
    },
  });

  if (!property) {
    throw new NotFoundError("Property", propertyId);
  }

  // Owner check
  if (property.ownerId === userId) {
    return true;
  }

  // Agent check
  const assignment = property.agentAssignments[0];
  if (assignment) {
    if (requiredPermission && !assignment[requiredPermission]) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Middleware enforcing that the caller can manage the property referenced in req.params.propertyId or req.body.propertyId
 */
export function requirePropertyManager(
  permission?: "canManageListings" | "canManageApplications" | "canManageMaintenance" | "canRecordPayments"
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError());
      }

      const propertyId = req.params.propertyId || req.body.propertyId || req.params.id;
      if (!propertyId) {
        return next(new ForbiddenError("Property ID required for authorization"));
      }

      const hasAccess = await verifyPropertyAccess(propertyId, req.user.id, permission);
      if (!hasAccess) {
        return next(new ForbiddenError("You are not authorized to manage this property"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
