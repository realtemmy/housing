import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().default("postgresql://postgres:password@localhost:5432/directkey?schema=public"),
  JWT_SECRET: z.string().min(16).default("directkey-super-secret-jwt-key-for-dev-and-testing-min-32-chars"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  PAYSTACK_SECRET_KEY: z.string().optional().default("sk_test_placeholder_key_here"),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default("pk_test_placeholder_key_here"),
  EMAIL_HOST: z.string().optional().default(""),
  EMAIL_PORT: z.coerce.number().optional().default(587),
  EMAIL_USER: z.string().optional().default(""),
  EMAIL_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().default("DirectKey <notifications@directkey.ng>"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(500),
});

export const config = envSchema.parse(process.env);
