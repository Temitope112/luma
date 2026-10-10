import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import ticketTypeRoutes from "./routes/ticket-type.routes.js";
import orderRoutes from "./routes/order.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import organizerRoutes from "./routes/organizer.routes.js";
import { paystackWebhook } from "./controllers/payment.controller.js";
import { errorHandler, notFoundHandler, } from "./middleware/error.middleware.js";
const app = express();
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
// Paystack webhook MUST receive raw JSON
app.post("/api/payments/webhook", express.raw({
    type: "application/json",
}), paystackWebhook);
// Normal request parsing
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());
// Health routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Luma API is running",
    });
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Luma API is healthy",
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", ticketTypeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/organizer", organizerRoutes);
// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map