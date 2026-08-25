import type { Metadata } from "next";
import Link from "next/link";
import { CallButton, ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { PRICING_CONFIRMED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "What In-Home Care Costs in North Mississippi",
  description:
    "How families pay for in-home care in Mississippi: private pay, the Medicaid Elderly and Disabled Waiver, long-term care insurance, and VA benefits, explained plainly.",
  alternates: { canonical: "/paying-for-care" },
};

/* TODO(client): REAL NUMBERS REQUIRED.
 * Package 2 sells published pricing ranges as the differentiator, and this
 * is the highest-intent page on the site. Until the client supplies actual
 * private-pay rates, the page shows an honest "call for a quote" block
 * rather than an invented range. Do not ship to a live domain like this. */

const PAYMENT_ROUTES = [
  {
    title: "Private pay",
    body: "The family pays directly, usually by the hour. This is how most in-home care in Mississippi is paid for. It is also the fastest to arrange, because it does not depend on anyone else approving it.",
    guide: {
      label: "What in-home care costs in Mississippi",
      href: "/guides/what-in-home-care-costs-in-mississippi",
    },
  },
  {
    title: "Medicaid Elderly and Disabled Waiver",
    body: "Mississippi's E&D Waiver is a Medicaid program that can cover in-home personal care for people who would otherwise need nursing-home level care. Eligibility is decided by the Mississippi Division of Medicaid, not by any agency. There is an application process and, at times, a waiting list.",
    guide: {
      label: "How to apply for the waiver in North Mississippi",
      href: "/guides/elderly-and-disabled-waiver-north-mississippi",
    },
  },
  {
    title: "Long-term care insurance",
    body: "If your parent bought a long-term care policy years ago, it may cover exactly this. Policies vary widely in what they pay and what they require, so read the benefit trigger and the elimination period before assuming anything.",
    guide: null,
  },
  {
    title: "VA benefits",
    body: "Veterans and surviving spouses may qualify for benefits that help pay for in-home care, including Aid and Attendance. This runs through the VA and is worth asking about if there is any service history in the family.",
    guide: {
      label: "VA Aid and Attendance, and how families use it",
      href: "/guides/va-aid-and-attendance-for-in-home-care",
    },
  },
];

export default function PayingForCare() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="What it costs"
          title="How families actually pay for in-home care."
          lede="This is the question everybody has and almost nobody answers plainly. Here is the honest version."
        />

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-28">
          {PRICING_CONFIRMED ? null : (
            <div className="rounded-panel border-2 border-pink bg-pink-wash p-8">
              <h2 className="text-[1.7rem]">Our rates</h2>
              <p className="mt-4 text-xl text-ink-soft">
                Call {site.phone} and we will give you a straight number for the
                schedule you actually need. Cost depends on how many hours a
                week and what kind of help. There is no sense quoting you a figure
                for care that is not yours.
              </p>
              <div className="mt-7">
                <CallButton />
              </div>
            </div>
          )}

          <div className="mt-14 space-y-7 text-xl leading-relaxed text-ink-soft">
            <h2 className="text-[2.1rem] text-ink">The four ways this gets paid for</h2>
            <p>
              Almost every family in Mississippi pays for in-home care through
              one of four routes, and plenty use more than one.
            </p>
          </div>

          <ol className="mt-10 space-y-8">
            {PAYMENT_ROUTES.map((route, i) => (
              <li key={route.title} className="border-t border-rule pt-7">
                <div className="flex gap-5">
                  {/* text-pink, not text-pink-soft. The soft tone is a decoration
                      colour for underlines and borders at 2.67:1, and axe
                      correctly failed it the moment it was asked to be a
                      numeral someone has to read. */}
                  <span className="font-display text-[1.7rem] text-pink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.7rem] font-semibold text-ink">
                      {route.title}
                    </h3>
                    <p className="mt-3 text-xl text-ink-soft">{route.body}</p>
                    {route.guide && (
                      <p className="mt-3">
                        <Link
                          href={route.guide.href}
                          className="text-lg font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                        >
                          {route.guide.label}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-rule bg-mist/65">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
            <h2 className="text-[2.1rem]">What Medicare does not cover</h2>
            <div className="mt-6 space-y-7 text-xl text-ink-soft">
              <p>
                This catches families out constantly, so it is worth being blunt:{" "}
                <strong className="text-ink">
                  Medicare does not pay for ongoing help with bathing, meals,
                  dressing, and housekeeping.
                </strong>
              </p>
              <p>
                Medicare covers short-term skilled care, such as a nurse or a
                physical therapist for a limited period after a hospital stay.
                That is home health, and it is a different service from what we
                provide. The daily, ongoing, non-medical help that keeps someone
                in their own home is not part of it.
              </p>
              <p>
                That is not a reason to give up. It is the reason the other four
                routes above exist. If you are not sure which service you are
                looking at, our guide on{" "}
                <Link
                  href="/guides/home-health-vs-in-home-care"
                  className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                >
                  home health versus in-home care
                </Link>{" "}
                sets the two side by side.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <h2 className="text-[2.1rem]">Where to start if money is the obstacle</h2>
          <div className="mt-6 space-y-7 text-xl text-ink-soft">
            <p>
              Call us anyway. We would rather spend twenty minutes helping you
              understand your options than have you put off getting help because
              you assumed you could not afford it.
            </p>
            <p>
              If the Medicaid waiver is the right route, that process runs
              through the Mississippi Division of Medicaid and takes time, so the
              sooner someone starts it, the better. If we are not the right
              agency for your situation, we will say so.
            </p>
            <p>
              <Link
                href="/answers"
                className="font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
              >
                More questions families ask
              </Link>
            </p>
          </div>
        </section>

        <ClosingCta
          title="Ask us what it would cost for your situation."
          body="Not a range for someone else's mother. A number for the schedule yours actually needs."
        />
      </main>
      <Footer />
    </>
  );
}
