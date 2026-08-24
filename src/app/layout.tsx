import type { Metadata } from "next";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import { MagnoliaDefs } from "@/components/Magnolia";
import { site } from "@/lib/site";
import "./globals.css";

/* Source Serif 4: warm and credible, but drawn for reading rather than for
 * display. Replaces Fraunces, whose high contrast and decorative ampersand
 * cost too much legibility for this readership. */
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

/* Source Sans 3: large x-height, open apertures, unambiguous numerals.
 * The reader is frequently 55+ and on a phone. */
const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | In-Home Care in Tupelo & North Mississippi`,
    template: `%s | ${site.shortName}`,
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-plum focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        {/* Only facts that are confirmed. No aggregateRating, no
            certifications, no claims the client has not cleared. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              additionalType: "https://schema.org/LocalBusiness",
              name: site.name,
              telephone: site.phone,
              url: site.url,
              founder: { "@type": "Person", name: site.founder },
              address: {
                "@type": "PostalAddress",
                streetAddress: site.address.street,
                addressLocality: site.address.city,
                addressRegion: site.address.state,
                postalCode: site.address.zip,
                addressCountry: "US",
              },
              areaServed: site.counties.map((c) => ({
                "@type": "AdministrativeArea",
                name: `${c.name} County, Mississippi`,
              })),
            }),
          }}
        />
        <MagnoliaDefs />
        {children}
      </body>
    </html>
  );
}
