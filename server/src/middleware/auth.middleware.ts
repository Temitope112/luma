import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "./error.middleware.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role:
      | "ATTENDEE"
      | "ORGANIZER"
      | "ADMIN";
  };
}

/**
 * Required authentication.
 *
 * Use this for protected routes such as:
 * - orders
 * - payments
 * - organizer actions
 * - ticket management
 */
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token;

    if (!token) {
      throw new AppError(
        "You are not authenticated",
        401
      );
    }

    const decoded =
      verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(
            "Invalid or expired authentication token",
            401
          )
    );
  }
};

/**
 * Optional authentication.
 *
 * Used for routes where being logged out is
 * a valid state, such as GET /auth/me.
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.token;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded =
      verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    // Remove an invalid/expired cookie.
    res.clearCookie("token", {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
    });

    // An expired session simply means
    // the user is now logged out.
    next();
  }
};