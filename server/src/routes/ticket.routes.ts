import { Router } from "express";

import { getMyTickets } from "../controllers/ticket.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect, getMyTickets);

export default router;