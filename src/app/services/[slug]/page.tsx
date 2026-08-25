import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceIllustration from "@/components/ServiceIllustration";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { services, site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} in Tupelo & North Mississippi`,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug);
  const url = `${site.url}/services/${service.slug}`;

  /* Service, not Product. There is no price and no offer here, and marking
   * up an offer we cannot populate would be a rich-result violation as
   * well as a lie. areaServed carries the local signal instead. */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.blurb,
      url,
      serviceType: service.name,
      category: "Non-medical in-home care",
      provider: { "@type": "LocalBusiness", "@id": `${site.url}/#business` },
      areaServed: site.counties.map((c) => ({
        "@type": "AdministrativeArea",
        name: `${c.name} County, Mississippi`,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `What ${service.name.toLowerCase()} includes`,
        itemListElement: service.includes.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${site.url}/services`,
        },
        { "@type": "ListItem", position: 3, name: service.name, item: url },
      ],
    },
  ];

  return (
    <>
      <Header />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PageHero eyebrow="Services" title={service.name} lede={service.blurb} />

        <section
          style={
            {
              "--accent": `var(--color-${service.accent})`,
              "--accent-wash": `var(--color-${service.accent}-wash)`,
            } as React.CSSProperties
          }
          className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32"
        >
          <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <ServiceIllustration
                slug={service.slug}
                accent={service.accent}
                className="mb-8 h-32 w-32"
              />
              <h2 className="text-[2.1rem]">Who this is for</h2>
              <p className="mt-5 text-2xl leading-relaxed text-ink-soft">
                {service.forWhom}
              </p>
              <p className="mt-8 border-l-4 border-[var(--accent)] bg-[var(--accent-wash)] py-4 pl-6 pr-4 text-xl leading-relaxed text-ink">
                {service.note}
              </p>
            </div>

            <div>
              <h2 className="text-[2.1rem]">What it includes</h2>
              <ul className="mt-6 space-y-4">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-rule pb-4">
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
                    <span className="text-xl text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <h2 className="text-[2.1rem]">Where we provide it</h2>
            <p className="mt-4 max-w-2xl text-xl text-ink-soft">
              {/* Residential services are not "available across seven
                  counties" the way a visiting service is: a staffed home is
                  in one specific place. Saying otherwise would imply she has
                  homes everywhere, which is not something we know. */}
              {service.group === "supported-living"
                ? `We serve families across all seven counties. Call ${site.phone} and we will tell you what is available and where.`
                : `${service.name} is available across all seven counties we serve.`}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {site.towns
                .filter((t) => t.page)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/in-home-care/${t.slug}`}
                      className="text-xl font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/service-area"
                  className="text-xl font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                >
                  All seven counties
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <h2 className="text-[1.7rem]">Other things we help with</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="text-xl text-ink-soft underline decoration-rule decoration-2 underline-offset-4 transition-colors duration-200 hover:text-pink hover:decoration-pink-soft"
                >
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
