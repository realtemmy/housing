"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplicationsByApplicant = exports.getApplicationById = exports.getAllApplications = void 0;
const application_service_1 = __importDefault(require("../services/application.service"));
const application_validators_1 = require("../validators/application.validators");
const getAllApplications = async (req, res, next) => {
    try {
        const { applicantId, status, type } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await application_service_1.default.getAllApplications({
            page,
            limit,
            applicantId: applicantId,
            status: status,
            applicationType: type,
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
exports.getAllApplications = getAllApplications;
const getApplicationById = async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        const application = await application_service_1.default.getApplicationById(applicationId);
        res.status(200).json({
            status: "success",
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getApplicationById = getApplicationById;
const getApplicationsByApplicant = async (req, res, next) => {
    try {
        const applicantId = req.params.id;
        const { status, type } = req.query;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const result = await application_service_1.default.getApplicationsByApplicant(applicantId, {
            page,
            limit,
            status: status,
            applicationType: type,
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
exports.getApplicationsByApplicant = getApplicationsByApplicant;
const createApplication = async (req, res, next) => {
    try {
        const validatedData = application_validators_1.applicationValidator.parse(req.body);
        const application = await application_service_1.default.createApplication(validatedData);
        res.status(201).json({
            status: "success",
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createApplication = createApplication;
const updateApplication = async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        const validatedData = application_validators_1.updateApplicationValidator.parse(req.body);
        const application = await application_service_1.default.updateApplication(applicationId, validatedData);
        res.status(200).json({
            status: "success",
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        await application_service_1.default.deleteApplication(applicationId);
        res.status(200).json({
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteApplication = deleteApplication;
