"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreUnit = exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.unitAvailable = exports.getUnit = exports.getAllUnits = void 0;
const unit_service_1 = __importDefault(require("../services/unit.service"));
const unit_validators_1 = require("../validators/unit.validators");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllUnits = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const { propertyId, buildingId, status } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await unit_service_1.default.getAllUnits(ownerId, {
            page,
            limit,
            propertyId: propertyId,
            buildingId: buildingId,
            status: status,
            includeDeleted: req.query.includeDeleted === "true",
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
exports.getAllUnits = getAllUnits;
const getUnit = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const unitId = req.params.id;
        const unit = await unit_service_1.default.getUnitById(unitId, ownerId);
        res.status(200).json({
            status: "success",
            data: unit,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUnit = getUnit;
const unitAvailable = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        const unitId = req.params.id;
        const result = await unit_service_1.default.checkUnitAvailability(unitId, ownerId);
        res.status(200).json({
            status: "success",
            available: result.available,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.unitAvailable = unitAvailable;
const createUnit = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const validatedData = unit_validators_1.unitValidator.parse(req.body);
        const unit = await unit_service_1.default.createUnit(ownerId, validatedData);
        res.status(201).json({
            status: "success",
            data: unit,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createUnit = createUnit;
const updateUnit = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const unitId = req.params.id;
        const validatedData = unit_validators_1.updateUnitValidator.parse(req.body);
        const updatedUnit = await unit_service_1.default.updateUnit(unitId, ownerId, validatedData);
        res.status(200).json({
            status: "success",
            data: updatedUnit,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUnit = updateUnit;
const deleteUnit = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const unitId = req.params.id;
        await unit_service_1.default.softDeleteUnit(unitId, ownerId);
        res.status(200).json({
            status: "success",
            message: "Unit deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUnit = deleteUnit;
const restoreUnit = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const unitId = req.params.id;
        const unit = await unit_service_1.default.restoreUnit(unitId, ownerId);
        res.status(200).json({
            status: "success",
            data: unit,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreUnit = restoreUnit;
