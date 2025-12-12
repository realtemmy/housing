// Export all email templates
export { welcomeTemplate } from "./welcome";
export { verifyEmailTemplate } from "./verifyEmail";
export { forgotPasswordTemplate } from "./forgotPassword";
export { resetPasswordSuccessTemplate } from "./resetPasswordSuccess";
export { emailChangedTemplate } from "./emailChanged";
export { twoFactorAuthTemplate } from "./twoFactorAuth";
export { accountLockedTemplate } from "./accountLocked";

// Template types for type safety
export interface WelcomeData {
  firstName: string;
  email: string;
  verificationLink?: string;
}

export interface VerifyEmailData {
  firstName: string;
  verificationLink: string;
  verificationCode?: string;
}

export interface ForgotPasswordData {
  firstName: string;
  resetLink: string;
}

export interface ResetPasswordSuccessData {
  firstName: string;
  email: string;
  timestamp: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface EmailChangedData {
  firstName: string;
  oldEmail: string;
  newEmail: string;
  timestamp: string;
  verificationLink?: string;
}

export interface TwoFactorAuthData {
  firstName: string;
  code: string;
  ipAddress?: string;
  deviceInfo?: string;
  expiresIn?: number;
}

export interface AccountLockedData {
  firstName: string;
  email: string;
  reason: string;
  unlockLink?: string;
  timestamp: string;
  ipAddress?: string;
}
