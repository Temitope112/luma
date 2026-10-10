import { prisma } from "../utils/prisma";

export const getMyTicketsService = async (
  userId: string
) => {
  return prisma.ticket.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItem: {
        include: {
          ticketType: {
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  venue: true,
                  startsAt: true,
                  endsAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
};