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

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://luma-ashy-mu.vercel.app",
  env.CLIENT_URL,
]
  .filter(Boolean)
  .map((origin) =>
    origin.replace(/\/$/, "")
  );

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      /*
       * Requests such as Render health checks,
       * Postman and server-to-server requests
       * may not send an Origin header.
       */
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin =
        origin.replace(/\/$/, "");

      if (
        allowedOrigins.includes(
          normalizedOrigin
        )
      ) {
        callback(null, true);
        return;
      }

      console.warn(
        `Blocked CORS origin: ${origin}`
      );

      callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/*
 * Paystack webhook MUST receive the
 * raw request body before express.json().
 */
app.post(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  paystackWebhook
);

// Normal request parsing
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// Health routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Luma API is running",
  });
});

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Luma API is healthy",
      timestamp:
        new Date().toISOString(),
    });
  }
);

// API routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api",
  ticketTypeRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/organizer",
  organizerRoutes
);

// Error handling
app.use(notFoundHandler);

app.use(errorHandler);

export default app;