export type TicketType = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  quantity: number;
  sold: number;
  salesStart?: string | null;
  salesEnd?: string | null;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: string | null;
  image?: string | null;

  venue: string;
  address?: string | null;
  city?: string | null;
  country: string;

  startsAt: string;
  endsAt?: string | null;

  capacity?: number | null;

  status:
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";

  ticketTypes?: TicketType[];
};

export type EventsResponse = {
  success: boolean;
  events: Event[];
};