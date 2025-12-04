export const verifyEmailTemplate = (data: {
  firstName: string;
  verificationLink: string;
  verificationCode?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 50px 40px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 40px;">
                  ✉️
                </div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Thanks for signing up! To complete your registration and access all features, please verify your email address.
              </p>

              ${
                data.verificationCode
                  ? `
              <div style="text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 15px 0; color: #555555; font-size: 16px;">
                  Your verification code is:
                </p>
                <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%); border: 2px dashed #11998e; border-radius: 12px; padding: 25px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #11998e; font-family: 'Courier New', monospace;">
                    ${data.verificationCode}
                  </span>
                </div>
                <p style="margin: 15px 0 0 0; color: #888888; font-size: 14px;">
                  This code expires in 10 minutes
                </p>
              </div>

              <p style="margin: 30px 0 20px 0; color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
                Or click the button below:
              </p>
              `
                  : ""
              }

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${data.verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security tip:</strong> If you didn't create an account with us, please ignore this email or contact our support team.
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; color: #11998e; font-size: 14px; word-break: break-all;">
                ${data.verificationLink}
              </p>

              <p style="margin: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong>The HM Leases Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px;">
                © ${new Date().getFullYear()} HM Leases. All rights reserved.
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px;">
                This verification link expires in 24 hours.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
