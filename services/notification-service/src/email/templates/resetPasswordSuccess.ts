export const resetPasswordSuccessTemplate = (data: {
  firstName: string;
  email: string;
  timestamp: string;
  ipAddress?: string;
  deviceInfo?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 50px 40px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 40px;">
                  ✅
                </div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Password Reset Successful</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Your password has been successfully reset. You can now sign in to your HM Leases account using your new password.
              </p>

              <div style="background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border-left: 4px solid #43e97b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  Reset Details:
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px; width: 140px;">
                      Account:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.email}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      Time:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.timestamp}
                    </td>
                  </tr>
                  ${
                    data.ipAddress
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      IP Address:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
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
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      Device:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.deviceInfo}
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <div style="background-color: #fff3cd; border-left: 4px solid #ff6b6b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #c92a2a; font-size: 14px; font-weight: 600;">
                  🔒 Didn't make this change?
                </p>
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  If you didn't reset your password, your account may be compromised. Please contact our support team immediately and we'll help secure your account.
                </p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  🛡️ Security Tips:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>Use a strong, unique password</li>
                  <li>Enable two-factor authentication</li>
                  <li>Never share your password with anyone</li>
                  <li>Update your password regularly</li>
                  <li>Be cautious of phishing emails</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                If you have any questions or concerns, don't hesitate to reach out to our support team.
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
                This is an automated security notification.
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
