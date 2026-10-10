import { Router } from "express";

import {
  paystackWebhook,
  verifyPayment,
} from "../controllers/payment.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/webhook",
  paystackWebhook
);

router.get(
  "/verify/:reference",
  protect,
  verifyPayment
);

export default router;