"use client";

import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";

import type {
  TicketType,
} from "@/types/event";

type TicketSelectorProps = {
  ticketTypes: TicketType[];
  onChange: (
    selections: {
      ticketTypeId: string;
      quantity: number;
    }[]
  ) => void;
};

export default function TicketSelector({
  ticketTypes,
  onChange,
}: TicketSelectorProps) {
  const [quantities, setQuantities] =
    useState<Record<string, number>>({});

  const selections = useMemo(() => {
    return ticketTypes
      .map((ticket) => ({
        ticketTypeId: ticket.id,
        quantity:
          quantities[ticket.id] ?? 0,
      }))
      .filter(
        (item) =>
          item.quantity > 0
      );
  }, [quantities, ticketTypes]);

  const updateQuantity = (
    ticketId: string,
    next: number,
    max: number
  ) => {
    const safeValue =
      Math.max(
        0,
        Math.min(next, max)
      );

    const nextQuantities = {
      ...quantities,
      [ticketId]: safeValue,
    };

    setQuantities(
      nextQuantities
    );

    onChange(
      ticketTypes
        .map((ticket) => ({
          ticketTypeId:
            ticket.id,
          quantity:
            nextQuantities[
              ticket.id
            ] ?? 0,
        }))
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  if (ticketTypes.length === 0) {
    return (
      <div className="rounded-2xl bg-[#F4F1EC] p-5 text-sm text-neutral-600">
        Tickets are not available for this event yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ticketTypes.map(
        (ticket, index) => {
          const remaining =
            ticket.quantity -
            ticket.sold;

          const quantity =
            quantities[
              ticket.id
            ] ?? 0;

          return (
            <motion.div
              key={ticket.id}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay:
                  index * 0.06,
              }}
              className="rounded-[20px] border border-black/8 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Ticket
                      size={15}
                      className="text-[#8A6DF6]"
                    />

                    <h3 className="font-semibold tracking-[-0.02em]">
                      {ticket.name}
                    </h3>
                  </div>

                  {ticket.description && (
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {ticket.description}
                    </p>
                  )}

                  <p className="mt-3 text-sm font-semibold">
                    ₦
                    {Number(
                      ticket.price
                    ).toLocaleString(
                      "en-NG"
                    )}
                  </p>

                  <p className="mt-1 text-[11px] text-neutral-400">
                    {remaining} remaining
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#F7F5F1] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        ticket.id,
                        quantity - 1,
                        remaining
                      )
                    }
                    disabled={
                      quantity === 0
                    }
                    className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        ticket.id,
                        quantity + 1,
                        remaining
                      )
                    }
                    disabled={
                      quantity >=
                      remaining
                    }
                    className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        }
      )}
    </div>
  );
}