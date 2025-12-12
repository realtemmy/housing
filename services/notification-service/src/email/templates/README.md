# Email Templates

Modern, responsive email templates for authentication and user management flows.

## Email Class

The `Email` class is located in `../email.ts` and provides a simple interface for sending templated emails.

### Constructor

```typescript
new Email(to: string | string[], from?: IUser)
```

- `to`: Single email address or array of email addresses
- `from`: Optional sender information. If not provided, defaults to `"System <notification@hm-leases.com>"`

### Example

```typescript
import Email from '../email';

// Single recipient
const email = new Email('user@example.com');

// Multiple recipients
const email = new Email(['user1@example.com', 'user2@example.com']);

// Custom sender
const email = new Email('user@example.com', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});
```

### Configuration

The Email class uses Nodemailer and requires the following environment variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Available Templates

### 1. Welcome Email (`welcome.ts`)
Sent when a new user signs up for the platform.

**Features:**
- Gradient header with welcoming message
- Optional email verification link
- Quick start guide
- Professional branding

**Usage:**
```typescript
import Email from '../email';

const email = new Email('user@example.com');
await email.sendWelcomeEmail({
  firstName: 'John',
  email: 'user@example.com',
  verificationLink: 'https://yourdomain.com/verify?token=abc123' // optional
});
```

**Note:** The `verificationLink` parameter is optional. If not provided, the template will omit the verification section.

---

### 2. Email Verification (`verifyEmail.ts`)
Sent to verify a user's email address.

**Features:**
- Large verification code display (optional)
- Verification link button
- Security warnings
- 24-hour expiration notice

**Usage:**
```typescript
const email = new Email('user@example.com');
await email.sendVerificationEmail({
  firstName: 'John',
  verificationLink: 'https://yourdomain.com/verify?token=abc123',
  verificationCode: '123456' // optional, displayed prominently
});
```

---

### 3. Forgot Password (`forgotPassword.ts`)
Sent when a user requests to reset their password.

**Features:**
- Reset code display (optional)
- Password reset link
- Security tips
- Multiple security warnings

**Usage:**
```typescript
const email = new Email('user@example.com');
await email.sendForgotPasswordEmail({
  firstName: 'John',
  resetLink: 'https://yourdomain.com/reset-password?token=abc123',
  resetCode: '789456' // optional, 15-minute expiry
});
```

---

### 4. Password Reset Success (`resetPasswordSuccess.ts`)
Confirmation email sent after successful password reset.

**Features:**
- Success indicator
- Reset details (time, IP, device)
- Security tips
- Alert for unauthorized changes

**Usage:**
```typescript
const email = new Email('user@example.com');
await email.sendResetPasswordSuccessEmail({
  firstName: 'John',
  email: 'user@example.com',
  timestamp: new Date().toLocaleString(),
  ipAddress: '192.168.1.1', // optional
  deviceInfo: 'Chrome on Windows 10' // optional
});
```

---

### 5. Email Changed (`emailChanged.ts`)
Notification sent when user changes their email address.

**Features:**
- Shows old and new email
- Optional verification for new email
- Security alert
- Change timestamp

**Usage:**
```typescript
// Send to BOTH old and new email addresses
const emailOld = new Email('old@example.com');
const emailNew = new Email('new@example.com');

const data = {
  firstName: 'John',
  oldEmail: 'old@example.com',
  newEmail: 'new@example.com',
  timestamp: new Date().toLocaleString(),
  verificationLink: 'https://yourdomain.com/verify-new-email?token=abc123' // optional
};

await emailOld.sendEmailChangedNotification(data);
await emailNew.sendEmailChangedNotification(data);
```

---

### 6. Two-Factor Authentication (`twoFactorAuth.ts`)
Sends 2FA code for login verification.

**Features:**
- Large, readable code display
- Login attempt details (IP, device)
- Expiration timer
- Security warnings

**Usage:**
```typescript
const email = new Email('user@example.com');
await email.sendTwoFactorAuthCode({
  firstName: 'John',
  code: '123456',
  ipAddress: '192.168.1.1', // optional
  deviceInfo: 'Chrome on Windows 10', // optional
  expiresIn: 10 // minutes, optional (default: 10)
});
```

---

### 7. Account Locked (`accountLocked.ts`)
Notification when account is locked due to security reasons.

**Features:**
- Clear lock reason
- Unlock account button
- Common reasons list
- Support contact info

**Usage:**
```typescript
const email = new Email('user@example.com');
await email.sendAccountLockedNotification({
  firstName: 'John',
  email: 'user@example.com',
  reason: 'Multiple failed login attempts',
  unlockLink: 'https://yourdomain.com/unlock-account?token=abc123', // optional
  timestamp: new Date().toLocaleString(),
  ipAddress: '192.168.1.1' // optional
});
```

---

## Design Features

All templates include:

- **Responsive Design**: Works on all devices and email clients
- **Modern Gradients**: Unique color scheme for each template type
- **Security Focused**: Clear warnings and security tips
- **Professional Layout**: Clean, organized information hierarchy
- **Accessibility**: High contrast, readable fonts
- **Branded**: Consistent HM Leases branding
- **Call-to-Action Buttons**: Clear, prominent action buttons
- **Footer Information**: Copyright, security notices

## Color Schemes

- **Welcome**: Purple gradient (#667eea → #764ba2)
- **Verify Email**: Green-teal gradient (#11998e → #38ef7d)
- **Forgot Password**: Pink-red gradient (#f093fb → #f5576c)
- **Reset Success**: Green-cyan gradient (#43e97b → #38f9d7)
- **Email Changed**: Pink-yellow gradient (#fa709a → #fee140)
- **2FA Code**: Blue-cyan gradient (#4facfe → #00f2fe)
- **Account Locked**: Red gradient (#ff6b6b → #ee5a6f)

## Email Client Compatibility

Tested and optimized for:
- Gmail (Desktop & Mobile)
- Outlook (Desktop & Web)
- Apple Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

## Customization

To customize the templates:

1. **Change Branding**: Update "HM Leases" references
2. **Modify Colors**: Update gradient values in each template
3. **Add Logo**: Insert image in header section
4. **Adjust Layout**: Modify table structure
5. **Update Footer**: Change copyright and contact info

## Best Practices

1. **Always include firstName**: Personalization improves engagement
2. **Provide alternative links**: Include text links for button alternatives
3. **Set expiration times**: Clearly communicate when links/codes expire
4. **Include security details**: IP address and device info when relevant
5. **Send to multiple addresses**: For email changes, notify both addresses
6. **Test thoroughly**: Preview in multiple email clients

## Security Considerations

- Never include sensitive data in emails
- Always use HTTPS links
- Implement token expiration
- Rate limit email sending
- Log all email sends for audit trails
- Use secure SMTP configuration
- Consider adding email authentication (SPF, DKIM, DMARC)

## Example: Complete Flow

```typescript
import Email from '../email';

// 1. User signs up
const welcomeEmail = new Email('user@example.com');
await welcomeEmail.sendWelcomeEmail({
  firstName: 'John',
  email: 'user@example.com',
  verificationLink: 'https://yourdomain.com/verify?token=abc123'
});

// 2. Resend verification if needed
const verifyEmail = new Email('user@example.com');
await verifyEmail.sendVerificationEmail({
  firstName: 'John',
  verificationLink: 'https://yourdomain.com/verify?token=abc123',
  verificationCode: '123456'
});

// 3. User forgets password
const forgotEmail = new Email('user@example.com');
await forgotEmail.sendForgotPasswordEmail({
  firstName: 'John',
  resetLink: 'https://yourdomain.com/reset?token=xyz789',
  resetCode: '789456'
});

// 4. Password successfully reset
const successEmail = new Email('user@example.com');
await successEmail.sendResetPasswordSuccessEmail({
  firstName: 'John',
  email: 'user@example.com',
  timestamp: new Date().toLocaleString(),
  ipAddress: '192.168.1.1',
  deviceInfo: 'Chrome on Windows 10'
});

// 5. User enables 2FA and logs in
const twoFactorEmail = new Email('user@example.com');
await twoFactorEmail.sendTwoFactorAuthCode({
  firstName: 'John',
  code: '123456',
  ipAddress: '192.168.1.1',
  deviceInfo: 'Chrome on Windows 10',
  expiresIn: 10
});
```

## Support

For issues or questions about these templates, contact the development team or refer to the main documentation.
