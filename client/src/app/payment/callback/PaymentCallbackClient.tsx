"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleAlert,
  LoaderCircle,
  MapPin,
  Ticket,
} from "lucide-react";

import {
  verifyPayment,
  type VerifiedOrder,
} from "@/services/payment.service";

type PaymentCallbackClientProps = {
  reference: string | null;
};

type PageStatus =
  | "loading"
  | "success"
  | "error";

export default function PaymentCallbackClient({
  reference,
}: PaymentCallbackClientProps) {
  const [status, setStatus] =
    useState<PageStatus>("loading");

  const [order, setOrder] =
    useState<VerifiedOrder | null>(
      null
    );

  const [message, setMessage] =
    useState(
      "Confirming your payment..."
    );

  const hasVerified =
    useRef(false);

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const runVerification =
      async () => {
        if (!reference) {
          setStatus("error");
          setMessage(
            "Payment reference is missing."
          );

          return;
        }

        try {
          const result =
            await verifyPayment(
              reference
            );

          setOrder(result.order);

          if (
            result.order.status !==
            "PAID"
          ) {
            setStatus("error");
            setMessage(
              "Your payment could not be confirmed."
            );

            return;
          }

          setStatus("success");

          setMessage(
            result.message ||
              "Payment verified successfully."
          );
        } catch (error: any) {
          console.error(
            "Payment verification failed:",
            error
          );

          setStatus("error");

          setMessage(
            error?.response?.data
              ?.message ??
              "We couldn't verify your payment."
          );
        }
      };

    runVerification();
  }, [reference]);

  const issuedTickets =
    useMemo(() => {
      if (!order?.items) {
        return [];
      }

      return order.items.flatMap(
        (item) =>
          (item.tickets ?? []).map(
            (ticket) => ({
              ...ticket,
              ticketTypeName:
                item.ticketType
                  ?.name ??
                "Admission",
            })
          )
      );
    }, [order]);

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
            <LoaderCircle
              size={26}
              className="animate-spin"
            />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[#171717]">
            Confirming payment
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Hold on while we confirm
            your transaction and prepare
            your ticket.
          </p>
        </motion.div>
      </main>
    );
  }

  if (
    status === "error" ||
    !order
  ) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-[0_20px_70px_rgba(40,30,70,0.08)]"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
            <CircleAlert
              size={23}
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
            We couldn&apos;t confirm it
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {message}
          </p>

          {reference && (
            <div className="mt-6 rounded-2xl bg-[#F4F1EC] p-4 text-left">
              <span className="text-[10px] uppercase tracking-[0.13em] text-neutral-400">
                Reference
              </span>

              <p className="mt-1 break-all text-xs font-medium text-neutral-700">
                {reference}
              </p>
            </div>
          )}

          <Link
            href="/events"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#171717] text-sm font-semibold text-white"
          >
            Back to events
          </Link>
        </motion.div>
      </main>
    );
  }

  const event = order.event;

  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#8A6DF6] text-white"
        >
          <Check
            size={28}
            strokeWidth={2.5}
          />
        </motion.div>

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
            delay: 0.1,
            duration: 0.55,
          }}
          className="mt-6 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6DF6]">
            You&apos;re in
          </p>

          <h1 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-[#171717] sm:text-5xl">
            Your ticket is ready.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-neutral-500">
            Your payment was confirmed
            and your spot has been
            secured.
          </p>
        </motion.div>

        {event && (
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.55,
            }}
            className="mt-10 overflow-hidden rounded-[28px] bg-[#171717] text-white shadow-[0_25px_70px_rgba(40,30,70,0.13)]"
          >
            {event.image && (
              <div className="relative h-56 overflow-hidden sm:h-72">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-7">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                Event
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                {event.title}
              </h2>

              <div className="mt-5 grid gap-3 text-sm text-white/60 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                  />

                  {new Date(
                    event.startsAt
                  ).toLocaleDateString(
                    "en-NG",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin
                    size={15}
                  />

                  {event.city
                    ? `${event.venue}, ${event.city}`
                    : event.venue}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="mt-5 rounded-[26px] bg-white p-5 shadow-[0_15px_50px_rgba(40,30,70,0.05)] sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-black/6 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                Order
              </p>

              <p className="mt-1 text-sm font-semibold">
                {order.reference}
              </p>
            </div>

            <span className="rounded-full bg-[#EEE9FF] px-3 py-1.5 text-[10px] font-semibold text-[#7459E8]">
              PAID
            </span>
          </div>

          <div className="py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">
                Tickets
              </span>

              <strong className="text-sm">
                {issuedTickets.length}
              </strong>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-neutral-500">
                Amount paid
              </span>

              <strong className="text-lg tracking-[-0.03em]">
                ₦
                {Number(
                  order.totalAmount
                ).toLocaleString(
                  "en-NG"
                )}
              </strong>
            </div>
          </div>

          {issuedTickets.length >
            0 && (
            <div className="space-y-2 border-t border-black/6 pt-5">
              {issuedTickets.map(
                (
                  ticket,
                  index
                ) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-2xl bg-[#F7F5F1] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
                        <Ticket
                          size={15}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {
                            ticket.ticketTypeName
                          }
                        </p>

                        <p className="mt-0.5 text-[10px] text-neutral-400">
                          Ticket{" "}
                          {index + 1}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-[#7459E8]">
                      VALID
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </motion.section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {event && (
            <Link
              href={`/events/${event.slug}`}
              className="flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-[#171717] transition hover:bg-[#F4F1EC]"
            >
              Event details
            </Link>
          )}

          <Link
            href="/events"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] text-sm font-semibold text-white transition hover:bg-black"
          >
            Discover more events
            <ArrowRight
              size={15}
            />
          </Link>
        </div>
      </div>
    </main>
  );
}