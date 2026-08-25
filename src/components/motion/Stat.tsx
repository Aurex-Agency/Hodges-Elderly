"use client";

import { useEffect, useRef, useState } from "react";
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
  accent = "plum",
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
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (value === null || reduced || !inView) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <motion.div
      className="bg-mist/80 px-6 py-12 text-center transition-colors duration-300 hover:bg-[var(--accent-wash)]"
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
      <p ref={ref} className="font-display text-[2.1rem] font-semibold text-[var(--accent)]">
        {value === null ? suffix : `${display} ${suffix}`}
      </p>
      <p className="mx-auto mt-2 max-w-[16rem] text-lg leading-snug text-ink-soft">
        {label}
      </p>
    </motion.div>
  );
}
