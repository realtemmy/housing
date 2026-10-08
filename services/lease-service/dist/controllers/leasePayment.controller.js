"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeasePayment = exports.updateLeasePayment = exports.createLeasePayment = exports.getLeasePaymentById = exports.getAllLeasePayments = void 0;
const leasePayment_service_1 = __importDefault(require("../services/leasePayment.service"));
const leasePayment_validators_1 = require("../validators/leasePayment.validators");
const getAllLeasePayments = async (req, res, next) => {
    try {
        const { leaseId, status } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await leasePayment_service_1.default.getAllLeasePayments({
            page,
            limit,
            leaseId: leaseId,
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
exports.getAllLeasePayments = getAllLeasePayments;
const getLeasePaymentById = async (req, res, next) => {
    try {
        const paymentId = req.params.id;
        const payment = await leasePayment_service_1.default.getLeasePaymentById(paymentId);
        res.status(200).json({
            status: "success",
            data: payment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeasePaymentById = getLeasePaymentById;
const createLeasePayment = async (req, res, next) => {
    try {
        const validatedData = leasePayment_validators_1.leasePaymentValidator.parse(req.body);
        const payment = await leasePayment_service_1.default.createLeasePayment(validatedData);
        res.status(201).json({
            status: "success",
            data: payment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLeasePayment = createLeasePayment;
const updateLeasePayment = async (req, res, next) => {
    try {
        const paymentId = req.params.id;
        const validatedData = leasePayment_validators_1.updateLeasePaymentValidator.parse(req.body);
        const payment = await leasePayment_service_1.default.updateLeasePayment(paymentId, validatedData);
        res.status(200).json({
            status: "success",
            data: payment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeasePayment = updateLeasePayment;
const deleteLeasePayment = async (req, res, next) => {
    try {
        const paymentId = req.params.id;
        await leasePayment_service_1.default.deleteLeasePayment(paymentId);
        res.status(200).json({
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLeasePayment = deleteLeasePayment;
