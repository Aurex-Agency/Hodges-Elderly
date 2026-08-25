"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Magnolia from "./Magnolia";
import ServiceIllustration from "./ServiceIllustration";
import type { Service } from "@/lib/site";

/* The services list, openable in place and driven by scroll.
 *
 * Each row opens as it reaches the middle of the viewport and closes again
 * as it leaves, so scrolling the section reads as one continuous movement
 * rather than six things waiting to be clicked. Clicking still works and
 * takes over until you scroll to a different row.
 *
 * Why a narrow band rather than plain visibility: with a focus band across
 * the middle of the screen only one row qualifies at a time, so the list
 * cannot open two at once. And because the row that closes is always above
 * the row that opens, the two height changes largely cancel and the page
 * does not lurch under the reader.
 *
 * Keeping it from lurching: a panel is up to ~850px tall on a phone, taller
 * than the viewport, so when the row above collapses the document loses a
 * whole screen of height above your scroll position and the page snaps
 * upward. The browser's own scroll anchoring does not rescue an animated
 * height. So the open row's header is pinned by hand: its viewport position
 * is recorded, and every time the list resizes mid-animation the scroll is
 * corrected by however far that header moved. The row you are reading stays
 * put and the panel opens beneath it.
 *
 * Under prefers-reduced-motion the scroll behaviour is off entirely.
 * Content opening by itself as you scroll is precisely what that setting
 * exists to prevent. Click still works.
 *
 * Built on the W3C accordion pattern: a real button with aria-expanded and
 * aria-controls, keyboard operable with Enter and Space. */

const EASE = [0.22, 0.61, 0.36, 1] as const;
/* Slower out of the gate and a long settle, so the panel unfolds rather
 * than snapping open. */
const UNFOLD = [0.33, 0.02, 0.18, 1] as const;

export default function ServicesExplorer({
  services,
}: {
  services: readonly Service[];
}) {
  const reduced = useReducedMotion();
  /* Set by scrolling. */
  const [inBand, setInBand] = useState<string | null>(null);
  /* Set by clicking, and released as soon as scrolling reaches another row. */
  const [manual, setManual] = useState<{ slug: string | null; active: boolean }>({
    slug: null,
    active: false,
  });

  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const listRef = useRef<HTMLUListElement>(null);
  /* The element whose on-screen position must not change while the list
   * reflows, and the position to hold it at. */
  const anchor = useRef<{ el: HTMLElement; top: number } | null>(null);
  const lastOpen = useRef<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    const nodes = [...rowRefs.current.values()];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = entry.target.getAttribute("data-slug");
          if (!slug) continue;
          if (entry.isIntersecting) {
            setInBand(slug);
            /* Reaching a different row hands control back to scrolling.
               Released here, in the observer callback, rather than in an
               effect that syncs derived state: an observer is an external
               subscription, which is where setState belongs. */
            setManual((m) =>
              m.active && m.slug !== slug ? { slug: null, active: false } : m,
            );
          } else {
            setInBand((current) => (current === slug ? null : current));
          }
        }
      },
      /* A thin band across the middle of the viewport. */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, services]);

  const open = manual.active || reduced ? manual.slug : inBand;

  /* Record the anchor before the browser paints the new open state. When a
   * row closes to nothing, keep pinning the row that just closed, otherwise
   * scrolling out of the section drops a screen of height with nothing
   * holding the page steady. */
  useLayoutEffect(() => {
    const slug = open ?? lastOpen.current;
    lastOpen.current = open ?? lastOpen.current;
    if (!slug) return;
    const el = document.getElementById(`svc-button-${slug}`);
    if (el) anchor.current = { el, top: el.getBoundingClientRect().top };
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;

    const observer = new ResizeObserver(() => {
      const held = anchor.current;
      if (!held || !held.el.isConnected) return;
      const drift = held.el.getBoundingClientRect().top - held.top;
      /* Sub-pixel drift is not worth a scroll write, and correcting it every
       * frame is how you get a ResizeObserver feedback loop. */
      if (Math.abs(drift) > 0.5) {
        window.scrollBy({ top: drift, behavior: "instant" });
      }
    });

    observer.observe(list);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <ul ref={listRef} className="-mx-6 mt-16 border-t border-rule sm:mx-0">
      {services.map((service, i) => {
        const isOpen = open === service.slug;
        const panelId = `svc-panel-${service.slug}`;
        const buttonId = `svc-button-${service.slug}`;

        return (
          <li
            key={service.slug}
            data-slug={service.slug}
            ref={(node) => {
              if (node) rowRefs.current.set(service.slug, node);
              else rowRefs.current.delete(service.slug);
            }}
            style={
              {
                "--accent": `var(--color-${service.accent})`,
                "--accent-wash": `var(--color-${service.accent}-wash)`,
              } as React.CSSProperties
            }
            className="border-b border-rule"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setManual({ slug: isOpen ? null : service.slug, active: true })
                }
                className={`group relative w-full cursor-pointer px-6 py-8 text-left font-body font-normal transition-colors duration-300 hover:bg-[var(--accent-wash)] sm:grid sm:grid-cols-[4.5rem_20rem_1fr_2.5rem] sm:items-center sm:gap-x-10 sm:px-6 sm:py-10 ${
                  isOpen ? "bg-[var(--accent-wash)]" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-1 origin-top bg-[var(--accent)] transition-transform duration-300 ${
                    isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                  }`}
                />

                {/* The numeral gives way to a small bloom when the row is
                    open, a quiet marker of "you are here". */}
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <motion.span
                    className="absolute font-display text-[1.7rem] tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-[var(--accent)]"
                    animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.6 : 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.span
                    className="absolute h-10 w-10"
                    initial={false}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      scale: isOpen ? 1 : 0.4,
                      rotate: isOpen ? 0 : -40,
                    }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.55 }}
                  >
                    <Magnolia
                      className="h-full w-full text-[var(--accent)]"
                      variant="simple"
                      withLeaves={false}
                    />
                  </motion.span>
                </span>

                <span
                  className={`mt-4 block font-display text-[1.7rem] font-semibold transition-colors duration-300 sm:mt-0 ${
                    isOpen
                      ? "text-[var(--accent)]"
                      : "text-ink group-hover:text-[var(--accent)]"
                  }`}
                >
                  {service.name}
                </span>

                <span className="mt-2 block text-xl text-ink-soft sm:mt-0">
                  {service.blurb}
                </span>

                {/* Top right on a phone, fourth column on a wide screen. It
                    was hidden below sm entirely, which left nothing at all
                    to signal that the rows open. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute right-4 top-8 text-[var(--accent)] sm:static sm:justify-self-end"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.62, ease: UNFOLD },
                    opacity: { duration: 0.4, ease: EASE },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-9 pt-6 sm:grid sm:grid-cols-[4.5rem_1fr] sm:gap-x-10 sm:px-6">
                    <span aria-hidden="true" className="hidden sm:block" />
                    <div className="lg:grid lg:grid-cols-[1fr_11rem] lg:items-start lg:gap-10">
                      <div>
                        <p className="text-xl text-ink-soft">{service.forWhom}</p>

                        <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                          {service.includes.map((item, j) => (
                            <motion.li
                              key={item}
                              className="flex gap-3"
                              initial={reduced ? false : { opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.45,
                                ease: EASE,
                                delay: reduced ? 0 : 0.2 + j * 0.06,
                              }}
                            >
                              <svg
                                viewBox="0 0 20 20"
                                className="mt-2 h-5 w-5 shrink-0 text-[var(--accent)]"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M4 10.5 8 14.5 16 5.5"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-xl text-ink-soft">{item}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <p className="mt-8">
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex items-center gap-2 text-xl font-semibold text-[var(--accent)] underline decoration-current/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-current"
                          >
                            More about {service.name.toLowerCase()}
                            <svg
                              viewBox="0 0 20 20"
                              className="h-4 w-4"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M4 10h12m0 0-5-5m5 5-5 5"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </p>
                      </div>

                      {/* Now shown on phones too: it is colour and life in a
                          section that is otherwise a wall of text there. */}
                      <ServiceIllustration
                        slug={service.slug}
                        accent={service.accent}
                        className="mt-7 h-24 w-24 lg:mt-0 lg:h-44 lg:w-44 lg:justify-self-end"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
