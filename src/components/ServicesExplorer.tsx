"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Magnolia from "./Magnolia";
import ServiceIllustration from "./ServiceIllustration";
import type { Service } from "@/lib/site";

/* The services list, openable in place and driven by scroll.
 *
 * A row opens when it reaches the middle of the viewport and stays open
 * until it has left the screen completely. Nothing ever collapses while
 * you can see it, which is the whole point: watching a section you are
 * still looking at fold itself shut reads as a fault, however smooth the
 * animation is. It also means every collapse happens off-screen, so the
 * scroll correction that follows has nothing visible to disturb.
 *
 * That does allow two rows to be open at once, the one you are reading
 * and the one above still trailing off the top. That is fine, and it
 * looks deliberate rather than like a list snapping between states.
 *
 * Clicking toggles a row directly and scrolling carries on around it.
 *
 * Panels stay mounted and animate between height 0 and auto rather than
 * being added and removed. AnimatePresence removes an exiting child
 * asynchronously, a frame or more after the state change, so a correction
 * measured in a layout effect always read a drift of exactly zero and the
 * height then vanished afterwards with nothing compensating for it.
 *
 * Instead each panel carries a ResizeObserver, whose callback runs before
 * the frame is painted, so a correction issued there lands in the same
 * frame as the height change and the two cancel invisibly. Only panels
 * changing height entirely ABOVE the middle of the screen are corrected
 * for; a panel opening at or below that line is meant to push the page
 * down and must be left alone.
 *
 * Under prefers-reduced-motion the observers do not run at all, so
 * nothing opens or closes by itself. Click still works.
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
  /* Every row currently open. Scrolling adds and removes; clicking toggles. */
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  /* Whether the most recent change came from a click. A scroll-driven close
   * happens off-screen and must be instant: animating it puts the scroll
   * correction back on a timer, and a running correction fights the reader. */
  const [byClick, setByClick] = useState(false);

  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const panelRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    if (reduced) return;
    const rows = [...rowRefs.current.values()];
    if (rows.length === 0) return;

    const add = (slug: string) => {
      setByClick(false);
      setOpen((prev) => (prev.has(slug) ? prev : new Set(prev).add(slug)));
    };
    const remove = (slug: string) => {
      setByClick(false);
      setOpen((prev) => {
        if (!prev.has(slug)) return prev;
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    };

    /* Opens on reaching a line across the middle of the viewport. A line
     * rather than a band, so the choice of row is never ambiguous. */
    const opener = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = entry.target.getAttribute("data-slug");
          if (slug && entry.isIntersecting) add(slug);
        }
      },
      { rootMargin: "-50% 0px -49.6% 0px", threshold: 0 },
    );

    /* Closes only once the row has left the viewport entirely, in either
     * direction. Nothing folds shut in front of the reader. */
    const closer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = entry.target.getAttribute("data-slug");
          if (slug && !entry.isIntersecting) remove(slug);
        }
      },
      { threshold: 0 },
    );

    for (const row of rows) {
      opener.observe(row);
      closer.observe(row);
    }
    return () => {
      opener.disconnect();
      closer.disconnect();
    };
  }, [reduced, services]);

  /* One observer for every panel. Its callback lands before paint, so a
   * correction issued here is invisible rather than animated. */
  useEffect(() => {
    if (reduced) return;
    const heights = new Map<Element, number>();

    const observer = new ResizeObserver((entries) => {
      let correction = 0;
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const now = el.offsetHeight;
        const before = heights.get(el);
        heights.set(el, now);
        if (before === undefined || before === now) continue;

        /* Only changes entirely above the reading line move content the
         * reader is looking at. Anything at or below it is expected to
         * push the page down and must be left alone. */
        if (el.getBoundingClientRect().bottom <= window.innerHeight / 2) {
          correction += now - before;
        }
      }
      if (correction !== 0) {
        window.scrollBy({ top: correction, behavior: "instant" });
      }
    });

    for (const el of panelRefs.current.values()) {
      heights.set(el, el.offsetHeight);
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [reduced, services]);

  return (
    <ul className="-mx-6 mt-16 border-t border-rule sm:mx-0">
      {services.map((service, i) => {
        const isOpen = open.has(service.slug);
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
                onClick={() => {
                  setByClick(true);
                  setOpen((prev) => {
                    const next = new Set(prev);
                    if (isOpen) next.delete(service.slug);
                    else next.add(service.slug);
                    return next;
                  });
                }}
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

            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              ref={(node) => {
                if (node) panelRefs.current.set(service.slug, node);
                else panelRefs.current.delete(service.slug);
              }}
              /* Kept in the DOM so its height is observable, but inert while
                 collapsed so it takes no focus and is not announced. */
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : isOpen
                    ? {
                        height: { duration: 0.62, ease: UNFOLD },
                        opacity: { duration: 0.4, ease: EASE },
                      }
                    : {
                        /* Off-screen and instant when scrolling, so the
                           correction stays a single step. A click closes a
                           panel you are looking at, so that one animates. */
                        height: { duration: byClick ? 0.4 : 0, ease: EASE },
                        opacity: { duration: byClick ? 0.2 : 0 },
                      }
              }
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
          </li>
        );
      })}
    </ul>
  );
}
