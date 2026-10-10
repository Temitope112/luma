import type {
  NextFunction,
  Response,
} from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { getMyTicketsService } from "../services/ticket.service.js";

export const getMyTickets = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "You are not authenticated",
        401
      );
    }

    const tickets = await getMyTicketsService(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};