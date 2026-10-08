"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservation = exports.updateReservation = exports.createReservation = exports.getReservationsByReservor = exports.getReservationById = exports.getAllReservations = void 0;
const reservation_service_1 = __importDefault(require("../services/reservation.service"));
const reservation_validators_1 = require("../validators/reservation.validators");
const getAllReservations = async (req, res, next) => {
    try {
        const { reservorId, status, type } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await reservation_service_1.default.getAllReservations({
            page,
            limit,
            reservorId: reservorId,
            status: status,
            reservationType: type,
        });
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllReservations = getAllReservations;
const getReservationById = async (req, res, next) => {
    try {
        const reservationId = req.params.id;
        const reservation = await reservation_service_1.default.getReservationById(reservationId);
        res.status(200).json({
            status: "success",
            data: reservation,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReservationById = getReservationById;
const getReservationsByReservor = async (req, res, next) => {
    try {
        const reservorId = req.params.id;
        const { status, type } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await reservation_service_1.default.getReservationsByReservor(reservorId, {
            page,
            limit,
            status: status,
            reservationType: type,
        });
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReservationsByReservor = getReservationsByReservor;
const createReservation = async (req, res, next) => {
    try {
        const validatedData = reservation_validators_1.reservationValidator.parse(req.body);
        const reservation = await reservation_service_1.default.createReservation(validatedData);
        res.status(201).json({
            status: "success",
            data: reservation,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createReservation = createReservation;
const updateReservation = async (req, res, next) => {
    try {
        const reservationId = req.params.id;
        const validatedData = reservation_validators_1.updateReservationValidator.parse(req.body);
        const reservation = await reservation_service_1.default.updateReservation(reservationId, validatedData);
        res.status(200).json({
            status: "success",
            data: reservation,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReservation = updateReservation;
const deleteReservation = async (req, res, next) => {
    try {
        const reservationId = req.params.id;
        await reservation_service_1.default.deleteReservation(reservationId);
        res.status(200).json({
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReservation = deleteReservation;
