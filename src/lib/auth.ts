import crypto from "node:crypto";
import util from "node:util";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UserRole } from "../generated/prisma/client";

const scryptAsync = util.promisify(crypto.scrypt);

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export class AuthUtil {
  /**
   * Hash a plaintext password asynchronously using native crypto.scrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  /**
   * Verify a plaintext password against a stored scrypt hash asynchronously
   */
  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }

  /**
   * Generate an Access JWT
   */
  static generateAccessToken(user: { id: string; email: string; role: UserRole }): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  /**
   * Generate a Refresh JWT
   */
  static generateRefreshToken(user: { id: string; email: string; role: UserRole }): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: "refresh",
      },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  }

  /**
   * Generate a secure random numeric OTP (e.g., 6 digits for handover verification)
   */
  static generateOtp(digits = 6): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }
}
