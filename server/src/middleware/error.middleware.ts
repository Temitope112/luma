import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      `Route ${req.originalUrl} not found`,
      404
    )
  );
};

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    err.statusCode || 500;

  const message =
    err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};