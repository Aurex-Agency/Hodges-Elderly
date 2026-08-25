"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { BACK_WHORL, PETAL } from "./Magnolia";

/* People, drawn rather than photographed.
 *
 * The client wants families on the site and has no photography. A
 * photoreal generated image of a caregiver would read as a record of a
 * real employee, which is the one thing we cannot fake here: visitors are
 * deciding who gets a key to a parent's house. An illustration nobody
 * would mistake for a photograph carries the warmth without the claim.
 *
 * Faces are deliberately left blank and skin is drawn in the brand wash
 * rather than any flesh tone. These read as "a family", not "this family",
 * which is both honest and appropriate for a business serving everyone in
 * seven counties. */

const EASE = [0.22, 0.61, 0.36, 1] as const;

const scene: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, ease: EASE },
      opacity: { duration: 0.12 },
    },
  },
};

const GROUND = 142;

/** An upright adult. */
function Adult({ x, flip = false }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <motion.g variants={rise}>
      <path
        d={`M ${x - 18} ${GROUND} L ${x - 13} 78 C ${x - 12} 70, ${x - 6} 66, ${x} 66 C ${x + 6} 66, ${x + 12} 70, ${x + 13} 78 L ${x + 18} ${GROUND} Z`}
        fill="var(--accent-wash)"
        stroke="currentColor"
      />
      <circle cx={x} cy={50} r={13} fill="var(--accent-wash)" stroke="currentColor" />
      <path
        d={`M ${x - 13} 47 C ${x - 13} 33, ${x + 13} 33, ${x + 13} 47 C ${x + 8} 41, ${x - 8} 41, ${x - 13} 47 Z`}
        fill="currentColor"
        stroke="none"
      />
      <path
        d={`M ${x + s * 13} 84 C ${x + s * 22} 94, ${x + s * 24} 108, ${x + s * 22} 118`}
        fill="none"
        stroke="currentColor"
      />
    </motion.g>
  );
}

/** A shorter, slightly stooped figure with a cane. */
function Elder({ x, cane = true }: { x: number; cane?: boolean }) {
  return (
    <motion.g variants={rise}>
      <path
        d={`M ${x - 16} ${GROUND} L ${x - 11} 92 C ${x - 10} 85, ${x - 5} 82, ${x} 82 C ${x + 5} 82, ${x + 10} 85, ${x + 11} 92 L ${x + 16} ${GROUND} Z`}
        fill="var(--accent-wash)"
        stroke="currentColor"
      />
      <circle cx={x} cy={66} r={12} fill="var(--accent-wash)" stroke="currentColor" />
      <path
        d={`M ${x - 12} 63 C ${x - 12} 51, ${x + 12} 51, ${x + 12} 63 C ${x + 7} 58, ${x - 7} 58, ${x - 12} 63 Z`}
        fill="currentColor"
        opacity="0.45"
        stroke="none"
      />
      {cane && (
        <>
          <path d={`M ${x + 25} 100 L ${x + 27} ${GROUND}`} fill="none" stroke="currentColor" />
          <path
            d={`M ${x + 25} 100 C ${x + 20} 97, ${x + 18} 102, ${x + 21} 105`}
            fill="none"
            stroke="currentColor"
          />
        </>
      )}
    </motion.g>
  );
}

function Bloom({ x, y, d = 22 }: { x: number; y: number; d?: number }) {
  const scale = d / 228;
  return (
    <motion.g
      variants={{
        hidden: { x, y, scale: 0, rotate: -30, opacity: 0 },
        shown: {
          x,
          y,
          scale,
          rotate: 0,
          opacity: 1,
          transition: { type: "spring", bounce: 0.45, duration: 0.8 },
        },
      }}
      style={{ transformBox: "view-box", originX: 0, originY: 0 }}
    >
      {BACK_WHORL.map((angle) => (
        <path
          key={angle}
          d={PETAL}
          transform={`rotate(${angle})`}
          fill="var(--color-ochre-wash)"
          stroke="var(--color-ochre)"
          strokeWidth={2.6 / scale}
          strokeLinejoin="round"
        />
      ))}
      <circle r={22} fill="var(--color-ochre)" opacity="0.7" />
    </motion.g>
  );
}

const SCENES: Record<string, React.ReactNode> = {
  /* You call. One person on the phone, working out what to do next. */
  call: (
    <>
      <Adult x={84} />
      <motion.g variants={rise}>
        {/* Forearm up to the ear, with the handset against the side of the
            head rather than above it. */}
        <path d="M 71 86 C 62 80, 59 68, 64 60" fill="none" stroke="currentColor" />
        <rect
          x={60}
          y={45}
          width={10}
          height={18}
          rx={3}
          transform="rotate(-12 65 54)"
          fill="var(--accent-wash)"
          stroke="currentColor"
        />
      </motion.g>
      <motion.g variants={rise}>
        <path d="M 138 118 L 196 118" fill="none" stroke="currentColor" />
        <path d="M 146 118 L 146 142" fill="none" stroke="currentColor" />
        <path d="M 188 118 L 188 142" fill="none" stroke="currentColor" />
      </motion.g>
      <Bloom x={167} y={112} d={26} />
      {L("M 14 142 L 206 142")}
    </>
  ),

  /* We come to the house and meet everyone in it. */
  visit: (
    <>
      <motion.g variants={rise}>
        <path d="M 18 74 L 56 44 L 94 74" fill="none" stroke="currentColor" />
        <path
          d="M 32 142 L 32 78 L 80 78 L 80 142"
          fill="var(--accent-wash)"
          stroke="currentColor"
        />
        <circle cx={70} cy={112} r={3} fill="currentColor" stroke="none" />
      </motion.g>
      <Elder x={56} cane={false} />
      <Adult x={140} flip />
      <motion.g variants={rise}>
        <path d="M 127 84 C 116 88, 108 94, 104 100" fill="none" stroke="currentColor" />
      </motion.g>
      <Bloom x={186} y={132} d={22} />
      {L("M 14 142 L 206 142")}
    </>
  ),

  /* Care begins. Someone walks alongside. */
  care: (
    <>
      <Adult x={86} />
      <Elder x={136} />
      <motion.g variants={rise}>
        <path
          d="M 99 86 C 111 83, 121 87, 126 94"
          fill="none"
          stroke="currentColor"
        />
      </motion.g>
      <Bloom x={34} y={130} d={24} />
      {L("M 14 142 L 206 142")}
    </>
  ),
};

function L(d: string) {
  return <motion.path d={d} variants={draw} fill="none" stroke="currentColor" />;
}

export default function FigureScene({
  name,
  accent = "pink",
  className,
}: {
  name: "call" | "visit" | "care";
  accent?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 220 160"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={
        {
          color: `var(--color-${accent})`,
          "--accent-wash": `var(--color-${accent}-wash)`,
        } as React.CSSProperties
      }
      variants={scene}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      {SCENES[name]}
    </motion.svg>
  );
}
