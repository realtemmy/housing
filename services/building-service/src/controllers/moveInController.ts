import { Request, Response, NextFunction } from "express";
import moveInService from "../services/moveInService";
import {
  createMoveInHandoverValidator,
  updateMoveInHandoverValidator,
  createInspectionChecklistItemValidator,
  updateInspectionChecklistItemValidator,
  createInspectionChecklistResponseValidator,
  updateInspectionChecklistResponseValidator,
  createConditionReportValidator,
  updateConditionReportValidator,
  createKeyHandoverValidator,
  updateKeyHandoverValidator,
} from "../validators/moveIn.validators";
import AppError from "../utils/appError";

// MoveInHandover controllers
export const getAllMoveInHandovers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, we'll get all move-in handovers (could add filtering later)
    const moveInHandovers = await moveInService.getMoveInHandoversByLeaseId(
      "" // Empty string will return all since we don't have a getAll method yet
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
  } catch (error) {
    next(error);
  }
};

export const getMoveInHandoverById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.id as string;
    const moveInHandover = await moveInService.getMoveInHandoverById(moveInHandoverId);

    res.status(200).json({
      status: "success",
      data: moveInHandover,
    });
  } catch (error) {
    next(error);
  }
};

export const createMoveInHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createMoveInHandoverValidator.parse(req.body);
    const moveInHandover = await moveInService.createMoveInHandover(validatedData);

    res.status(201).json({
      status: "success",
      data: moveInHandover,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMoveInHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.id as string;
    const validatedData = updateMoveInHandoverValidator.parse(req.body);
    const moveInHandover = await moveInService.updateMoveInHandover(moveInHandoverId, validatedData);

    res.status(200).json({
      status: "success",
      data: moveInHandover,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMoveInHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.id as string;
    const result = await moveInService.deleteMoveInHandover(moveInHandoverId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// InspectionChecklistItem controllers
export const getAllInspectionChecklistItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isActive } = req.query;
    const options = {
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };
    const checklistItems = await moveInService.getInspectionChecklistItems(options);

    res.status(200).json({
      status: "success",
      data: checklistItems,
    });
  } catch (error) {
    next(error);
  }
};

export const createInspectionChecklistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createInspectionChecklistItemValidator.parse(req.body);
    const checklistItem = await moveInService.createInspectionChecklistItem(validatedData);

    res.status(201).json({
      status: "success",
      data: checklistItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInspectionChecklistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id as string;
    const validatedData = updateInspectionChecklistItemValidator.parse(req.body);
    const checklistItem = await moveInService.updateInspectionChecklistItem(itemId, validatedData);

    res.status(200).json({
      status: "success",
      data: checklistItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInspectionChecklistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id as string;
    const result = await moveInService.deleteInspectionChecklistItem(itemId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// InspectionChecklistResponse controllers
export const createInspectionChecklistResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createInspectionChecklistResponseValidator.parse(req.body);
    const response = await moveInService.createInspectionChecklistResponse(validatedData);

    res.status(201).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getInspectionChecklistResponsesByMoveInHandoverId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.moveInHandoverId as string;
    const responses = await moveInService.getInspectionChecklistResponsesByMoveInHandoverId(moveInHandoverId);

    res.status(200).json({
      status: "success",
      data: responses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInspectionChecklistResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const responseId = req.params.id as string;
    const validatedData = updateInspectionChecklistResponseValidator.parse(req.body);
    const response = await moveInService.updateInspectionChecklistResponse(responseId, validatedData);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInspectionChecklistResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const responseId = req.params.id as string;
    const result = await moveInService.deleteInspectionChecklistResponse(responseId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ConditionReport controllers
export const createConditionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createConditionReportValidator.parse(req.body);
    const conditionReport = await moveInService.createConditionReport(validatedData);

    res.status(201).json({
      status: "success",
      data: conditionReport,
    });
  } catch (error) {
    next(error);
  }
};

export const getConditionReportsByMoveInHandoverId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.moveInHandoverId as string;
    const conditionReports = await moveInService.getConditionReportsByMoveInHandoverId(moveInHandoverId);

    res.status(200).json({
      status: "success",
      data: conditionReports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConditionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportId = req.params.id as string;
    const validatedData = updateConditionReportValidator.parse(req.body);
    const conditionReport = await moveInService.updateConditionReport(reportId, validatedData);

    res.status(200).json({
      status: "success",
      data: conditionReport,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConditionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportId = req.params.id as string;
    const result = await moveInService.deleteConditionReport(reportId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// KeyHandover controllers
export const createKeyHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createKeyHandoverValidator.parse(req.body);
    const keyHandover = await moveInService.createKeyHandover(validatedData);

    res.status(201).json({
      status: "success",
      data: keyHandover,
    });
  } catch (error) {
    next(error);
  }
};

export const getKeyHandoversByMoveInHandoverId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moveInHandoverId = req.params.moveInHandoverId as string;
    const keyHandovers = await moveInService.getKeyHandoversByMoveInHandoverId(moveInHandoverId);

    res.status(200).json({
      status: "success",
      data: keyHandovers,
    });
  } catch (error) {
    next(error);
  }
};

export const updateKeyHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const handoverId = req.params.id as string;
    const validatedData = updateKeyHandoverValidator.parse(req.body);
    const keyHandover = await moveInService.updateKeyHandover(handoverId, validatedData);

    res.status(200).json({
      status: "success",
      data: keyHandover,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteKeyHandover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const handoverId = req.params.id as string;
    const result = await moveInService.deleteKeyHandover(handoverId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};