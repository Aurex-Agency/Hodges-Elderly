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
  /** Blob centre, as a percentage of the viewport. */
  at: [number, number];
  /** Ellipse radii, as a percentage of the viewport. */
  size: [number, number];
  stop: number;
  strength: number;
};

const FIELDS: Field[] = [
  { token: "plum", at: [80, 14], size: [78, 68], stop: 0.0, strength: 34 },
  { token: "ochre", at: [12, 34], size: [74, 64], stop: 0.22, strength: 32 },
  { token: "spruce", at: [88, 50], size: [80, 66], stop: 0.42, strength: 34 },
  { token: "clay", at: [14, 66], size: [76, 64], stop: 0.62, strength: 30 },
  { token: "green", at: [86, 76], size: [78, 66], stop: 0.8, strength: 34 },
  { token: "wine", at: [16, 94], size: [74, 64], stop: 1.0, strength: 32 },
];

/* A second, offset field per stop. One blob reads as a smudge; two that
 * drift apart read as colour moving through the page. */
const COUNTER: Field[] = [
  { token: "ochre", at: [16, 8], size: [56, 46], stop: 0.0, strength: 20 },
  { token: "spruce", at: [86, 26], size: [54, 44], stop: 0.22, strength: 20 },
  { token: "plum", at: [14, 54], size: [56, 46], stop: 0.42, strength: 20 },
  { token: "green", at: [84, 60], size: [54, 44], stop: 0.62, strength: 20 },
  { token: "wine", at: [12, 82], size: [56, 46], stop: 0.8, strength: 20 },
  { token: "clay", at: [84, 96], size: [54, 44], stop: 1.0, strength: 20 },
];

/* The old gradient ran from full colour at the centre to transparent at
 * 68% of the ending shape, which meant every layer painted a viewport-sized
 * rectangle whose outer third was transparent pixels being blended for
 * nothing. Sizing the box to the part that is actually visible keeps the
 * identical falloff and drops the painted area by more than half. */
const FADE_STOP = 0.68;

function boxFor(field: Field) {
  const [cx, cy] = field.at;
  const [rx, ry] = field.size;
  const w = rx * FADE_STOP * 2;
  const h = ry * FADE_STOP * 2;
  /* Percentages of the parent, not vw/vh. The parent is the viewport, so
   * they look interchangeable, but 100vw includes the scrollbar gutter and
   * the parent's 100% does not. Using vw shifted every blob by about one
   * percent and showed up as a 16/255 drift against the original at the
   * foot of the page. */
  return {
    left: `${cx - w / 2}%`,
    top: `${cy - h / 2}%`,
    width: `${w}%`,
    height: `${h}%`,
  };
}

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

  /* Off-band layers leave the paint path entirely.
   *
   * With a 0.26 falloff and stops 0.2 apart, only about five of the twelve
   * fields are visible at any scroll position. The other seven sat at
   * opacity 0 and were still composited every frame, which is most of what
   * made this expensive: measured, twelve viewport-sized gradient layers
   * cost 8.8% long frames on the homepage and the same twelve at a third
   * of the area cost none. This is fill rate, not layer count. */
  const visibility = useTransform(opacity, (v) =>
    v < 0.004 ? "hidden" : "visible",
  );

  return (
    <motion.div
      className="absolute"
      style={{
        opacity,
        visibility,
        ...boxFor(field),
        willChange: "opacity",
        /* closest-side puts the transparent stop exactly on the box edge,
         * so the falloff curve is identical to the old full-bleed version
         * and only the wasted transparent margin is gone. */
        backgroundImage: `radial-gradient(closest-side, color-mix(in srgb, var(--color-${field.token}) ${field.strength}%, transparent) 0%, transparent 100%)`,
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
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
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
