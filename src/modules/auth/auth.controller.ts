import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.refreshToken(req.body.refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AuthService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.changePassword(
        req.user!.id,
        req.body.oldPassword,
        req.body.newPassword
      );
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  static async assignAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await AuthService.assignAgent(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Agent assigned successfully",
        data: assignment,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getManagedProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await AuthService.getManagedProperties(req.user!.id);
      res.status(200).json({
        success: true,
        data: properties,
      });
    } catch (err) {
      next(err);
    }
  }
}
