"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsForLeasePayment = exports.getPaymentsForReservation = exports.getPaymentsForApplication = exports.getPaymentTransactionById = exports.refundPayment = exports.processPayment = void 0;
const payment_service_1 = __importDefault(require("../services/payment.service"));
const payment_validators_1 = require("../validators/payment.validators");
const processPayment = async (req, res, next) => {
    try {
        const validatedData = payment_validators_1.paymentValidator.parse(req.body);
        const result = await payment_service_1.default.processPayment(validatedData);
        if (result.success) {
            res.status(201).json({
                status: "success",
                data: result,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.processPayment = processPayment;
const refundPayment = async (req, res, next) => {
    try {
        const transactionId = req.params.id;
        const validatedData = payment_validators_1.refundPaymentValidator.parse(req.body);
        const result = await payment_service_1.default.refundPayment(transactionId, validatedData.amount);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refundPayment = refundPayment;
const getPaymentTransactionById = async (req, res, next) => {
    try {
        const transactionId = req.params.id;
        const transaction = await payment_service_1.default.getPaymentTransactionById(transactionId);
        res.status(200).json({
            status: "success",
            data: transaction,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentTransactionById = getPaymentTransactionById;
const getPaymentsForApplication = async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        const { page, limit } = req.query;
        const options = {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        const result = await payment_service_1.default.getPaymentsForApplication(applicationId, options);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentsForApplication = getPaymentsForApplication;
const getPaymentsForReservation = async (req, res, next) => {
    try {
        const reservationId = req.params.id;
        const { page, limit } = req.query;
        const options = {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        const result = await payment_service_1.default.getPaymentsForReservation(reservationId, options);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentsForReservation = getPaymentsForReservation;
const getPaymentsForLeasePayment = async (req, res, next) => {
    try {
        const leasePaymentId = req.params.id;
        const { page, limit } = req.query;
        const options = {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        const result = await payment_service_1.default.getPaymentsForLeasePayment(leasePaymentId, options);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentsForLeasePayment = getPaymentsForLeasePayment;
