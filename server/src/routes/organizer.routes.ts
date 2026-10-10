import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import { getOrganizerDashboard } from "../controllers/organizer.controller.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  getOrganizerDashboard
);

export default router;