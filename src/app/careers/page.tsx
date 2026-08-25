import type { Metadata } from "next";
import { submitApplication } from "@/app/actions";
import LeadForm, { type Field } from "@/components/LeadForm";
import { Footer, Header, PageHero } from "@/components/chrome";
import { countyNames, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Caregiver Jobs in North Mississippi",
  description: `Apply to work as a caregiver with ${site.shortName} in Tupelo, New Albany, Pontotoc, and across seven North Mississippi counties.`,
  alternates: { canonical: "/careers" },
};

const FIELDS: Field[] = [
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  {
    name: "town",
    label: "Town you live in",
    required: true,
    help: "So we can match you with families nearby.",
  },
  {
    name: "experience",
    label: "Your experience",
    type: "textarea",
    help: "Paid work, family caregiving, CNA or other certification. All of it counts, and if you are new to this, say so.",
  },
  {
    name: "availability",
    label: "When you can work",
    type: "textarea",
    help: "Days, evenings, weekends, overnights, whatever suits you.",
  },
];

export default function Careers() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Work with us"
          title="Caregiving work across North Mississippi."
          lede={`${site.founder} hires every caregiver here personally. If you are good at this work, she wants to meet you.`}
        />

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 text-xl leading-relaxed text-ink-soft">
              <h2 className="text-[2.1rem] text-ink">What the work is</h2>
              <p>
                Going into someone&rsquo;s home and helping them stay in it.
                Bathing and dressing, meals, laundry, rides to the doctor,
                company through a long afternoon. Some clients need a few hours
                a week; some need daily help.
              </p>
              <h2 className="pt-2 text-[2.1rem] text-ink">Who does well here</h2>
              <p>
                People who show up when they said they would. Most of what makes
                a caregiver good is not clinical. It is reliability, patience,
                and treating someone&rsquo;s home like their home.
              </p>
              <p>
                Experience with elderly clients, or with intellectual and
                developmental disabilities, is valuable. So is having cared for
                your own family. Tell us either way.
              </p>
              <h2 className="pt-2 text-[2.1rem] text-ink">Where we need people</h2>
              <p>
                Across all seven counties we serve:{" "}
                {countyNames.join(", ")}. Living close to the families you
                serve makes everything easier, so tell us where you are.
              </p>
            </div>

            <div className="rounded-panel border border-rule bg-mist/70 p-10 lg:p-12">
              <h2 className="text-[2.1rem]">Apply</h2>
              <p className="mt-3 text-xl text-ink-soft">
                No long application. Tell us how to reach you and we will call.
              </p>
              <div className="mt-8">
                <LeadForm
                  action={submitApplication}
                  fields={FIELDS}
                  submitLabel="Send application"
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
