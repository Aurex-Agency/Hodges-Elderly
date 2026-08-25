import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { MagnoliaDefs } from "@/components/Magnolia";
import ScrollTint, { ScrollProgress } from "@/components/motion/ScrollTint";
import { LAUNCH_READY, services, site } from "@/lib/site";
import "./globals.css";

/* Merriweather throughout, headings and body alike.
 *
 * It was drawn specifically for reading on screens: a large x-height,
 * sturdy stems and open counters, which is the right set of qualities for
 * a readership that is mostly over 55 and often reading on a phone. */
const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  weight: ["400", "700"],
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
    url: site.url,
  },
  /* The card was defaulting to "summary", which is the small square
   * thumbnail. The share image is a 1200x630 landscape card and needs the
   * large variant or it gets cropped to a square and loses the headline.
   *
   * The image itself is picked up from opengraph-image.png / twitter-image.png
   * sitting next to this file, with alt text from the matching .alt.txt. */
  twitter: {
    card: "summary_large_image",
  },
  alternates: { canonical: "/" },
  robots: {
    // Driven by the single launch switch in lib/site, alongside robots.txt
    // and the sitemap, so indexing cannot be turned on in one place and
    // left off in another.
    index: LAUNCH_READY,
    follow: LAUNCH_READY,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={merriweather.variable}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-pink focus:px-5 focus:py-3 focus:text-white"
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
              // Was HomeAndConstructionBusiness, which is schema.org's type
              // for contractors and tradespeople and describes the wrong
              // business entirely. There is no schema.org type for
              // non-medical in-home care, so plain LocalBusiness is the
              // honest choice: broad, correct, and not a claim to be a
              // medical provider.
              "@type": "LocalBusiness",
              "@id": `${site.url}/#business`,
              name: site.name,
              description:
                "Non-medical in-home care for elderly and disabled adults across seven counties in North Mississippi.",
              telephone: site.phone,
              email: site.email,
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
              areaServed: [
                ...site.counties.map((c) => ({
                  "@type": "AdministrativeArea",
                  name: `${c.name} County, Mississippi`,
                })),
                // The towns matter as much as the counties: people search
                // "in-home care Tupelo", not "in-home care Lee County".
                ...site.towns.map((t) => ({
                  "@type": "City",
                  name: `${t.name}, Mississippi`,
                })),
              ],
              knowsAbout: [
                "in-home care",
                "personal care",
                "companion care",
                "respite care",
                "caregiver support",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "In-home care services",
                itemListElement: services.map((s) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: s.name,
                    description: s.blurb,
                    url: `${site.url}/services/${s.slug}`,
                  },
                })),
              },
            }),
          }}
        />
        <ScrollTint />
        <ScrollProgress />
        <MagnoliaDefs />
        {children}
      </body>
    </html>
  );
}
