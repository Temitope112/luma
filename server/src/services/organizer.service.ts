import { prisma } from "../utils/prisma.js";
import { AppError } from "../middleware/error.middleware.js";

export const getOrganizerDashboardService = async (
  userId: string,
  role: string
) => {
  if (
    role !== "ORGANIZER" &&
    role !== "ADMIN"
  ) {
    throw new AppError(
      "Organizer access required",
      403
    );
  }

  const events = await prisma.event.findMany({
    where: {
      organizerId: userId,
    },
    include: {
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          sold: true,
        },
      },

      orders: {
        where: {
          status: "PAID",
        },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalEvents = events.length;

  const publishedEvents =
    events.filter(
      (event) =>
        event.status === "PUBLISHED"
    ).length;

  const upcomingEvents =
    events.filter(
      (event) =>
        event.status === "PUBLISHED" &&
        event.startsAt > new Date()
    ).length;

  const totalTicketsSold =
    events.reduce(
      (total, event) =>
        total +
        event.ticketTypes.reduce(
          (sum, ticketType) =>
            sum + ticketType.sold,
          0
        ),
      0
    );

  const totalRevenue =
    events.reduce(
      (total, event) =>
        total +
        event.orders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.totalAmount
            ),
          0
        ),
      0
    );

  const recentSales = events
    .flatMap((event) =>
      event.orders.map((order) => ({
        id: order.id,
        amount: Number(
          order.totalAmount
        ),
        createdAt:
          order.createdAt,
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
        },
        attendee: order.user,
      }))
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime()
    )
    .slice(0, 6);

  const formattedEvents =
    events.map((event) => {
      const ticketsSold =
        event.ticketTypes.reduce(
          (total, ticketType) =>
            total +
            ticketType.sold,
          0
        );

      const revenue =
        event.orders.reduce(
          (total, order) =>
            total +
            Number(
              order.totalAmount
            ),
          0
        );

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        image: event.image,
        venue: event.venue,
        city: event.city,
        startsAt:
          event.startsAt,
        endsAt:
          event.endsAt,
        status: event.status,
        capacity:
          event.capacity,
        ticketsSold,
        revenue,
        ordersCount:
          event.orders.length,
      };
    });

  return {
    stats: {
      totalEvents,
      publishedEvents,
      upcomingEvents,
      totalTicketsSold,
      totalRevenue,
    },

    events:
      formattedEvents,

    recentSales,
  };
};