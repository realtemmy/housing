import { Request, Response, NextFunction } from "express";
import { HandoverService } from "./handover.service";

export class HandoverController {
  static async createHandover(req: Request, res: Response, next: NextFunction) {
    try {
      const handover = await HandoverService.createHandover(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Handover inspection scheduled with release OTP",
        data: handover,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await HandoverService.updateChecklist(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Checklist updated",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHandover(req: Request, res: Response, next: NextFunction) {
    try {
      const handover = await HandoverService.getHandover(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: handover,
      });
    } catch (err) {
      next(err);
    }
  }

  static async confirmLandlord(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await HandoverService.confirmLandlord(
        req.params.id as string,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        message: "Landlord inspection confirmed",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async completeWithOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await HandoverService.completeWithOtp(
        req.params.id as string,
        req.user!.id,
        req.body.otp
      );
      res.status(200).json({
        success: true,
        message: "Physical handover successfully verified via OTP release. Tenancy is now ACTIVE.",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
