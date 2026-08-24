import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import ServiceIllustration from "@/components/ServiceIllustration";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "In-Home Care Services",
  description:
    "Personal care, companion care, IDD and mental health support, meals and homemaking, errands and transportation, and respite for family caregivers across North Mississippi.",
};

export default function Services() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Services"
          title="Care built around their day, not around a package."
          lede="Non-medical in-home care. Start with whatever is actually a problem right now. A few hours a week is a normal place to begin."
        />

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <ul className="border-t border-rule">
            {services.map((service, i) => (
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
                  className="group relative grid items-center gap-x-8 gap-y-3 py-8 transition-colors duration-300 hover:bg-[var(--accent-wash)] sm:grid-cols-[6rem_20rem_1fr] sm:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-y-100"
                  />

                  <span className="flex items-center gap-3">
                    <span className="font-display text-2xl tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ServiceIllustration
                      slug={service.slug}
                      accent={service.accent}
                      className="h-14 w-14 shrink-0"
                    />
                  </span>

                  <h2 className="font-display text-2xl font-semibold text-ink transition-colors duration-300 group-hover:text-[var(--accent)]">
                    {service.name}
                  </h2>
                  <p className="text-lg text-ink-soft">{service.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-2xl text-lg text-ink-soft">
            Not sure which of these you need? Most families are not. Describe
            what a normal day looks like and we will work it out together.
          </p>
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
