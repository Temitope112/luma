"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ScanLine,
} from "lucide-react";

import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Plus,
  Ticket,
  UsersRound,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";

import {
  getOrganizerDashboard,
  type OrganizerDashboard,
} from "@/services/organizer.service";

const formatMoney = (
  value: number
) =>
  new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(value);

const formatDate = (
  value: string
) =>
  new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    dashboard,
    setDashboard,
  ] =
    useState<OrganizerDashboard | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(
        "/login?redirect=/dashboard"
      );

      return;
    }

    if (
      user.role !== "ORGANIZER" &&
      user.role !== "ADMIN"
    ) {
      router.replace(
        "/tickets"
      );

      return;
    }

    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await getOrganizerDashboard();

          setDashboard(data);
        } catch (error) {
          console.error(
            error
          );

          setError(
            "We couldn't load your dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, [
    user,
    authLoading,
    router,
  ]);

  if (
    authLoading ||
    loading
  ) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-black/5" />

          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-black/5" />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[24px] bg-black/5"
                />
              )
            )}
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-[28px] bg-black/5" />
        </div>
      </main>
    );
  }

  if (
    !user ||
    (
      user.role !==
        "ORGANIZER" &&
      user.role !==
        "ADMIN"
    )
  ) {
    return null;
  }

  if (
    error ||
    !dashboard
  ) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#FCFBF8] px-5">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">
            Dashboard unavailable
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            {error ??
              "Something went wrong."}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label:
        "Total revenue",
      value:
        formatMoney(
          dashboard.stats
            .totalRevenue
        ),
      icon:
        CircleDollarSign,
    },

    {
      label:
        "Tickets sold",
      value:
        dashboard.stats
          .totalTicketsSold,
      icon: Ticket,
    },

    {
      label:
        "Upcoming events",
      value:
        dashboard.stats
          .upcomingEvents,
      icon: CalendarDays,
    },

    {
      label:
        "Published",
      value:
        dashboard.stats
          .publishedEvents,
      icon: UsersRound,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FCFBF8] pb-20">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        {/* HEADER */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6DF6]">
              Organizer workspace
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#171717] md:text-5xl">
              Good to see you,{" "}
              {user.firstName}.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
              Track your events,
              ticket sales and
              attendee activity from
              one place.
            </p>
          </div>

          <Link
  href="/dashboard/check-in"
  className="flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#171717] transition hover:-translate-y-0.5"
>
  <ScanLine size={16} />
  Check in tickets
</Link>

          <Link
            href="/create-event"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Create event
          </Link>
        </div>

        {/* STATS */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(
            (
              stat,
              index
            ) => {
              const Icon =
                stat.icon;

              return (
                <motion.div
                  key={
                    stat.label
                  }
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.05,
                  }}
                  className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_rgba(30,20,60,0.04)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                      <Icon
                        size={
                          17
                        }
                      />
                    </div>
                  </div>

                  <p className="mt-7 text-2xl font-semibold tracking-[-0.04em] text-[#171717]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    {stat.label}
                  </p>
                </motion.div>
              );
            }
          )}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* EVENTS */}

          <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(30,20,60,0.04)] md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.04em]">
                  Your events
                </h2>

                <p className="mt-1 text-xs text-neutral-400">
                  {
                    dashboard
                      .stats
                      .totalEvents
                  }{" "}
                  total
                </p>
              </div>

              <Link
                href="/create-event"
                className="text-xs font-semibold text-[#7459E8]"
              >
                New event
              </Link>
            </div>

            {dashboard.events
              .length === 0 ? (
              <div className="py-16 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto text-neutral-300"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  No events yet
                </h3>

                <p className="mt-2 text-sm text-neutral-400">
                  Create your first
                  event to start
                  selling tickets.
                </p>

                <Link
                  href="/create-event"
                  className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
                >
                  Create event
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {dashboard.events
                  .slice(0, 6)
                  .map(
                    (
                      event
                    ) => (
                      <div
                        key={
                          event.id
                        }
                        className="flex flex-col gap-4 rounded-[20px] bg-[#F7F5F1] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-[#171717]">
                              {
                                event.title
                              }
                            </h3>

                            <span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-neutral-500">
                              {
                                event.status
                              }
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-neutral-400">
                            {formatDate(
                              event.startsAt
                            )}{" "}
                            ·{" "}
                            {
                              event.city
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-5">
                          <div>
                            <p className="text-sm font-semibold">
                              {
                                event.ticketsSold
                              }
                            </p>

                            <p className="text-[10px] text-neutral-400">
                              sold
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {formatMoney(
                                event.revenue
                              )}
                            </p>

                            <p className="text-[10px] text-neutral-400">
                              revenue
                            </p>
                          </div>

                          <Link
                            href={`/events/${event.slug}`}
                            className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-600"
                          >
                            <ArrowUpRight
                              size={
                                15
                              }
                            />
                          </Link>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </section>

          {/* RECENT SALES */}

          <aside className="rounded-[28px] bg-[#171717] p-5 text-white md:p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.17em] text-white/35">
                Activity
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                Recent sales
              </h2>
            </div>

            {dashboard
              .recentSales
              .length === 0 ? (
              <div className="py-16 text-center">
                <Ticket
                  size={26}
                  className="mx-auto text-white/20"
                />

                <p className="mt-4 text-sm text-white/40">
                  Ticket purchases
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                {dashboard.recentSales.map(
                  (
                    sale
                  ) => (
                    <div
                      key={
                        sale.id
                      }
                      className="rounded-[18px] bg-white/[0.06] p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {
                              sale
                                .attendee
                                .firstName
                            }{" "}
                            {
                              sale
                                .attendee
                                .lastName
                            }
                          </p>

                          <p className="mt-1 truncate text-[10px] text-white/35">
                            {
                              sale
                                .event
                                .title
                            }
                          </p>
                        </div>

                        <p className="shrink-0 text-xs font-semibold text-[#A996FF]">
                          {formatMoney(
                            sale.amount
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}