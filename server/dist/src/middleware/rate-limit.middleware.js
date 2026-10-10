import { rateLimit, } from "express-rate-limit";
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 *
        60 *
        1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});
export const resetPasswordLimiter = rateLimit({
    windowMs: 15 *
        60 *
        1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map