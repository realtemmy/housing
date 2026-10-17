import { Request, Response, NextFunction } from "express";
import { VerificationService } from "./verification.service";

export class VerificationController {
  static async submitCase(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VerificationService.submitCase(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Verification case submitted successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listCases(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as any;
      const result = await VerificationService.listCases({ status, page, limit });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VerificationService.getCaseById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async reviewCase(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await VerificationService.reviewCase(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Case status updated to ${req.body.status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Suspicious Reports ---
  static async reportSuspiciousListing(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await VerificationService.reportSuspiciousListing({
        listingId: req.body.listingId,
        reporterId: req.user?.id,
        reason: req.body.reason,
        details: req.body.details,
      });
      res.status(201).json({
        success: true,
        message: "Suspicious listing report submitted",
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listSuspiciousReports(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await VerificationService.listSuspiciousReports(page, limit);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async reviewSuspiciousReport(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VerificationService.reviewSuspiciousReport(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Suspicious report reviewed",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
