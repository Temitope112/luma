import { api } from "@/lib/api";

export type IssuedTicket = {
  id: string;
  status: "VALID" | "USED" | "CANCELLED";
  createdAt?: string;
};

export type PaidOrderItem = {
  id: string;
  quantity: number;
  unitPrice?: string | number;
  ticketType?: {
    id: string;
    name: string;
    price: string | number;
  };
  tickets?: IssuedTicket[];
};

export type VerifiedOrder = {
  id: string;
  reference: string;
  totalAmount: string | number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "CANCELLED"
    | "REFUNDED";

  event?: {
    id: string;
    title: string;
    slug: string;
    venue: string;
    city?: string | null;
    startsAt: string;
    image?: string | null;
  };

  items?: PaidOrderItem[];
};

export type VerifyPaymentResponse = {
  success: boolean;
  message: string;
  order: VerifiedOrder;
};

export const verifyPayment = async (
  reference: string
): Promise<VerifyPaymentResponse> => {
  const response =
    await api.get<VerifyPaymentResponse>(
      `/payments/verify/${reference}`
    );

  return response.data;
};