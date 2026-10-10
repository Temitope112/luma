import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";
import { generateTicketCode } from "../utils/ticket-code";

type FulfillmentPayment = {
  reference: string;
  amountInKobo: number;
  providerTxnId?: string;
  currency?: string;
  channel?: string;
  gatewayResponse?: string;
  paidAt?: Date;
};

export const fulfillOrder = async (
  payment: FulfillmentPayment
) => {
  const existingOrder =
    await prisma.order.findUnique({
      where: {
        reference: payment.reference,
      },

      include: {
        items: {
          include: {
            ticketType: true,
            tickets: true,
          },
        },

        paymentAttempts: true,
      },
    });

  if (!existingOrder) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  const expectedAmountInKobo =
    Math.round(
      Number(
        existingOrder.totalAmount
      ) * 100
    );

  if (
    payment.amountInKobo !==
    expectedAmountInKobo
  ) {
    throw new AppError(
      "Payment amount does not match order total",
      400
    );
  }

  if (
    payment.currency &&
    payment.currency !== "NGN"
  ) {
    throw new AppError(
      "Invalid payment currency",
      400
    );
  }

  // Already fulfilled.
  // We still safely return the existing order.
  if (
    existingOrder.status === "PAID"
  ) {
    return existingOrder;
  }

  return prisma.$transaction(
    async (tx) => {
      /**
       * Atomically claim the order.
       *
       * Only one process can successfully move:
       *
       * PENDING -> PROCESSING
       */
      const claim =
        await tx.order.updateMany({
          where: {
            id: existingOrder.id,
            status: "PENDING",
          },

          data: {
            status: "PROCESSING",
          },
        });

      /**
       * If count is zero, another webhook
       * or verification request already
       * claimed or completed this order.
       */
      if (claim.count === 0) {
        const currentOrder =
          await tx.order.findUnique({
            where: {
              id: existingOrder.id,
            },

            include: {
              event: true,

              items: {
                include: {
                  ticketType: true,
                  tickets: true,
                },
              },

              paymentAttempts: true,
            },
          });

        if (!currentOrder) {
          throw new AppError(
            "Order not found",
            404
          );
        }

        return currentOrder;
      }

      /**
       * Update or create the payment
       * audit record.
       */
      await tx.paymentAttempt.upsert({
        where: {
          providerReference:
            payment.reference,
        },

        update: {
          providerTxnId:
            payment.providerTxnId,

          status: "SUCCESS",

          currency:
            payment.currency ??
            "NGN",

          channel:
            payment.channel,

          gatewayResponse:
            payment.gatewayResponse,

          paidAt:
            payment.paidAt ??
            new Date(),
        },

        create: {
          provider: "PAYSTACK",

          providerReference:
            payment.reference,

          providerTxnId:
            payment.providerTxnId,

          amount:
            existingOrder.totalAmount,

          currency:
            payment.currency ??
            "NGN",

          status: "SUCCESS",

          channel:
            payment.channel,

          gatewayResponse:
            payment.gatewayResponse,

          paidAt:
            payment.paidAt ??
            new Date(),

          orderId:
            existingOrder.id,
        },
      });

      /**
       * We are now the only transaction
       * allowed to issue tickets.
       */
      for (
        const item of
        existingOrder.items
      ) {
        /**
         * Extra duplicate protection.
         */
        if (
          item.tickets.length > 0
        ) {
          continue;
        }

        /**
         * Atomically increment sold count
         * only if enough stock remains.
         */
        const stockUpdate =
          await tx.ticketType.updateMany({
            where: {
              id:
                item.ticketTypeId,

              sold: {
                lte:
                  item.ticketType
                    .quantity -
                  item.quantity,
              },
            },

            data: {
              sold: {
                increment:
                  item.quantity,
              },
            },
          });

        if (
          stockUpdate.count !== 1
        ) {
          throw new AppError(
            `${item.ticketType.name} no longer has enough stock`,
            409
          );
        }

        /**
         * Generate purchased tickets.
         */
        await tx.ticket.createMany({
          data: Array.from(
            {
              length:
                item.quantity,
            },

            () => ({
              code:
                generateTicketCode(),

              status:
                "VALID" as const,

              userId:
                existingOrder.userId,

              orderItemId:
                item.id,
            })
          ),
        });
      }

      /**
       * Fulfillment completed.
       */
      return tx.order.update({
        where: {
          id: existingOrder.id,
        },

        data: {
          status: "PAID",
        },

        include: {
          event: true,

          items: {
            include: {
              ticketType: true,
              tickets: true,
            },
          },

          paymentAttempts: true,
        },
      });
    },
    {
      maxWait: 15000,
      timeout: 30000,
    }
  );
};