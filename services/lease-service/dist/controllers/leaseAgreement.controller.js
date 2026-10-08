"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateLeaseAgreement = exports.executeLeaseAgreement = exports.getLeaseAgreement = exports.signLeaseAgreement = exports.generateLeaseAgreement = void 0;
const leaseAgreement_service_1 = __importDefault(require("../services/leaseAgreement.service"));
const leaseAgreement_validators_1 = require("../validators/leaseAgreement.validators");
const generateLeaseAgreement = async (req, res, next) => {
    try {
        const validatedData = leaseAgreement_validators_1.generateLeaseAgreementValidator.parse(req.body);
        const result = await leaseAgreement_service_1.default.generateLeaseAgreement(validatedData);
        res.status(201).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateLeaseAgreement = generateLeaseAgreement;
const signLeaseAgreement = async (req, res, next) => {
    try {
        const validatedData = leaseAgreement_validators_1.signLeaseAgreementValidator.parse(req.body);
        const { leaseId } = req.params;
        // Add leaseId to the validated data for the service
        const input = { ...validatedData, leaseId };
        const result = await leaseAgreement_service_1.default.signLeaseAgreement(input);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signLeaseAgreement = signLeaseAgreement;
const getLeaseAgreement = async (req, res, next) => {
    try {
        const { leaseId } = req.params;
        const agreement = await leaseAgreement_service_1.default.getLeaseAgreement(leaseId);
        res.status(200).json({
            status: "success",
            data: agreement,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaseAgreement = getLeaseAgreement;
const executeLeaseAgreement = async (req, res, next) => {
    try {
        const validatedData = leaseAgreement_validators_1.executeLeaseAgreementValidator.parse(req.body);
        const result = await leaseAgreement_service_1.default.executeLeaseAgreement(validatedData.leaseId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.executeLeaseAgreement = executeLeaseAgreement;
const terminateLeaseAgreement = async (req, res, next) => {
    try {
        const validatedData = leaseAgreement_validators_1.terminateLeaseAgreementValidator.parse(req.body);
        const result = await leaseAgreement_service_1.default.terminateLeaseAgreement(validatedData.leaseId, validatedData.reason);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.terminateLeaseAgreement = terminateLeaseAgreement;
