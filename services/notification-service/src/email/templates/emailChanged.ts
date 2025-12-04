export const emailChangedTemplate = (data: {
  firstName: string;
  oldEmail: string;
  newEmail: string;
  timestamp: string;
  verificationLink?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Address Changed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 50px 40px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 40px;">
                  📧
                </div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Email Address Changed</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Your email address for your HM Leases account has been successfully changed. This notification has been sent to both your old and new email addresses.
              </p>

              <div style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); border-left: 4px solid #fa709a; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  Change Details:
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px; width: 140px;">
                      Previous Email:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.oldEmail}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      New Email:
                    </td>
                    <td style="padding: 5px 0; color: #43e97b; font-size: 14px; font-weight: 600;">
                      ${data.newEmail}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666666; font-size: 14px;">
                      Changed On:
                    </td>
                    <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 500;">
                      ${data.timestamp}
                    </td>
                  </tr>
                </table>
              </div>

              ${
                data.verificationLink
                  ? `
              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Please verify your new email address by clicking the button below:
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${data.verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(250, 112, 154, 0.4);">
                      Verify New Email
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <div style="background-color: #fff3cd; border-left: 4px solid #ff6b6b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #c92a2a; font-size: 14px; font-weight: 600;">
                  🔒 Didn't make this change?
                </p>
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  If you didn't change your email address, someone may have unauthorized access to your account. Contact our support team immediately to secure your account.
                </p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  What happens next?
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>All future notifications will be sent to your new email address</li>
                  <li>You'll use your new email to sign in</li>
                  <li>Your account data and settings remain unchanged</li>
                  <li>This change is immediate and permanent</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                If you have any questions or concerns, please don't hesitate to contact our support team.
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
                This is an automated security notification sent to both email addresses.
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
