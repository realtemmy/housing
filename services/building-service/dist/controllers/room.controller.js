"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreRoom = exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoomById = exports.getAllRooms = void 0;
const room_service_1 = __importDefault(require("../services/room.service"));
const room_validator_1 = require("../validators/room.validator");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllRooms = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const { unitId, propertyId, status } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await room_service_1.default.getAllRooms(ownerId, {
            page,
            limit,
            unitId: unitId,
            propertyId: propertyId,
            status: status,
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
exports.getAllRooms = getAllRooms;
const getRoomById = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const roomId = req.params.id;
        const room = await room_service_1.default.getRoomById(roomId, ownerId);
        res.status(200).json({
            status: "success",
            data: room,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRoomById = getRoomById;
const createRoom = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const validatedData = room_validator_1.roomValidator.parse(req.body);
        const room = await room_service_1.default.createRoom(ownerId, validatedData);
        res.status(201).json({
            status: "success",
            data: room,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoom = createRoom;
const updateRoom = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const roomId = req.params.id;
        const validatedData = room_validator_1.updateRoomValidator.parse(req.body);
        const updatedRoom = await room_service_1.default.updateRoom(roomId, ownerId, validatedData);
        res.status(200).json({
            status: "success",
            data: updatedRoom,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const roomId = req.params.id;
        await room_service_1.default.softDeleteRoom(roomId, ownerId);
        res.status(200).json({
            status: "success",
            message: "Room deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRoom = deleteRoom;
const restoreRoom = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const roomId = req.params.id;
        const room = await room_service_1.default.restoreRoom(roomId, ownerId);
        res.status(200).json({
            status: "success",
            data: room,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreRoom = restoreRoom;
