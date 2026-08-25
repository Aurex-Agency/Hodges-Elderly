import type { Metadata } from "next";
import {
  A,
  Callout,
  GuideShell,
  H2,
  H3,
  LI,
  Lead,
  NotAdvice,
  P,
  UL,
} from "@/components/guide";
import { guideBySlug } from "@/lib/guides";
import { site } from "@/lib/site";

const guide = guideBySlug("home-health-vs-in-home-care")!;

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
      "National Council on Aging, seven things to know about Medicare's home health benefit",
    href: "https://www.ncoa.org/article/seven-things-you-should-know-about-medicares-home-health-care-benefit/",
  },
  {
    label: "Medicare Rights Center, understanding Medicare home health care",
    href: "https://www.medicarerights.org/medicare-answers/2026/01/28/understanding-medicare-home-health-care",
  },
  {
    label:
      "Medicare Interactive, eligibility for the home health benefit under Part A and Part B",
    href: "https://www.medicareinteractive.org/understanding-medicare/medicare-covered-services/home-health-services/eligibility-for-home-health-part-a-or-part-b",
  },
  {
    label:
      "Mississippi State Department of Health, health facilities licensure and regulation",
    href: "https://msdh.ms.gov/msdhsite/_static/30,0,83.html",
  },
];

export default function Page() {
  return (
    <GuideShell guide={guide} sources={SOURCES}>
      <Lead>
        Home health care and in-home care are two different services. They
        sound like the same thing, they are often delivered in the same house
        in the same week, and confusing them is how families end up with a
        bill they were certain somebody else was paying.
      </Lead>

      <P>
        The distinction is not about where the care happens. Both happen at
        home. It is about whether the care is medical.
      </P>

      <H2>Home health care is medical, and temporary</H2>

      <P>
        Home health is skilled medical care delivered at home by licensed
        clinicians. A nurse, a physical therapist, an occupational therapist,
        a speech therapist. It has to be ordered by a doctor, it is tied to a
        specific medical problem, and it is meant to end.
      </P>

      <P>Typical home health looks like:</P>

      <UL>
        <LI>Wound care and dressing changes after surgery</LI>
        <LI>Physical therapy after a hip replacement or a stroke</LI>
        <LI>Teaching a family how to manage a new diagnosis or a new device</LI>
        <LI>Injections, IV therapy, and monitoring of a specific condition</LI>
      </UL>

      <P>
        In Mississippi, agencies providing skilled medical services at home
        have to be licensed by the State Department of Health. If somebody is
        offering nursing care in your parent&rsquo;s house, that license is a
        fair thing to ask about.
      </P>

      <H2>In-home care is not medical, and it is ongoing</H2>

      <P>
        In-home care, also called personal care, home care, or non-medical
        care, is help with daily living. Bathing, dressing, meals,
        housekeeping, errands, company, and being there so somebody is not
        alone. It does not require a doctor&rsquo;s order, it is not tied to a
        diagnosis, and it can carry on for years.
      </P>

      <P>
        This is what {site.name} does. It is also what most families are
        actually looking for when they start searching, even when they use the
        phrase &ldquo;home health&rdquo; to describe it.
      </P>

      <H2>The part that costs people money</H2>

      <Callout title="Medicare does not pay for ongoing help at home">
        <P>
          Medicare covers home health, under conditions. It does not cover
          long-term help with bathing, dressing, meals, or housekeeping when
          that help is the only thing needed. Homemaker services and personal
          care on their own are explicitly outside the benefit.
        </P>
      </Callout>

      <P>
        Medicare&rsquo;s home health benefit has real gates on it. A doctor
        has to certify that the person needs skilled care. In most cases the
        person has to be considered homebound, meaning leaving home takes
        considerable effort. The care has to be intermittent rather than
        continuous. And the doctor has to recertify the whole plan every 60
        days for it to carry on.
      </P>

      <P>
        A home health aide can help with bathing and dressing under that
        benefit, but only alongside a skilled service. When the skilled need
        ends, so does the aide. That moment, when physical therapy finishes
        and the visits simply stop, is when a great many families discover
        that the daily help they had grown used to was never a long-term
        arrangement.
      </P>

      <H2>How to tell which one you need</H2>

      <H3>You probably need home health if</H3>

      <UL>
        <LI>A doctor has just ordered therapy or nursing at home</LI>
        <LI>There is a wound, a catheter, an injection, or a new device</LI>
        <LI>Somebody is recovering from surgery, a stroke, or a hospital stay</LI>
        <LI>The goal is to get back to where they were before</LI>
      </UL>

      <H3>You probably need in-home care if</H3>

      <UL>
        <LI>The problem is bathing, dressing, meals, laundry, or the house</LI>
        <LI>They are alone too much and it is starting to show</LI>
        <LI>They have stopped driving and are missing appointments</LI>
        <LI>You are the one doing all of it and you are running out of room</LI>
        <LI>Nothing has changed medically, it is just gradually gotten harder</LI>
      </UL>

      <H2>Very often the answer is both</H2>

      <P>
        These two services run alongside each other constantly, and they are
        not in competition. A typical run of events looks like this. Your
        father falls and breaks a hip. He has surgery. He comes home with
        Medicare-covered home health for physical therapy three times a week.
        Meanwhile somebody still has to get him into the shower on the other
        four days, cook, do the washing, and drive him to the follow-up
        appointment. That second list is in-home care, and it is on the family
        unless the family arranges otherwise.
      </P>

      <P>
        When the therapy ends after six or eight weeks, the home health stops
        and the second list does not.
      </P>

      <H2>So who does pay for in-home care?</H2>

      <P>
        Mostly families, out of pocket, at rates that in Mississippi are the
        lowest in the country. Beyond that there are three routes worth
        checking: the{" "}
        <A href="/guides/elderly-and-disabled-waiver-north-mississippi">
          Medicaid Elderly and Disabled Waiver
        </A>
        , a long-term care insurance policy if one was ever bought, and{" "}
        <A href="/guides/va-aid-and-attendance-for-in-home-care">
          VA Aid and Attendance
        </A>{" "}
        for wartime veterans and their surviving spouses.
      </P>

      <P>
        Our guide on{" "}
        <A href="/guides/what-in-home-care-costs-in-mississippi">
          what in-home care costs in Mississippi
        </A>{" "}
        goes through all four in more detail, with the actual numbers.
      </P>

      <Callout title="If you are not sure which one you are looking at">
        <P>
          Call {site.phone} and describe what is happening. If what you
          actually need is skilled nursing or therapy, we will tell you that,
          and we will tell you to start with the doctor. We would rather send
          you to the right place than sign you up for the wrong service.
        </P>
      </Callout>

      <NotAdvice>
        Medicare coverage decisions are made by Medicare, and the rules
        summarized here are general. For a specific situation, check with the
        person&rsquo;s doctor and with Medicare directly.
      </NotAdvice>
    </GuideShell>
  );
}
