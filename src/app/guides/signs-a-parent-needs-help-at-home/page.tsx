import type { Metadata } from "next";
import {
  A,
  Callout,
  GuideShell,
  H2,
  LI,
  Lead,
  NotAdvice,
  P,
  UL,
} from "@/components/guide";
import { guideBySlug } from "@/lib/guides";
import { site } from "@/lib/site";

const guide = guideBySlug("signs-a-parent-needs-help-at-home")!;

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
      "National Institute on Aging, on noticing changes and talking with an older parent about care",
    href: "https://www.nia.nih.gov/health/caregiving/how-talk-your-older-parent-about-their-care",
  },
  {
    label:
      "CDC, older adult falls data and prevention (falls are the leading cause of injury in this age group)",
    href: "https://www.cdc.gov/falls/data-research/index.html",
  },
  {
    label:
      "National Institute on Aging, social isolation and loneliness in older adults",
    href: "https://www.nia.nih.gov/health/loneliness-and-social-isolation/loneliness-and-social-isolation-tips-staying-connected",
  },
];

export default function Page() {
  return (
    <GuideShell guide={guide} sources={SOURCES}>
      <Lead>
        Almost nobody calls us because of one dramatic event. They call
        because of an accumulation of small things they have been noticing for
        about eight months and telling themselves were nothing.
      </Lead>

      <P>
        Decline is quiet. It is also actively hidden, because your mother
        knows exactly what conversation follows from admitting she cannot get
        out of the bath on her own, and she would rather not have it. So the
        signs show up in the house before they show up in anything she says.
      </P>

      <P>
        Here is what to look at, roughly in the order that things tend to
        slip.
      </P>

      <H2>Look at the mail</H2>

      <P>
        This is the one people skip, and it is often the earliest reliable
        signal. Unopened mail piling up, especially bills. Final notices.
        Checks written and never sent. A utility that has been shut off and
        restored. Duplicate payments. Money going out to charities or sweep
        stakes that were not part of the picture two years ago.
      </P>

      <P>
        Handling paperwork takes attention, sequencing, and follow-through,
        and it is one of the first things to go. It also happens to be the
        area where the damage compounds fastest.
      </P>

      <H2>Look at the kitchen</H2>

      <UL>
        <LI>Expired food in the fridge, sometimes a lot of it</LI>
        <LI>The same three easy items, and nothing that requires cooking</LI>
        <LI>Scorched pans, or a burner ring that has been scrubbed hard</LI>
        <LI>Very little food at all, which usually means shopping has become
        the hard part rather than eating</LI>
        <LI>Clothes that have gotten loose since you last visited</LI>
      </UL>

      <P>
        Weight loss is one of the clearest signs that something in the chain
        has broken, and the break can be anywhere in it. Driving to the store,
        carrying the bags, standing at the stove, or simply remembering to
        eat.
      </P>

      <H2>Look at how they move</H2>

      <P>
        Watch them stand up from a chair without helping. Watch them cross a
        room. You are looking for a hand reaching for the wall or the back of
        the sofa, a shuffle where there used to be a stride, a pause at the
        top of the steps, or a wide slow turn instead of a normal one.
      </P>

      <P>
        Then look for evidence of falls they have not mentioned. A bruise on
        the forearm. A cracked door frame. Furniture moved into a line
        against a wall, which is often somebody quietly building themselves a
        handrail out of the room.
      </P>

      <Callout title="Ask this question directly">
        <P>
          &ldquo;Have you fallen since I was last here?&rdquo; Then wait
          through the silence rather than filling it. Falls get concealed more
          than any other event, because a fall is the thing that people
          believe leads directly to a nursing home. One fall roughly doubles
          the odds of another.
        </P>
      </Callout>

      <H2>Look at the bathroom</H2>

      <P>
        Personal care is intimate, so it is the last thing anyone will
        volunteer. The house tells you instead. Hair that has not been washed.
        The same clothes across several days. A new smell in the laundry, or a
        pile of it that has not moved. A bath mat that is bone dry. A towel
        that has not been used.
      </P>

      <P>
        If bathing has become frightening, and for someone unsteady it is
        genuinely frightening, it stops happening long before anyone says so.
      </P>

      <H2>Look at the medication</H2>

      <UL>
        <LI>Bottles that are too full given the date they were filled</LI>
        <LI>Bottles that are empty far too early</LI>
        <LI>Expired prescriptions still in the rotation</LI>
        <LI>A pill organizer that is loaded wrong, or not loaded at all</LI>
        <LI>Multiple bottles of the same drug from different pharmacies</LI>
      </UL>

      <H2>Look at what has quietly stopped</H2>

      <P>
        This one is easy to miss over the phone, because the answer to
        &ldquo;how are you&rdquo; is always fine. Ask instead what they did
        this week, and listen for the things that are no longer in the answer.
        Church. The Wednesday group. A standing lunch. Cards. Calling their
        sister.
      </P>

      <P>
        Withdrawal is sometimes about mobility, sometimes about hearing,
        sometimes about no longer driving after dark, and sometimes it is
        depression. All four are worth acting on, and none of them get better
        by themselves. Isolation is not a soft problem. It has measurable
        effects on health.
      </P>

      <H2>Look at the car</H2>

      <P>
        Walk around it. New dents and scrapes, especially on the same corner.
        Mirror glass missing. Curbside wheel damage. Then ask where they still
        drive to, and notice whether the list has quietly shrunk to daylight
        hours and two familiar routes. People usually restrict their own
        driving before anybody takes the keys, and that self-restriction is
        the signal.
      </P>

      <H2>The one nobody puts on these lists</H2>

      <Lead>Look at the person doing the caring.</Lead>

      <P>
        If a spouse, a sibling, or you have become the one managing all of
        this, the question is not only whether your mother needs help. It is
        whether the arrangement holding this together is sustainable, and how
        you would know before it broke.
      </P>

      <P>
        Family caregivers burn out quietly too, and when they do, the person
        being cared for very often ends up in a facility, which is exactly the
        outcome everyone was trying to avoid.{" "}
        <A href="/services/respite-for-family">Respite care</A> exists for
        precisely this, and it is far cheaper than the alternative it prevents.
      </P>

      <H2>How to raise it without starting a fight</H2>

      <UL>
        <LI>
          Lead with what you saw, not with what it means. &ldquo;I noticed the
          mail has piled up&rdquo; goes somewhere. &ldquo;You cannot manage
          any more&rdquo; goes nowhere.
        </LI>
        <LI>
          Ask what they find hardest rather than telling them. People will
          often name it themselves if the question is open.
        </LI>
        <LI>
          Offer help with a task, not with their independence. Nobody accepts
          help with being old. Plenty of people accept help with the
          housework.
        </LI>
        <LI>
          Start small and temporary. A few hours a week, tried for a month, is
          a far easier yes than a permanent arrangement.
        </LI>
        <LI>
          Let them be involved in choosing. Being handed a caregiver and being
          part of picking one are different experiences.
        </LI>
        <LI>
          Talk to their doctor. Some of what looks like decline is a
          medication interaction, a thyroid problem, poor hearing, or
          depression, and those are treatable.
        </LI>
      </UL>

      <Callout title="If you recognized more than two or three of these">
        <P>
          It is worth a conversation, not a crisis. Call {site.phone} and
          describe what you have been noticing. {site.firstName} will ask what
          a normal day looks like and what has changed lately, and she will
          tell you honestly whether she thinks you need help yet. Sometimes
          the answer is not yet, and that is a perfectly good answer.
        </P>
      </Callout>

      <NotAdvice>
        This is a list of things worth noticing, not a diagnostic tool. Sudden
        confusion, a fall with any injury, chest pain, or a rapid change in
        behavior are medical matters and should go to a doctor rather than to
        a care agency.
      </NotAdvice>
    </GuideShell>
  );
}
