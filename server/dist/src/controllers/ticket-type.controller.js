import { z } from "zod";
import { AppError } from "../middleware/error.middleware.js";
import { createTicketTypeService, deleteTicketTypeService, getTicketTypesService, updateTicketTypeService, } from "../services/ticket-type.service.js";
const createTicketTypeSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce
        .number()
        .nonnegative(),
    quantity: z.coerce
        .number()
        .int()
        .positive(),
    salesStart: z.coerce
        .date()
        .optional(),
    salesEnd: z.coerce
        .date()
        .optional(),
});
const updateTicketTypeSchema = createTicketTypeSchema.partial();
export const createTicketType = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const eventId = req.params.eventId;
        if (!eventId ||
            Array.isArray(eventId)) {
            throw new AppError("Event ID is required", 400);
        }
        const data = createTicketTypeSchema.parse(req.body);
        const ticketType = await createTicketTypeService(eventId, req.user.userId, req.user.role, data);
        res.status(201).json({
            success: true,
            message: "Ticket type created successfully",
            ticketType,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getTicketTypes = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId ||
            Array.isArray(eventId)) {
            throw new AppError("Event ID is required", 400);
        }
        const ticketTypes = await getTicketTypesService(eventId);
        res.status(200).json({
            success: true,
            count: ticketTypes.length,
            ticketTypes,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateTicketType = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const ticketTypeId = req.params.id;
        if (!ticketTypeId ||
            Array.isArray(ticketTypeId)) {
            throw new AppError("Ticket type ID is required", 400);
        }
        const data = updateTicketTypeSchema.parse(req.body);
        const ticketType = await updateTicketTypeService(ticketTypeId, req.user.userId, req.user.role, data);
        res.status(200).json({
            success: true,
            message: "Ticket type updated successfully",
            ticketType,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTicketType = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const ticketTypeId = req.params.id;
        if (!ticketTypeId ||
            Array.isArray(ticketTypeId)) {
            throw new AppError("Ticket type ID is required", 400);
        }
        const result = await deleteTicketTypeService(ticketTypeId, req.user.userId, req.user.role);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=ticket-type.controller.js.map