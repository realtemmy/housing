import { Router } from "express";
import { deleteUser, getAllUsers, getLoggedInUser, getUserById } from "../controllers/userController";
import { protect } from "../controllers/authController";

const router = Router();

router.route("/").get(getAllUsers)

router.route("/me").get(protect, getLoggedInUser);

router.route("/:id").get(getUserById).delete(deleteUser);




export default router;