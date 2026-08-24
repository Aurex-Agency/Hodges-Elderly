import Magnolia from "@/components/Magnolia";
import Logo from "@/components/Logo";
import { site, services } from "@/lib/site";

function CallButton({ subtle = false }: { subtle?: boolean }) {
  return (
    <a
      href={site.phoneHref}
      className={
        subtle
          ? "inline-flex min-h-[3.25rem] items-center gap-2 rounded-full border-2 border-plum px-7 text-lg font-semibold text-plum transition-colors duration-200 hover:bg-plum hover:text-petal"
          : "inline-flex min-h-[3.5rem] items-center gap-3 rounded-full bg-plum px-8 text-lg font-semibold text-petal shadow-[0_2px_0_0_var(--color-plum-deep)] transition-colors duration-200 hover:bg-plum-deep"
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M6.6 2.5 9 3.1l1.2 3.6-1.9 1.6a12.4 12.4 0 0 0 5.4 5.4l1.6-1.9 3.6 1.2.6 2.4a2 2 0 0 1-2 2.5A16.5 16.5 0 0 1 4.1 4.5a2 2 0 0 1 2.5-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      Call {site.phone}
    </a>
  );
}

export default function Home() {
  return (
    <>
      <header className="relative z-20 border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {["Services", "Her Story", "Service Area", "What It Costs", "Answers"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-base font-semibold text-ink-soft transition-colors duration-200 hover:text-plum"
                >
                  {item}
                </a>
              ),
            )}
          </nav>
          <div className="hidden sm:block">
            <CallButton subtle />
          </div>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------
            Hero. No photography exists, so the bloom does the emotional
            work that a photograph normally would.
        --------------------------------------------------------------- */}
        <section className="grain relative overflow-hidden">
          {/* Two separate treatments. On narrow screens the text block spans
              the full width, so a full-strength bloom behind it destroys
              legibility — especially the dark leaves. There it becomes a
              faint, leafless corner accent instead. */}
          <div className="pointer-events-none absolute -right-24 -top-16 h-[20rem] w-[20rem] opacity-[0.35] lg:hidden">
            <Magnolia className="h-full w-full -rotate-[14deg]" withLeaves={false} />
          </div>
          {/* Desktop: bleeds off the right edge so it reads as a composed
              field the headline sits against, not a stamp floating in space. */}
          <div className="pointer-events-none absolute -right-36 -top-20 hidden h-[54rem] w-[54rem] opacity-90 lg:block">
            <Magnolia className="h-full w-full -rotate-[14deg]" />
          </div>
          <div className="pointer-events-none absolute -bottom-56 -left-44 hidden h-[30rem] w-[30rem] opacity-[0.22] lg:block">
            <Magnolia className="h-full w-full rotate-[195deg]" withLeaves={false} />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 lg:pb-36 lg:pt-28">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-leaf">
                <span className="h-px w-10 bg-leaf-soft" aria-hidden="true" />
                In-home care across North Mississippi
              </p>

              <h1 className="mt-7 text-[2.7rem] leading-[1.03] sm:text-6xl lg:text-[4.25rem]">
                She stays in her own home.
                <span className="block text-plum">
                  We take care of everything else.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-xl text-ink-soft">
                Hodges Elderly &amp; Disabled Services is a local, family-founded
                agency serving seven counties around Tupelo. You will not get a
                call center. You will get {site.founder.split(" ")[0]}.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <CallButton />
                <a
                  href="#contact"
                  className="inline-flex min-h-[3.5rem] items-center px-2 text-lg font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-plum"
                >
                  Ask a question first
                </a>
              </div>

              <p className="mt-6 text-base text-ink-faint">
                Serving {site.counties.slice(0, -1).join(", ")}, and{" "}
                {site.counties.at(-1)} counties.
              </p>
            </div>
          </div>
        </section>

        {/* Three things that are true today. The insured/bonded and waiver
            claims belong here too — withheld until the client confirms. */}
        <section className="border-y border-rule bg-cream-deep">
          <div className="mx-auto grid max-w-6xl gap-px bg-rule sm:grid-cols-3">
            {[
              { stat: "8 years", label: "caring for elderly, IDD, and mental health clients" },
              { stat: "7 counties", label: "across North Mississippi, all locally served" },
              { stat: "Founder-led", label: `you talk to ${site.founder}, not a franchise office` },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-cream-deep px-6 py-9 text-center">
                <p className="font-display text-3xl font-semibold text-plum">{stat}</p>
                <p className="mx-auto mt-2 max-w-[16rem] text-base leading-snug text-ink-soft">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Services. An editorial list with hanging numerals rather than a
            grid of equal rounded cards — the default pattern every
            competitor in this market already uses.
        --------------------------------------------------------------- */}
        <section id="services" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl">What we do in the home</h2>
            <p className="mt-5 text-xl text-ink-soft">
              Non-medical care, built around what she actually needs help with —
              not a package she has to fit into.
            </p>
          </div>

          <ul className="mt-16 border-t border-rule">
            {services.map((service, i) => (
              <li key={service.slug} className="border-b border-rule">
                <a
                  href={`/services/${service.slug}`}
                  className="group grid items-baseline gap-x-8 gap-y-3 py-8 transition-colors duration-200 hover:bg-plum-wash sm:grid-cols-[4rem_21rem_1fr] sm:px-4"
                >
                  <span className="font-display text-2xl text-plum-soft tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-plum">
                    {service.name}
                  </h3>
                  <p className="text-lg text-ink-soft">{service.blurb}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------------
            Her story. The strongest asset on the project: she started this
            after caring for her grandmother through bone cancer. Full-bleed
            dark green so it lands as the emotional centre of the page.
        --------------------------------------------------------------- */}
        <section id="her-story" className="grain relative overflow-hidden bg-leaf-deep text-cream">
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-[34rem] w-[34rem] opacity-[0.09]">
            <Magnolia className="h-full w-full rotate-[18deg]" withLeaves={false} />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:py-32">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-soft">
                Why this agency exists
              </p>
              <blockquote className="mt-8">
                <p className="font-display text-3xl leading-[1.2] text-cream sm:text-4xl">
                  &ldquo;Taking care of my grandmother was an eye-opener. That is
                  when I realized caring for people was my passion.&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  {/* Placeholder for her portrait — see TODO below. */}
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-leaf-soft font-display text-xl text-cream"
                    aria-hidden="true"
                  >
                    AH
                  </span>
                  <span className="text-base leading-tight text-leaf-soft">
                    <span className="block font-semibold text-cream">
                      {site.founder}
                    </span>
                    {site.founderTitle}
                  </span>
                </footer>
              </blockquote>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-cream/85 lg:pt-16">
              <p>
                Before there was an agency, there was a granddaughter looking
                after her grandmother through bone cancer. {site.founder.split(" ")[0]}{" "}
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
              <p className="font-semibold text-cream">
                Her mother has run a care home in West Point for years. This is
                the second generation of the same family doing the same work.
              </p>
            </div>
          </div>
        </section>

        {/* Service area, set as display type rather than a map or pill row. */}
        <section id="service-area" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-4xl lg:text-5xl">Where we go</h2>
              <p className="mt-5 text-lg text-ink-soft">
                Seven counties, all within reach of Tupelo. If you are just
                outside the line, call anyway — {site.founder.split(" ")[0]} will
                tell you honestly whether she can serve you.
              </p>
              <div className="mt-8">
                <CallButton subtle />
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
              {site.counties.map((county) => (
                <li key={county} className="border-b border-rule py-4">
                  <span className="font-display text-2xl font-semibold text-ink">
                    {county}
                  </span>
                  <span className="mt-0.5 block text-sm uppercase tracking-wider text-ink-faint">
                    County
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-12 max-w-3xl text-base text-ink-faint">
            Including {site.towns.map((t) => t.name).join(", ")}.
          </p>
        </section>

        {/* Closing call to action. */}
        <section id="contact" className="grain relative overflow-hidden border-t border-rule bg-plum-wash">
          <div className="pointer-events-none absolute -left-20 -top-28 h-[24rem] w-[24rem] opacity-40">
            <Magnolia className="h-full w-full rotate-[145deg]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:py-32">
            <h2 className="text-4xl lg:text-5xl">
              Tell us what she needs. We will tell you straight.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl text-ink-soft">
              No pressure and no sales script — just a conversation about what is
              going on and whether we are the right fit.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CallButton />
            </div>
            <p className="mt-6 text-base text-ink-faint">
              {/* TODO(client): confirm answering hours before publishing them. */}
              Serving {site.address.city} and the surrounding seven counties.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule bg-cream-deep">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-base text-ink-soft">
              Locally founded in-home care for elderly and disabled adults across
              North Mississippi.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/services/${s.slug}`}
                    className="text-base text-ink-soft transition-colors duration-200 hover:text-plum"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Towns</h2>
            <ul className="mt-4 space-y-2.5">
              {site.towns
                .filter((t) => t.page)
                .map((t) => (
                  <li key={t.name}>
                    <a
                      href={`/in-home-care/${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-base text-ink-soft transition-colors duration-200 hover:text-plum"
                    >
                      In-home care in {t.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-base text-ink-soft">
              <li>
                <a
                  href={site.phoneHref}
                  className="font-semibold text-plum transition-colors duration-200 hover:text-plum-deep"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rule">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <p className="text-sm text-ink-faint">
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
