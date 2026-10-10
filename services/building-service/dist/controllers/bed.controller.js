"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreBed = exports.deleteBed = exports.updateBed = exports.createBed = exports.getBedById = exports.getAllBeds = void 0;
const bed_service_1 = __importDefault(require("../services/bed.service"));
const bed_validator_1 = require("../validators/bed.validator");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllBeds = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const { roomId, propertyId, status } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit, 10)
            : 20;
        const result = await bed_service_1.default.getAllBeds(ownerId, {
            page,
            limit,
            roomId: roomId,
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
exports.getAllBeds = getAllBeds;
const getBedById = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const bedId = req.params.id;
        const bed = await bed_service_1.default.getBedById(bedId, ownerId);
        res.status(200).json({
            status: "success",
            data: bed,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBedById = getBedById;
const createBed = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const validatedData = bed_validator_1.bedValidator.parse(req.body);
        const createdBed = await bed_service_1.default.createBed(ownerId, validatedData);
        res.status(201).json({
            status: "success",
            data: createdBed,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBed = createBed;
const updateBed = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const bedId = req.params.id;
        const validatedData = bed_validator_1.updateBedValidator.parse(req.body);
        const updatedBed = await bed_service_1.default.updateBed(bedId, ownerId, validatedData);
        res.status(200).json({
            status: "success",
            data: updatedBed,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBed = updateBed;
const deleteBed = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const bedId = req.params.id;
        await bed_service_1.default.softDeleteBed(bedId, ownerId);
        res.status(200).json({
            status: "success",
            message: "Bed deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBed = deleteBed;
const restoreBed = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const bedId = req.params.id;
        const bed = await bed_service_1.default.restoreBed(bedId, ownerId);
        res.status(200).json({
            status: "success",
            data: bed,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreBed = restoreBed;
