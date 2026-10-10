"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreProperty = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getProperty = exports.getAllProperties = void 0;
const property_service_1 = __importDefault(require("../services/property.service"));
const property_validators_1 = require("../validators/property.validators");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllProperties = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const search = req.query.search || "";
        const orderBy = req.query.orderBy === "asc" ? "asc" : "desc";
        const includeDeleted = req.query.includeDeleted === "true";
        const result = await property_service_1.default.getAllProperties(ownerId, {
            page,
            limit,
            search,
            orderBy,
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
exports.getAllProperties = getAllProperties;
const getProperty = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const propertyId = req.params.id;
        const property = await property_service_1.default.getPropertyById(propertyId, ownerId);
        res.status(200).json({
            status: "success",
            data: property,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProperty = getProperty;
const createProperty = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const validatedData = property_validators_1.propertyValidator.parse(req.body);
        const property = await property_service_1.default.createProperty(ownerId, validatedData);
        res.status(201).json({
            status: "success",
            data: property,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const propertyId = req.params.id;
        const validatedData = property_validators_1.updatePropertyValidator.parse(req.body);
        const updatedProperty = await property_service_1.default.updateProperty(propertyId, ownerId, validatedData);
        res.status(200).json({
            status: "success",
            data: updatedProperty,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const propertyId = req.params.id;
        await property_service_1.default.softDeleteProperty(propertyId, ownerId);
        res.status(200).json({
            status: "success",
            message: "Property deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProperty = deleteProperty;
const restoreProperty = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return next(new appError_1.default("User unauthenticated", 401));
        }
        const propertyId = req.params.id;
        const property = await property_service_1.default.restoreProperty(propertyId, ownerId);
        res.status(200).json({
            status: "success",
            data: property,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreProperty = restoreProperty;
