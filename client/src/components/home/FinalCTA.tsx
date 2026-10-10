"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-[#8A6DF6] px-5 py-16 text-white md:px-8 md:py-24">
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
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/60">
            Start somewhere
          </p>

          <h2 className="max-w-3xl text-[48px] font-semibold leading-[0.94] tracking-[-0.065em] sm:text-6xl lg:text-[84px]">
            Your next great
            event starts here.
          </h2>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href="/events"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#171717] transition hover:-translate-y-0.5"
          >
            Discover events
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/create-event"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/8 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/12"
          >
            Create an event
          </Link>
        </div>
      </motion.div>
    </section>
  );
}