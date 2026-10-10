import { Router } from "express";

import { protect } from "../middleware/auth.middleware";

import { getOrganizerDashboard } from "../controllers/organizer.controller";

const router = Router();

router.get(
  "/dashboard",
  protect,
  getOrganizerDashboard
);

export default router;