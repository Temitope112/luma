import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  checkInTicket,
  getOrganizerDashboard,
} from "../controllers/organizer.controller.js";

const router = Router();

router.post(
  "/check-in",
  protect,
  checkInTicket
);

router.get(
  "/dashboard",
  protect,
  getOrganizerDashboard
);

export default router;