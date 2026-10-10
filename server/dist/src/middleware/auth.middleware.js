import { AppError } from "./error.middleware";
import { verifyToken } from "../utils/jwt";
export const protect = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            throw new AppError("You are not authenticated", 401);
        }
        const decoded = verifyToken(token);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        next(error instanceof AppError
            ? error
            : new AppError("Invalid or expired authentication token", 401));
    }
};
