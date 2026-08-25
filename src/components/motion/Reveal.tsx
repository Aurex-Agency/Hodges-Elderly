"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Shared entrance motion.
 *
 * The audience skews 55+ and often arrives worried about a parent, so the
 * brief here is "the page feels alive", not "the page performs". Movement
 * is short, single-direction, and never delays reading: text is legible
 * from the first frame of the transition, and the spring settles quickly.
 *
 * Everything animates transform and opacity only. */

/* A gentle spring rather than a fixed duration. Springs settle instead of
 * stopping, which is most of what "smooth" means when you feel it. A touch
 * of bounce, not enough to look bouncy. */
const SPRING = { type: "spring", bounce: 0.16, duration: 0.85 } as const;

/* No scale.
 *
 * These variants used to rise from scale 0.985. Nobody reads 1.5% as
 * movement, but everybody sees its side effect: a fractionally scaled
 * element has its text re-rasterised on every frame of the spring, so
 * headings shimmer very slightly on the way in. On a site whose readers are
 * mostly over 55 that is a bad trade for an effect they cannot perceive.
 * Translate and opacity only, which is also the cheap pair. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: SPRING },
};

/** Fade-and-rise a single block when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -12% 0px" }}
      variants={{
        hidden: riseVariants.hidden,
        shown: {
          opacity: 1,
          y: 0,
          transition: { ...SPRING, delay },
        },
      }}
    >
      {children}
    </Component>
  );
}

/** Parent that staggers its RevealItem children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -12% 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={riseVariants}>
      {children}
    </Component>
  );
}
