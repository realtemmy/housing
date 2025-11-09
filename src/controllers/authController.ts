import { Request, Response, NextFunction } from "express";
import { prisma } from "../client/prisma";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userValidator } from "../validators/userValidator";
import AppError from "../utils/appError";
import { User } from "../generated/schema";

export const signUp = async (req: Request, res: Response) => {
  const validatedUser = userValidator.parse(req.body);
  const { email, password, role, firstName, lastName, username } =
    validatedUser;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role,
      password: hashedPassword,
      username,
    },
  });
  res.status(201).json({
    status: "success",
    data: createdUser,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return next(new AppError("No user with email found.", 404));

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) return next(new AppError("Incorrect password", 401));

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
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
  const refreshToken = req.cookies?.jwt;
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
    { id: decoded.id },
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
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError("Unauthorized", 401));

  const token = authHeader.split(" ")[1];
  if (!token) return next(new AppError("No token provided", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
  } catch {
    return next(new AppError("Invalid or expired token. Login again.", 401));
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) return next(new AppError("User no longer exists", 401));

  req.user = user;
  next();
};

export const restrictTo =
  (...roles: string[]) =>
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;
    if (!user) return next(new AppError("Unauthorized", 401));

    if (!roles.includes(user.role)) {
      return next(
        new AppError("Forbidden: you do not have permission to perform this action", 403)
      );
    }

    next();
  };
