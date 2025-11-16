import { Router } from "express";
import { getAllUsers, getLoggedInUser } from "../controllers/userController";
import { login, signUp, authGoogle } from "../controllers/authController";
import { protect } from "../controllers/authController";

const router = Router();

router.post("/auth/login", login);
router.post("/auth/signup", signUp);

router.post("/auth/google", authGoogle)

router.get("/me", protect, getLoggedInUser);

router.route("/").get(getAllUsers);

export default router;
