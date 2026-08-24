import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { MagnoliaDefs } from "@/components/Magnolia";
import { site } from "@/lib/site";
import "./globals.css";

/* Fraunces: a warm old-style serif with real character. Chosen against the
 * corporate-blue Arial of the two franchise competitors in this market.
 * Softened optical axis so it reads Southern rather than fashionable. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

/* Source Sans 3: large x-height, open apertures, unambiguous numerals.
 * The reader is frequently 55+ and on a phone. */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} — In-Home Care in Tupelo & North Mississippi`,
    template: `%s — ${site.shortName}`,
  },
  description:
    "In-home care across Lee, Pontotoc, Union, Chickasaw, Monroe, Lafayette, and Itawamba counties. Founder-led, local, and built on eight years of caring for elderly, IDD, and mental health clients.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.shortName,
  },
  robots: {
    // TODO(launch): flip to index once the real domain is live.
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-plum focus:px-5 focus:py-3 focus:text-petal"
        >
          Skip to content
        </a>
        <MagnoliaDefs />
        {children}
      </body>
    </html>
  );
}
