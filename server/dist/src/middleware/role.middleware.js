import { AppError } from "./error.middleware";
export const allowRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(new AppError("You are not authenticated", 401));
    }
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to access this resource", 403));
    }
    next();
};
