import { getPrismaClient } from "../../lib/db";
import { AuthUtil } from "../../lib/auth";
import { ConflictError, NotFoundError, UnauthorizedError, ForbiddenError } from "../../lib/errors";
import { UserRole } from "../../generated/prisma/client";

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role?: UserRole;
  }) {
    const prisma = await getPrismaClient();

    const existingEmail = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existingEmail) {
      throw new ConflictError("A user with this email already exists");
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) {
      throw new ConflictError("A user with this phone number already exists");
    }

    const passwordHash = await AuthUtil.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || UserRole.TENANT,
        status: "ACTIVE",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const accessToken = AuthUtil.generateAccessToken(user);
    const refreshToken = AuthUtil.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  static async login(data: { email: string; password: string }) {
    const prisma = await getPrismaClient();

    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.status === "SUSPENDED") {
      throw new ForbiddenError("Your account has been suspended. Please contact DirectKey support.");
    }

    const isMatch = await AuthUtil.verifyPassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
    };

    const accessToken = AuthUtil.generateAccessToken(safeUser);
    const refreshToken = AuthUtil.generateRefreshToken(safeUser);

    return { user: safeUser, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    const prisma = await getPrismaClient();

    let payload;
    try {
      payload = AuthUtil.verifyToken(token);
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    if (payload.type && payload.type !== "refresh") {
      throw new UnauthorizedError("Invalid token type: refresh token required");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status === "SUSPENDED") {
      throw new UnauthorizedError("User session is no longer active");
    }

    const newAccessToken = AuthUtil.generateAccessToken(user);
    const newRefreshToken = AuthUtil.generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async getProfile(userId: string) {
    const prisma = await getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User", userId);
    }

    return user;
  }

  static async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string }) {
    const prisma = await getPrismaClient();

    if (data.phone) {
      const existing = await prisma.user.findFirst({
        where: { phone: data.phone, id: { not: userId } },
      });
      if (existing) {
        throw new ConflictError("Phone number is already in use by another user");
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
      },
    });

    return updated;
  }

  static async changePassword(userId: string, oldPass: string, newPass: string) {
    const prisma = await getPrismaClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User", userId);

    const isMatch = await AuthUtil.verifyPassword(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Current password does not match");
    }

    const newHash = await AuthUtil.hashPassword(newPass);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: "Password updated successfully" };
  }

  static async assignAgent(landlordId: string, data: {
    propertyId: string;
    agentEmail: string;
    canManageListings: boolean;
    canManageApplications: boolean;
    canManageMaintenance: boolean;
    canRecordPayments: boolean;
  }) {
    const prisma = await getPrismaClient();

    // Verify property belongs to landlord
    const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!property) throw new NotFoundError("Property", data.propertyId);
    if (property.ownerId !== landlordId) {
      throw new ForbiddenError("You can only assign agents to properties you own");
    }

    const agent = await prisma.user.findUnique({ where: { email: data.agentEmail.toLowerCase() } });
    if (!agent) {
      throw new NotFoundError(`Agent with email '${data.agentEmail}' not found`);
    }

    if (agent.role !== UserRole.AGENT && agent.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Specified user does not have the AGENT role");
    }

    const assignment = await prisma.agentAssignment.upsert({
      where: {
        propertyId_agentId: {
          propertyId: data.propertyId,
          agentId: agent.id,
        },
      },
      update: {
        canManageListings: data.canManageListings,
        canManageApplications: data.canManageApplications,
        canManageMaintenance: data.canManageMaintenance,
        canRecordPayments: data.canRecordPayments,
        isActive: true,
      },
      create: {
        propertyId: data.propertyId,
        agentId: agent.id,
        assignedById: landlordId,
        canManageListings: data.canManageListings,
        canManageApplications: data.canManageApplications,
        canManageMaintenance: data.canManageMaintenance,
        canRecordPayments: data.canRecordPayments,
        isActive: true,
      },
      include: {
        agent: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        property: {
          select: { id: true, title: true, area: true },
        },
      },
    });

    return assignment;
  }

  static async getManagedProperties(agentId: string) {
    const prisma = await getPrismaClient();
    const assignments = await prisma.agentAssignment.findMany({
      where: { agentId, isActive: true },
      include: {
        property: {
          include: {
            units: true,
            owner: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
      },
    });
    return assignments.map(a => ({
      assignmentId: a.id,
      permissions: {
        canManageListings: a.canManageListings,
        canManageApplications: a.canManageApplications,
        canManageMaintenance: a.canManageMaintenance,
        canRecordPayments: a.canRecordPayments,
      },
      property: a.property,
    }));
  }
}
