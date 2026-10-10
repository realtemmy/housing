"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreBuilding = exports.deleteBuilding = exports.updateBuilding = exports.createBuilding = exports.getBuilding = exports.getAllBuildings = void 0;
const building_service_1 = __importDefault(require("../services/building.service"));
const building_validators_1 = require("../validators/building.validators");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllBuildings = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const search = req.query.search || "";
        const orderBy = req.query.orderBy === "asc" ? "asc" : "desc";
        const propertyId = req.query.propertyId || undefined;
        const includeDeleted = req.query.includeDeleted === "true";
        const result = await building_service_1.default.getAllBuildings(ownerId, {
            page,
            limit,
            search,
            orderBy,
            propertyId,
            includeDeleted,
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
exports.getAllBuildings = getAllBuildings;
const getBuilding = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const buildingId = req.params.id;
        const building = await building_service_1.default.getBuildingById(buildingId, ownerId);
        res.status(200).json({
            status: "success",
            data: building,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBuilding = getBuilding;
const createBuilding = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const validatedData = building_validators_1.buildingValidator.parse(req.body);
        const building = await building_service_1.default.createBuilding(ownerId, validatedData);
        res.status(201).json({
            status: "success",
            data: building,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBuilding = createBuilding;
const updateBuilding = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const buildingId = req.params.id;
        const validatedData = building_validators_1.updateBuildingValidator.parse(req.body);
        const updatedBuilding = await building_service_1.default.updateBuilding(buildingId, ownerId, validatedData);
        res.status(200).json({
            status: "success",
            data: updatedBuilding,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBuilding = updateBuilding;
const deleteBuilding = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const buildingId = req.params.id;
        await building_service_1.default.softDeleteBuilding(buildingId, ownerId);
        res.status(200).json({
            status: "success",
            message: "Building deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBuilding = deleteBuilding;
const restoreBuilding = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const buildingId = req.params.id;
        const building = await building_service_1.default.restoreBuilding(buildingId, ownerId);
        res.status(200).json({
            status: "success",
            data: building,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreBuilding = restoreBuilding;
