import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";

export class NotificationController {
  static async listUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const unreadOnly = req.query.unread === "true";
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await NotificationService.listUserNotifications(req.user!.id, {
        unreadOnly,
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

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await NotificationService.markAsRead(
        req.params.id as string,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.markAllAsRead(req.user!.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}
