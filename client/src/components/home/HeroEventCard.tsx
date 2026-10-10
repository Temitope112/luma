"use client";

import { motion } from "framer-motion";

type HeroEventCardProps = {
  image: string;
  category: string;
  title: string;
  meta: string;
  className?: string;
  delay?: number;
  rotate?: number;
};

export default function HeroEventCard({
  image,
  category,
  title,
  meta,
  className = "",
  delay = 0,
  rotate = 0,
}: HeroEventCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 40,
        rotate,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotate,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -10,
        rotate: rotate * 0.35,
        scale: 1.02,
      }}
      className={`overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(37,29,53,0.12)] ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur">
          {category}
        </span>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em]">
            {title}
          </h3>

          <p className="mt-1 text-xs text-white/80">
            {meta}
          </p>
        </div>
      </div>
    </motion.div>
  );
}