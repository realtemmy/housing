import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, we would extract userId from JWT token
    // For now, we'll use a placeholder - this should be replaced with auth middleware
    const userId = req.headers["user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract userId from JWT token (placeholder)
    const userId = req.headers["user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Validate input
    const validatedData = updateProfileSchema.parse(req.body);

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract userId from JWT token (placeholder)
    const userId = req.headers["user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Validate input
    const validatedData = changePasswordSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.errors,
      });
    }
    next(error);
  }
};