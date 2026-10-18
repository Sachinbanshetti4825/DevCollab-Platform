import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createOrganizationController,
  deleteOrganization,
  getMyOrganization,
  updateOrganizationController,
} from "../controllers/organization.controller.js";
import { organizationValidator } from "../validators/organization.validate.js";
import validateRequest from "../middlewares/validateRequest.middleware.js";

const organizationRouter = express.Router();

organizationRouter.post(
  "/createOrganization",
  authMiddleware,
  organizationValidator,
  validateRequest,
  createOrganizationController,
);
organizationRouter.get("/my", authMiddleware, getMyOrganization);

organizationRouter.patch(
  "/UpdateOrganization/:id",
  authMiddleware,
  organizationValidator,
  validateRequest,
  updateOrganizationController,
);

organizationRouter.delete("/deleteOrganization/:organizationId",authMiddleware,deleteOrganization);

export default organizationRouter;
