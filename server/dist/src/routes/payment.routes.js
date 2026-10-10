import { Router } from "express";
import { paystackWebhook, verifyPayment, } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/webhook", paystackWebhook);
router.get("/verify/:reference", protect, verifyPayment);
export default router;
//# sourceMappingURL=payment.routes.js.map