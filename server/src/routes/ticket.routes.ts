import { Router } from "express";

import { getMyTickets } from "../controllers/ticket.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", protect, getMyTickets);

export default router;