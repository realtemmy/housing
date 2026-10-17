import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, NotificationController.listUserNotifications);
router.patch("/:id/read", requireAuth, NotificationController.markAsRead);
router.post("/read-all", requireAuth, NotificationController.markAllAsRead);

export const notificationRoutes = router;
