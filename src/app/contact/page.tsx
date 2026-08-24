import type { Metadata } from "next";
import { submitEnquiry } from "@/app/actions";
import LeadForm, { type Field } from "@/components/LeadForm";
import { CallButton, Footer, Header, PageHero } from "@/components/chrome";
import { countyNames, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Talk to ${site.founder} about in-home care in Tupelo and North Mississippi. Call ${site.phone} or send a message.`,
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

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-3xl">Calling is fastest</h2>
              <p className="mt-5 text-lg text-ink-soft">
                Most families would rather talk than type, and honestly it is
                quicker. You will reach {site.founder}, who owns the agency.
              </p>
              <div className="mt-7">
                <CallButton />
              </div>

              <dl className="mt-12 space-y-6 border-t border-rule pt-8">
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.18em] text-green">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.phoneHref}
                      className="text-xl font-semibold text-plum underline decoration-plum-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-plum"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.18em] text-green">
                    Office
                  </dt>
                  <dd className="mt-1 text-lg text-ink-soft">
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.18em] text-green">
                    Service area
                  </dt>
                  <dd className="mt-1 text-lg text-ink-soft">
                    {countyNames.join(", ")} counties.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-rule bg-mist p-8 lg:p-10">
              <h2 className="text-3xl">Or send a message</h2>
              <p className="mt-3 text-lg text-ink-soft">
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
