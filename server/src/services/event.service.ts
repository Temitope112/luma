import { prisma } from "../utils/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
import { createSlug } from "../utils/slug.js";

type CreateEventInput = {
  title: string;
  description: string;
  category?: string;
  image?: string;
  venue: string;
  address?: string;
  city?: string;
  country?: string;
  startsAt: Date;
  endsAt?: Date;
  capacity?: number;
  organizerId: string;
};

type UpdateEventInput = Partial<
  Omit<CreateEventInput, "organizerId">
>;

export const createEventService = async (
  data: CreateEventInput
) => {
  let slug = createSlug(data.title);

  const existingSlug = await prisma.event.findUnique({
    where: {
      slug,
    },
  });

  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      image: data.image,
      venue: data.venue,
      address: data.address,
      city: data.city,
      country: data.country ?? "Nigeria",
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      capacity: data.capacity,
      organizerId: data.organizerId,
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const getAllEventsService = async () => {
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      startsAt: "asc",
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      ticketTypes: true,
    },
  });
};

export const getEventByIdService = async (
  eventId: string
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      ticketTypes: true,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
};

export const updateEventService = async (
  eventId: string,
  userId: string,
  role: "ATTENDEE" | "ORGANIZER" | "ADMIN",
  data: UpdateEventInput
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (
    role !== "ADMIN" &&
    event.organizerId !== userId
  ) {
    throw new AppError(
      "You cannot edit this event",
      403
    );
  }

  let slug = event.slug;

  if (data.title && data.title !== event.title) {
    slug = createSlug(data.title);

    const slugExists = await prisma.event.findFirst({
      where: {
        slug,
        NOT: {
          id: eventId,
        },
      },
    });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      ...data,
      slug,
    },
  });
};

export const deleteEventService = async (
  eventId: string,
  userId: string,
  role: "ATTENDEE" | "ORGANIZER" | "ADMIN"
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (
    role !== "ADMIN" &&
    event.organizerId !== userId
  ) {
    throw new AppError(
      "You cannot delete this event",
      403
    );
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    message: "Event deleted successfully",
  };
};

export const publishEventService = async (
  eventId: string,
  userId: string,
  role: "ATTENDEE" | "ORGANIZER" | "ADMIN"
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      ticketTypes: true,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (
    role !== "ADMIN" &&
    event.organizerId !== userId
  ) {
    throw new AppError(
      "You cannot publish this event",
      403
    );
  }

  if (event.status === "CANCELLED") {
    throw new AppError(
      "A cancelled event cannot be published",
      400
    );
  }

  if (event.ticketTypes.length === 0) {
    throw new AppError(
      "Add at least one ticket type before publishing",
      400
    );
  }

  const publishedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      status: "PUBLISHED",
    },
    include: {
      ticketTypes: true,
    },
  });

  return publishedEvent;
};

export const getEventBySlugService = async (
  slug: string
) => {
  const event =
    await prisma.event.findUnique({
      where: {
        slug,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ticketTypes: true,
      },
    });

  if (!event) {
    throw new AppError(
      "Event not found",
      404
    );
  }

  if (event.status !== "PUBLISHED") {
    throw new AppError(
      "Event is not available",
      404
    );
  }

  return event;
};