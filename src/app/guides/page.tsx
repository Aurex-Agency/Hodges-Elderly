import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { formatGuideDate, guides } from "@/lib/guides";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides for North Mississippi Families",
  description:
    "Plain answers on what care costs in Mississippi, what Medicaid and Medicare cover, VA benefits, and how to tell when a parent needs help at home.",
  alternates: { canonical: "/guides" },
};

const CATEGORIES = [...new Set(guides.map((g) => g.category))];

export default function Guides() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Guides | ${site.shortName}`,
    url: `${site.url}/guides`,
    description: metadata.description,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    blogPost: guides.map((g) => ({
      "@type": "BlogPosting",
      headline: g.title,
      description: g.description,
      datePublished: g.published,
      dateModified: g.updated,
      url: `${site.url}/guides/${g.slug}`,
      author: { "@type": "Person", name: site.founder },
    })),
  };

  return (
    <>
      <Header />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PageHero
          eyebrow="Guides"
          title="The things nobody explains until you have to find out."
          lede="Written for families in these seven counties, with every figure traced back to Medicaid, the VA, or the office that actually administers the program. No sales pitch buried in the middle."
        />

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
          {CATEGORIES.map((category, ci) => (
            <div key={category} className="mb-20 last:mb-0">
              <Reveal>
                <h2 className="border-b border-rule pb-4 text-base font-bold uppercase tracking-[0.18em] text-green">
                  {category}
                </h2>
              </Reveal>

              <RevealGroup as="ul" className="mt-10 grid gap-8 lg:grid-cols-2" stagger={0.07}>
                {guides
                  .filter((g) => g.category === category)
                  .map((g) => (
                    <RevealItem as="li" key={g.slug}>
                      <Link
                        href={`/guides/${g.slug}`}
                        style={
                          {
                            "--accent": `var(--color-${g.accent})`,
                            "--accent-wash": `var(--color-${g.accent}-wash)`,
                          } as React.CSSProperties
                        }
                        className="group flex h-full flex-col rounded-panel border border-rule bg-page/75 p-8 transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-wash)]"
                      >
                        <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                          <span
                            className="h-px w-8 bg-[var(--accent)]"
                            aria-hidden="true"
                          />
                          {g.readMinutes} minute read
                        </span>
                        <h3 className="mt-4 font-display text-[1.7rem] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-[var(--accent)]">
                          {g.title}
                        </h3>
                        <p className="mt-3 flex-1 text-xl text-ink-soft">
                          {g.description}
                        </p>
                        <span className="mt-6 text-base text-ink-faint">
                          <time dateTime={g.published}>
                            {formatGuideDate(g.published)}
                          </time>
                        </span>
                      </Link>
                    </RevealItem>
                  ))}
              </RevealGroup>

              {ci === 0 && (
                <Reveal className="mt-10 text-lg text-ink-faint">
                  <p>
                    If you would rather just ask, call {site.phone}. Nobody is
                    going to put you on a mailing list for it.
                  </p>
                </Reveal>
              )}
            </div>
          ))}
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
