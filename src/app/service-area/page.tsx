import type { Metadata } from "next";
import Link from "next/link";
import { CallButton, ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Area | Seven North Mississippi Counties",
  description:
    "Hodges Elderly and Disable Services provides in-home care in Lee, Pontotoc, Union, Chickasaw, Monroe, Lafayette, and Itawamba counties.",
  alternates: { canonical: "/service-area" },
};

export default function ServiceArea() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Where we go"
          title="Seven counties, all within reach of Tupelo."
          lede={`If you are just outside the line, call anyway. ${site.firstName} will tell you honestly whether she can serve you.`}
        />

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
          <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {site.counties.map((county) => {
              const towns = site.towns.filter((t) => t.county === county.name);
              return (
                <li
                  key={county.name}
                  style={
                    {
                      "--accent": `var(--color-${county.accent})`,
                      "--accent-wash": `var(--color-${county.accent}-wash)`,
                    } as React.CSSProperties
                  }
                  className="group bg-page/75 p-9 transition-colors duration-300 hover:bg-[var(--accent-wash)]"
                >
                  <h2 className="font-display text-[1.7rem] font-semibold text-ink transition-colors duration-300 group-hover:text-[var(--accent)]">
                    {county.name} County
                  </h2>
                  <p className="mt-2 text-lg text-ink-soft">
                    {towns.length > 0
                      ? towns.map((t) => t.name).join(", ")
                      : "In-home care available throughout the county."}
                  </p>
                  {towns.some((t) => t.page) && (
                    <p className="mt-4">
                      {towns
                        .filter((t) => t.page)
                        .map((t) => (
                          <Link
                            key={t.slug}
                            href={`/in-home-care/${t.slug}`}
                            className="text-lg font-semibold text-[var(--accent)] underline decoration-current/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-current"
                          >
                            In-home care in {t.name}
                          </Link>
                        ))}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-12 max-w-2xl">
            <h2 className="text-[1.7rem]">Not sure if you are in the area?</h2>
            <p className="mt-4 text-xl text-ink-soft">
              County lines are not the point. Travel time is. If you are close
              to one of these counties, it is worth a phone call.
            </p>
            <div className="mt-7">
              <CallButton />
            </div>
          </div>
        </section>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
