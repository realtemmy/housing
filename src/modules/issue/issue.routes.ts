import { Router } from "express";
import { IssueController } from "./issue.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createTenantIssueSchema,
  updateTenantIssueSchema,
  addIssueCommentSchema,
} from "./issue.validation";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(createTenantIssueSchema, "body"),
  IssueController.createIssue
);

router.get("/", requireAuth, IssueController.listIssues);
router.get("/:id", requireAuth, IssueController.getIssueById);

router.patch(
  "/:id",
  requireAuth,
  validate(updateTenantIssueSchema, "body"),
  IssueController.updateIssue
);

router.post(
  "/:id/comments",
  requireAuth,
  validate(addIssueCommentSchema, "body"),
  IssueController.addComment
);

export const issueRoutes = router;
