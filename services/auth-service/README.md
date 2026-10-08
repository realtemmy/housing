# Auth Service

This service handles user authentication and management for the DirectKey platform.

## Features

- User registration with email verification
- Login with JWT access/refresh tokens
- Email verification
- Password reset functionality
- User profile management
- Role-based access control
- Google OAuth (placeholder)
- Session management

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback

### User Routes (protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

## Environment Variables

See `.env.example` for required environment variables.

## Database Schema

The User model includes:
- Basic profile information (name, email, etc.)
- Security fields (password hash, verification tokens)
- Role and status management
- OAuth fields for social login
- Consent tracking (terms acceptance)
- Timestamps for audit trail

## Implementation Notes

1. Passwords are hashed using bcrypt with salt rounds of 12
2. JWT access tokens expire in 15 minutes
3. JWT refresh tokens expire in 7 days
4. Email verification tokens expire in 24 hours
5. Password reset tokens expire in 1 hour
6. Route protection is implemented via JWT middleware
7. Role-based access control is available for fine-grained permissions

## Error Handling

The service uses a centralized error handling format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

Success responses follow this format:
```json
{
  "status": "success",
  "message": "Success description",
  "data": {} // Optional data payload
}
```