import { Router } from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// User routes (protected)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.put("/change-password", authenticateToken, changePassword);

export default router;