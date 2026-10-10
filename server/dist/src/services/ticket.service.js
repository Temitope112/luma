import { prisma } from "../utils/prisma.js";
export const getMyTicketsService = async (userId) => {
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
//# sourceMappingURL=ticket.service.js.map