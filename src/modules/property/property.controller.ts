import { Request, Response, NextFunction } from "express";
import { PropertyService } from "./property.service";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";
import { ForbiddenError } from "../../lib/errors";

export class PropertyController {
  static async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await PropertyService.createProperty(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const isOwnerView = req.query.mine === "true";
      const result = await PropertyService.listProperties({
        userId: req.user?.id,
        ownerOnly: isOwnerView,
        area: req.query.area as string,
        city: req.query.city as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await PropertyService.getPropertyById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = req.params.id as string;
      const hasAccess = await verifyPropertyAccess(propertyId, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("You do not have permission to edit this property");

      const updated = await PropertyService.updateProperty(propertyId, req.body);
      res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = req.params.id as string;
      const hasAccess = await verifyPropertyAccess(propertyId, req.user!.id);
      if (!hasAccess) throw new ForbiddenError("You do not have permission to delete this property");

      const result = await PropertyService.deleteProperty(propertyId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  // Buildings
  static async createBuilding(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = req.params.propertyId as string;
      const hasAccess = await verifyPropertyAccess(propertyId, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");

      const building = await PropertyService.createBuilding(propertyId, req.body);
      res.status(201).json({ success: true, data: building });
    } catch (err) {
      next(err);
    }
  }

  static async updateBuilding(req: Request, res: Response, next: NextFunction) {
    try {
      const building = await PropertyService.updateBuilding(req.params.buildingId as string, req.body, req.user!.id);
      res.status(200).json({ success: true, data: building });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBuilding(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.deleteBuilding(req.params.buildingId as string, req.user!.id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Units
  static async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = req.params.propertyId as string;
      const hasAccess = await verifyPropertyAccess(propertyId, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");

      const unit = await PropertyService.createUnit(propertyId, req.body);
      res.status(201).json({ success: true, data: unit });
    } catch (err) {
      next(err);
    }
  }

  static async updateUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await PropertyService.updateUnit(req.params.unitId as string, req.body, req.user!.id);
      res.status(200).json({ success: true, data: unit });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.deleteUnit(req.params.unitId as string, req.user!.id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Rooms
  static async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, unitId } = req.params;
      const hasAccess = await verifyPropertyAccess(propertyId as string, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");

      const room = await PropertyService.createRoom(propertyId as string, unitId as string, req.body);
      res.status(201).json({ success: true, data: room });
    } catch (err) {
      next(err);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await PropertyService.updateRoom(req.params.roomId as string, req.body, req.user!.id);
      res.status(200).json({ success: true, data: room });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.deleteRoom(req.params.roomId as string, req.user!.id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Beds
  static async createBed(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, roomId } = req.params;
      const hasAccess = await verifyPropertyAccess(propertyId as string, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");

      const bed = await PropertyService.createBed(propertyId as string, roomId as string, req.body);
      res.status(201).json({ success: true, data: bed });
    } catch (err) {
      next(err);
    }
  }

  static async updateBed(req: Request, res: Response, next: NextFunction) {
    try {
      const bed = await PropertyService.updateBed(req.params.bedId as string, req.body, req.user!.id);
      res.status(200).json({ success: true, data: bed });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBed(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.deleteBed(req.params.bedId as string, req.user!.id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Media
  static async addMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = req.params.propertyId as string;
      const hasAccess = await verifyPropertyAccess(propertyId, req.user!.id, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");

      const media = await PropertyService.addMedia(propertyId, req.body);
      res.status(201).json({ success: true, data: media });
    } catch (err) {
      next(err);
    }
  }

  static async removeMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.removeMedia(req.params.mediaId as string, req.user!.id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Availability
  static async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, id } = req.params;
      const result = await PropertyService.checkAvailability(
        type.toUpperCase() as "UNIT" | "ROOM" | "BED",
        id as string
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
