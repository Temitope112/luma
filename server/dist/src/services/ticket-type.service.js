import { prisma } from "../utils/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
export const createTicketTypeService = async (eventId, userId, role, data) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
    });
    if (!event) {
        throw new AppError("Event not found", 404);
    }
    if (role !== "ADMIN" &&
        event.organizerId !== userId) {
        throw new AppError("You cannot add tickets to this event", 403);
    }
    if (data.salesStart && data.salesEnd) {
        if (data.salesEnd <= data.salesStart) {
            throw new AppError("Sales end date must be after sales start date", 400);
        }
    }
    const ticketType = await prisma.ticketType.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            salesStart: data.salesStart,
            salesEnd: data.salesEnd,
            eventId,
        },
    });
    return ticketType;
};
export const getTicketTypesService = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
    });
    if (!event) {
        throw new AppError("Event not found", 404);
    }
    return prisma.ticketType.findMany({
        where: {
            eventId,
        },
        orderBy: {
            price: "asc",
        },
    });
};
export const updateTicketTypeService = async (ticketTypeId, userId, role, data) => {
    const ticketType = await prisma.ticketType.findUnique({
        where: {
            id: ticketTypeId,
        },
        include: {
            event: true,
        },
    });
    if (!ticketType) {
        throw new AppError("Ticket type not found", 404);
    }
    if (role !== "ADMIN" &&
        ticketType.event.organizerId !== userId) {
        throw new AppError("You cannot edit this ticket type", 403);
    }
    if (data.quantity !== undefined &&
        data.quantity < ticketType.sold) {
        throw new AppError(`Quantity cannot be lower than tickets already sold (${ticketType.sold})`, 400);
    }
    return prisma.ticketType.update({
        where: {
            id: ticketTypeId,
        },
        data,
    });
};
export const deleteTicketTypeService = async (ticketTypeId, userId, role) => {
    const ticketType = await prisma.ticketType.findUnique({
        where: {
            id: ticketTypeId,
        },
        include: {
            event: true,
        },
    });
    if (!ticketType) {
        throw new AppError("Ticket type not found", 404);
    }
    if (role !== "ADMIN" &&
        ticketType.event.organizerId !== userId) {
        throw new AppError("You cannot delete this ticket type", 403);
    }
    if (ticketType.sold > 0) {
        throw new AppError("You cannot delete a ticket type that already has sales", 400);
    }
    await prisma.ticketType.delete({
        where: {
            id: ticketTypeId,
        },
    });
    return {
        message: "Ticket type deleted successfully",
    };
};
//# sourceMappingURL=ticket-type.service.js.map