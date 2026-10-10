import { api } from "@/lib/api";

export type CreateOrderItem = {
  ticketTypeId: string;
  quantity: number;
};

export type CreateOrderInput = {
  eventId: string;
  items: CreateOrderItem[];
};

export type TicketStatus =
  | "VALID"
  | "USED"
  | "CANCELLED";

export type OrderTicket = {
  id: string;
  status: TicketStatus;
  createdAt?: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  unitPrice?: string | number;

  ticketType: {
    id: string;
    name: string;
    price: string | number;
  };

  tickets: OrderTicket[];
};

export type OrderEvent = {
  id: string;
  title: string;
  slug: string;
  description?: string;

  image?: string | null;

  venue: string;
  address?: string | null;
  city?: string | null;
  country?: string;

  startsAt: string;
  endsAt?: string | null;
};

export type Order = {
  id: string;
  reference: string;

  totalAmount: string | number;

  status:
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "CANCELLED"
    | "REFUNDED";

  event: OrderEvent;

  items: OrderItem[];

  createdAt: string;
};

export const createOrder = async (
  data: CreateOrderInput
) => {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
};

export const getMyOrders =
  async (): Promise<Order[]> => {
    const response =
      await api.get<{
        success: boolean;
        orders: Order[];
      }>("/orders/me");

    return response.data.orders;
  };

export const getOrderById = async (
  orderId: string
): Promise<Order> => {
  const response =
    await api.get<{
      success: boolean;
      order: Order;
    }>(`/orders/${orderId}`);

  return response.data.order;
};