"use client";

import { motion } from "framer-motion";
import {
  Quote,
  Star,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "I found an event I would never have heard about anywhere else. That alone sold me.",
    name: "Mira",
    role: "Designer",
  },
  {
    quote:
      "The ticket flow was simple. I paid, got my ticket, and that was it.",
    name: "Tobi",
    role: "Student",
  },
  {
    quote:
      "Creating the event felt clean and straightforward. No unnecessary stress.",
    name: "Kemi",
    role: "Community organizer",
  },
];

export default function CommunitySection() {
  return (
    <section className="bg-[#FCFBF8] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
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
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500">
              Built around people
            </p>

            <h2 className="max-w-2xl text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-[72px]">
              Better events feel
              <span className="block text-[#8A6DF6]">
                effortless.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="flex gap-1 text-[#8A6DF6]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill="currentColor"
                />
              ))}
            </div>

            <span>
              Loved by attendees and organizers
            </span>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map(
            (testimonial, index) => (
              <motion.article
                key={testimonial.name}
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
                  amount: 0.25,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                }}
                className="rounded-[24px] bg-white p-6 shadow-[0_12px_40px_rgba(30,25,50,0.05)] sm:p-7"
              >
                <div className="mb-8 grid h-10 w-10 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
                  <Quote size={17} />
                </div>

                <p className="text-[16px] leading-7 tracking-[-0.015em] text-neutral-800">
                  “{testimonial.quote}”
                </p>

                <div className="mt-8 border-t border-black/6 pt-4">
                  <strong className="block text-sm font-semibold">
                    {testimonial.name}
                  </strong>

                  <span className="mt-1 block text-xs text-neutral-400">
                    {testimonial.role}
                  </span>
                </div>
              </motion.article>
            )
          )}
        </div>
      </div>
    </section>
  );
}