"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = require("../controllers/reservation.controller");
const router = (0, express_1.Router)();
// General reservations endpoints
router.route("/").get(reservation_controller_1.getAllReservations).post(reservation_controller_1.createReservation);
// Reservation by ID
router.route("/:id").get(reservation_controller_1.getReservationById).patch(reservation_controller_1.updateReservation).delete(reservation_controller_1.deleteReservation);
// Reservations by reservor
router.route("/reservor/:id").get(reservation_controller_1.getReservationsByReservor);
exports.default = router;
