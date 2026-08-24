"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  BACK_WHORL,
  CONE,
  CREASE,
  FRONT_WHORL,
  LEAF,
  LEAF_FILL,
  LEAVES,
  PETAL,
  PETAL_BACK,
  PETAL_FRONT,
  STAMENS,
} from "../Magnolia";

/* The site's signature moment: the magnolia opens.
 *
 * Leaves unfurl first, then the outer whorl, then the inner petals, then
 * the centre — roughly the order a real bloom opens in. It runs once, on
 * entering the viewport, and never loops. A flower that opens forever is a
 * logo animation; one that opens once is a moment.
 *
 * Only transform and opacity are animated, so it stays on the compositor.
 *
 * Note on geometry: the static Magnolia wraps its paths in a
 * <g transform="translate(200 200)">, but relying on that here would make
 * the CSS transform-origin ambiguous (transform-box defaults differ, and
 * "50% 50%" resolves against the viewBox, not the element's local space).
 * So the translate is folded into the animated transform as x/y instead,
 * with an explicit origin of 0 0 — which is where each petal's base sits.
 * Motion composes translate before rotate and scale, so each petal pivots
 * around the centre of the bloom exactly as intended. */

/* Motion writes transform-origin itself and defaults it to 50% 50%, which
 * with transform-box: view-box resolves to 200px 200px — so a plain CSS
 * transformOrigin here is silently overridden and every petal pivots around
 * the wrong point. originX/originY are Motion's own props and do stick. */
const ORIGIN = {
  transformBox: "view-box",
  originX: 0,
  originY: 0,
} as const;

const bloom: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};

/* Petals scale up from the centre and untwist slightly, as though they had
 * been furled around the cone. */
const petal = (angle: number, scale: number): Variants => ({
  closed: { x: 200, y: 200, scale: 0.12, rotate: angle - 26, opacity: 0 },
  open: {
    x: 200,
    y: 200,
    scale,
    rotate: angle,
    opacity: 1,
    transition: { type: "spring", bounce: 0.32, duration: 1.05 },
  },
});

const leafVariants = (angle: number, scale: number): Variants => ({
  closed: { x: 200, y: 200, scale: 0.3, rotate: angle - 14, opacity: 0 },
  open: {
    x: 200,
    y: 200,
    scale,
    rotate: angle,
    opacity: 1,
    transition: { type: "spring", bounce: 0.24, duration: 0.9 },
  },
});

const centre: Variants = {
  closed: { x: 200, y: 200, scale: 0, opacity: 0 },
  open: {
    x: 200,
    y: 200,
    scale: 1,
    opacity: 1,
    transition: { type: "spring", bounce: 0.5, duration: 0.7, delay: 0.35 },
  },
};

export default function BloomingMagnolia({
  className,
  withLeaves = true,
}: {
  className?: string;
  withLeaves?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      variants={bloom}
      initial={reduced ? "open" : "closed"}
      whileInView="open"
      /* once: the bloom should not re-open every time you scroll past. */
      viewport={{ once: true, amount: 0.35 }}
    >
      {withLeaves &&
        LEAVES.map(({ angle, scale }) => (
          <motion.g
            key={`leaf-${angle}`}
            variants={leafVariants(angle, scale)}
            style={ORIGIN}
          >
            <path d={LEAF} fill={`url(#${LEAF_FILL})`} />
            <path
              d="M 0 -12 L 0 -164"
              stroke="#0c2019"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
              fill="none"
            />
          </motion.g>
        ))}

      {BACK_WHORL.map((angle) => (
        <motion.g key={`back-${angle}`} variants={petal(angle, 1)} style={ORIGIN}>
          <path
            d={PETAL}
            fill={`url(#${PETAL_BACK})`}
            stroke="#c3d0c8"
            strokeWidth="1.1"
          />
        </motion.g>
      ))}

      {FRONT_WHORL.map((angle) => (
        <motion.g
          key={`front-${angle}`}
          variants={petal(angle, 0.66)}
          style={ORIGIN}
        >
          <path
            d={PETAL}
            fill={`url(#${PETAL_FRONT})`}
            stroke="#cddad2"
            strokeWidth="1.4"
          />
          <path d={CREASE} stroke="#dde7e0" strokeWidth="1.6" fill="none" />
        </motion.g>
      ))}

      <motion.g variants={centre} style={ORIGIN}>
        <ellipse cx="0" cy="-1" rx="11" ry="14" fill={`url(#${CONE})`} />
        {STAMENS.map((st, i) => (
          <line
            key={`stamen-${i}`}
            x1={st.x1}
            y1={st.y1}
            x2={st.x2}
            y2={st.y2}
            stroke="#b39a5e"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}
