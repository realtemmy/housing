import { Router } from "express";
import maintenanceController from "../controllers/maintenance.controller";

const router = Router();

// Maintenance request routes
router.post("/", maintenanceController.createMaintenanceRequest);
router.get("/", maintenanceController.getAllMaintenanceRequests);
router.get("/:id", maintenanceController.getMaintenanceRequestById);
router.patch("/:id", maintenanceController.updateMaintenanceRequest);
router.delete("/:id", maintenanceController.deleteMaintenanceRequest);

// Additional routes for maintenance history
router.get("/:id/history", maintenanceController.getMaintenanceHistory);
router.post("/:id/history", maintenanceController.addMaintenanceHistory);

export default router;
