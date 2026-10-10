import { Router } from "express";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventBySlug,
  publishEvent,
  updateEvent,
} from "../controllers/event.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getAllEvents);

router.patch(
  "/:id/publish",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  publishEvent
);

router.get("/", getAllEvents);

router.get(
  "/slug/:slug",
  getEventBySlug
);

router.get(
  "/:id",
  getEventById
);

router.post(
  "/",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  createEvent
);

router.patch(
  "/:id",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  allowRoles("ORGANIZER", "ADMIN"),
  deleteEvent
);

export default router;