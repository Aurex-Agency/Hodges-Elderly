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
import { site } from "@/lib/site";

const guide = guideBySlug("va-aid-and-attendance-for-in-home-care")!;

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
      "U.S. Department of Veterans Affairs, Veterans Pension rates effective 1 December 2025",
    href: "https://www.va.gov/pension/veterans-pension-rates/",
  },
  {
    label:
      "U.S. Department of Veterans Affairs, Survivors Pension rates effective 1 December 2025",
    href: "https://www.va.gov/pension/survivors-pension-rates/",
  },
  {
    label: "U.S. Department of Veterans Affairs, Veterans Pension eligibility",
    href: "https://www.va.gov/pension/eligibility/",
  },
  {
    label: "U.S. Department of Veterans Affairs, Aid and Attendance benefits",
    href: "https://www.va.gov/pension/aid-attendance-housebound/",
  },
];

export default function Page() {
  return (
    <GuideShell guide={guide} sources={SOURCES}>
      <Lead>
        Aid and Attendance is a monthly increase to the VA pension for
        veterans and surviving spouses who need help with everyday activities.
        It is paid in cash, it is not taxed, and it can be spent on in-home
        care.
      </Lead>

      <P>
        It is also badly underclaimed. Most people who qualify have never
        heard of it, partly because it is not a benefit the VA advertises and
        partly because it sits inside a program most veterans assume is only
        for people with a service-connected disability. It is not.
      </P>

      <H2>The rates, as of now</H2>

      <P>
        These are the current maximum annual pension rates including Aid and
        Attendance, set by the VA and effective from 1 December 2025.
      </P>

      <KeyNumbers>
        <KeyNumber
          value="$29,093"
          label="Veteran, no dependents"
          note="About $2,424 a month"
        />
        <KeyNumber
          value="$34,488"
          label="Veteran with one dependent"
          note="About $2,874 a month"
        />
        <KeyNumber
          value="$18,697"
          label="Surviving spouse"
          note="About $1,558 a month"
        />
      </KeyNumbers>

      <P>
        Two married veterans who both qualify for Aid and Attendance can
        receive up to $46,143 a year between them.
      </P>

      <Callout title="An important catch in how it is calculated">
        <P>
          These are maximum rates, not checks everyone receives in full. The
          VA pays the difference between your countable income and the maximum
          rate. So a veteran with countable income of $12,000 a year would
          receive roughly the difference between that and $29,093, not the
          full $29,093 on top of it.
        </P>
        <P>
          The reason care costs matter so much here is that unreimbursed
          medical expenses, including what you pay a care agency, are
          subtracted from your income before that calculation runs. Paying for
          in-home care can be what makes someone eligible in the first place.
        </P>
      </Callout>

      <H2>Who qualifies</H2>

      <P>There are three gates, and all three have to be cleared.</P>

      <H3>1. Service</H3>

      <P>
        The veteran must have served at least 90 days of active duty with at
        least one day during a recognized wartime period, and have a discharge
        that is not dishonorable. The wartime periods include World War II,
        the Korean conflict, the Vietnam era, and the Gulf War. Combat is not
        required. Serving during that window is enough, wherever they were
        stationed.
      </P>

      <P>
        For veterans who entered service after 7 September 1980 there is an
        additional minimum service requirement, which the VA sets out on its
        eligibility page.
      </P>

      <H3>2. Care need</H3>

      <P>
        Aid and Attendance is for someone who needs another person&rsquo;s
        help with the ordinary activities of daily living. The VA looks for
        things like:
      </P>

      <UL>
        <LI>Needing help bathing, dressing, or feeding themselves</LI>
        <LI>Needing help with toileting or adjusting prosthetics</LI>
        <LI>Being bedridden beyond what treatment ordinarily requires</LI>
        <LI>Being in a nursing home because of physical or mental incapacity</LI>
        <LI>
          Eyesight limited to 5/200 or worse in both eyes, or a concentric
          visual field of 5 degrees or less
        </LI>
      </UL>

      <P>
        This is the list that in-home care speaks to directly. The evidence
        the VA wants is a physician&rsquo;s statement on the condition, which
        is what form 21-2680 is for.
      </P>

      <H3>3. Income and net worth</H3>

      <P>
        From 1 December 2025 to 30 November 2026 the net worth limit for VA
        pension eligibility is $163,699. Net worth means assets plus annual
        income, and a primary residence and a vehicle are generally excluded.
      </P>

      <P>
        The VA also reviews asset transfers made in the three years before the
        claim, so giving money away to get under the limit can create a
        penalty period rather than eligibility.
      </P>

      <H2>Surviving spouses qualify too</H2>

      <P>
        This is the part people miss most often. A surviving spouse of a
        wartime veteran can claim in their own right. They must have been
        married to the veteran at the time of death, and generally must not
        have remarried. There is no age requirement for a surviving spouse.
      </P>

      <P>
        A great many widows in this part of the state are paying privately for
        help at home while sitting on an entitlement nobody ever mentioned to
        them.
      </P>

      <H2>How to apply</H2>

      <Steps>
        <Step n={1} title="Find the discharge papers">
          <P>
            The DD-214, or equivalent separation document for older service
            periods, is the foundation of the whole claim. If it cannot be
            found, records can be requested from the National Archives, and a
            veterans service officer can help with that.
          </P>
        </Step>

        <Step n={2} title="Get a free accredited representative">
          <P>
            Do not pay anyone to file an initial claim. It is against federal
            law to charge for preparing one. County veterans service officers
            and accredited service organizations do this work at no cost, and
            they do it constantly, which is worth more than any paid service.
            Mississippi has a state Veterans Affairs Board with service
            officers across the state.
          </P>
        </Step>

        <Step n={3} title="Get the physician's statement">
          <P>
            VA form 21-2680, the examination for housebound status or
            permanent need for regular aid and attendance, is completed by a
            doctor. This is the document that establishes the care need, and a
            thin one is the most common reason a claim comes back denied.
          </P>
        </Step>

        <Step n={4} title="Document the care costs">
          <P>
            Keep the invoices. Recurring, verifiable in-home care expenses are
            what reduce countable income, and the more clearly they are
            documented, the more straightforward the calculation.
          </P>
        </Step>

        <Step n={5} title="File and wait">
          <P>
            Veterans use form 21P-527EZ, surviving spouses use 21P-534EZ, with
            21-2680 attached. Processing commonly takes several months. Once
            approved, benefits are generally backdated to the date the claim
            was received, which is a good reason to file the intent to file
            form early rather than waiting until every document is perfect.
          </P>
        </Step>
      </Steps>

      <Callout title="Two things to be careful about">
        <P>
          First, anybody charging a fee to prepare an initial claim is either
          breaking the law or selling you something else alongside it,
          frequently an annuity. Second, no care agency, including this one,
          can promise you an outcome. Eligibility is decided by the VA.
        </P>
      </Callout>

      <H2>Where we fit in this</H2>

      <P>
        {site.name} is a private in-home care agency. We are not a VA
        provider, we do not file claims, and we are not accredited to give
        advice on them. What we can do is provide the care, keep clear
        invoices for it, and point you toward the people who file these claims
        for free.
      </P>

      <P>
        If the benefit is a long way off and help is needed now, our guide on{" "}
        <A href="/guides/what-in-home-care-costs-in-mississippi">
          what in-home care costs in Mississippi
        </A>{" "}
        sets out what a small starting schedule actually runs, and{" "}
        <A href="/guides/elderly-and-disabled-waiver-north-mississippi">
          the Medicaid Elderly and Disabled Waiver
        </A>{" "}
        is worth checking in parallel.
      </P>

      <Callout title="Start with a conversation">
        <P>
          Call {site.phone} and tell us what is going on. If your father
          served, say so, and we will make sure you leave the call knowing who
          to ring about it.
        </P>
      </Callout>

      <NotAdvice>
        Aid and Attendance eligibility is determined solely by the Department
        of Veterans Affairs. Rates change every December with the annual cost
        of living adjustment. Confirm current figures at VA.gov, and get help
        with a claim from an accredited veterans service officer rather than
        from a care agency.
      </NotAdvice>
    </GuideShell>
  );
}
