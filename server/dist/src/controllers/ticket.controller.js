import { AppError } from "../middleware/error.middleware";
import { getMyTicketsService } from "../services/ticket.service";
export const getMyTickets = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const tickets = await getMyTicketsService(req.user.userId);
        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets,
        });
    }
    catch (error) {
        next(error);
    }
};
