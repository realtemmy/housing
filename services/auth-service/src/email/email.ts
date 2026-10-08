import nodemailer from "nodemailer";
import {
  welcomeTemplate,
  verifyEmailTemplate,
  forgotPasswordTemplate,
  resetPasswordSuccessTemplate,
  type WelcomeData,
  type VerifyEmailData,
  type ForgotPasswordData,
  type ResetPasswordSuccessData,
} from "./templates";

// Re-export the types for use in controllers
export type { WelcomeData, VerifyEmailData, ForgotPasswordData, ResetPasswordSuccessData };

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

class Email {
  from: string;
  to: string | string[];

  constructor(to: string | string[], from?: IUser) {
    this.from = from
      ? `${from.firstName} ${from.lastName} <${from.email}>`
      : "System <notification@hm-leases.com>";
    this.to = to;
  }

  transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST as string,
      port: +(process.env.EMAIL_PORT || 587),
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string, html: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.transporter().sendMail(mailOptions);
  }

  // Template-specific methods
  async sendWelcomeEmail(data: WelcomeData) {
    await this.send("Welcome to HM Leases!", welcomeTemplate(data));
  }

  async sendVerificationEmail(data: VerifyEmailData) {
    await this.send("Verify Your Email Address", verifyEmailTemplate(data));
  }

  async sendForgotPasswordEmail(data: ForgotPasswordData) {
    await this.send("Reset Your Password", forgotPasswordTemplate(data));
  }

  async sendResetPasswordSuccessEmail(data: ResetPasswordSuccessData) {
    await this.send(
      "Password Reset Successful",
      resetPasswordSuccessTemplate(data)
    );
  }
}

export default Email;

// Helper functions for auth service
export const sendVerificationEmail = async (email: string, data: VerifyEmailData) => {
  const emailService = new Email(email);
  await emailService.sendVerificationEmail(data);
};

export const sendPasswordResetEmail = async (email: string, data: ForgotPasswordData) => {
  const emailService = new Email(email);
  await emailService.sendForgotPasswordEmail(data);
};

export const sendWelcomeEmail = async (email: string, data: WelcomeData) => {
  const emailService = new Email(email);
  await emailService.sendWelcomeEmail(data);
};

export const sendResetPasswordSuccessEmail = async (email: string, data: ResetPasswordSuccessData) => {
  const emailService = new Email(email);
  await emailService.sendResetPasswordSuccessEmail(data);
};