"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Magnolia from "./Magnolia";
import ServiceIllustration from "./ServiceIllustration";
import type { Service } from "@/lib/site";

/* The services list, made openable in place.
 *
 * The previous version was a flat list of six links: to find out what
 * "personal care" actually covers you had to leave the homepage. Now each
 * row opens to show exactly what is included, which is the question
 * families are really asking, and the full page is still one click away.
 *
 * Built on a real <button> with aria-expanded/aria-controls rather than a
 * clickable div, so it works on a keyboard and announces its state. */

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function ServicesExplorer({
  services,
}: {
  services: readonly Service[];
}) {
  const [open, setOpen] = useState<string | null>(services[0]?.slug ?? null);
  const reduced = useReducedMotion();

  return (
    <ul className="mt-14 border-t border-rule">
      {services.map((service, i) => {
        const isOpen = open === service.slug;
        const panelId = `svc-panel-${service.slug}`;
        const buttonId = `svc-button-${service.slug}`;

        return (
          <li
            key={service.slug}
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
                onClick={() => setOpen(isOpen ? null : service.slug)}
                className={`group relative grid w-full cursor-pointer items-center gap-x-8 gap-y-2 py-7 text-left font-body font-normal transition-colors duration-300 hover:bg-[var(--accent-wash)] sm:grid-cols-[4rem_21rem_1fr_2rem] sm:px-4 ${isOpen ? "bg-[var(--accent-wash)]" : ""}`}
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
                    className="absolute font-display text-2xl tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-[var(--accent)]"
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
                  className={`font-display text-2xl font-semibold transition-colors duration-300 ${
                    isOpen
                      ? "text-[var(--accent)]"
                      : "text-ink group-hover:text-[var(--accent)]"
                  }`}
                >
                  {service.name}
                </span>

                <span className="text-lg text-ink-soft">{service.blurb}</span>

                <motion.span
                  aria-hidden="true"
                  className="hidden justify-self-end text-[var(--accent)] sm:block"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
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
                    height: { duration: 0.38, ease: EASE },
                    opacity: { duration: 0.25, ease: EASE },
                  }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 pb-9 sm:grid-cols-[4rem_1fr] sm:px-4">
                    <span aria-hidden="true" />
                    <div className="grid gap-8 lg:grid-cols-[1fr_11rem] lg:items-start">
                      <div>
                      <p className="max-w-2xl text-lg text-ink-soft">
                        {service.forWhom}
                      </p>

                      <ul className="mt-6 grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-2">
                        {service.includes.map((item, j) => (
                          <motion.li
                            key={item}
                            className="flex gap-3"
                            initial={reduced ? false : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: EASE,
                              delay: reduced ? 0 : 0.12 + j * 0.045,
                            }}
                          >
                            <svg
                              viewBox="0 0 20 20"
                              className="mt-1.5 h-5 w-5 shrink-0 text-[var(--accent)]"
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
                            <span className="text-lg text-ink-soft">{item}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <p className="mt-7">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--accent)] underline decoration-current/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-current"
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

                      <ServiceIllustration
                        slug={service.slug}
                        accent={service.accent}
                        className="hidden h-44 w-44 lg:block lg:justify-self-end"
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
