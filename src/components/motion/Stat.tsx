"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

/* A single trust-strip figure.
 *
 * Numeric stats count up once when scrolled into view; non-numeric ones
 * ("Founder-led") just fade in with the rest. The count is deliberately
 * quick — this is a reassurance, not a scoreboard, and a number that takes
 * three seconds to arrive reads as a gimmick.
 *
 * The final value is rendered in the initial HTML and only replaced once
 * the animation starts, so it is correct for search engines, for users
 * with JavaScript disabled, and under prefers-reduced-motion. */

export default function Stat({
  value,
  suffix,
  label,
  accent = "pink",
}: {
  value: number | null;
  suffix: string;
  label: string;
  /** Palette token name. */
  accent?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  /* The count writes to the text node directly rather than through
   * setState. Driving it through React re-rendered this component on every
   * animation frame for the best part of a second, three times over, while
   * the reveal springs were still running. The rendered markup already
   * contains the final value, so nothing here is needed for the first
   * paint, for search engines, or for reduced motion. */
  useEffect(() => {
    if (value === null || reduced || !inView) return;
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)} ${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, suffix]);

  return (
    <motion.div
      className="bg-mist/80 px-6 py-10 text-center sm:py-12 transition-colors duration-300 hover:bg-[var(--accent-wash)]"
      style={
        {
          "--accent": `var(--color-${accent})`,
          "--accent-wash": `var(--color-${accent}-wash)`,
        } as React.CSSProperties
      }
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <p
        ref={ref}
        className="font-display text-[2.1rem] font-semibold tabular-nums text-[var(--accent)]"
      >
        {value === null ? suffix : `${value} ${suffix}`}
      </p>
      <p className="mx-auto mt-2 max-w-[16rem] text-lg leading-snug text-ink-soft">
        {label}
      </p>
    </motion.div>
  );
}
