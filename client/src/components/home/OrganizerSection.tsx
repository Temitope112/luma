"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Users,
} from "lucide-react";

export default function OrganizerSection() {
  return (
    <section className="bg-[#171717] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:py-32">

        {/* COPY */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#a996ff]">
            For organizers
          </p>

          <h2 className="max-w-xl text-[46px] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-[74px]">
            Make something
            <span className="block text-[#a996ff]">
              people remember.
            </span>
          </h2>

          <p className="mt-7 max-w-md text-[15px] leading-7 text-white/55 sm:text-base">
            From your first guest to your final check-in,
            Luma gives you everything you need to run your
            event without the chaos.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Create beautiful event pages",
              "Sell and manage tickets",
              "Track attendees in real time",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.45,
                }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#8a6df6]/15 text-[#a996ff]">
                  <Check size={13} />
                </span>

                {item}
              </motion.div>
            ))}
          </div>

          <Link
            href="/create-event"
            className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition duration-200 hover:-translate-y-0.5"
          >
            Create your event
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* MOCK DASHBOARD */}

        <div className="relative min-h-[540px] sm:min-h-[620px]">
          <motion.div
            className="absolute left-[8%] top-[8%] h-64 w-64 rounded-full bg-[#8a6df6]/20 blur-[90px]"
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 45,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-1/2 top-1/2 w-[94%] max-w-[610px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/10 bg-[#222222] p-3 shadow-2xl sm:p-4"
          >
            {/* MOCK WINDOW HEADER */}

            <div className="flex items-center justify-between px-2 py-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Your event
                </span>

                <h3 className="mt-1 text-base font-semibold">
                  Lagos Creative Night
                </h3>
              </div>

              <span className="rounded-full bg-[#8a6df6]/15 px-3 py-1.5 text-[10px] font-medium text-[#b6a7ff]">
                Live
              </span>
            </div>

            {/* IMAGE */}

            <div className="relative mt-2 h-[215px] overflow-hidden rounded-[20px] sm:h-[270px]">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90"
                alt="Lagos Creative Night"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4">
                <p className="text-[11px] text-white/60">
                  Saturday · 7:00 PM
                </p>

                <p className="mt-1 text-sm font-medium">
                  Victoria Island, Lagos
                </p>
              </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.055] p-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Users size={14} />
                  <span className="text-[10px]">
                    Guests
                  </span>
                </div>

                <strong className="mt-4 block text-2xl tracking-[-0.04em]">
                  428
                </strong>

                <span className="mt-1 block text-[10px] text-[#a996ff]">
                  +32 today
                </span>
              </div>

              <div className="rounded-2xl bg-white/[0.055] p-4">
                <div className="flex items-center gap-2 text-white/40">
                  <CalendarDays size={14} />

                  <span className="text-[10px]">
                    Tickets sold
                  </span>
                </div>

                <strong className="mt-4 block text-2xl tracking-[-0.04em]">
                  71%
                </strong>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: "71%",
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.3,
                      delay: 0.4,
                    }}
                    className="h-full rounded-full bg-[#8a6df6]"
                  />
                </div>
              </div>

              <div className="col-span-2 rounded-2xl bg-[#8a6df6] p-4 text-white sm:col-span-1">
                <span className="text-[10px] text-white/65">
                  Revenue
                </span>

                <strong className="mt-4 block text-2xl tracking-[-0.04em]">
                  ₦920k
                </strong>

                <span className="mt-1 block text-[10px] text-white/65">
                  Across all tickets
                </span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD */}

          <motion.div
            initial={{
              opacity: 0,
              x: 25,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            animate={{
              y: [0, -8, 0],
            }}
            viewport={{ once: true }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: 0.7,
              },
              x: {
                duration: 0.5,
                delay: 0.7,
              },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-[4%] right-[1%] hidden rounded-2xl bg-white px-4 py-3 text-black shadow-xl sm:block"
          >
            <span className="text-[10px] text-neutral-400">
              Latest ticket
            </span>

            <strong className="mt-1 block text-xs">
              Regular · ₦5,000
            </strong>
          </motion.div>
        </div>
      </div>
    </section>
  );
}