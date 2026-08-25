"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { BACK_WHORL, PETAL } from "./Magnolia";

/* Six illustrations, one per service.
 *
 * Line drawings rather than photoreal imagery, deliberately: under the
 * Aurex asset-role standard a generated photograph of a caregiver would
 * read as evidence of a real person, which we cannot honestly offer. An
 * illustration reads as an interface asset — it carries warmth without
 * claiming to be a record of anything.
 *
 * What makes them a system rather than six loose icons: every scene has a
 * magnolia somewhere in it, built from the same petal path as the site's
 * bloom. A towel with a flower resting on it, a keyring fob, a flowering
 * plant. It is the small recurring signature that ties the service pages
 * back to the brand mark.
 *
 * Strokes render with pathLength so each scene draws itself in on scroll. */

const STROKE = 3;

const scene: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/* Structural linework draws itself. */
const line: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.75, ease: [0.32, 0.72, 0.3, 1] },
      opacity: { duration: 0.12 },
    },
  },
};

const solid: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.45, duration: 0.7 },
  },
};

/* One petal alone is just an ovate blob at this size — it has to be a whole
 * small bloom to read as a flower. Six tepals is the fewest that still does.
 *
 * Position and scale live in the variant rather than a transform attribute:
 * Motion animates scale through a CSS transform, which replaces an attribute
 * transform outright and would silently drop the translate with it. Child
 * paths use plain attribute transforms, which is safe — nothing animates
 * them individually. */
function Bloom({
  x,
  y,
  d = 20,
  tone = "pink",
}: {
  x: number;
  y: number;
  /** Approximate diameter in viewBox units. */
  d?: number;
  /** Palette token name. */
  tone?: string;
}) {
  const scale = d / 228;
  const stroke = `var(--color-${tone})`;
  const fill = `var(--color-${tone}-wash)`;

  return (
    <motion.g
      variants={{
        hidden: { x, y, scale: 0, rotate: -35, opacity: 0 },
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
          fill={fill}
          stroke={stroke}
          strokeWidth={2.6 / scale}
          strokeLinejoin="round"
        />
      ))}
      <circle r={22} fill={`var(--color-${tone})`} opacity="0.7" />
    </motion.g>
  );
}

function L(d: string, extra?: Record<string, string | number>) {
  return <motion.path d={d} variants={line} {...extra} />;
}

const buildScenes = (bloomTone: string): Record<string, React.ReactNode> => ({
  /* Folded towels with a bloom resting on top. Reads instantly, keeps the
     dignity of the service, and depicts no one. */
  "personal-care": (
    <>
      {L("M 32 74 L 88 74 C 91 74, 94 77, 94 80 L 94 88 C 94 91, 91 94, 88 94 L 32 94 C 29 94, 26 91, 26 88 L 26 80 C 26 77, 29 74, 32 74 Z")}
      {L("M 38 57 L 82 57 C 85 57, 88 60, 88 63 L 88 68 C 88 71, 85 74, 82 74 L 38 74 C 35 74, 32 71, 32 68 L 32 63 C 32 60, 35 57, 38 57 Z")}
      {L("M 37 74 C 33 80, 33 88, 37 94", { opacity: 0.5 })}
      {L("M 43 57 C 39 61, 39 70, 43 74", { opacity: 0.5 })}
      <Bloom x={60} y={46} d={26} tone={bloomTone} />
    </>
  ),

  /* Two mugs on a table — one still steaming. */
  "companion-care": (
    <>
      {L("M 16 94 L 104 94")}
      {L("M 34 58 L 34 82 C 34 88, 39 92, 45 92 L 53 92 C 59 92, 64 88, 64 82 L 64 58")}
      {L("M 29 58 L 69 58")}
      {L("M 64 64 C 75 64, 75 78, 64 78")}
      {L("M 74 68 L 74 84 C 74 88, 78 92, 82 92 L 88 92 C 92 92, 96 88, 96 84 L 96 68")}
      {L("M 70 68 L 100 68")}
      {L("M 44 48 C 40 42, 48 38, 44 30", { opacity: 0.5 })}
      {L("M 56 48 C 52 42, 60 38, 56 30", { opacity: 0.5 })}
      <Bloom x={20} y={86} d={16} tone={bloomTone} />
    </>
  ),

  /* A young plant flowering against a stake — supported independence,
     which is exactly what this service is for. */
  "idd-and-mental-health-support": (
    <>
      {L("M 40 86 L 45 106 L 75 106 L 80 86")}
      {L("M 34 86 L 86 86")}
      {L("M 58 86 C 58 70, 58 56, 58 46")}
      {L("M 58 74 C 48 74, 40 68, 38 59 C 48 57, 56 64, 58 74")}
      {L("M 58 64 C 66 63, 72 58, 74 51 C 66 50, 60 55, 58 64")}
      {L("M 76 50 L 76 86", { opacity: 0.5 })}
      {L("M 56 70 L 78 70", { opacity: 0.5 })}
      <Bloom x={58} y={36} d={22} tone={bloomTone} />
    </>
  ),

  /* A covered pot, still hot, with a bloom on the counter beside it. */
  "meals-and-homemaking": (
    <>
      {L("M 14 104 L 106 104")}
      {L("M 34 64 L 37 92 C 38 98, 42 102, 48 102 L 72 102 C 78 102, 82 98, 83 92 L 86 64")}
      {L("M 28 64 L 92 64")}
      {L("M 39 64 C 41 53, 49 47, 60 47 C 71 47, 79 53, 81 64")}
      {L("M 34 71 C 27 71, 27 80, 34 80")}
      {L("M 86 71 C 93 71, 93 80, 86 80")}
      {L("M 50 38 C 46 32, 54 28, 50 22", { opacity: 0.5 })}
      {L("M 70 38 C 66 32, 74 28, 70 22", { opacity: 0.5 })}
      <motion.circle cx="60" cy="42" r="4.5" variants={solid} fill="currentColor" />
      <Bloom x={100} y={96} d={16} tone={bloomTone} />
    </>
  ),

  /* Keys with a bloom for a fob. Handing over the keys is named in this
     service's copy as one of the hardest days in a person's life. */
  "errands-and-transportation": (
    <>
      <motion.circle cx="34" cy="50" r="14" variants={line} fill="none" pathLength={1} />
      {L("M 48 50 L 98 50")}
      {L("M 84 50 L 84 64")}
      {L("M 94 50 L 94 61")}
      {L("M 34 64 L 34 74", { opacity: 0.5 })}
      <Bloom x={34} y={85} d={21} tone={bloomTone} />
    </>
  ),


  /* An open front door with the light on inside, and a path up to it. The
     ID/DD services are about a door staying open to an ordinary life, not
     about a building. */
  "home-and-community-supports": (
    <>
      {L("M 20 100 L 100 100")}
      {L("M 30 100 L 30 44 L 72 26 L 72 100")}
      {L("M 30 44 L 72 26")}
      {L("M 72 40 L 96 52 L 96 100")}
      {L("M 46 100 L 46 62 L 62 62 L 62 100")}
      <motion.circle cx="58" cy="82" r="2.4" variants={solid} fill="currentColor" />
      {L("M 80 62 L 88 62", { opacity: 0.5 })}
      {L("M 80 74 L 88 74", { opacity: 0.5 })}
      <Bloom x={20} y={84} d={17} tone={bloomTone} />
    </>
  ),

  /* Three small roofs sharing one ground line. Supervised living is a
     household of a few people, which is the whole point of it, so the
     drawing is houses rather than a facility. */
  "supervised-living": (
    <>
      {L("M 10 96 L 110 96")}
      {L("M 18 96 L 18 66 L 36 52 L 54 66 L 54 96")}
      {L("M 30 96 L 30 80 L 42 80 L 42 96")}
      {L("M 62 96 L 62 60 L 82 44 L 102 60 L 102 96")}
      {L("M 74 96 L 74 76 L 90 76 L 90 96")}
      {L("M 70 66 L 78 66", { opacity: 0.5 })}
      {L("M 86 66 L 94 66", { opacity: 0.5 })}
      <Bloom x={57} y={30} d={19} tone={bloomTone} />
    </>
  ),

  /* A house with a steady light in the window and a clock face beside it:
     somebody is awake in there at any hour. */
  "behavioral-supervised-living": (
    <>
      {L("M 14 100 L 106 100")}
      {L("M 22 100 L 22 58 L 50 36 L 78 58 L 78 100")}
      {L("M 40 100 L 40 76 L 60 76 L 60 100")}
      {L("M 34 58 L 46 58 L 46 68 L 34 68 Z")}
      <motion.circle cx="90" cy="46" r="13" variants={line} fill="none" pathLength={1} />
      {L("M 90 39 L 90 46 L 96 50")}
      <Bloom x={22} y={86} d={16} tone={bloomTone} />
    </>
  ),

  /* Two speech shapes, one tangled and one resolved into a clear line.
     Behavior support is about working out what is being communicated. */
  "behavior-support": (
    <>
      {L("M 16 32 L 58 32 C 62 32, 64 34, 64 38 L 64 60 C 64 64, 62 66, 58 66 L 32 66 L 20 78 L 22 66 L 16 66 C 12 66, 10 64, 10 60 L 10 38 C 10 34, 12 32, 16 32 Z")}
      {L("M 20 44 C 26 38, 30 52, 36 46 C 42 40, 46 54, 52 48", { opacity: 0.55 })}
      {L("M 64 54 L 104 54 C 108 54, 110 56, 110 60 L 110 82 C 110 86, 108 88, 104 88 L 88 88 L 76 100 L 78 88 L 72 88 C 68 88, 66 86, 66 82 L 66 66")}
      {L("M 76 70 L 100 70", { opacity: 0.55 })}
      {L("M 76 78 L 92 78", { opacity: 0.55 })}
      <Bloom x={100} y={30} d={17} tone={bloomTone} />
    </>
  ),

  /* An armchair with a blanket over the arm. */
  "respite-for-family": (
    <>
      {L("M 36 66 L 36 38 C 36 32, 41 28, 47 28 L 73 28 C 79 28, 84 32, 84 38 L 84 66")}
      {L("M 24 66 L 24 58 C 24 53, 28 50, 33 50 L 36 50")}
      {L("M 96 66 L 96 58 C 96 53, 92 50, 87 50 L 84 50")}
      {L("M 22 70 C 22 67, 25 66, 28 66 L 92 66 C 95 66, 98 67, 98 70 L 98 84 L 22 84 Z")}
      {L("M 30 84 L 30 96")}
      {L("M 90 84 L 90 96")}
      {L("M 33 50 C 22 50, 14 58, 13 70 C 13 76, 16 80, 21 80 C 26 80, 28 75, 27 70 C 26 62, 30 55, 36 53", {
        opacity: 0.5,
      })}
      <Bloom x={60} y={46} d={18} tone={bloomTone} />
    </>
  ),
});

export default function ServiceIllustration({
  slug,
  className,
  accent = "green",
}: {
  slug: string;
  className?: string;
  /** Palette token the linework is drawn in. */
  accent?: string;
}) {
  const reduced = useReducedMotion();
  /* Keep the magnolia legible against the linework: on the purple-family
     accents it switches to ochre rather than disappearing into the drawing. */
  const bloomTone = accent === "pink" || accent === "wine" ? "ochre" : "pink";
  const drawing = buildScenes(bloomTone)[slug];
  if (!drawing) return null;

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke={`var(--color-${accent})`}
      color={`var(--color-${accent})`}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={scene}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      {drawing}
    </motion.svg>
  );
}
