export const twoFactorAuthTemplate = (data: {
  firstName: string;
  code: string;
  ipAddress?: string;
  deviceInfo?: string;
  expiresIn?: number; // in minutes
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 50px 40px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 40px;">
                  🔑
                </div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Verification Code</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Here's your two-factor authentication code to complete your sign-in:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 3px solid #4facfe; border-radius: 16px; padding: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);">
                  <span style="font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #4facfe; font-family: 'Courier New', monospace;">
                    ${data.code}
                  </span>
                </div>
                <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px;">
                  This code expires in ${data.expiresIn || 10} minutes
                </p>
              </div>

              ${
                data.ipAddress || data.deviceInfo
                  ? `
              <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #4facfe;">
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 14px; font-weight: 600;">
                  Sign-in attempt details:
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                  ${
                    data.ipAddress
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 13px; width: 100px;">
                      IP Address:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 13px; font-weight: 500;">
                      ${data.ipAddress}
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    data.deviceInfo
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 13px;">
                      Device:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 13px; font-weight: 500;">
                      ${data.deviceInfo}
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>
              `
                  : ""
              }

              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: 600;">
                  🛡️ Security Tips:
                </p>
                <ul style="margin: 5px 0 0 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                  <li>Never share this code with anyone</li>
                  <li>HM Leases will never ask for this code</li>
                  <li>If you didn't attempt to sign in, ignore this email</li>
                </ul>
              </div>

              <div style="background-color: #ffe5e5; border-left: 4px solid #ff6b6b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #c92a2a; font-size: 14px; font-weight: 600;">
                  ⚠️ Didn't try to sign in?
                </p>
                <p style="margin: 0; color: #c92a2a; font-size: 13px; line-height: 1.6;">
                  If you didn't attempt to sign in, someone may be trying to access your account. Consider changing your password immediately and enabling additional security measures.
                </p>
              </div>

              <p style="margin: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                Need help? Contact our support team.
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
                This is an automated security code. Do not reply to this email.
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
