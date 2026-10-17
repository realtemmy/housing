import { Request, Response, NextFunction } from "express";
import { IssueService } from "./issue.service";

export class IssueController {
  static async createIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueService.createIssue(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Tenant dispute/issue reported",
        data: issue,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listIssues(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        propertyId: req.query.propertyId as string,
        status: req.query.status as any,
        category: req.query.category as any,
        priority: req.query.priority as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };
      const result = await IssueService.listIssues(req.user!.id, req.user!.role, filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getIssueById(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueService.getIssueById(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: issue,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await IssueService.updateIssue(
        req.params.id as string,
        req.user!.id,
        req.user!.role,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Issue updated to ${req.body.status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await IssueService.addComment(
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
