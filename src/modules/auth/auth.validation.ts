import { z } from "zod";
import { UserRole } from "../../generated/prisma/client";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum([UserRole.TENANT, UserRole.LANDLORD, UserRole.AGENT]).default(UserRole.TENANT),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const assignAgentSchema = z.object({
  propertyId: z.string().uuid(),
  agentEmail: z.string().email(),
  canManageListings: z.boolean().default(true),
  canManageApplications: z.boolean().default(true),
  canManageMaintenance: z.boolean().default(true),
  canRecordPayments: z.boolean().default(true),
});
