import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";
import { AppError } from "./error.middleware.js";

type Role = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export const allowRoles =
  (...roles: Role[]) =>
  (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("You are not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to access this resource",
          403
        )
      );
    }

    next();
  };