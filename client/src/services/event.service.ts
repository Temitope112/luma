import { api } from "@/lib/api";

import type {
  Event,
  EventsResponse,
} from "@/types/event";

export const getEvents = async (): Promise<Event[]> => {
  const response =
    await api.get<EventsResponse>("/events");

  return response.data.events;
};

export const getEventBySlug = async (
  slug: string
): Promise<Event> => {
  const response =
    await api.get<{
      success: boolean;
      event: Event;
    }>(
      `/events/slug/${slug}`
    );

  return response.data.event;
};