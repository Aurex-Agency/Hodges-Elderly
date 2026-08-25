import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Answers for Families",
  description:
    "Straight answers on how fast we can start, who comes into the home, what it costs, and what Medicaid and Medicare cover.",
  alternates: { canonical: "/answers" },
};

/* Withheld answers are filtered out entirely rather than shown with a
 * placeholder. A visible "TODO" is worse than an absent question, and a
 * fabricated answer about screening or billing is worse than both. */
const published = faqs.filter((f) => !("withheld" in f && f.withheld));

const GROUPS = [...new Set(published.map((f) => f.group))];

export default function Answers() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: published.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
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
          eyebrow="Answers"
          title="The questions families actually ask."
          lede="Nobody hires in-home care casually. These are the things people want to know before they call, answered the way we would answer them on the phone."
        />

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-32">
          {GROUPS.map((group) => (
            <div key={group} className="mb-16 last:mb-0">
              <h2 className="border-b border-rule pb-4 text-base font-bold uppercase tracking-[0.18em] text-green">
                {group}
              </h2>
              <dl className="mt-10 space-y-11">
                {published
                  .filter((f) => f.group === group)
                  .map((f) => (
                    <div key={f.q}>
                      <dt className="font-display text-[1.7rem] font-semibold leading-snug text-ink">
                        {f.q}
                      </dt>
                      <dd className="mt-3 text-xl leading-relaxed text-ink-soft">
                        {f.a}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}

          <div className="mt-16 rounded-panel border border-rule bg-mist/70 p-10">
            <h2 className="text-[1.7rem]">Still not answered?</h2>
            <p className="mt-3 text-xl text-ink-soft">
              Call {site.phone} and ask. Or read the longer versions in our{" "}
              <Link
                href="/guides"
                className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4"
              >
                guides for families
              </Link>
              , which go through{" "}
              <Link
                href="/guides/what-in-home-care-costs-in-mississippi"
                className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4"
              >
                what care costs in Mississippi
              </Link>
              ,{" "}
              <Link
                href="/guides/elderly-and-disabled-waiver-north-mississippi"
                className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4"
              >
                the Medicaid waiver
              </Link>
              , and{" "}
              <Link
                href="/guides/home-health-vs-in-home-care"
                className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4"
              >
                what Medicare does and does not pay for
              </Link>
              .
            </p>
          </div>
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
