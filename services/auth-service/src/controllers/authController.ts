import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { userValidator } from "../validator/userValidator";
import AppError from "../utils/appError";
import { User } from "../generated/prisma/client";
import kafkaService from "../kafka/kafka";

const client = new OAuth2Client();

const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new AppError("Invalid Google token", 401);
  }

  const { email, given_name, family_name, picture, sub } = payload;
  return {
    email,
    firstName: given_name,
    lastName: family_name,
    photo: picture,
    sub,
  };
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedUser = userValidator.parse(req.body);
    const { email, password, role, firstName, lastName, phone } = validatedUser;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createdUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        firstName,
        lastName,
        provider: "local",
        phone: phone ?? null,
      },
    });
    const accessToken = jwt.sign(
      { id: createdUser.id, iss: "auth-service-issuer" },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { id: createdUser.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // or "lax"
      maxAge: 24 * 60 * 60 * 1000,
    });

    await kafkaService.publishUserCreated({
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      role: createdUser.role,
    });
    res.status(201).json({
      status: "success",
      data: { createdUser, accessToken },
    });
  } catch (error) {
    next(error);
    console.error("Error: ", error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return next(new AppError("No user with email found.", 404));

  if (!user.passwordHash)
    return next(
      new AppError(
        "This account doesn't have a password. Please sign in with OAuth",
        400
      )
    );

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return next(new AppError("Incorrect password", 401));

  const accessToken = jwt.sign(
    { id: user.id, iss: "auth-service-issuer" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "1d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // or "lax"
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    data: { user, accessToken },
  });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return next(new AppError("Unauthorized", 406));

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: string;
    };
  } catch {
    return next(new AppError("Invalid refresh token", 401));
  }

  const accessToken = jwt.sign(
    { id: decoded.id, iss: "auth-service-issuer" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  res.status(200).json({
    status: "success",
    accessToken,
  });
};

export const protect = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    // Decode and verify token (Kong already validated, but verify for defense-in-depth)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
        id: string;
      };
    } catch (error) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    next(error);
  }
};

export const restrictTo =
  (...roles: ["ADMIN" | "USER"]) =>
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User | undefined;
      if (!user) return next(new AppError("Unauthorized", 401));

      if (!roles.includes(user.role)) {
        return next(
          new AppError(
            "Forbidden: you do not have permission to perform this action",
            403
          )
        );
      }

      next();
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  };

export const authGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token as string;
  const { email, photo, firstName, lastName, sub } = await verifyGoogleToken(
    token
  );
  const { role } = req.body;

  if (!email || !firstName || !lastName)
    return next(
      new AppError("Authentication with Google failed. No email provided.", 400)
    );

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ provider: "google", providerId: sub }, { email }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        photo: photo ?? null,
        email,
        role,
        provider: "google",
        providerId: sub,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        provider: "google",
        providerId: sub,
        email,
      },
    });
  }

  // Create tokens and response
  const accessToken = jwt.sign(
    { id: user.id, iss: "auth-service-issuer" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "1d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    data: { user, accessToken },
  });
};
