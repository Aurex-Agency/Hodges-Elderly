import type { Metadata } from "next";
import {
  A,
  Callout,
  GuideShell,
  H2,
  H3,
  KeyNumber,
  KeyNumbers,
  LI,
  Lead,
  NotAdvice,
  P,
  Step,
  Steps,
  UL,
} from "@/components/guide";
import { guideBySlug } from "@/lib/guides";
import { guideMetadata } from "@/lib/guide-meta";
import { countyNames, site } from "@/lib/site";

const guide = guideBySlug("elderly-and-disabled-waiver-north-mississippi")!;

export const metadata: Metadata = guideMetadata(guide);

const SOURCES = [
  {
    label:
      "Mississippi Division of Medicaid, Elderly and Disabled Waiver program page",
    href: "https://medicaid.ms.gov/programs/elderly-and-disabled-waiver/",
  },
  {
    label:
      "Three Rivers Planning and Development District, Medicaid Waiver case management",
    href: "https://trpdd.com/medicaid-waiver/",
  },
  {
    label: "Mississippi Access to Care Network, programs and services",
    href: "https://www.mississippiaccesstocare.org/HelpInfo/ProgramsServices",
  },
  {
    label:
      "Medicaid Planning Assistance, Mississippi 2026 income and asset limits for long-term care Medicaid",
    href: "https://www.medicaidplanningassistance.org/medicaid-eligibility-mississippi/",
  },
];

export default function Page() {
  return (
    <GuideShell guide={guide} sources={SOURCES}>
      <Lead>
        The Elderly and Disabled Waiver is the reason a lot of people in this
        part of the state are still living at home rather than in a nursing
        facility. It is also one of the least explained programs in
        Mississippi, largely because the explaining is spread across three
        different organizations.
      </Lead>

      <P>
        Here is the whole thing in one place, including the local office that
        handles it for {countyNames.slice(0, -1).join(", ")}, and{" "}
        {countyNames.at(-1)} counties.
      </P>

      <H2>What the waiver actually is</H2>

      <P>
        Medicaid will pay for a nursing home for someone who needs that level
        of care. A waiver is Medicaid agreeing to spend some of that same
        money on care at home instead, because staying home is usually both
        cheaper and better. That is the whole idea in one sentence.
      </P>

      <P>
        The Elderly and Disabled Waiver, usually shortened to the E and D
        Waiver, is the statewide version of that for older adults and for
        adults with physical disabilities. Services covered under it include:
      </P>

      <UL>
        <LI>
          Personal care services, meaning hands-on help with bathing,
          dressing, eating, meal preparation, and housekeeping
        </LI>
        <LI>Case management by a registered nurse and a licensed social worker</LI>
        <LI>Adult day services</LI>
        <LI>Home delivered meals</LI>
        <LI>Expanded home health services</LI>
        <LI>In-home respite and institutional respite for family caregivers</LI>
        <LI>Transition assistance for someone moving back home from a facility</LI>
      </UL>

      <H2>Who qualifies</H2>

      <P>
        There are three separate gates, and an applicant has to clear all
        three. Failing any one of them stops the application, which is why so
        many families give up partway through without understanding what went
        wrong.
      </P>

      <H3>The medical gate</H3>

      <P>
        The applicant has to need the same level of care a nursing facility
        provides. In practice that is measured by an assessment score, and
        Mississippi currently requires a score of 50 or higher on the Medicaid
        Long Term Services and Supports assessment. This is the gate that
        surprises people. Needing a lot of help is not automatically the same
        as meeting nursing facility level of care.
      </P>

      <H3>The age gate</H3>

      <P>
        The applicant must be at least 21. The waiver covers older adults and
        adults with physical disabilities alike. Children and young adults
        under 21, and adults with intellectual and developmental disabilities,
        are served by different waivers.
      </P>

      <H3>The financial gate</H3>

      <KeyNumbers>
        <KeyNumber
          value="$2,982"
          label="Monthly income limit"
          note="Single applicant, 2026"
        />
        <KeyNumber
          value="$4,000"
          label="Countable asset limit"
          note="Single applicant, 2026"
        />
        <KeyNumber value="21+" label="Minimum age" note="For this waiver" />
      </KeyNumbers>

      <P>
        For 2026 the individual income limit for long-term care Medicaid in
        Mississippi is $2,982 a month, and the countable asset limit for a
        single applicant is $4,000. For a married couple where both people are
        applying, those figures roughly double, to $5,964 and $6,000.
      </P>

      <P>
        The word doing the work there is countable. A primary home, one
        vehicle, and personal belongings are generally not counted, and the
        rules for a married couple where only one spouse applies are different
        again and considerably more generous. Do not rule your family out
        based on a bank balance alone.
      </P>

      <Callout title="If you are slightly over the limit">
        <P>
          Being over the income or asset limit is not always the end of it.
          There are legal planning routes, and a Medicaid case worker or an
          elder law attorney can tell you whether any of them apply. What you
          should not do is start moving money around on your own. Medicaid
          reviews transfers going back five years, and a well-meant gift to a
          grandchild can create a penalty period that costs far more than it
          saved.
        </P>
      </Callout>

      <H2>Who runs it in our counties</H2>

      <P>
        This is the part that is genuinely hard to find. Mississippi Medicaid
        sets the rules, but the day-to-day case management is handled by
        regional Planning and Development Districts. For this corner of the
        state that is{" "}
        <A href="https://trpdd.com/medicaid-waiver/">
          Three Rivers Planning and Development District
        </A>
        , whose waiver program covers Calhoun, Chickasaw, Itawamba, Lafayette,
        Lee, Monroe, Pontotoc, and Union counties.
      </P>

      <P>
        Every one of the seven counties we serve sits inside that list. If you
        live in {countyNames.slice(0, -1).join(", ")}, or {countyNames.at(-1)}{" "}
        county, Three Rivers is your case management office.
      </P>

      <Callout title="Two numbers worth writing down">
        <P>
          Three Rivers Planning and Development District, waiver program:{" "}
          <strong className="font-bold text-ink">662-489-2415</strong>, or
          toll free{" "}
          <strong className="font-bold text-ink">1-877-489-6911</strong>.
        </P>
        <P>
          Mississippi Access to Care, the statewide help line for long-term
          care questions and waiver screening:{" "}
          <strong className="font-bold text-ink">1-844-822-4622</strong>.
        </P>
      </Callout>

      <H2>How to actually start</H2>

      <Steps>
        <Step n={1} title="Call Mississippi Access to Care or Three Rivers">
          <P>
            Either number above will get you to someone who can screen the
            situation and tell you whether the waiver is the right program to
            pursue. Mississippi Access to Care exists specifically to give
            unbiased information about long-term care options, and it is free.
            Have the person&rsquo;s date of birth, Medicaid or Medicare
            numbers if they have them, and a rough picture of their income to
            hand.
          </P>
        </Step>

        <Step n={2} title="Get the Medicaid eligibility side moving">
          <P>
            The applicant has to be eligible for Medicaid, either through
            Supplemental Security Income or by meeting the long-term care
            income and asset limits. This runs through the Division of
            Medicaid, and it is the part that takes the longest, so start it
            early rather than waiting for the assessment.
          </P>
        </Step>

        <Step n={3} title="Complete the level of care assessment">
          <P>
            A nurse assesses the applicant and scores their need. This
            determines whether they meet nursing facility level of care. Be
            accurate rather than optimistic. Families often describe a good
            day, and the assessment is supposed to capture the ordinary one.
            If your mother can walk to the mailbox on a good morning but needs
            help to reach the bathroom most nights, say both things.
          </P>
        </Step>

        <Step n={4} title="Get assigned a case management team">
          <P>
            Everyone on the waiver is assigned a local team consisting of a
            registered nurse and a licensed social worker. They build the plan
            of care, decide the mix and amount of services, and coordinate the
            providers who deliver them.
          </P>
        </Step>

        <Step n={5} title="Choose your providers">
          <P>
            Once a plan of care exists, services are delivered by
            Medicaid-approved providers. You are not simply assigned to
            whoever is nearest, and it is reasonable to ask your case manager
            what your options are.
          </P>
        </Step>
      </Steps>

      <H2>How long it takes, and what to do meanwhile</H2>

      <P>
        Nobody should tell you a precise timeline, because it depends on how
        quickly the Medicaid eligibility side clears and whether a slot is
        available. Plan for weeks rather than days, and for months rather than
        weeks if the financial eligibility is complicated.
      </P>

      <P>
        That gap is the real problem for most families, because the reason
        they started the application is that something is already unsafe. A
        few hours a week of private-pay care during the wait is a common
        bridge, and it is usually a much smaller number than people expect.
        Our guide on{" "}
        <A href="/guides/what-in-home-care-costs-in-mississippi">
          what in-home care costs in Mississippi
        </A>{" "}
        has the real ranges.
      </P>

      <H2>A common mix-up worth clearing up</H2>

      <P>
        The E and D Waiver is not the only waiver Mississippi runs. There is a
        separate Independent Living waiver, a Traumatic Brain Injury and
        Spinal Cord Injury waiver, an Assisted Living waiver, and an
        Intellectual Disabilities and Developmental Disabilities waiver. If
        the person you are caring for has an intellectual or developmental
        disability, the ID and DD waiver is very likely the one you want, not
        this one. Mississippi Access to Care can point you at the right one in
        a single phone call.
      </P>

      <Callout title="Where we fit">
        <P>
          {site.name} provides non-medical in-home care in these counties.
          Whether the waiver ends up paying, or the family does, or some
          combination, the practical question is the same one: who is going to
          be in the house, and when. Call {site.phone} and we will talk
          through what the days actually look like.
        </P>
      </Callout>

      <NotAdvice>
        Eligibility for the Elderly and Disabled Waiver is determined by the
        Mississippi Division of Medicaid, not by a care agency. Income and
        asset limits change annually. Confirm current figures with Medicaid or
        with Three Rivers before making any decision based on them.
      </NotAdvice>
    </GuideShell>
  );
}
