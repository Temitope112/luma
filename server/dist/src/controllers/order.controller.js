import { z } from "zod";
import { AppError } from "../middleware/error.middleware.js";
import { createOrderService, getMyOrdersService, getOrderByIdService, } from "../services/order.service.js";
const createOrderSchema = z.object({
    eventId: z.string().min(1),
    items: z
        .array(z.object({
        ticketTypeId: z.string().min(1),
        quantity: z.coerce
            .number()
            .int()
            .positive()
            .max(10),
    }))
        .min(1),
});
export const createOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const data = createOrderSchema.parse(req.body);
        const result = await createOrderService(req.user.userId, data);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: result.order,
            payment: result.payment,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getMyOrders = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const orders = await getMyOrdersService(req.user.userId);
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getOrderById = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const orderId = req.params.id;
        if (!orderId || Array.isArray(orderId)) {
            throw new AppError("Order ID is required", 400);
        }
        const order = await getOrderByIdService(orderId, req.user.userId, req.user.role);
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=order.controller.js.map