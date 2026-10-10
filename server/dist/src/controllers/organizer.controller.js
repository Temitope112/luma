import { AppError } from "../middleware/error.middleware.js";
import { getOrganizerDashboardService } from "../services/organizer.service.js";
export const getOrganizerDashboard = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("You are not authenticated", 401);
        }
        const dashboard = await getOrganizerDashboardService(req.user.userId, req.user.role);
        res.status(200).json({
            success: true,
            dashboard,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=organizer.controller.js.map