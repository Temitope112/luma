"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  QrCode,
  Ticket,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Find something",
    text: "Discover events that actually match your interests.",
  },
  {
    number: "02",
    title: "Get your ticket",
    text: "Choose your ticket, pay securely, and you’re in.",
  },
  {
    number: "03",
    title: "Show up",
    text: "Your ticket stays ready whenever it’s time to check in.",
  },
];

export default function HowItWorks() {
  return (
    <section className="overflow-hidden bg-[#F4F1EC]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24 lg:py-32">
        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            From discovery to check-in
          </p>

          <h2 className="max-w-xl text-[46px] font-semibold leading-[0.97] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-[72px]">
            Your whole event
            <span className="block text-[#8A6DF6]">
              journey, simplified.
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-[15px] leading-7 text-neutral-600 sm:text-base">
            No screenshots. No searching through old messages.
            Your event details and tickets stay exactly where
            you need them.
          </p>

          <div className="mt-10 divide-y divide-black/8 border-y border-black/8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                }}
                className="grid grid-cols-[42px_1fr] gap-4 py-5 sm:grid-cols-[52px_1fr]"
              >
                <span className="pt-1 text-xs font-semibold text-[#8A6DF6]">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#171717]">
                    {step.title}
                  </h3>

                  <p className="mt-1 max-w-sm text-sm leading-6 text-neutral-500">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            href="/events"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
          >
            Discover events
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* RIGHT */}

        <div className="relative min-h-[580px] sm:min-h-[680px]">
          <motion.div
            className="absolute left-[18%] top-[15%] h-64 w-64 rounded-full bg-[#DCCFFF]/65 blur-[90px]"
            animate={{
              scale: [1, 1.12, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-[8%] right-[10%] h-56 w-56 rounded-full bg-[#E8D7C9]/70 blur-[90px]"
            animate={{
              y: [0, -15, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* PHONE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 45,
              rotate: -3,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: -2,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-1/2 top-1/2 z-20 w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-[42px] border-[8px] border-[#161616] bg-white p-2 shadow-[0_40px_90px_rgba(46,38,70,0.18)] sm:w-[330px]"
          >
            <div className="overflow-hidden rounded-[30px] bg-[#FCFBF8]">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <div>
                  <p className="text-[10px] text-neutral-400">
                    Saturday
                  </p>

                  <strong className="text-sm tracking-[-0.02em]">
                    My ticket
                  </strong>
                </div>

                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
                  <Ticket size={15} />
                </div>
              </div>

              <div className="mx-3 overflow-hidden rounded-[24px] bg-[#171717] text-white">
                <div className="relative h-[210px] sm:h-[245px]">
                  <img
                    src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=90"
                    alt="Event"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-white/60">
                      Music
                    </p>

                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                      Afrobeats Rooftop
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 px-4 py-4">
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <CalendarDays size={14} />
                    Sat, Nov 16 · 7:00 PM
                  </div>

                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <MapPin size={14} />
                    Victoria Island, Lagos
                  </div>
                </div>

                <div className="mx-4 border-t border-dashed border-white/15 py-5">
                  <div className="mx-auto grid h-28 w-28 place-items-center rounded-xl bg-white text-black">
                    <QrCode size={76} strokeWidth={1.3} />
                  </div>

                  <p className="mt-3 text-center text-[10px] text-white/45">
                    Scan at the entrance
                  </p>
                </div>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <CheckCircle2
                    size={15}
                    className="text-[#8A6DF6]"
                  />
                  Payment confirmed
                </div>
              </div>
            </div>
          </motion.div>

          {/* FLOATING PAYMENT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            animate={{
              y: [0, -8, 0],
            }}
            viewport={{
              once: true,
            }}
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
            className="absolute left-[1%] top-[23%] z-30 hidden rounded-2xl bg-white px-4 py-3 shadow-xl sm:block"
          >
            <span className="text-[10px] text-neutral-400">
              Payment
            </span>

            <strong className="mt-1 block text-xs">
              ₦5,000 · Successful
            </strong>
          </motion.div>

          {/* FLOATING TICKET */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            animate={{
              y: [0, 9, 0],
            }}
            viewport={{
              once: true,
            }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: 0.9,
              },
              x: {
                duration: 0.5,
                delay: 0.9,
              },
              y: {
                duration: 4.4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-[15%] right-[1%] z-30 hidden rounded-2xl bg-[#8A6DF6] px-4 py-3 text-white shadow-xl sm:block"
          >
            <span className="text-[10px] text-white/60">
              Ticket ready
            </span>

            <strong className="mt-1 block text-xs">
              Regular Admission
            </strong>
          </motion.div>
        </div>
      </div>
    </section>
  );
}