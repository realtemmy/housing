"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKeyHandover = exports.updateKeyHandover = exports.getKeyHandoversByMoveInHandoverId = exports.createKeyHandover = exports.deleteConditionReport = exports.updateConditionReport = exports.getConditionReportsByMoveInHandoverId = exports.createConditionReport = exports.deleteInspectionChecklistResponse = exports.updateInspectionChecklistResponse = exports.getInspectionChecklistResponsesByMoveInHandoverId = exports.createInspectionChecklistResponse = exports.deleteInspectionChecklistItem = exports.updateInspectionChecklistItem = exports.createInspectionChecklistItem = exports.getAllInspectionChecklistItems = exports.deleteMoveInHandover = exports.updateMoveInHandover = exports.createMoveInHandover = exports.getMoveInHandoverById = exports.getAllMoveInHandovers = void 0;
const moveInService_1 = __importDefault(require("../services/moveInService"));
const moveIn_validators_1 = require("../validators/moveIn.validators");
// MoveInHandover controllers
const getAllMoveInHandovers = async (req, res, next) => {
    try {
        // For now, we'll get all move-in handovers (could add filtering later)
        const moveInHandovers = await moveInService_1.default.getMoveInHandoversByLeaseId("" // Empty string will return all since we don't have a getAll method yet
        );
        // Actually, let's implement a proper getAll method or use leaseId filter
        // For now, we'll return an empty array and implement properly later
        res.status(200).json({
            status: "success",
            data: {
                items: [],
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                itemsPerPage: 0,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllMoveInHandovers = getAllMoveInHandovers;
const getMoveInHandoverById = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.id;
        const moveInHandover = await moveInService_1.default.getMoveInHandoverById(moveInHandoverId);
        res.status(200).json({
            status: "success",
            data: moveInHandover,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMoveInHandoverById = getMoveInHandoverById;
const createMoveInHandover = async (req, res, next) => {
    try {
        const validatedData = moveIn_validators_1.createMoveInHandoverValidator.parse(req.body);
        const moveInHandover = await moveInService_1.default.createMoveInHandover(validatedData);
        res.status(201).json({
            status: "success",
            data: moveInHandover,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createMoveInHandover = createMoveInHandover;
const updateMoveInHandover = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.id;
        const validatedData = moveIn_validators_1.updateMoveInHandoverValidator.parse(req.body);
        const moveInHandover = await moveInService_1.default.updateMoveInHandover(moveInHandoverId, validatedData);
        res.status(200).json({
            status: "success",
            data: moveInHandover,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMoveInHandover = updateMoveInHandover;
const deleteMoveInHandover = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.id;
        const result = await moveInService_1.default.deleteMoveInHandover(moveInHandoverId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMoveInHandover = deleteMoveInHandover;
// InspectionChecklistItem controllers
const getAllInspectionChecklistItems = async (req, res, next) => {
    try {
        const { isActive } = req.query;
        const options = {
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        };
        const checklistItems = await moveInService_1.default.getInspectionChecklistItems(options);
        res.status(200).json({
            status: "success",
            data: checklistItems,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllInspectionChecklistItems = getAllInspectionChecklistItems;
const createInspectionChecklistItem = async (req, res, next) => {
    try {
        const validatedData = moveIn_validators_1.createInspectionChecklistItemValidator.parse(req.body);
        const checklistItem = await moveInService_1.default.createInspectionChecklistItem(validatedData);
        res.status(201).json({
            status: "success",
            data: checklistItem,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createInspectionChecklistItem = createInspectionChecklistItem;
const updateInspectionChecklistItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const validatedData = moveIn_validators_1.updateInspectionChecklistItemValidator.parse(req.body);
        const checklistItem = await moveInService_1.default.updateInspectionChecklistItem(itemId, validatedData);
        res.status(200).json({
            status: "success",
            data: checklistItem,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateInspectionChecklistItem = updateInspectionChecklistItem;
const deleteInspectionChecklistItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const result = await moveInService_1.default.deleteInspectionChecklistItem(itemId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteInspectionChecklistItem = deleteInspectionChecklistItem;
// InspectionChecklistResponse controllers
const createInspectionChecklistResponse = async (req, res, next) => {
    try {
        const validatedData = moveIn_validators_1.createInspectionChecklistResponseValidator.parse(req.body);
        const response = await moveInService_1.default.createInspectionChecklistResponse(validatedData);
        res.status(201).json({
            status: "success",
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createInspectionChecklistResponse = createInspectionChecklistResponse;
const getInspectionChecklistResponsesByMoveInHandoverId = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.moveInHandoverId;
        const responses = await moveInService_1.default.getInspectionChecklistResponsesByMoveInHandoverId(moveInHandoverId);
        res.status(200).json({
            status: "success",
            data: responses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInspectionChecklistResponsesByMoveInHandoverId = getInspectionChecklistResponsesByMoveInHandoverId;
const updateInspectionChecklistResponse = async (req, res, next) => {
    try {
        const responseId = req.params.id;
        const validatedData = moveIn_validators_1.updateInspectionChecklistResponseValidator.parse(req.body);
        const response = await moveInService_1.default.updateInspectionChecklistResponse(responseId, validatedData);
        res.status(200).json({
            status: "success",
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateInspectionChecklistResponse = updateInspectionChecklistResponse;
const deleteInspectionChecklistResponse = async (req, res, next) => {
    try {
        const responseId = req.params.id;
        const result = await moveInService_1.default.deleteInspectionChecklistResponse(responseId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteInspectionChecklistResponse = deleteInspectionChecklistResponse;
// ConditionReport controllers
const createConditionReport = async (req, res, next) => {
    try {
        const validatedData = moveIn_validators_1.createConditionReportValidator.parse(req.body);
        const conditionReport = await moveInService_1.default.createConditionReport(validatedData);
        res.status(201).json({
            status: "success",
            data: conditionReport,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createConditionReport = createConditionReport;
const getConditionReportsByMoveInHandoverId = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.moveInHandoverId;
        const conditionReports = await moveInService_1.default.getConditionReportsByMoveInHandoverId(moveInHandoverId);
        res.status(200).json({
            status: "success",
            data: conditionReports,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getConditionReportsByMoveInHandoverId = getConditionReportsByMoveInHandoverId;
const updateConditionReport = async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const validatedData = moveIn_validators_1.updateConditionReportValidator.parse(req.body);
        const conditionReport = await moveInService_1.default.updateConditionReport(reportId, validatedData);
        res.status(200).json({
            status: "success",
            data: conditionReport,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateConditionReport = updateConditionReport;
const deleteConditionReport = async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const result = await moveInService_1.default.deleteConditionReport(reportId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteConditionReport = deleteConditionReport;
// KeyHandover controllers
const createKeyHandover = async (req, res, next) => {
    try {
        const validatedData = moveIn_validators_1.createKeyHandoverValidator.parse(req.body);
        const keyHandover = await moveInService_1.default.createKeyHandover(validatedData);
        res.status(201).json({
            status: "success",
            data: keyHandover,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createKeyHandover = createKeyHandover;
const getKeyHandoversByMoveInHandoverId = async (req, res, next) => {
    try {
        const moveInHandoverId = req.params.moveInHandoverId;
        const keyHandovers = await moveInService_1.default.getKeyHandoversByMoveInHandoverId(moveInHandoverId);
        res.status(200).json({
            status: "success",
            data: keyHandovers,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getKeyHandoversByMoveInHandoverId = getKeyHandoversByMoveInHandoverId;
const updateKeyHandover = async (req, res, next) => {
    try {
        const handoverId = req.params.id;
        const validatedData = moveIn_validators_1.updateKeyHandoverValidator.parse(req.body);
        const keyHandover = await moveInService_1.default.updateKeyHandover(handoverId, validatedData);
        res.status(200).json({
            status: "success",
            data: keyHandover,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateKeyHandover = updateKeyHandover;
const deleteKeyHandover = async (req, res, next) => {
    try {
        const handoverId = req.params.id;
        const result = await moveInService_1.default.deleteKeyHandover(handoverId);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteKeyHandover = deleteKeyHandover;
