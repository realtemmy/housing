import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  static async getTenantDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getTenantDashboard(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOwnerDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getOwnerDashboard(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAdminDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminDashboard();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await DashboardService.listAuditLogs({
        actorId: req.query.actorId as string,
        entityType: req.query.entityType as string,
        action: req.query.action as string,
        page,
        limit,
      });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}
