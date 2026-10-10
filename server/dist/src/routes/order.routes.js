import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
export default router;
//# sourceMappingURL=order.routes.js.map