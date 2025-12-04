export const welcomeTemplate = (data: {
  firstName: string;
  email: string;
  verificationLink?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HM Leases</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Welcome to HM Leases!</h1>
              <p style="margin: 15px 0 0 0; color: #e6e6ff; font-size: 16px;">We're excited to have you on board</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Thank you for signing up! Your account has been created successfully. We're thrilled to help you manage your leases and properties with ease.
              </p>

              ${
                data.verificationLink
                  ? `
              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                To get started, please verify your email address by clicking the button below:
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${data.verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px 0; color: #667eea; font-size: 14px; word-break: break-all;">
                ${data.verificationLink}
              </p>
              `
                  : ""
              }

              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                  What's next?
                </p>
                <ul style="margin: 10px 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>Complete your profile</li>
                  <li>Add your first property</li>
                  <li>Explore lease management features</li>
                  <li>Set up notifications</li>
                </ul>
              </div>

              <p style="margin: 0 0 10px 0; color: #555555; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to reach out to our support team.
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
                You received this email because you signed up for HM Leases.
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
