import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";
import { generateOrderReference } from "../utils/ticket-code";
import { initializePaystackPayment } from "./payment.service";

type OrderItemInput = {
  ticketTypeId: string;
  quantity: number;
};

type CreateOrderInput = {
  eventId: string;
  items: OrderItemInput[];
};

type Role = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export const createOrderService = async (
  userId: string,
  data: CreateOrderInput
) => {
  if (data.items.length === 0) {
    throw new AppError(
      "At least one ticket is required",
      400
    );
  }

  const result = await prisma.$transaction(
    async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const event = await tx.event.findUnique({
        where: {
          id: data.eventId,
        },
      });

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      if (event.status !== "PUBLISHED") {
        throw new AppError(
          "Tickets can only be purchased for published events",
          400
        );
      }

      if (event.startsAt <= new Date()) {
        throw new AppError(
          "Ticket sales are closed for this event",
          400
        );
      }

      const ticketTypeIds = data.items.map(
        (item) => item.ticketTypeId
      );

      if (
        new Set(ticketTypeIds).size !==
        ticketTypeIds.length
      ) {
        throw new AppError(
          "Duplicate ticket types are not allowed in the same order",
          400
        );
      }

      const ticketTypes =
        await tx.ticketType.findMany({
          where: {
            id: {
              in: ticketTypeIds,
            },
            eventId: data.eventId,
          },
        });

      if (
        ticketTypes.length !==
        ticketTypeIds.length
      ) {
        throw new AppError(
          "One or more ticket types are invalid",
          400
        );
      }

      let totalAmount = 0;

      const preparedItems = data.items.map(
        (item) => {
          const ticketType =
            ticketTypes.find(
              (ticket) =>
                ticket.id === item.ticketTypeId
            );

          if (!ticketType) {
            throw new AppError(
              "Ticket type not found",
              404
            );
          }

          if (item.quantity < 1) {
            throw new AppError(
              "Ticket quantity must be at least 1",
              400
            );
          }

          const remaining =
            ticketType.quantity -
            ticketType.sold;

          if (
            remaining <
            item.quantity
          ) {
            throw new AppError(
              `Only ${remaining} ${ticketType.name} ticket(s) remaining`,
              400
            );
          }

          const now = new Date();

          if (
            ticketType.salesStart &&
            now < ticketType.salesStart
          ) {
            throw new AppError(
              `${ticketType.name} ticket sales have not started`,
              400
            );
          }

          if (
            ticketType.salesEnd &&
            now > ticketType.salesEnd
          ) {
            throw new AppError(
              `${ticketType.name} ticket sales have ended`,
              400
            );
          }

          totalAmount +=
            Number(ticketType.price) *
            item.quantity;

          return {
            ticketType,
            quantity: item.quantity,
          };
        }
      );

      const reference =
        generateOrderReference();

      const order =
        await tx.order.create({
          data: {
            reference,
            totalAmount,
            status: "PENDING",
            userId,
            eventId: data.eventId,
          },
        });

      for (const item of preparedItems) {
        await tx.orderItem.create({
          data: {
            quantity: item.quantity,
            unitPrice:
              item.ticketType.price,
            orderId: order.id,
            ticketTypeId:
              item.ticketType.id,
          },
        });
      }

      return {
        order,
        user,
      };
    }
  );

  const payment =
    await initializePaystackPayment({
      email: result.user.email,
      amount: Number(
        result.order.totalAmount
      ),
      reference:
        result.order.reference,
    });

  await prisma.paymentAttempt.create({
    data: {
      provider: "PAYSTACK",
      providerReference:
        payment.reference,
      amount:
        result.order.totalAmount,
      currency: "NGN",
      status: "INITIALIZED",
      orderId: result.order.id,
    },
  });

  return {
    order: result.order,
    payment,
  };
};

export const getMyOrdersService = async (
  userId: string
) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          venue: true,
          startsAt: true,
        },
      },
      items: {
        include: {
          ticketType: true,
          tickets: true,
        },
      },
      paymentAttempts: true,
    },
  });
};

export const getOrderByIdService = async (
  orderId: string,
  userId: string,
  role: Role
) => {
  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            organizerId: true,
            venue: true,
            startsAt: true,
          },
        },
        items: {
          include: {
            ticketType: true,
            tickets: true,
          },
        },
        paymentAttempts: true,
      },
    });

  if (!order) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  const canView =
    role === "ADMIN" ||
    order.userId === userId ||
    order.event.organizerId ===
      userId;

  if (!canView) {
    throw new AppError(
      "You do not have permission to view this order",
      403
    );
  }

  return order;
};