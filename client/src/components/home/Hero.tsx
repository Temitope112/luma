"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import HeroEventCard from "./HeroEventCard";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fcfbf8]">
      <div className="pointer-events-none absolute left-[42%] top-28 h-72 w-72 rounded-full bg-[#f7d8c5]/70 blur-3xl" />

      <div className="pointer-events-none absolute right-[18%] top-20 h-72 w-72 rounded-full bg-[#dfd5ff]/65 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{
            staggerChildren: 0.12,
          }}
          className="relative z-10"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-neutral-500"
          >
            Events bring people together
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-xl text-[58px] font-semibold leading-[0.9] tracking-[-0.07em] text-black sm:text-[72px] lg:text-[90px]"
          >
            Unforgettable
            <span className="block text-[#8a6df6]">
              moments
            </span>
            start here.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-7 max-w-md text-base leading-7 text-neutral-600 sm:text-lg"
          >
            From campus shows to tech meetups, creative
            nights and conferences — find what&apos;s
            happening around you.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/create-event"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Create an event
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/events"
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-sm font-medium text-neutral-900 transition hover:-translate-y-0.5 hover:border-black/20"
            >
              Discover events
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["A", "M", "T"].map((item) => (
                <div
                  key={item}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#fcfbf8] bg-neutral-200 text-xs font-semibold text-neutral-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div>
              <strong className="block text-lg leading-none">
                2,000+
              </strong>

              <span className="mt-1 block text-xs text-neutral-500">
                already building and attending on Luma.
              </span>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[700px]">
          <motion.div
            className="absolute left-[2%] top-[9%] h-52 w-52 rounded-full bg-[#f9d7c3]/65 blur-2xl"
            animate={{
              x: [0, 18, 0],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute right-[5%] top-[6%] h-48 w-48 rounded-full bg-[#ded2ff]/70 blur-2xl"
            animate={{
              x: [0, -15, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <HeroEventCard
            image="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=90"
            category="Music"
            title="Afrobeats Rooftop Party"
            meta="Sat, Nov 16 · Lagos"
            className="absolute left-[16%] top-[2%] z-30 w-[44%] sm:w-[40%]"
            rotate={-7}
            delay={0.2}
          />

          <HeroEventCard
            image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=90"
            category="Technology"
            title="Lagos Tech Summit"
            meta="Fri, Nov 22 · Eko Hotel"
            className="absolute bottom-[3%] left-[30%] z-20 w-[51%] sm:w-[48%]"
            rotate={5}
            delay={0.35}
          />

          <HeroEventCard
            image="https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=90"
            category="Creative"
            title="Art & Ideas"
            meta="Sun, Nov 10 · Lagos"
            className="absolute right-[2%] top-[18%] z-10 w-[36%] sm:w-[32%]"
            rotate={7}
            delay={0.5}
          />

          <HeroEventCard
            image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=90"
            category="Wellness"
            title="Morning Flow"
            meta="Sat, Nov 9 · Lagos"
            className="absolute bottom-[9%] right-0 z-40 w-[30%] sm:w-[27%]"
            rotate={8}
            delay={0.65}
          />

          <motion.div
            initial={{
              opacity: 0,
              rotate: -10,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              rotate: -5,
              scale: 1,
            }}
            transition={{
              delay: 0.9,
              duration: 0.6,
            }}
            className="absolute right-[5%] top-[7%] z-50 hidden rotate-[-5deg] text-right text-sm font-medium leading-5 text-neutral-800 sm:block"
          >
            Real people.
            <br />
            Real events.
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              rotate: 7,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              rotate: 4,
              scale: 1,
            }}
            transition={{
              delay: 1,
              duration: 0.6,
            }}
            className="absolute bottom-[2%] right-[4%] z-50 hidden rotate-[4deg] text-sm font-medium leading-5 text-neutral-800 sm:block"
          >
            Find
            <br />
            your people.
          </motion.div>
        </div>
      </div>
    </section>
  );
}