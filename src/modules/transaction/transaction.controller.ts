import { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  // Applications
  static async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await TransactionService.createApplication(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        listingId: req.query.listingId as string,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };
      const result = await TransactionService.listApplications(req.user!.id, req.user!.role, filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await TransactionService.getApplicationById(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }

  static async reviewApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TransactionService.reviewApplication(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Application reviewed successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // Offers
  static async createOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await TransactionService.createOffer(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Offer sent to applicant",
        data: offer,
      });
    } catch (err) {
      next(err);
    }
  }

  static async respondOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TransactionService.respondOffer(
        req.params.offerId as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Offer ${req.body.status.toLowerCase()}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // Reservation Holds
  static async createReservationHold(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await TransactionService.createReservationHold(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Inventory successfully reserved with temporary hold",
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancelReservationHold(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TransactionService.cancelReservationHold(req.params.id as string, req.user!.id);
      res.status(200).json({
        success: true,
        message: "Reservation hold released",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await TransactionService.getReservation(req.params.id as string);
      res.status(200).json({
        success: true,
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }
}
