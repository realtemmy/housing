import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../email/email";

// Validation schemas
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

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-super-secret-refresh-key-change-in-production";

// Email verification token expiry (24 hours)
const EMAIL_VERIFICATION_TOKEN_EXPIRY = "24h";
// Password reset token expiry (1 hour)
const PASSWORD_RESET_TOKEN_EXPIRY = "1h";
// Refresh token expiry (7 days)
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        verificationToken,
        verificationTokenExpiresAt,
        isEmailVerified: false,
        role: "USER", // Default role
        status: false, // Inactive until email verified
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

    // Return success response
    res.status(201).json({
      status: "success",
      message: "User registered successfully. Please check your email to verify your account.",
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
 * Login user
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        status: "error",
        message: "Please verify your email before logging in",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" } // Short-lived access token
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Update user's last login (optional)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return tokens
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
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
 * Verify email with token
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification token",
      });
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        status: true, // Activate account
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password - send reset email
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "If your email is registered, you will receive a password reset link",
      });
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

    res.status(200).json({
      status: "success",
      message: "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token",
      });
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

    res.status(200).json({
      status: "success",
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    } catch (err) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired refresh token",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
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

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a more secure implementation, we would add the token to a blacklist
    // For simplicity, we'll just return success (client should discard tokens)
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth initiation
 */
export const googleAuth = (req: Request, res: Response) => {
  // This would typically redirect to Google's OAuth consent screen
  // For now, we'll return a placeholder
  res.status(200).json({
    status: "info",
    message: "Google OAuth endpoint - redirect to Google consent screen",
  });
};

/**
 * Google OAuth callback
 */
export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would handle the callback from Google OAuth
    // For now, we'll return a placeholder
    res.status(200).json({
      status: "info",
      message: "Google OAuth callback - process Google response and create/link user",
    });
  } catch (error) {
    next(error);
  }
};