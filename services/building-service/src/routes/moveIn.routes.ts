import { Router } from "express";
import {
  getAllMoveInHandovers,
  getMoveInHandoverById,
  createMoveInHandover,
  updateMoveInHandover,
  deleteMoveInHandover,
} from "../controllers/moveInController";
import {
  getAllInspectionChecklistItems,
  createInspectionChecklistItem,
  updateInspectionChecklistItem,
  deleteInspectionChecklistItem,
} from "../controllers/moveInController";
import {
  createInspectionChecklistResponse,
  getInspectionChecklistResponsesByMoveInHandoverId,
  updateInspectionChecklistResponse,
  deleteInspectionChecklistResponse,
} from "../controllers/moveInController";
import {
  createConditionReport,
  getConditionReportsByMoveInHandoverId,
  updateConditionReport,
  deleteConditionReport,
} from "../controllers/moveInController";
import {
  createKeyHandover,
  getKeyHandoversByMoveInHandoverId,
  updateKeyHandover,
  deleteKeyHandover,
} from "../controllers/moveInController";

const router = Router();

// MoveInHandover routes
router.route("/").get(getAllMoveInHandovers).post(createMoveInHandover);
router
  .route("/:id")
  .get(getMoveInHandoverById)
  .patch(updateMoveInHandover)
  .delete(deleteMoveInHandover);

// InspectionChecklistItem routes
router
  .route("/inspection-items")
  .get(getAllInspectionChecklistItems)
  .post(createInspectionChecklistItem);

router
  .route("/inspection-items/:id")
  .patch(updateInspectionChecklistItem)
  .delete(deleteInspectionChecklistItem);

// InspectionChecklistResponse routes
router
  .route("/:moveInHandoverId/inspection-responses")
  .post(createInspectionChecklistResponse)
  .get(getInspectionChecklistResponsesByMoveInHandoverId);

router
  .route("/inspection-responses/:id")
  .patch(updateInspectionChecklistResponse)
  .delete(deleteInspectionChecklistResponse);

// ConditionReport routes
router
  .route("/:moveInHandoverId/condition-reports")
  .post(createConditionReport)
  .get(getConditionReportsByMoveInHandoverId);

router
  .route("/condition-reports/:id")
  .patch(updateConditionReport)
  .delete(deleteConditionReport);

// KeyHandover routes
router
  .route("/:moveInHandoverId/key-handovers")
  .post(createKeyHandover)
  .get(getKeyHandoversByMoveInHandoverId);

router
  .route("/key-handovers/:id")
  .patch(updateKeyHandover)
  .delete(deleteKeyHandover);

export default router;