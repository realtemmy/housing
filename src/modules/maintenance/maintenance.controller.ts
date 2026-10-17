import { Request, Response, NextFunction } from "express";
import { MaintenanceService } from "./maintenance.service";

export class MaintenanceController {
  static async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await MaintenanceService.createRequest(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Maintenance request submitted",
        data: request,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        propertyId: req.query.propertyId as string,
        status: req.query.status as any,
        category: req.query.category as any,
        urgency: req.query.urgency as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };
      const result = await MaintenanceService.listRequests(req.user!.id, req.user!.role, filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await MaintenanceService.getRequestById(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MaintenanceService.updateStatus(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Maintenance status updated to ${req.body.status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await MaintenanceService.addComment(
        req.params.id as string,
        req.user!.id,
        req.user!.role,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Comment added",
        data: comment,
      });
    } catch (err) {
      next(err);
    }
  }
}
