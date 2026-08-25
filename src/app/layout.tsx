import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { MagnoliaDefs } from "@/components/Magnolia";
import ScrollTint, { ScrollProgress } from "@/components/motion/ScrollTint";
import { site } from "@/lib/site";
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
    <html lang="en" className={merriweather.variable}>
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
        <ScrollTint />
        <ScrollProgress />
        <MagnoliaDefs />
        {children}
      </body>
    </html>
  );
}
