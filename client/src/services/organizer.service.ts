import { api } from "@/lib/api";

export type DashboardEvent = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  venue: string;
  city: string;
  startsAt: string;
  endsAt: string;
  status:
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";
  capacity: number | null;
  ticketsSold: number;
  revenue: number;
  ordersCount: number;
};

export type RecentSale = {
  id: string;
  amount: number;
  createdAt: string;

  event: {
    id: string;
    title: string;
    slug: string;
  };

  attendee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type OrganizerDashboard = {
  stats: {
    totalEvents: number;
    publishedEvents: number;
    upcomingEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
  };

  events: DashboardEvent[];

  recentSales: RecentSale[];
};

export const getOrganizerDashboard =
  async (): Promise<OrganizerDashboard> => {
    const response =
      await api.get<{
        success: boolean;
        dashboard: OrganizerDashboard;
      }>(
        "/organizer/dashboard"
      );

    return response.data.dashboard;
  };
  export type CheckedInTicket = {
  id: string;
  code: string;
  status:
    | "VALID"
    | "USED"
    | "CANCELLED";

  checkedInAt:
    | string
    | null;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  orderItem: {
    ticketType: {
      id: string;
      name: string;
    };

    order: {
      event: {
        id: string;
        title: string;
        slug: string;
        venue: string;
        city: string | null;
        startsAt: string;
      };
    };
  };
};

export const checkInTicket =
  async (
    value: string
  ): Promise<CheckedInTicket> => {
    const response =
      await api.post<{
        success: boolean;
        message: string;
        ticket: CheckedInTicket;
      }>(
        "/organizer/check-in",
        {
          value,
        }
      );

    return response.data.ticket;
  };