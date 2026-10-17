import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { MaintenanceRequest, MaintenanceHistory } from "../generated/prisma/client";

export class MaintenanceService {
  // Create a new maintenance request
  async createMaintenanceRequest(data: {
    tenantId: string;
    propertyId: string;
    unitId?: string;
    description: string;
    type: string;
    priority: string;
  }) {
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        description: data.description,
        type: data.type as any, // In a real implementation, we'd validate this
        priority: data.priority as any, // In a real implementation, we'd validate this
        status: "REQUESTED",
      },
    });
    return maintenanceRequest;
  }

  // Get all maintenance requests with optional filtering
  async getAllMaintenanceRequests(filters: any = {}) {
    const whereClause: any = {};

    if (filters.tenantId) {
      whereClause.tenantId = filters.tenantId;
    }
    if (filters.propertyId) {
      whereClause.propertyId = filters.propertyId;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.type) {
      whereClause.type = filters.type;
    }
    if (filters.priority) {
      whereClause.priority = filters.priority;
    }

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return maintenanceRequests;
  }

  // Get a specific maintenance request by ID
  async getMaintenanceRequestById(id: string) {
    const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
      where: { id },
    });

    if (!maintenanceRequest) {
      throw new AppError("Maintenance request not found", 404);
    }

    return maintenanceRequest;
  }

  // Update a maintenance request
  async updateMaintenanceRequest(id: string, data: any) {
    const maintenanceRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        ...(data.description && { description: data.description }),
        ...(data.type && { type: data.type }),
        ...(data.priority && { priority: data.priority }),
        ...(data.status && { status: data.status }),
        ...(data.scheduledFor && { scheduledFor: data.scheduledFor }),
        ...(data.completedAt && { completedAt: data.completedAt }),
        updatedAt: new Date(),
      },
    });

    return maintenanceRequest;
  }

  // Delete a maintenance request
  async deleteMaintenanceRequest(id: string) {
    const maintenanceRequest = await prisma.maintenanceRequest.delete({
      where: { id },
    });

    return maintenanceRequest !== null;
  }

  // Get maintenance history for a request
  async getMaintenanceHistory(requestId: string) {
    const history = await prisma.maintenanceHistory.findMany({
      where: { requestId },
      orderBy: { performedAt: "desc" },
    });

    return history;
  }

  // Add history entry to a maintenance request
  async addMaintenanceHistory(requestId: string, data: {
    action: string;
    performedBy: string;
    notes?: string;
  }) {
    const history = await prisma.maintenanceHistory.create({
      data: {
        requestId,
        action: data.action,
        performedBy: data.performedBy,
        notes: data.notes,
      },
    });

    return history;
  }
}

export default new MaintenanceService();
