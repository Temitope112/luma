"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import { getEventBySlug } from "@/services/event.service";
import { createOrder } from "@/services/order.service";

import type { Event } from "@/types/event";

import TicketSelector from "@/components/events/TicketSelector";

type Selection = {
  ticketTypeId: string;
  quantity: number;
};

export default function EventDetailsClient() {
  const params = useParams();
  const router = useRouter();

  const slug =
    params.slug as string;

  const [event, setEvent] =
    useState<Event | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    selections,
    setSelections,
  ] = useState<Selection[]>([]);

  const [
    purchasing,
    setPurchasing,
  ] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getEventBySlug(slug);

        setEvent(data);
      } catch (error) {
        console.error(error);

        setError(
          "We couldn't load this event."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadEvent();
    }
  }, [slug]);

  const total = useMemo(() => {
    if (!event) return 0;

    return selections.reduce(
      (sum, item) => {
        const ticket =
          event.ticketTypes?.find(
            (ticket) =>
              ticket.id ===
              item.ticketTypeId
          );

        if (!ticket) {
          return sum;
        }

        return (
          sum +
          Number(ticket.price) *
            item.quantity
        );
      },
      0
    );
  }, [event, selections]);

  const handlePurchase =
    async () => {
      if (
        !event ||
        selections.length === 0
      ) {
        return;
      }

      try {
        setPurchasing(true);

        const result =
          await createOrder({
            eventId: event.id,
            items: selections,
          });

        const authorizationUrl =
          result.payment
            ?.authorization_url;

        if (!authorizationUrl) {
          throw new Error(
            "Payment link was not returned."
          );
        }

        window.location.href =
          authorizationUrl;
      } catch (error: any) {
        console.error(error);

        if (
          error?.response?.status ===
          401
        ) {
          router.push(
            `/login?redirect=/events/${slug}`
          );

          return;
        }

        setError(
          error?.response?.data
            ?.message ??
            "Unable to start checkout."
        );
      } finally {
        setPurchasing(false);
      }
    };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FCFBF8]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="h-5 w-24 animate-pulse rounded bg-black/5" />

          <div className="mt-10 h-[430px] animate-pulse rounded-[30px] bg-black/5" />

          <div className="mt-8 h-10 w-2/3 animate-pulse rounded bg-black/5" />
        </div>
      </main>
    );
  }

  if (
    error &&
    !event
  ) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] px-5 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-semibold">
            Event unavailable
          </h1>

          <p className="mt-3 text-neutral-500">
            {error}
          </p>

          <Link
            href="/events"
            className="mt-7 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Browse events
          </Link>
        </div>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  const startsAt =
    new Date(event.startsAt);

  return (
    <main className="min-h-screen bg-[#FCFBF8] pb-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={15} />
          Back to events
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
            duration: 0.65,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mt-8 overflow-hidden rounded-[30px] bg-neutral-200"
        >
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=90"
            }
            alt={event.title}
            className="h-[340px] w-full object-cover sm:h-[470px] lg:h-[540px]"
          />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <section>
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
                delay: 0.12,
                duration: 0.55,
              }}
            >
              {event.category && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A6DF6]">
                  {event.category}
                </span>
              )}

              <h1 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#171717] sm:text-6xl">
                {event.title}
              </h1>

              <div className="mt-7 flex flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:flex-wrap sm:gap-7">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />

                  {startsAt.toLocaleDateString(
                    "en-NG",
                    {
                      weekday:
                        "long",
                      month:
                        "long",
                      day:
                        "numeric",
                      year:
                        "numeric",
                    }
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} />

                  {startsAt.toLocaleTimeString(
                    "en-NG",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />

                  {event.city
                    ? `${event.venue}, ${event.city}`
                    : event.venue}
                </div>
              </div>
            </motion.div>

            <div className="my-10 h-px bg-black/8" />

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                About this event
              </h2>

              <p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-8 text-neutral-600">
                {event.description}
              </p>
            </section>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[26px] bg-white p-5 shadow-[0_20px_60px_rgba(40,30,70,0.07)]">
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Tickets
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Choose your ticket
                </h2>
              </div>

              <TicketSelector
                ticketTypes={
                  event.ticketTypes ??
                  []
                }
                onChange={
                  setSelections
                }
              />

              <div className="mt-5 border-t border-black/8 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    Total
                  </span>

                  <strong className="text-xl tracking-[-0.03em]">
                    ₦
                    {total.toLocaleString(
                      "en-NG"
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePurchase
                  }
                  disabled={
                    selections.length ===
                      0 ||
                    purchasing
                  }
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#171717] text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {purchasing
                    ? "Starting checkout..."
                    : "Get tickets"}
                </button>

                {error && event && (
                  <p className="mt-3 text-xs leading-5 text-red-500">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/8 bg-white/95 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.12em] text-neutral-400">
              Total
            </span>

            <strong className="text-lg">
              ₦
              {total.toLocaleString(
                "en-NG"
              )}
            </strong>
          </div>

          <button
            type="button"
            onClick={
              handlePurchase
            }
            disabled={
              selections.length ===
                0 ||
              purchasing
            }
            className="h-12 flex-1 rounded-xl bg-[#171717] px-6 text-sm font-semibold text-white disabled:opacity-40"
          >
            {purchasing
              ? "Loading..."
              : "Get tickets"}
          </button>
        </div>
      </div>
    </main>
  );
}