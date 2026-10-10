import { Router } from "express";

import {
  createTicketType,
  deleteTicketType,
  getTicketTypes,
  updateTicketType,
} from "../controllers/ticket-type.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/events/:eventId/ticket-types",
  getTicketTypes
);

router.post(
  "/events/:eventId/ticket-types",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  createTicketType
);

router.patch(
  "/ticket-types/:id",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  updateTicketType
);

router.delete(
  "/ticket-types/:id",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  deleteTicketType
);

export default router;