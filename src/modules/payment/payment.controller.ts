import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  static async setPaymentInstruction(req: Request, res: Response, next: NextFunction) {
    try {
      const instruction = await PaymentService.setPaymentInstruction(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Payment instructions configured",
        data: instruction,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPaymentInstructions(req: Request, res: Response, next: NextFunction) {
    try {
      const instructions = await PaymentService.getPaymentInstructions(
        req.params.tenancyId as string,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        data: instructions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createObligation(req: Request, res: Response, next: NextFunction) {
    try {
      const obligation = await PaymentService.createObligation(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Rent obligation added",
        data: obligation,
      });
    } catch (err) {
      next(err);
    }
  }

  static async reportPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.reportPayment(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Payment reported successfully and submitted for owner verification",
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await PaymentService.verifyPayment(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Payment status updated to ${req.body.status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async correctPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const corrected = await PaymentService.correctPayment(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Payment corrected successfully with audit trail",
        data: corrected,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTenancyLedger(req: Request, res: Response, next: NextFunction) {
    try {
      const ledger = await PaymentService.getTenancyLedger(
        req.params.tenancyId as string,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        data: ledger,
      });
    } catch (err) {
      next(err);
    }
  }
}
