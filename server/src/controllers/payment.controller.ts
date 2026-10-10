import crypto from "crypto";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";

import { verifyPaystackPayment } from "../services/payment.service.js";
import { fulfillOrder } from "../services/order-fulfillment.service.js";

import { prisma } from "../utils/prisma.js";

export const verifyPayment = async (
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

    const reference = req.params.reference;

    if (
      !reference ||
      Array.isArray(reference)
    ) {
      throw new AppError(
        "Payment reference is required",
        400
      );
    }

    const payment =
      await verifyPaystackPayment(reference);

    if (payment.status !== "success") {
      throw new AppError(
        `Payment status is ${payment.status}`,
        400
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          reference,
        },
      });

    if (!order) {
      throw new AppError(
        "Order not found",
        404
      );
    }

    if (
      order.userId !==
      req.user.userId
    ) {
      throw new AppError(
        "You cannot verify this order",
        403
      );
    }

    const paidOrder =
  await fulfillOrder({
    reference,
    amountInKobo:
      Number(payment.amount),

    providerTxnId:
      payment.id
        ? String(payment.id)
        : undefined,

    currency:
      payment.currency,

    channel:
      payment.channel,

    gatewayResponse:
      payment.gateway_response,

    paidAt:
      payment.paid_at
        ? new Date(
            payment.paid_at
          )
        : new Date(),
  });

    res.status(200).json({
      success: true,

      message:
        order.status === "PAID"
          ? "Payment already verified"
          : "Payment verified and tickets issued",

      order: paidOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const paystackWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(
      "📡 PAYSTACK WEBHOOK HIT"
    );

    const signature =
      req.headers[
        "x-paystack-signature"
      ];

    console.log(
      "Signature present:",
      Boolean(signature)
    );

    console.log(
      "Raw body is Buffer:",
      Buffer.isBuffer(req.body)
    );

    if (
      !signature ||
      Array.isArray(signature)
    ) {
      console.log(
        "❌ Missing Paystack signature"
      );

      return res.sendStatus(401);
    }

    if (!Buffer.isBuffer(req.body)) {
      console.log(
        "❌ Webhook body is not raw"
      );

      return res.sendStatus(400);
    }

    const hash = crypto
      .createHmac(
        "sha512",
        env.PAYSTACK_SECRET_KEY
      )
      .update(req.body)
      .digest("hex");

    console.log(
      "Signature matches:",
      hash === signature
    );

    if (hash !== signature) {
      console.log(
        "❌ Invalid Paystack signature"
      );

      return res.sendStatus(401);
    }

    const event = JSON.parse(
      req.body.toString("utf8")
    );

    console.log(
      "✅ Valid Paystack webhook received"
    );

    console.log(
      "Event:",
      event.event
    );

    if (
      event.event ===
      "charge.success"
    ) {
      const reference =
        event.data?.reference;

      const amount =
        Number(
          event.data?.amount
        );

      const currency =
        event.data?.currency;

      const status =
        event.data?.status;

      if (
        !reference ||
        !amount ||
        status !== "success"
      ) {
        console.log(
          "⚠️ Ignoring incomplete or unsuccessful charge event"
        );

        return res.sendStatus(200);
      }

      if (currency !== "NGN") {
        console.error(
          "❌ Unexpected payment currency:",
          currency
        );

        return res.sendStatus(200);
      }

      console.log(
        "💳 Successful payment:",
        reference
      );
await fulfillOrder({
  reference,
  amountInKobo: amount,

  providerTxnId:
    event.data?.id
      ? String(
          event.data.id
        )
      : undefined,

  currency,

  channel:
    event.data?.channel,

  gatewayResponse:
    event.data
      ?.gateway_response,

  paidAt:
    event.data?.paid_at
      ? new Date(
          event.data.paid_at
        )
      : new Date(),
});
      console.log(
        "✅ Order fulfillment completed:",
        reference
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(
      "❌ Paystack webhook error:",
      error
    );

    return res.sendStatus(500);
  }
};