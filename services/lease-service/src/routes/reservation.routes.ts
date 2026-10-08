import { Router } from "express";
import {
  getAllReservations,
  getReservationById,
  getReservationsByReservor,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller";

const router = Router();

// General reservations endpoints
router.route("/").get(getAllReservations).post(createReservation);

// Reservation by ID
router.route("/:id").get(getReservationById).patch(updateReservation).delete(deleteReservation);

// Reservations by reservor
router.route("/reservor/:id").get(getReservationsByReservor);

export default router;