"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLease = exports.createLease = exports.getLeaseById = exports.getAllLeases = void 0;
const lease_service_1 = __importDefault(require("../services/lease.service"));
const lease_validators_1 = require("../validators/lease.validators");
const getAllLeases = async (req, res, next) => {
    try {
        const { tenantId, rentableId, rentableType, status } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await lease_service_1.default.getAllLeases({
            page,
            limit,
            tenantId: tenantId,
            rentableId: rentableId,
            rentableType: rentableType, // TODO: Fix type casting
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
exports.getAllLeases = getAllLeases;
const getLeaseById = async (req, res, next) => {
    try {
        const leaseId = req.params.id;
        const lease = await lease_service_1.default.getLeaseById(leaseId);
        res.status(200).json({
            status: "success",
            data: lease,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaseById = getLeaseById;
const createLease = async (req, res, next) => {
    try {
        const validatedData = lease_validators_1.leaseValidator.parse(req.body);
        const lease = await lease_service_1.default.createLease(validatedData);
        res.status(201).json({
            status: "success",
            data: lease,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLease = createLease;
const updateLease = async (req, res, next) => {
    try {
        const leaseId = req.params.id;
        const validatedData = lease_validators_1.updateLeaseValidator.parse(req.body);
        const lease = await lease_service_1.default.updateLease(leaseId, validatedData);
        res.status(200).json({
            status: "success",
            data: lease,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLease = updateLease;
