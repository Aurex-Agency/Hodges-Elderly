import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallButton, ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { services, site } from "@/lib/site";

const townPages = site.towns.filter((t) => t.page);

/* Deliberately does not name local hospitals, facilities, or landmarks.
 * Those are strong local-SEO signals, but only if verified — and stating
 * an unverified relationship with a named institution is worse than a
 * slightly plainer page. TODO(client): supply real local detail. */
const TOWN_COPY: Record<string, { intro: string; local: string }> = {
  tupelo: {
    intro:
      "Tupelo is where the agency is based, so it is where we can respond fastest, including on short notice.",
    local:
      "As the largest city in the region, Tupelo is also where most families in the surrounding counties come for medical appointments. If your mother lives here, or comes here regularly for care, we can build the schedule around those trips rather than around ours.",
  },
  "new-albany": {
    intro:
      "New Albany sits about half an hour north of Tupelo, and we serve families throughout Union County.",
    local:
      "Families in smaller towns often have fewer options and end up driving further for help. That is exactly the situation in-home care is meant to solve. The care comes to the house instead of the house emptying out.",
  },
  pontotoc: {
    intro:
      "Pontotoc is a short drive west of Tupelo, and we serve families across Pontotoc County.",
    local:
      "A lot of families here have someone in the next town over who helps when they can. In-home care fills the days in between, so the person doing the driving is not carrying all of it alone.",
  },
};

export function generateStaticParams() {
  return townPages.map((t) => ({ town: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const t = townPages.find((x) => x.slug === town);
  if (!t) return {};
  return {
    title: `In-Home Care in ${t.name}, MS`,
    description: `Non-medical in-home care for elderly and disabled adults in ${t.name} and ${t.county} County, Mississippi. Locally founded and founder-led.`,
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const t = townPages.find((x) => x.slug === town);
  if (!t) notFound();

  const copy = TOWN_COPY[t.slug];
  const otherTowns = townPages.filter((x) => x.slug !== t.slug);

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow={`${t.county} County`}
          title={`In-home care in ${t.name}, Mississippi`}
          lede={copy.intro}
        />

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
              <p className="text-xl text-ink">
                Hodges Elderly and Disabled Services provides non-medical
                in-home care to elderly and disabled adults in {t.name} and
                throughout {t.county} County.
              </p>
              <p>{copy.local}</p>
              <p>
                We are not a franchise branch. {site.founder} founded this
                agency, hires every caregiver personally, and answers the phone
                when you call. If something is not working with your
                parent&rsquo;s care, you are talking to the owner about it.
              </p>
              <p>
                <Link
                  href="/about"
                  className="font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
                >
                  Read {site.firstName}&rsquo;s story
                </Link>
              </p>
            </div>

            <div className="rounded-2xl border border-rule bg-mist/70 p-8">
              <h2 className="text-2xl">Start with a phone call</h2>
              <p className="mt-4 text-lg text-ink-soft">
                Tell us what a normal day looks like in {t.name} and what has
                changed. No script, no pressure.
              </p>
              <div className="mt-7">
                <CallButton />
              </div>
              <p className="mt-5 text-base text-ink-faint">
                Or{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4"
                >
                  send a message
                </Link>{" "}
                and we will get back to you.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-3xl">What we help with in {t.name}</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-rule pb-4">
                  <Link
                    href={`/services/${s.slug}`}
                    className="font-display text-xl font-semibold text-ink transition-colors duration-200 hover:text-plum"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-1.5 text-base text-ink-soft">{s.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl">Nearby</h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {otherTowns.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/in-home-care/${o.slug}`}
                  className="text-lg text-ink-soft underline decoration-rule decoration-2 underline-offset-4 transition-colors duration-200 hover:text-plum hover:decoration-plum-soft"
                >
                  In-home care in {o.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/service-area"
                className="text-lg text-ink-soft underline decoration-rule decoration-2 underline-offset-4 transition-colors duration-200 hover:text-plum hover:decoration-plum-soft"
              >
                All seven counties
              </Link>
            </li>
          </ul>
        </section>

        <ClosingCta
          title={`Caring for someone in ${t.name}?`}
          body="One conversation about what is going on at home. If we are not the right fit, we will tell you that too."
        />
      </main>
      <Footer />
    </>
  );
}
