import Link from "next/link";
import Magnolia from "@/components/Magnolia";
import BloomingMagnolia from "@/components/motion/BloomingMagnolia";
import HeroBloom from "@/components/motion/HeroBloom";
import DriftingPetals from "@/components/motion/DriftingPetals";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Stat from "@/components/motion/Stat";
import FigureScene from "@/components/FigureScene";
import ServicesExplorer from "@/components/ServicesExplorer";
import { CallButton, ClosingCta, Footer, Header } from "@/components/chrome";
import { countyNames, howItStarts, site, services } from "@/lib/site";

const STATS = [
  { value: 8, suffix: "years", accent: "spruce", label: "caring for elderly, IDD, and mental health clients" },
  { value: 7, suffix: "counties", accent: "clay", label: "across North Mississippi, all locally served" },
  { value: null, suffix: "Founder-led", accent: "plum", label: `you talk to ${site.founder}, not a franchise office` },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="main">
        {/* Hero. There is no photography, so the bloom does the emotional
            work a photograph normally would — and it opens on arrival. */}
        <section className="relative overflow-hidden">
          {/* On narrow screens the text spans the full width, so a
              full-strength bloom behind it destroys legibility. There it
              becomes a faint, leafless corner accent instead. */}
          <div className="pointer-events-none absolute -right-24 -top-16 h-[20rem] w-[20rem] opacity-40 lg:hidden">
            <Magnolia className="h-full w-full -rotate-[14deg]" withLeaves={false} />
          </div>
          <HeroBloom className="pointer-events-none absolute -right-44 -top-20 hidden h-[54rem] w-[54rem] opacity-[0.88] lg:block" />

          <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 lg:pb-40 lg:pt-28">
            <RevealGroup className="max-w-2xl" stagger={0.09}>
              <RevealItem>
                <p className="flex items-center gap-3 text-base font-bold uppercase tracking-[0.18em] text-green">
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
                <p className="mt-7 max-w-xl text-2xl text-ink-soft">
                  In-home care for aging parents and grandparents across seven
                  counties around Tupelo, so they keep the home they know and
                  you stop lying awake about the days you can&rsquo;t be there.
                </p>
              </RevealItem>

              <RevealItem>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <CallButton />
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[3.5rem] items-center px-2 text-xl font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-plum"
                  >
                    Ask a question first
                  </Link>
                </div>
              </RevealItem>

              <RevealItem>
                <p className="mt-6 text-lg text-ink-faint">
                  Serving {countyNames.slice(0, -1).join(", ")}, and{" "}
                  {countyNames.at(-1)} counties.
                </p>
              </RevealItem>
            </RevealGroup>
          </div>
        </section>

        {/* Three things that are true today. The insured/bonded and waiver
            claims belong here too — withheld until the client confirms. */}
        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto grid max-w-6xl gap-px bg-rule sm:grid-cols-3">
            {STATS.map((s) => (
              <Stat
                key={s.suffix}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                accent={s.accent}
              />
            ))}
          </div>
        </section>

        {/* Openable in place: the "what does personal care actually cover"
            question gets answered without leaving the page. */}
        <section className="mx-auto max-w-6xl px-6 py-28 lg:py-40">
          <Reveal className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl">What we do in the home</h2>
            <p className="mt-5 text-2xl text-ink-soft">
              Non-medical care, built around what they actually need help with,
              not a package they have to fit into. Open any one to see what it
              covers.
            </p>
          </Reveal>

          <ServicesExplorer services={services} />
        </section>

        {/* The three steps between deciding to call and someone turning up.
            Families stall for months here, so it gets its own section. */}
        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto max-w-6xl px-6 py-28 lg:py-40">
            <Reveal className="max-w-3xl">
              <h2 className="text-4xl lg:text-5xl">How it starts</h2>
              <p className="mt-5 text-2xl text-ink-soft">
                Most families put this call off for months because nobody tells
                them what happens next. Here is the whole of it.
              </p>
            </Reveal>

            <ol className="mt-16 grid gap-8 lg:grid-cols-3">
              {howItStarts.map((step, i) => (
                <Reveal as="li" key={step.scene} delay={i * 0.1}>
                  <div
                    style={
                      {
                        "--accent": `var(--color-${step.accent})`,
                        "--accent-wash": `var(--color-${step.accent}-wash)`,
                      } as React.CSSProperties
                    }
                    className="h-full rounded-2xl border border-rule bg-page/75 p-8 transition-colors duration-300 hover:border-[var(--accent)]"
                  >
                    <FigureScene
                      name={step.scene}
                      accent={step.accent}
                      className="h-40 w-full"
                    />
                    <p className="mt-6 flex items-center gap-3 text-base font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                      <span className="h-px w-8 bg-[var(--accent)]" aria-hidden="true" />
                      Step {i + 1}
                    </p>
                    <h3 className="mt-3 font-display text-[1.7rem] font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-xl text-ink-soft">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-12">
              <CallButton />
            </Reveal>
          </div>
        </section>

        {/* Her story — the strongest asset on the project. */}
        <section className="relative overflow-hidden bg-forest text-white">
          <DriftingPetals />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-[34rem] w-[34rem] opacity-[0.09]">
            <BloomingMagnolia className="h-full w-full rotate-[18deg]" withLeaves={false} />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
            <Reveal>
              <p className="text-base font-bold uppercase tracking-[0.18em] text-green-soft">
                Why this agency exists
              </p>
              <blockquote className="mt-8">
                <p className="font-display text-[2.1rem] leading-[1.24] sm:text-4xl">
                  &ldquo;Taking care of my grandmother was an eye-opener. That is
                  when I realized caring for people was my passion.&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  {/* TODO(client): replace with her portrait once we have one. */}
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-green-soft font-display text-2xl"
                    aria-hidden="true"
                  >
                    AH
                  </span>
                  <span className="text-lg leading-tight text-green-soft">
                    <span className="block font-semibold text-white">
                      {site.founder}
                    </span>
                    {site.founderTitle}
                  </span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.12} className="space-y-7 text-xl leading-relaxed text-white/85 lg:pt-16">
              <p>
                Before there was an agency, there was a granddaughter looking
                after her grandmother through bone cancer. {site.firstName}{" "}
                learned this work the way most people in Mississippi learn it. At
                home, without being asked, because someone she loved needed
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
        <section className="mx-auto max-w-6xl px-6 py-28 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 className="text-4xl lg:text-5xl">Where we go</h2>
              <p className="mt-5 text-xl text-ink-soft">
                Seven counties, all within reach of Tupelo. If you are just
                outside the line, call anyway. {site.firstName} will tell you
                honestly whether she can serve you.
              </p>
              <div className="mt-8">
                <CallButton variant="outline" />
              </div>
            </Reveal>

            <RevealGroup as="ul" className="grid grid-cols-2 gap-x-8 sm:grid-cols-3" stagger={0.05}>
              {site.counties.map((county) => (
                <RevealItem as="li" key={county.name}>
                  <Link
                    href={county.href}
                    style={
                      {
                        "--accent": `var(--color-${county.accent})`,
                        "--accent-wash": `var(--color-${county.accent}-wash)`,
                      } as React.CSSProperties
                    }
                    className="group block border-b-2 border-rule px-3 py-4 transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-wash)]"
                  >
                    <span className="font-display text-[1.7rem] font-semibold text-ink transition-colors duration-200 group-hover:text-[var(--accent)]">
                      {county.name}
                    </span>
                    <span className="mt-0.5 block text-base uppercase tracking-wider text-ink-faint transition-colors duration-200 group-hover:text-[var(--accent)]">
                      County
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <p className="mt-12 max-w-3xl text-lg text-ink-faint">
            Including {site.towns.map((t) => t.name).join(", ")}.
          </p>
        </section>

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
