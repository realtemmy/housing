"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeaseRenewal = exports.updateLeaseRenewal = exports.createLeaseRenewal = exports.getLeaseRenewalById = exports.getAllLeaseRenewals = void 0;
const leaseRenewal_service_1 = __importDefault(require("../services/leaseRenewal.service"));
const leaseRenewal_validators_1 = require("../validators/leaseRenewal.validators");
const getAllLeaseRenewals = async (req, res, next) => {
    try {
        const { leaseId, approved } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await leaseRenewal_service_1.default.getAllLeaseRenewals({
            page,
            limit,
            leaseId: leaseId,
            approved: approved === "true" ? true : approved === "false" ? false : undefined,
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
exports.getAllLeaseRenewals = getAllLeaseRenewals;
const getLeaseRenewalById = async (req, res, next) => {
    try {
        const renewalId = req.params.id;
        const renewal = await leaseRenewal_service_1.default.getLeaseRenewalById(renewalId);
        res.status(200).json({
            status: "success",
            data: renewal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaseRenewalById = getLeaseRenewalById;
const createLeaseRenewal = async (req, res, next) => {
    try {
        const validatedData = leaseRenewal_validators_1.leaseRenewalValidator.parse(req.body);
        const renewal = await leaseRenewal_service_1.default.createLeaseRenewal(validatedData);
        res.status(201).json({
            status: "success",
            data: renewal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLeaseRenewal = createLeaseRenewal;
const updateLeaseRenewal = async (req, res, next) => {
    try {
        const renewalId = req.params.id;
        const validatedData = leaseRenewal_validators_1.updateLeaseRenewalValidator.parse(req.body);
        const renewal = await leaseRenewal_service_1.default.updateLeaseRenewal(renewalId, validatedData);
        res.status(200).json({
            status: "success",
            data: renewal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeaseRenewal = updateLeaseRenewal;
const deleteLeaseRenewal = async (req, res, next) => {
    try {
        const renewalId = req.params.id;
        await leaseRenewal_service_1.default.deleteLeaseRenewal(renewalId);
        res.status(200).json({
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLeaseRenewal = deleteLeaseRenewal;
