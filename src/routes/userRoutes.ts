import { Router } from "express";
import { getAllUsers, getLoggedInUser } from "../controllers/userController";
import { protect } from "../controllers/authController";

const router = Router();

router.get("/me", protect, getLoggedInUser);

router.route("/").get(getAllUsers);

export default router;
