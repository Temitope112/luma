"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Ticket,
} from "lucide-react";

import {
  getMyOrders,
  type Order,
} from "@/services/order.service";

import { useAuth } from "@/context/AuthContext";

export default function MyTicketsPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getMyOrders();

        setOrders(data);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data
            ?.message ??
            "Unable to load your tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, authLoading]);

  const paidOrders =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status === "PAID"
      );
    }, [orders]);

  const totalTickets =
    useMemo(() => {
      return paidOrders.reduce(
        (total, order) =>
          total +
          order.items.reduce(
            (count, item) =>
              count +
              item.tickets.length,
            0
          ),
        0
      );
    }, [paidOrders]);

  if (
    authLoading ||
    loading
  ) {
    return (
      <main className="min-h-screen bg-[#FCFBF8]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="h-4 w-28 animate-pulse rounded bg-black/5" />

          <div className="mt-4 h-12 w-72 animate-pulse rounded bg-black/5" />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[26px] bg-black/5"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
            <Ticket size={22} />
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
            Your tickets live here.
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Sign in to see your purchased
            tickets and event details.
          </p>

          <Link
            href="/login?redirect=/tickets"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#171717] px-6 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFBF8] pb-20">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6DF6]">
              My tickets
            </p>

            <h1 className="mt-3 text-[44px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#171717] sm:text-6xl">
              Your next
              <span className="block">
                experience awaits.
              </span>
            </h1>
          </div>

          <div className="rounded-full bg-[#EEE9FF] px-4 py-2 text-xs font-semibold text-[#7459E8]">
            {totalTickets}{" "}
            {totalTickets === 1
              ? "ticket"
              : "tickets"}
          </div>
        </motion.div>

        {error && (
          <div className="mt-10 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error &&
          paidOrders.length === 0 && (
            <div className="mt-14 rounded-[28px] bg-[#F4F1EC] p-8 text-center sm:p-12">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#8A6DF6]">
                <Ticket size={22} />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                No tickets yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Find an event you love and
                your ticket will appear here
                after payment.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-6 text-sm font-semibold text-white"
              >
                Discover events
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {paidOrders.map(
            (order, index) => {
              const ticketCount =
                order.items.reduce(
                  (count, item) =>
                    count +
                    item.tickets.length,
                  0
                );

              const eventDate =
                new Date(
                  order.event.startsAt
                );

              return (
                <motion.article
                  key={order.id}
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
                      index * 0.06,
                    duration: 0.5,
                  }}
                  className="group overflow-hidden rounded-[26px] bg-white shadow-[0_14px_45px_rgba(40,30,70,0.06)]"
                >
                  <Link
                    href={`/tickets/${order.id}`}
                    className="block"
                  >
                    <div className="relative h-52 overflow-hidden bg-neutral-200 sm:h-60">
                      <img
                        src={
                          order.event
                            .image ||
                          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90"
                        }
                        alt={
                          order.event.title
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-neutral-800 backdrop-blur">
                        {ticketCount}{" "}
                        {ticketCount ===
                        1
                          ? "ticket"
                          : "tickets"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-semibold tracking-[-0.035em]">
                        {
                          order.event
                            .title
                        }
                      </h2>

                      <div className="mt-4 space-y-2 text-xs text-neutral-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={14}
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
                          <MapPin
                            size={14}
                          />

                          {order.event
                            .city
                            ? `${order.event.venue}, ${order.event.city}`
                            : order.event
                                .venue}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-black/6 pt-4">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                          {
                            order.reference
                          }
                        </span>

                        <span className="flex items-center gap-1 text-xs font-semibold text-[#7459E8]">
                          View ticket
                          <ArrowRight
                            size={13}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}