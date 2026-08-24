"use client";

import { motion, useReducedMotion } from "motion/react";
import { PETAL, PETAL_BACK } from "../Magnolia";

/* A few magnolia petals drifting down the page.
 *
 * Deliberately restrained: six petals, very low opacity, thirty-second
 * loops, and pointer-events-none. The point is that a page with no
 * photography should still feel like it is breathing — not that anyone
 * should notice petals falling while they are reading about their
 * mother's care.
 *
 * Fixed values rather than random, so the server and client render the
 * same markup and there is no hydration mismatch. */

const PETALS = [
  { left: "8%", delay: 0, duration: 26, drift: 40, scale: 0.16, spin: 150 },
  { left: "23%", delay: 6, duration: 32, drift: -30, scale: 0.11, spin: -120 },
  { left: "47%", delay: 12, duration: 29, drift: 55, scale: 0.14, spin: 200 },
  { left: "64%", delay: 3, duration: 35, drift: -45, scale: 0.1, spin: -170 },
  { left: "79%", delay: 17, duration: 28, drift: 35, scale: 0.13, spin: 130 },
  { left: "92%", delay: 9, duration: 31, drift: -25, scale: 0.09, spin: -140 },
];

export default function DriftingPetals() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {PETALS.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 400 400"
          className="absolute h-40 w-40 opacity-[0.13]"
          style={{ left: p.left, top: "-12rem" }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "125vh"],
            x: [0, p.drift, 0, -p.drift, 0],
            rotate: [0, p.spin],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <g transform={`translate(200 200) scale(${p.scale * 6})`}>
            <path
              d={PETAL}
              fill={`url(#${PETAL_BACK})`}
              stroke="#c3d0c8"
              strokeWidth="1.4"
            />
          </g>
        </motion.svg>
      ))}
    </div>
  );
}
