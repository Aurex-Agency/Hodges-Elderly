"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import BloomingMagnolia from "./BloomingMagnolia";

/* The hero bloom, tied to scroll.
 *
 * It opens once on arrival, then drifts and turns slowly as the page moves
 * under it. Scroll-linked motion is what makes a page feel fluid rather
 * than merely animated: nothing waits for a trigger, it just responds. */
export default function HeroBloom({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const y = useTransform(smooth, [0, 1], [0, 140]);
  const rotate = useTransform(smooth, [0, 1], [0, 22]);
  const scale = useTransform(smooth, [0, 1], [1, 1.14]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        style={reduced ? undefined : { y, rotate, scale }}
      >
        <BloomingMagnolia className="h-full w-full -rotate-[14deg]" />
      </motion.div>
    </div>
  );
}
