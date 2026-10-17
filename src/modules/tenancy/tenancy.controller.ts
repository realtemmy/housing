import { Request, Response, NextFunction } from "express";
import { TenancyService } from "./tenancy.service";

export class TenancyController {
  static async createTenancy(req: Request, res: Response, next: NextFunction) {
    try {
      const tenancy = await TenancyService.createTenancy(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Tenancy created successfully with initial obligations",
        data: tenancy,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listTenancies(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        propertyId: req.query.propertyId as string,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };
      const result = await TenancyService.listTenancies(req.user!.id, req.user!.role, filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTenancyById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenancy = await TenancyService.getTenancyById(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: tenancy,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateTenancy(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TenancyService.updateTenancy(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Tenancy updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // Occupants
  static async addOccupant(req: Request, res: Response, next: NextFunction) {
    try {
      const occupant = await TenancyService.addOccupant(
        req.params.tenancyId as string,
        req.user!.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Occupant added",
        data: occupant,
      });
    } catch (err) {
      next(err);
    }
  }

  static async removeOccupant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TenancyService.removeOccupant(
        req.params.tenancyId as string,
        req.params.occupantId as string,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  // Digital Agreements
  static async createAgreement(req: Request, res: Response, next: NextFunction) {
    try {
      const agreement = await TenancyService.createAgreement(
        req.params.tenancyId as string,
        req.user!.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Digital agreement created and pending signatures",
        data: agreement,
      });
    } catch (err) {
      next(err);
    }
  }

  static async signAgreementTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TenancyService.signAgreementTenant(
        req.params.agreementId as string,
        req.user!.id,
        req.ip
      );
      res.status(200).json({
        success: true,
        message: "Digital agreement signed by tenant",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async signAgreementLandlord(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TenancyService.signAgreementLandlord(
        req.params.agreementId as string,
        req.user!.id,
        req.ip
      );
      res.status(200).json({
        success: true,
        message: "Digital agreement signed by landlord/agent",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}
