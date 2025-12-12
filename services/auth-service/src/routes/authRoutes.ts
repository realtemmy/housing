import { Router } from "express";
import { login, signUp, refresh, authGoogle, forgotPassword, resetPassword } from "../controllers/authController";

const router =  Router();

router.post("/signup", signUp)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/google", authGoogle)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)


export default router;