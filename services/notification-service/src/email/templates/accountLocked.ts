export const accountLockedTemplate = (data: {
  firstName: string;
  email: string;
  reason: string;
  unlockLink?: string;
  timestamp: string;
  ipAddress?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Locked</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 50px 40px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 40px;">
                  🔒
                </div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Account Locked</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Your HM Leases account has been temporarily locked to protect your security.
              </p>

              <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%); border-left: 4px solid #ff6b6b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #c92a2a; font-size: 16px; font-weight: 600;">
                  Lock Details:
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px; width: 120px;">
                      Account:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.email}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      Reason:
                    </td>
                    <td style="padding: 5px 0; color: #c92a2a; font-size: 14px; font-weight: 600;">
                      ${data.reason}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      Locked On:
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
                </table>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  Common reasons for account locks:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>Multiple failed login attempts</li>
                  <li>Suspicious activity detected</li>
                  <li>Security policy violation</li>
                  <li>Account reported as compromised</li>
                </ul>
              </div>

              ${
                data.unlockLink
                  ? `
              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                To unlock your account, please click the button below and follow the verification steps:
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${data.unlockLink}" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);">
                      Unlock My Account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px 0; color: #ff6b6b; font-size: 14px; word-break: break-all;">
                ${data.unlockLink}
              </p>
              `
                  : `
              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Please contact our support team to unlock your account. They will help verify your identity and restore access safely.
              </p>
              `
              }

              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: 600;">
                  🛡️ Didn't recognize this activity?
                </p>
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  If you didn't trigger this lock, it means someone may have been trying to access your account. This is a security feature to protect you. After unlocking, we recommend changing your password.
                </p>
              </div>

              <div style="background-color: #e7f5ff; padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #4facfe;">
                <p style="margin: 0 0 10px 0; color: #1971c2; font-size: 16px; font-weight: 600;">
                  Need Help?
                </p>
                <p style="margin: 0; color: #1971c2; font-size: 14px; line-height: 1.6;">
                  If you're having trouble unlocking your account or believe this lock was made in error, please contact our support team. We're here to help 24/7.
                </p>
              </div>

              <p style="margin: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong>The HM Leases Security Team</strong>
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
