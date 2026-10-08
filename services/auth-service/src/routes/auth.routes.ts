import { Router } from "express";
import { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, refreshToken, logoutUser, googleAuth, googleAuthCallback } from "../controllers/authController";

const router = Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;