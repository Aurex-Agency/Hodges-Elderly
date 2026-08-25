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

  return (
    <>
      <Header />
      <main id="main">
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
              {service.name} is available across all seven counties we serve.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {site.towns
                .filter((t) => t.page)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/in-home-care/${t.slug}`}
                      className="text-xl font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/service-area"
                  className="text-xl font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
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
                  className="text-xl text-ink-soft underline decoration-rule decoration-2 underline-offset-4 transition-colors duration-200 hover:text-plum hover:decoration-plum-soft"
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
