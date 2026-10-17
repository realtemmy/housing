import { Request, Response, NextFunction } from "express";
import maintenanceService from "../services/maintenance.service";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

// Create a new maintenance request
export const createMaintenanceRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newRequest = await maintenanceService.createMaintenanceRequest(
      req.body
    );
    res.status(201).json({
      status: "success",
      data: {
        maintenanceRequest: newRequest,
      },
    });
  }
);

// Get all maintenance requests with filtering
export const getAllMaintenanceRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requests = await maintenanceService.getAllMaintenanceRequests(
      req.query
    );
    res.status(200).json({
      status: "success",
      results: requests.length,
      data: {
        maintenanceRequests: requests,
      },
    });
  }
);

// Get a specific maintenance request by ID
export const getMaintenanceRequestById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const request = await maintenanceService.getMaintenanceRequestById(
      req.params.id
    );
    if (!request) {
      return next(new AppError("Maintenance request not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        maintenanceRequest: request,
      },
    });
  }
);

// Update a maintenance request
export const updateMaintenanceRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedRequest = await maintenanceService.updateMaintenanceRequest(
      req.params.id,
      req.body
    );
    if (!updatedRequest) {
      return next(new AppError("Maintenance request not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        maintenanceRequest: updatedRequest,
      },
    });
  }
);

// Delete a maintenance request
export const deleteMaintenanceRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await maintenanceService.deleteMaintenanceRequest(
      req.params.id
    );
    if (!deleted) {
      return next(new AppError("Maintenance request not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// Get maintenance history for a request
export const getMaintenanceHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const history = await maintenanceService.getMaintenanceHistory(
      req.params.id
    );
    res.status(200).json({
      status: "success",
      data: {
        maintenanceHistory: history,
      },
    });
  }
);

// Add history entry to a maintenance request
export const addMaintenanceHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const history = await maintenanceService.addMaintenanceHistory(
      req.params.id,
      req.body
    );
    res.status(201).json({
      status: "success",
      data: {
        maintenanceHistory: history,
      },
    });
  }
);
