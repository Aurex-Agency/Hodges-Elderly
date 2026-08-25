"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/* Colour that flows as you scroll.
 *
 * A fixed stack of soft gradient fields sitting behind the whole page, one
 * per accent. Each fades up as you reach its part of the document and fades
 * down again as you leave, so the ground colour drifts continuously from
 * plum through ochre, spruce, clay, green and wine rather than the page
 * being a flat white slab.
 *
 * Only opacity animates, on fixed elements, so the whole effect stays on
 * the compositor and never triggers layout or paint of the content above.
 *
 * The colours are mixed down to a low percentage on purpose. This is a
 * business families turn to when a parent is failing; the page should feel
 * alive, not like a party. */

type Field = {
  token: string;
  /** Where the blob sits, and how far through the page it peaks. */
  at: string;
  stop: number;
  size: string;
  strength: number;
};

const FIELDS: Field[] = [
  { token: "plum", at: "80% 14%", stop: 0.0, size: "78% 68%", strength: 34 },
  { token: "ochre", at: "12% 34%", stop: 0.22, size: "74% 64%", strength: 32 },
  { token: "spruce", at: "88% 50%", stop: 0.42, size: "80% 66%", strength: 34 },
  { token: "clay", at: "14% 66%", stop: 0.62, size: "76% 64%", strength: 30 },
  { token: "green", at: "86% 76%", stop: 0.8, size: "78% 66%", strength: 34 },
  { token: "wine", at: "16% 94%", stop: 1.0, size: "74% 64%", strength: 32 },
];

/* A second, offset field per stop. One blob reads as a smudge; two that
 * drift apart read as colour moving through the page. */
const COUNTER: Field[] = [
  { token: "ochre", at: "16% 8%", stop: 0.0, size: "56% 46%", strength: 20 },
  { token: "spruce", at: "86% 26%", stop: 0.22, size: "54% 44%", strength: 20 },
  { token: "plum", at: "14% 54%", stop: 0.42, size: "56% 46%", strength: 20 },
  { token: "green", at: "84% 60%", stop: 0.62, size: "54% 44%", strength: 20 },
  { token: "wine", at: "12% 82%", stop: 0.8, size: "56% 46%", strength: 20 },
  { token: "clay", at: "84% 96%", stop: 1.0, size: "54% 44%", strength: 20 },
];

/* Neighbouring stops are ~0.2 apart, so a 0.26 falloff keeps two fields
 * overlapping at any moment and the transition never reads as a switch. */
const FALLOFF = 0.26;

function Layer({
  field,
  progress,
}: {
  field: Field;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [field.stop - FALLOFF, field.stop, field.stop + FALLOFF],
    [0, 1, 0],
    { clamp: true },
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        opacity,
        willChange: "opacity",
        backgroundImage: `radial-gradient(${field.size} at ${field.at}, color-mix(in srgb, var(--color-${field.token}) ${field.strength}%, transparent) 0%, transparent 68%)`,
      }}
    />
  );
}

export default function ScrollTint() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* Smoothing the driver rather than each layer: one spring, and the fields
   * settle together instead of racing each other on a flick scroll. */
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.0005,
  });

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {FIELDS.map((field) => (
        <Layer key={`a-${field.token}`} field={field} progress={smooth} />
      ))}
      {COUNTER.map((field) => (
        <Layer key={`b-${field.token}-${field.stop}`} field={field} progress={smooth} />
      ))}
    </div>
  );
}

/** Thin reading-progress bar, coloured by where you are in the page. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-plum), var(--color-ochre), var(--color-spruce), var(--color-clay), var(--color-green), var(--color-wine))",
      }}
    />
  );
}
