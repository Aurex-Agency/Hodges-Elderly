import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import ServiceIllustration from "@/components/ServiceIllustration";
import { SERVICE_GROUPS, WHO_WE_SERVE, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Personal care, companion care, home and community supports, in-home respite, supervised living, behavioral supervised living, and behavior support for autistic adults, across North Mississippi.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Services"
          title="Care built around their day, not around a package."
          lede="Support in someone's own home, and staffed homes for adults who need more than a few hours a day. Start with whatever is actually a problem right now."
        />

        {SERVICE_GROUPS.map((group, gi) => (
          <section
            key={group.id}
            className={
              gi === 1
                ? "border-y border-rule bg-mist/65"
                : ""
            }
          >
            <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
              <div className="max-w-3xl">
                <h2 className="text-4xl lg:text-[2.8rem]">{group.name}</h2>
                <p className="mt-5 text-2xl text-ink-soft">{group.blurb}</p>
              </div>

              <ul className="-mx-6 mt-14 border-t border-rule sm:mx-0">
                {services
                  .filter((x) => x.group === group.id)
                  .map((service, i) => (
                    <li
                      key={service.slug}
                      style={
                        {
                          "--accent": `var(--color-${service.accent})`,
                          "--accent-wash": `var(--color-${service.accent}-wash)`,
                        } as React.CSSProperties
                      }
                      className="border-b border-rule"
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group relative grid items-center gap-x-10 gap-y-4 px-6 py-8 transition-colors duration-300 hover:bg-[var(--accent-wash)] sm:grid-cols-[7.5rem_20rem_1fr] sm:px-6 sm:py-10"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-y-100"
                        />

                        <span className="flex items-center gap-3">
                          <span className="font-display text-[1.7rem] tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-[var(--accent)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <ServiceIllustration
                            slug={service.slug}
                            accent={service.accent}
                            className="h-14 w-14 shrink-0"
                          />
                        </span>

                        <h3 className="font-display text-[1.7rem] font-semibold text-ink transition-colors duration-300 group-hover:text-[var(--accent)]">
                          {service.name}
                        </h3>
                        <p className="text-xl text-ink-soft">{service.blurb}</p>
                      </Link>
                    </li>
                  ))}
              </ul>

              {gi === 0 && (
                <p className="mt-10 max-w-2xl text-xl text-ink-soft">
                  Not sure which of these you need? Most families are not.
                  Describe what a normal day looks like and we will work it
                  out together.
                </p>
              )}
            </div>
          </section>
        ))}

        {/* The service list answers "what do you do". It does not answer
            "do you deal with someone like my son", which is the question
            people are actually ringing up to ask. */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-[2.8rem]">Who we work with</h2>
            <p className="mt-5 text-2xl text-ink-soft">
              If you have been turned away before, or told a service was not
              equipped for the person you are calling about, say so on the
              phone. It changes the conversation.
            </p>
          </div>

          <ul className="mt-14 grid gap-8 sm:grid-cols-2">
            {WHO_WE_SERVE.map((w) => (
              <li
                key={w.id}
                style={
                  {
                    "--accent": `var(--color-${w.accent})`,
                    "--accent-wash": `var(--color-${w.accent}-wash)`,
                  } as React.CSSProperties
                }
                className="rounded-panel border border-rule bg-page/75 p-8 transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-wash)]"
              >
                <h3 className="font-display text-[1.55rem] font-bold leading-snug text-[var(--accent)]">
                  {w.name}
                </h3>
                <p className="mt-3 text-xl text-ink-soft">{w.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl text-lg text-ink-faint">
            Call {site.phone} and describe the situation. If we are not the
            right fit, we will tell you that and point you somewhere else.
          </p>
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
