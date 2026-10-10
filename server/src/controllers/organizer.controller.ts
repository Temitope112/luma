import type {
  NextFunction,
  Response,
} from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware";

import { AppError } from "../middleware/error.middleware";

import { getOrganizerDashboardService } from "../services/organizer.service";

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