import { Router } from "express";
import { login, signUp, refresh, authGoogle } from "../controllers/authController";

const router =  Router();

router.post("/signup", signUp)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/google", authGoogle)


export default router;