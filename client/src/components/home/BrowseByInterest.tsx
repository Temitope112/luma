"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { getEvents } from "@/services/event.service";
import type { Event } from "@/types/event";

const categories = [
  "All events",
  "Music",
  "Technology",
  "Business",
  "Creative",
  "Wellness",
  "Community",
  "Food & Drink",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=90";

export default function BrowseByInterest() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [activeCategory, setActiveCategory] =
    useState("All events");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEvents();

        setEvents(data);
      } catch (error) {
        console.error(
          "Failed to load events:",
          error
        );

        setError(
          "We couldn't load events right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeCategory === "All events") {
      return events;
    }

    return events.filter(
      (event) =>
        event.category?.toLowerCase() ===
        activeCategory.toLowerCase()
    );
  }, [events, activeCategory]);

  const scrollEvents = (
    direction: "left" | "right"
  ) => {
    const container =
      document.getElementById(
        "event-scroll-container"
      );

    if (!container) return;

    container.scrollBy({
      left:
        direction === "right"
          ? 420
          : -420,
      behavior: "smooth",
    });
  };

  const formatDate = (
    date: string
  ) => {
    return new Intl.DateTimeFormat(
      "en-NG",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    ).format(new Date(date));
  };

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                Explore by interest
              </p>

              <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.055em] text-neutral-950 sm:text-5xl">
                Find your kind of
                <span className="text-[#8a6df6]">
                  {" "}
                  thing.
                </span>
              </h2>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() =>
                  scrollEvents("left")
                }
                className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition hover:bg-neutral-950 hover:text-white"
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollEvents("right")
                }
                className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition hover:bg-neutral-950 hover:text-white"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {categories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category;

                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() =>
                        setActiveCategory(
                          category
                        )
                      }
                      className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
                        active
                          ? "text-white"
                          : "border border-black/8 bg-white text-neutral-600 hover:border-black/15 hover:text-black"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-category"
                          className="absolute inset-0 rounded-full bg-neutral-950"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}

                      <span className="relative z-10">
                        {category}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="mt-8 flex gap-4 overflow-hidden">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="w-[82vw] shrink-0 sm:w-[360px]"
              >
                <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-neutral-100" />

                <div className="mt-4 h-4 w-24 animate-pulse rounded bg-neutral-100" />

                <div className="mt-3 h-5 w-48 animate-pulse rounded bg-neutral-100" />

                <div className="mt-3 h-3 w-32 animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-10 rounded-2xl bg-[#F4F1EC] p-5 text-sm text-neutral-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredEvents.length === 0 && (
            <div className="mt-10 rounded-2xl bg-[#F4F1EC] p-6">
              <p className="text-sm font-medium text-neutral-900">
                No events found here yet.
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Try another category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <motion.div
              id="event-scroll-container"
              layout
              className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map(
                  (event, index) => (
                    <motion.article
                      layout
                      key={event.id}
                      initial={{
                        opacity: 0,
                        y: 24,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.45,
                        delay:
                          index * 0.04,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      whileHover={{
                        y: -6,
                      }}
                      className="group w-[82vw] shrink-0 snap-start sm:w-[360px] lg:w-[calc((100%-60px)/4)]"
                    >
                      <Link
                        href={`/events/${event.slug}`}
                        className="block"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-neutral-100">
                          <motion.img
                            src={
                              event.image ||
                              fallbackImage
                            }
                            alt={event.title}
                            className="h-full w-full object-cover"
                            whileHover={{
                              scale: 1.04,
                            }}
                            transition={{
                              duration: 0.45,
                              ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                              ],
                            }}
                          />

                          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-medium text-neutral-700 backdrop-blur-md">
                            {event.category ||
                              "Event"}
                          </span>

                          <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-950 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                            <ArrowRight
                              size={16}
                            />
                          </div>
                        </div>

                        <div className="px-1 pt-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#7c63e8]">
                            {formatDate(
                              event.startsAt
                            )}
                          </p>

                          <h3 className="text-lg font-semibold tracking-[-0.03em] text-neutral-950">
                            {event.title}
                          </h3>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                            <MapPin
                              size={13}
                            />

                            {event.city
                              ? `${event.venue}, ${event.city}`
                              : event.venue}
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}

        <div className="mt-4 sm:hidden">
          <Link
            href="/events"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-medium text-neutral-800"
          >
            See all events
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}