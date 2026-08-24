import Link from "next/link";
import Magnolia from "@/components/Magnolia";
import BloomingMagnolia from "@/components/motion/BloomingMagnolia";
import DriftingPetals from "@/components/motion/DriftingPetals";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Stat from "@/components/motion/Stat";
import ServicesExplorer from "@/components/ServicesExplorer";
import { CallButton, ClosingCta, Footer, Header } from "@/components/chrome";
import { site, services } from "@/lib/site";

const STATS = [
  { value: 8, suffix: "years", label: "caring for elderly, IDD, and mental health clients" },
  { value: 7, suffix: "counties", label: "across North Mississippi, all locally served" },
  { value: null, suffix: "Founder-led", label: `you talk to ${site.founder}, not a franchise office` },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="main">
        {/* Hero. There is no photography, so the bloom does the emotional
            work a photograph normally would — and it opens on arrival. */}
        <section className="relative overflow-hidden bg-page">
          {/* On narrow screens the text spans the full width, so a
              full-strength bloom behind it destroys legibility. There it
              becomes a faint, leafless corner accent instead. */}
          <div className="pointer-events-none absolute -right-24 -top-16 h-[20rem] w-[20rem] opacity-40 lg:hidden">
            <Magnolia className="h-full w-full -rotate-[14deg]" withLeaves={false} />
          </div>
          <div className="pointer-events-none absolute -right-44 -top-20 hidden h-[54rem] w-[54rem] opacity-[0.88] lg:block">
            <BloomingMagnolia className="h-full w-full -rotate-[14deg]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 lg:pb-32 lg:pt-24">
            <RevealGroup className="max-w-2xl" stagger={0.09}>
              <RevealItem>
                <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-green">
                  <span className="h-px w-10 bg-green-soft" aria-hidden="true" />
                  In-home care across North Mississippi
                </p>
              </RevealItem>

              <RevealItem>
                <h1 className="mt-7 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.1rem]">
                  You can&rsquo;t be there every day.
                  <span className="block text-plum">We can.</span>
                </h1>
              </RevealItem>

              <RevealItem>
                <p className="mt-7 max-w-xl text-xl text-ink-soft">
                  In-home care for aging parents and grandparents across seven
                  counties around Tupelo — so they keep the home they know, and
                  you stop lying awake about the days you can&rsquo;t be there.
                </p>
              </RevealItem>

              <RevealItem>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <CallButton />
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[3.5rem] items-center px-2 text-lg font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-plum"
                  >
                    Ask a question first
                  </Link>
                </div>
              </RevealItem>

              <RevealItem>
                <p className="mt-6 text-base text-ink-faint">
                  Serving {site.counties.slice(0, -1).join(", ")}, and{" "}
                  {site.counties.at(-1)} counties.
                </p>
              </RevealItem>
            </RevealGroup>
          </div>
        </section>

        {/* Three things that are true today. The insured/bonded and waiver
            claims belong here too — withheld until the client confirms. */}
        <section className="border-y border-rule bg-mist">
          <div className="mx-auto grid max-w-6xl gap-px bg-rule sm:grid-cols-3">
            {STATS.map((s) => (
              <Stat key={s.suffix} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </section>

        {/* Openable in place: the "what does personal care actually cover"
            question gets answered without leaving the page. */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <Reveal className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl">What we do in the home</h2>
            <p className="mt-5 text-xl text-ink-soft">
              Non-medical care, built around what they actually need help with —
              not a package they have to fit into. Open any one to see what it
              covers.
            </p>
          </Reveal>

          <ServicesExplorer services={services} />
        </section>

        {/* Her story — the strongest asset on the project. */}
        <section className="relative overflow-hidden bg-forest text-white">
          <DriftingPetals />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-[34rem] w-[34rem] opacity-[0.09]">
            <BloomingMagnolia className="h-full w-full rotate-[18deg]" withLeaves={false} />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-soft">
                Why this agency exists
              </p>
              <blockquote className="mt-8">
                <p className="font-display text-3xl leading-[1.24] sm:text-4xl">
                  &ldquo;Taking care of my grandmother was an eye-opener. That is
                  when I realized caring for people was my passion.&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  {/* TODO(client): replace with her portrait once we have one. */}
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-green-soft font-display text-xl"
                    aria-hidden="true"
                  >
                    AH
                  </span>
                  <span className="text-base leading-tight text-green-soft">
                    <span className="block font-semibold text-white">
                      {site.founder}
                    </span>
                    {site.founderTitle}
                  </span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.12} className="space-y-6 text-lg leading-relaxed text-white/85 lg:pt-16">
              <p>
                Before there was an agency, there was a granddaughter looking
                after her grandmother through bone cancer. {site.firstName}{" "}
                learned this work the way most people in Mississippi learn it —
                at home, without being asked, because someone she loved needed
                her.
              </p>
              <p>
                She went on to spend eight years supporting adults with
                intellectual and developmental disabilities and with mental
                illness. She opened Hodges to do it on her own terms:
                compassion, dignity, and a genuine passion for serving others.
              </p>
              <p>
                <Link
                  href="/about"
                  className="font-semibold text-white underline decoration-green-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-white"
                >
                  Read more about {site.firstName}
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Service area, set as display type rather than a map or pill row. */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 className="text-4xl lg:text-5xl">Where we go</h2>
              <p className="mt-5 text-lg text-ink-soft">
                Seven counties, all within reach of Tupelo. If you are just
                outside the line, call anyway — {site.firstName} will tell you
                honestly whether she can serve you.
              </p>
              <div className="mt-8">
                <CallButton variant="outline" />
              </div>
            </Reveal>

            <RevealGroup as="ul" className="grid grid-cols-2 gap-x-8 sm:grid-cols-3" stagger={0.05}>
              {site.counties.map((county) => (
                <RevealItem as="li" key={county} className="border-b border-rule py-4">
                  <span className="font-display text-2xl font-semibold text-ink">
                    {county}
                  </span>
                  <span className="mt-0.5 block text-sm uppercase tracking-wider text-ink-faint">
                    County
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <p className="mt-12 max-w-3xl text-base text-ink-faint">
            Including {site.towns.map((t) => t.name).join(", ")}.
          </p>
        </section>

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
