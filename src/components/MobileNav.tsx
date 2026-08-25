"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV, site } from "@/lib/site";

/* Navigation for everything below the desktop breakpoint.
 *
 * Until now the nav was simply hidden below 1024px and phone visitors had
 * no way through the site except the footer, which on a site whose readers
 * are largely on phones is a real gap rather than a styling nicety.
 *
 * Standard disclosure pattern: a real button with aria-expanded and
 * aria-controls, Escape closes, focus returns to the trigger. */
/* One transition for all three bars. They were on 0.22, 0.15 and 0.22, so
 * the middle bar finished early and the cross assembled in two stages
 * rather than one movement. */
const BAR = { duration: 0.24, ease: [0.22, 0.61, 0.36, 1] } as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[3.25rem] cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-control border-2 border-pink px-4 text-base font-semibold text-pink transition-colors duration-200 hover:bg-pink hover:text-white sm:gap-3 sm:px-6"
      >
        <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
          <motion.span
            className="block h-[2.5px] w-full rounded-full bg-current"
            animate={{ rotate: open ? 45 : 0, y: open ? 6.5 : 0 }}
            transition={BAR}
          />
          <motion.span
            className="block h-[2.5px] w-full rounded-full bg-current"
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ ...BAR, duration: 0.16 }}
          />
          <motion.span
            className="block h-[2.5px] w-full rounded-full bg-current"
            animate={{ rotate: open ? -45 : 0, y: open ? -6.5 : 0 }}
            transition={BAR}
          />
        </span>
        Menu
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav"
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] },
              opacity: { duration: 0.2 },
            }}
            className="absolute left-0 right-0 top-full z-30 overflow-hidden border-b border-rule bg-page shadow-lg"
          >
            <nav aria-label="Main" className="mx-auto max-w-6xl px-6 py-6">
              <ul className="divide-y divide-rule">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 text-2xl font-semibold text-ink transition-colors duration-200 hover:text-pink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={site.phoneHref}
                    className="block py-4 text-2xl font-semibold text-pink"
                  >
                    Call {site.phone}
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
