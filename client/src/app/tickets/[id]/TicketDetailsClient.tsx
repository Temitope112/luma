"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";

import {
  getOrderById,
  type Order,
} from "@/services/order.service";

type TicketDetailsClientProps = {
  orderId: string;
};

export default function TicketDetailsClient({
  orderId,
}: TicketDetailsClientProps) {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getOrderById(
            orderId
          );

        setOrder(data);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data
            ?.message ??
            "Unable to load this ticket."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="h-4 w-24 animate-pulse rounded bg-black/5" />

          <div className="mt-8 h-[650px] animate-pulse rounded-[30px] bg-black/5" />
        </div>
      </main>
    );
  }

  if (
    error ||
    !order ||
    order.status !== "PAID"
  ) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">
            Ticket unavailable
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            {error ??
              "This order does not contain an active paid ticket."}
          </p>

          <Link
            href="/tickets"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#171717] px-6 text-sm font-semibold text-white"
          >
            My tickets
          </Link>
        </div>
      </main>
    );
  }

  const eventDate =
    new Date(
      order.event.startsAt
    );

  const tickets =
    order.items.flatMap(
      (item) =>
        item.tickets.map(
          (ticket) => ({
            ...ticket,
            ticketType:
              item.ticketType.name,
          })
        )
    );

  return (
    <main className="min-h-screen bg-[#F4F1EC] pb-20">
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={15} />
          My tickets
        </Link>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6DF6]">
            Event ticket
          </p>

          <h1 className="mt-3 text-[40px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
            {order.event.title}
          </h1>
        </motion.div>

        <div className="mt-8 space-y-5">
          {tickets.map(
            (ticket, index) => (
              <motion.article
                key={ticket.id}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.08,
                  duration: 0.5,
                }}
                className="overflow-hidden rounded-[30px] bg-[#171717] text-white shadow-[0_25px_70px_rgba(40,30,70,0.15)]"
              >
                <div className="relative h-52 overflow-hidden sm:h-64">
                  <img
                    src={
                      order.event
                        .image ||
                      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90"
                    }
                    alt={
                      order.event.title
                    }
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-black/10 to-transparent" />
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                        Admission
                      </span>

                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                        {
                          ticket.ticketType
                        }
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                        ticket.status ===
                        "VALID"
                          ? "bg-[#8A6DF6] text-white"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 text-sm text-white/60 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                      />

                      {eventDate.toLocaleDateString(
                        "en-NG",
                        {
                          weekday:
                            "short",
                          month:
                            "short",
                          day:
                            "numeric",
                          year:
                            "numeric",
                        }
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock
                        size={15}
                      />

                      {eventDate.toLocaleTimeString(
                        "en-NG",
                        {
                          hour:
                            "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin
                        size={15}
                      />

                      {order.event.city
                        ? `${order.event.venue}, ${order.event.city}`
                        : order.event
                            .venue}
                    </div>
                  </div>

                  <div className="my-7 border-t border-dashed border-white/15" />

                  <div className="rounded-[24px] bg-white p-5 text-[#171717] sm:p-7">
                    <div className="mx-auto w-fit rounded-2xl bg-white p-2">
                      <QRCodeSVG
                        value={`LUMA:TICKET:${ticket.code}`}
                        size={190}
                        level="H"
                        marginSize={2}
                      />
                    </div>

                    <div className="mt-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                        <CheckCircle2
                          size={14}
                          className="text-[#8A6DF6]"
                        />

                        Ready for check-in
                      </div>

                      <p className="mt-2 text-[11px] leading-5 text-neutral-400">
                        Present this QR code
                        at the event entrance.
                      </p>
                    </div>

                    <div className="mt-5 rounded-xl bg-[#F4F1EC] px-4 py-3">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                        Ticket code
                      </span>

                      <p className="mt-1 break-all font-mono text-[11px] font-semibold text-[#171717]">
                        {ticket.code}
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl border border-black/5 px-4 py-3">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                        Ticket ID
                      </span>

                      <p className="mt-1 break-all font-mono text-[10px] text-neutral-500">
                        {ticket.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
                    <Ticket size={13} />
                    Order {order.reference}
                  </div>
                </div>
              </motion.article>
            )
          )}
        </div>
      </div>
    </main>
  );
}