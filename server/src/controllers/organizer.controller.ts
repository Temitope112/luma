import type {
  NextFunction,
  Response,
} from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { AppError } from "../middleware/error.middleware.js";

import {
  checkInTicketService,
  getOrganizerDashboardService,
} from "../services/organizer.service.js";

import { z } from "zod";

export const getOrganizerDashboard =
  async (
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

      const dashboard =
        await getOrganizerDashboardService(
          req.user.userId,
          req.user.role
        );

      res.status(200).json({
        success: true,
        dashboard,
      });
    } catch (error) {
      next(error);
    }
  };
  const checkInSchema = z
  .object({
    value: z
      .string()
      .trim()
      .min(
        1,
        "Ticket code is required"
      ),
  })
  .strict();

  export const checkInTicket =
  async (
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

      const { value } =
        checkInSchema.parse(
          req.body
        );

      const ticket =
        await checkInTicketService(
          value,
          req.user.userId,
          req.user.role
        );

      res.status(200).json({
        success: true,
        message:
          "Ticket checked in successfully",
        ticket,
      });
    } catch (error) {
      next(error);
    }
  };