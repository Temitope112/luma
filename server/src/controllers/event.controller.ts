import type {
  NextFunction,
  Response,
} from "express";

import { z } from "zod";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

import {
  createEventService,
  deleteEventService,
  getAllEventsService,
  getEventByIdService,
  getEventBySlugService,
  publishEventService,
  updateEventService,
} from "../services/event.service.js";

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
  image: z.string().url().optional(),

  venue: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  startsAt: z.coerce.date(),

  endsAt: z.coerce.date().optional(),

  capacity: z.coerce.number().int().positive().optional(),
});

const updateEventSchema = createEventSchema.partial();

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("You are not authenticated", 401);
    }

    const data = createEventSchema.parse(req.body);

    const event = await createEventService({
      ...data,
      organizerId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await getAllEventsService();

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.id;

    if (!eventId || Array.isArray(eventId)) {
      throw new AppError("Event ID is required", 400);
    }

    const event = await getEventByIdService(eventId);

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("You are not authenticated", 401);
    }

    const eventId = req.params.id;

    if (!eventId || Array.isArray(eventId)) {
      throw new AppError("Event ID is required", 400);
    }

    const data = updateEventSchema.parse(req.body);

    const event = await updateEventService(
      eventId,
      req.user.userId,
      req.user.role,
      data
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("You are not authenticated", 401);
    }

    const eventId = req.params.id;

    if (!eventId || Array.isArray(eventId)) {
      throw new AppError("Event ID is required", 400);
    }

    const result = await deleteEventService(
      eventId,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
export const publishEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("You are not authenticated", 401);
    }

    const eventId = req.params.id;

    if (!eventId || Array.isArray(eventId)) {
      throw new AppError("Event ID is required", 400);
    }

    const event = await publishEventService(
      eventId,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Event published successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};
export const getEventBySlug = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug =
      req.params.slug;

    if (
      !slug ||
      Array.isArray(slug)
    ) {
      throw new AppError(
        "Event slug is required",
        400
      );
    }

    const event =
      await getEventBySlugService(
        slug
      );

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};