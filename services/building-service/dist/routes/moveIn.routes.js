"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moveInController_1 = require("../controllers/moveInController");
const moveInController_2 = require("../controllers/moveInController");
const moveInController_3 = require("../controllers/moveInController");
const moveInController_4 = require("../controllers/moveInController");
const moveInController_5 = require("../controllers/moveInController");
const router = (0, express_1.Router)();
// MoveInHandover routes
router.route("/").get(moveInController_1.getAllMoveInHandovers).post(moveInController_1.createMoveInHandover);
router
    .route("/:id")
    .get(moveInController_1.getMoveInHandoverById)
    .patch(moveInController_1.updateMoveInHandover)
    .delete(moveInController_1.deleteMoveInHandover);
// InspectionChecklistItem routes
router
    .route("/inspection-items")
    .get(moveInController_2.getAllInspectionChecklistItems)
    .post(moveInController_2.createInspectionChecklistItem);
router
    .route("/inspection-items/:id")
    .patch(moveInController_2.updateInspectionChecklistItem)
    .delete(moveInController_2.deleteInspectionChecklistItem);
// InspectionChecklistResponse routes
router
    .route("/:moveInHandoverId/inspection-responses")
    .post(moveInController_3.createInspectionChecklistResponse)
    .get(moveInController_3.getInspectionChecklistResponsesByMoveInHandoverId);
router
    .route("/inspection-responses/:id")
    .patch(moveInController_3.updateInspectionChecklistResponse)
    .delete(moveInController_3.deleteInspectionChecklistResponse);
// ConditionReport routes
router
    .route("/:moveInHandoverId/condition-reports")
    .post(moveInController_4.createConditionReport)
    .get(moveInController_4.getConditionReportsByMoveInHandoverId);
router
    .route("/condition-reports/:id")
    .patch(moveInController_4.updateConditionReport)
    .delete(moveInController_4.deleteConditionReport);
// KeyHandover routes
router
    .route("/:moveInHandoverId/key-handovers")
    .post(moveInController_5.createKeyHandover)
    .get(moveInController_5.getKeyHandoversByMoveInHandoverId);
router
    .route("/key-handovers/:id")
    .patch(moveInController_5.updateKeyHandover)
    .delete(moveInController_5.deleteKeyHandover);
exports.default = router;
