import type { Metadata } from "next";
import { submitEnquiry } from "@/app/actions";
import LeadForm, { type Field } from "@/components/LeadForm";
import FigureScene from "@/components/FigureScene";
import { CallButton, Footer, Header, PageHero } from "@/components/chrome";
import { countyNames, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Talk to ${site.founder} about in-home care in Tupelo and North Mississippi. Call ${site.phone} or send a message.`,
  alternates: { canonical: "/contact" },
};

const FIELDS: Field[] = [
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    required: true,
    autoComplete: "tel",
    help: "The number to call you back on.",
  },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  {
    name: "town",
    label: "Which town",
    help: "Where does the person needing care live?",
  },
  {
    name: "message",
    label: "What is going on",
    type: "textarea",
    required: true,
    help: "A few sentences is plenty. What has changed recently, and what worries you most?",
  },
];

export default function Contact() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Contact"
          title="Start with one conversation."
          lede="No script and no pressure. Tell us what is happening at home and we will tell you honestly whether we can help."
        />

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <FigureScene name="call" accent="pink" className="mb-6 h-40 w-full max-w-sm" />
              <h2 className="text-[2.1rem]">Calling is fastest</h2>
              <p className="mt-5 text-xl text-ink-soft">
                Most families would rather talk than type, and honestly it is
                quicker. You will reach {site.founder}, who owns the agency.
              </p>
              <div className="mt-7">
                <CallButton />
              </div>

              <dl className="mt-12 space-y-6 border-t border-rule pt-8">
                <div>
                  <dt className="text-base font-bold uppercase tracking-[0.18em] text-green">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.phoneHref}
                      className="text-2xl font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-base font-bold uppercase tracking-[0.18em] text-green">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${site.email}`}
                      className="[overflow-wrap:anywhere] text-xl font-semibold text-pink underline decoration-pink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-pink"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-base font-bold uppercase tracking-[0.18em] text-green">
                    Office
                  </dt>
                  <dd className="mt-1 text-xl text-ink-soft">
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </dd>
                </div>
                <div>
                  <dt className="text-base font-bold uppercase tracking-[0.18em] text-green">
                    Service area
                  </dt>
                  <dd className="mt-1 text-xl text-ink-soft">
                    {countyNames.join(", ")} counties.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-panel border border-rule bg-mist/70 p-10 lg:p-12">
              <h2 className="text-[2.1rem]">Or send a message</h2>
              <p className="mt-3 text-xl text-ink-soft">
                We will call you back on the number you leave.
              </p>
              <div className="mt-8">
                <LeadForm
                  action={submitEnquiry}
                  fields={FIELDS}
                  submitLabel="Send message"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
