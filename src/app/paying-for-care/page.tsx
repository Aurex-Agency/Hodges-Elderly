import type { Metadata } from "next";
import Link from "next/link";
import { CallButton, ClosingCta, Footer, Header, PageHero } from "@/components/chrome";
import { PRICING_CONFIRMED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "What In-Home Care Costs in North Mississippi",
  description:
    "How families pay for in-home care in Mississippi: private pay, the Medicaid Elderly and Disabled Waiver, long-term care insurance, and VA benefits — explained plainly.",
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
  },
  {
    title: "Medicaid Elderly and Disabled Waiver",
    body: "Mississippi's E&D Waiver is a Medicaid program that can cover in-home personal care for people who would otherwise need nursing-home level care. Eligibility is decided by the Mississippi Division of Medicaid — not by any agency. There is an application process and, at times, a waiting list.",
  },
  {
    title: "Long-term care insurance",
    body: "If your parent bought a long-term care policy years ago, it may cover exactly this. Policies vary widely in what they pay and what they require, so read the benefit trigger and the elimination period before assuming anything.",
  },
  {
    title: "VA benefits",
    body: "Veterans and surviving spouses may qualify for benefits that help pay for in-home care, including Aid and Attendance. This runs through the VA and is worth asking about if there is any service history in the family.",
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

        <section className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          {PRICING_CONFIRMED ? null : (
            <div className="rounded-2xl border-2 border-plum bg-plum-wash p-8">
              <h2 className="text-2xl">Our rates</h2>
              <p className="mt-4 text-lg text-ink-soft">
                Call {site.phone} and we will give you a straight number for the
                schedule you actually need. Cost depends on how many hours a
                week and what kind of help — there is no sense quoting you a
                figure for care that is not yours.
              </p>
              <div className="mt-7">
                <CallButton />
              </div>
            </div>
          )}

          <div className="mt-14 space-y-7 text-lg leading-relaxed text-ink-soft">
            <h2 className="text-3xl text-ink">The four ways this gets paid for</h2>
            <p>
              Almost every family in Mississippi pays for in-home care through
              one of four routes, and plenty use more than one.
            </p>
          </div>

          <ol className="mt-10 space-y-8">
            {PAYMENT_ROUTES.map((route, i) => (
              <li key={route.title} className="border-t border-rule pt-7">
                <div className="flex gap-5">
                  <span className="font-display text-2xl text-plum-soft tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {route.title}
                    </h3>
                    <p className="mt-3 text-lg text-ink-soft">{route.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-rule bg-mist">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-3xl">What Medicare does not cover</h2>
            <div className="mt-6 space-y-6 text-lg text-ink-soft">
              <p>
                This catches families out constantly, so it is worth being blunt:{" "}
                <strong className="text-ink">
                  Medicare does not pay for ongoing help with bathing, meals,
                  dressing, and housekeeping.
                </strong>
              </p>
              <p>
                Medicare covers short-term skilled care — a nurse or a physical
                therapist for a limited period, usually after a hospital stay.
                That is home health, and it is a different service from what we
                provide. The daily, ongoing, non-medical help that keeps someone
                in their own home is not part of it.
              </p>
              <p>
                That is not a reason to give up. It is the reason the other four
                routes above exist.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-3xl">Where to start if money is the obstacle</h2>
          <div className="mt-6 space-y-6 text-lg text-ink-soft">
            <p>
              Call us anyway. We would rather spend twenty minutes helping you
              understand your options than have you put off getting help because
              you assumed you could not afford it.
            </p>
            <p>
              If the Medicaid waiver is the right route, that process runs
              through the Mississippi Division of Medicaid and takes time — so
              the sooner someone starts it, the better. If we are not the right
              agency for your situation, we will say so.
            </p>
            <p>
              <Link
                href="/answers"
                className="font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
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
