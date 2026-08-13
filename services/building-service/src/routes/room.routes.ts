import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.use(extractUser);

router.route("/").get(getAllRooms).post(createRoom);
router.route("/:id").get(getRoomById).patch(updateRoom).delete(deleteRoom);

export default router;
