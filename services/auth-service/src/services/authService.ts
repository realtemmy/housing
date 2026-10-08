import { prisma } from "../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../email/email";

// Validation schemas (same as in controllers for consistency)
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-super-secret-refresh-key-change-in-production";

// Token expiries
const EMAIL_VERIFICATION_TOKEN_EXPIRY = "24h";
const PASSWORD_RESET_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * Auth service class
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async registerUser(data: z.infer<typeof registerSchema>) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationToken,
        verificationTokenExpiresAt,
        isEmailVerified: false,
        role: "USER",
        status: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, {
        firstName: user.firstName,
        verificationLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${verificationToken}`,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails
    }

    return {
      user,
      message: "User registered successfully. Please check your email to verify your account.",
    };
  }

  /**
   * Login user
   */
  static async loginUser(data: z.infer<typeof loginSchema>) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before logging in");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Update user's last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      message: "Login successful",
    };
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string) {
    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerized: true,
        status: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return {
      message: "Email verified successfully. You can now log in.",
    };
  }

  /**
   * Forgot password - send reset email
   */
  static async forgotPassword(email: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        message: "If your email is registered, you will receive a password reset link",
      };
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, {
        firstName: user.firstName,
        resetLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Still return success to prevent email enumeration
    }

    return {
      message: "If your email is registered, you will receive a password reset link",
    };
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, password: string) {
    // Validate password
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return {
      message: "Password reset successful. You can now log in with your new password.",
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate new refresh token (rotation)
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully",
    };
  }

  /**
   * Logout user
   */
  static async logoutUser() {
    // In a more secure implementation, we would add the token to a blacklist
    // For simplicity, we'll just return success (client should discard tokens)
    return {
      message: "Logged out successfully",
    };
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string) {
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
      throw new Error("User not found");
    }

    return {
      user,
    };
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
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

    return {
      user,
      message: "Profile updated successfully",
    };
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, data: z.infer<typeof changePasswordSchema>) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      message: "Password changed successfully",
    };
  }
}

// Update profile schema (reusing from controller)
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

// Change password schema (reusing from controller)
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export default AuthService;