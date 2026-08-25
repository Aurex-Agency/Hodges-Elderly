"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, trackCall } from "@/lib/analytics";

/* Google Analytics 4.
 *
 * Loaded through next/script at afterInteractive rather than as a raw tag,
 * so it never competes with hydration for the main thread. Rendered only
 * when NEXT_PUBLIC_GA_ID is set, which means development and preview
 * deployments send nothing and the real property only ever sees real
 * traffic.
 *
 * Two things this handles that pasting the snippet into <head> would not:
 *
 * 1. Route changes. gtag's config call fires one page_view on load. This is
 *    an App Router site, so every link after that is a client-side
 *    navigation the tag never hears about, and without this effect the
 *    property would record the landing page and nothing else.
 *
 * 2. Click to call. Every phone number on the site is a tel: link, in the
 *    header, the hero, the closing block on every page, the footer, and
 *    inside guides. Wiring each one individually would guarantee missing
 *    some, so this listens once on the document and catches all of them,
 *    including ones added later.
 *
 * usePathname only, deliberately: useSearchParams forces the whole subtree
 * into client rendering unless it is wrapped in Suspense, and this site has
 * no query parameters worth measuring. */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;
    /* The config call already sent a page_view for the first render. */
    if (first.current) {
      first.current = false;
      return;
    }
    /* Deferred a frame on purpose. Next applies the new document title
     * during the commit that follows this effect, so reading it here sends
     * either the previous page's title or an empty string, and it races
     * differently on different routes. Measured: one navigation reported
     * the correct title and the next reported "". After a paint it has
     * always landed. */
    const id = requestAnimationFrame(() => {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!GA_ID) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      /* closest, not the target itself: the call buttons contain an svg and
       * a span, so the click almost never lands on the anchor. */
      const link = target?.closest?.('a[href^="tel:"]');
      if (!link) return;

      const where = link.closest("header")
        ? "header"
        : link.closest("footer")
          ? "footer"
          : "page";
      trackCall(where, window.location.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
