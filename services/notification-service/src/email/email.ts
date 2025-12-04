import nodemailer from "nodemailer";
import {
  welcomeTemplate,
  verifyEmailTemplate,
  forgotPasswordTemplate,
  resetPasswordSuccessTemplate,
  emailChangedTemplate,
  twoFactorAuthTemplate,
  accountLockedTemplate,
  type WelcomeData,
  type VerifyEmailData,
  type ForgotPasswordData,
  type ResetPasswordSuccessData,
  type EmailChangedData,
  type TwoFactorAuthData,
  type AccountLockedData,
} from "./templates";

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

  async sendEmailChangedNotification(data: EmailChangedData) {
    await this.send("Email Address Changed", emailChangedTemplate(data));
  }

  async sendTwoFactorAuthCode(data: TwoFactorAuthData) {
    await this.send(
      "Your Two-Factor Authentication Code",
      twoFactorAuthTemplate(data)
    );
  }

  async sendAccountLockedNotification(data: AccountLockedData) {
    await this.send("Account Locked - Action Required", accountLockedTemplate(data));
  }
}

export default Email;
