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
  UL,
} from "@/components/guide";
import { guideBySlug } from "@/lib/guides";
import { site } from "@/lib/site";

const guide = guideBySlug("what-in-home-care-costs-in-mississippi")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
  openGraph: {
    type: "article",
    title: guide.title,
    description: guide.description,
    publishedTime: guide.published,
    modifiedTime: guide.updated,
  },
};

const SOURCES = [
  {
    label:
      "A Place for Mom, Home Care Costs in 2026: A State-by-State Guide (national and Mississippi medians)",
    href: "https://www.aplaceformom.com/caregiver-resources/articles/in-home-care-costs",
  },
  {
    label:
      "Mississippi Division of Medicaid, Elderly and Disabled Waiver program page",
    href: "https://medicaid.ms.gov/programs/elderly-and-disabled-waiver/",
  },
  {
    label:
      "National Council on Aging, what Medicare's home health benefit does and does not cover",
    href: "https://www.ncoa.org/article/seven-things-you-should-know-about-medicares-home-health-care-benefit/",
  },
  {
    label: "U.S. Department of Veterans Affairs, Veterans Pension rate tables",
    href: "https://www.va.gov/pension/veterans-pension-rates/",
  },
];

export default function Page() {
  return (
    <GuideShell guide={guide} sources={SOURCES}>
      <Lead>
        Almost every family asks this question the same way. Not &ldquo;what
        is your rate,&rdquo; but &ldquo;can we afford this at all.&rdquo; So
        here is the honest picture for Mississippi, including the part most
        agencies leave out.
      </Lead>

      <P>
        In-home care is billed by the hour. That single fact explains most of
        the confusion, because the number that matters is not the hourly rate,
        it is the rate multiplied by the hours you actually need. Two families
        can be quoted exactly the same rate and end up with monthly costs that
        differ by a factor of ten.
      </P>

      <H2>The short answer</H2>

      <KeyNumbers>
        <KeyNumber
          value="$22 to $28"
          label="Typical agency rate per hour"
          note="Non-medical care, Mississippi, 2026"
        />
        <KeyNumber
          value="$24"
          label="Mississippi median per hour"
          note="Lowest of any state"
        />
        <KeyNumber
          value="$35"
          label="National median per hour"
          note="What the same care costs elsewhere"
        />
      </KeyNumbers>

      <P>
        Mississippi has the lowest non-medical caregiver rate in the country.
        The national median sits around $35 an hour, and Mississippi comes in
        near $24, with most agency rates in the state falling somewhere
        between $22 and $28 depending on the type of care, the time of day,
        and how far the caregiver has to drive.
      </P>

      <P>
        Rates in this region also tend to run at the lower end rather than the
        higher one. The costlier markets in the state are along the Gulf
        Coast, not in the north.
      </P>

      <Callout title="What this means in practice">
        <P>
          At roughly $24 an hour, four hours a day, five days a week works out
          near $2,000 a month. Around the clock care, at 44 hours a week or
          more, runs past $50,000 a year. The gap between those two numbers is
          why the first conversation is about hours, not about price.
        </P>
      </Callout>

      <H2>Nobody starts with round the clock care</H2>

      <P>
        Families almost always overestimate what they need to begin with,
        because they are picturing the worst version of the situation rather
        than the current one. In reality most people start small and add hours
        later as things change.
      </P>

      <P>Common starting points look like this:</P>

      <UL>
        <LI>
          <strong className="font-bold text-ink">Two or three mornings a
          week.</strong>{" "}
          Enough to cover bathing, dressing, and breakfast, which are the
          three tasks that most often become unsafe first.
        </LI>
        <LI>
          <strong className="font-bold text-ink">A few afternoons.</strong>{" "}
          Company, a cooked meal, laundry, and a set of eyes on how someone is
          really doing when the family is at work.
        </LI>
        <LI>
          <strong className="font-bold text-ink">One long day a
          week.</strong>{" "}
          Usually bought by a family member who is doing everything else and
          needs one predictable day back.
        </LI>
        <LI>
          <strong className="font-bold text-ink">Overnights only.</strong>{" "}
          For someone who is fine during the day but unsafe getting up at
          night, which is when most falls happen.
        </LI>
      </UL>

      <P>
        A schedule like any of those is a few hundred dollars a month rather
        than a few thousand. That is worth knowing before you decide the
        answer is a facility.
      </P>

      <H2>The four ways families actually pay</H2>

      <H3>1. Private pay</H3>

      <P>
        Most families in North Mississippi pay privately, at least at first.
        That usually means the person&rsquo;s own retirement income and
        savings, often topped up by adult children splitting the difference.
        It is the simplest arrangement and the one with the fewest rules
        attached, and it is why the hourly rate matters so much.
      </P>

      <H3>2. The Medicaid Elderly and Disabled Waiver</H3>

      <P>
        Mississippi Medicaid runs a program called the Elderly and Disabled
        Waiver, which pays for personal care at home for people who would
        otherwise need a nursing facility. It has real income and asset limits
        and a medical assessment, so it is not available to everyone, but for
        families who qualify it changes the maths entirely.
      </P>

      <P>
        We have written a separate guide on{" "}
        <A href="/guides/elderly-and-disabled-waiver-north-mississippi">
          how to apply for the waiver in these seven counties
        </A>
        , including who to call locally.
      </P>

      <H3>3. Long-term care insurance</H3>

      <P>
        If a parent bought a long-term care policy years ago, dig it out
        before you assume anything. Many policies cover in-home care, not just
        facility care, and a surprising number of families never claim on them
        because nobody realised the coverage existed. Look for an elimination
        period, which is the number of days you have to pay out of pocket
        before the policy starts, and a daily or monthly benefit cap.
      </P>

      <H3>4. VA benefits</H3>

      <P>
        Wartime veterans and their surviving spouses may qualify for a pension
        supplement called Aid and Attendance, which is paid monthly and can be
        spent on in-home care. It is one of the most underclaimed benefits in
        the country. Our guide on{" "}
        <A href="/guides/va-aid-and-attendance-for-in-home-care">
          VA Aid and Attendance
        </A>{" "}
        covers who qualifies and where to get free help filing.
      </P>

      <H2>What Medicare will not pay for</H2>

      <P>
        This is the single most expensive misunderstanding in the category, so
        it is worth being blunt about it. Medicare does not pay for ongoing
        help with bathing, dressing, meals, or housekeeping. It pays for
        short-term skilled care ordered by a doctor after an illness or a
        hospital stay, delivered by a licensed home health agency, and
        recertified every 60 days.
      </P>

      <P>
        Those are two different services with two different rulebooks, and
        families routinely arrange one while expecting the other to be
        covered. If you are not sure which one you are looking at, read{" "}
        <A href="/guides/home-health-vs-in-home-care">
          home health or in-home care: which one do you actually need
        </A>
        .
      </P>

      <H2>Questions worth asking any agency about price</H2>

      <UL>
        <LI>What is the hourly rate, and is there a minimum number of hours
        per visit?</LI>
        <LI>Does the rate change for nights, weekends, or holidays?</LI>
        <LI>Is there a separate charge for mileage on errands and
        appointments?</LI>
        <LI>Is there a deposit, a start-up fee, or an assessment fee?</LI>
        <LI>What happens to the bill if we cancel a visit, and how much
        notice do you need?</LI>
        <LI>Is there a contract with a minimum term, and how do we end
        it?</LI>
      </UL>

      <P>
        An agency that cannot answer those six questions clearly on the phone
        is telling you something useful about how the rest of it will go.
      </P>

      <Callout title="What we charge">
        <P>
          Call {site.phone} and ask. {site.firstName} will give you a straight
          number for the schedule you actually need, rather than a starting
          rate that only applies to a schedule nobody uses. There is no
          assessment fee for the first conversation and no obligation at the
          end of it.
        </P>
      </Callout>

      <NotAdvice>
        The figures above are market averages for the state of Mississippi
        drawn from published cost research, not quotes, and not a statement of
        our rates. Benefit eligibility is decided by Medicaid and the VA, not
        by a care agency.
      </NotAdvice>
    </GuideShell>
  );
}
