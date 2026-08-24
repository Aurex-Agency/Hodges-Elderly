"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Shared entrance motion.
 *
 * The audience skews 55+ and often arrives worried about a parent, so the
 * brief here is "the page feels alive", not "the page performs". Movement
 * is short, single-direction, and never delays reading: text is legible
 * from the first frame of the transition, and the whole thing is done in
 * under half a second.
 *
 * Everything animates transform and opacity only. */

const EASE = [0.22, 0.61, 0.36, 1] as const;

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
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
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: riseVariants.hidden,
        shown: {
          ...riseVariants.shown,
          transition: { duration: 0.5, ease: EASE, delay },
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
      viewport={{ once: true, amount: 0.2 }}
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
