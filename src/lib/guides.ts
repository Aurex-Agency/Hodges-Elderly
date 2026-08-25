/* Index for the guides section.
 *
 * Named "guides" rather than "blog" on purpose. The reader is usually an
 * adult child at eleven at night trying to work out what to do about a
 * parent. "Guides" tells them the page will answer something; "blog"
 * tells them it will be about us.
 *
 * Every guide here answers a question people in these seven counties
 * genuinely type into Google, and every factual claim in one is sourced
 * to a primary source (Medicaid, VA, MSDH, Three Rivers PDD) rather than
 * to another agency's marketing page.
 *
 * Dates are literal strings, not new Date(), so a rebuild never quietly
 * republishes everything with today's date.
 *
 * This module deliberately has NO value imports. scripts/social-assets.mjs
 * loads it directly under plain node to generate a share card per guide,
 * and node resolves extensionless specifiers differently from the bundler,
 * so a single `import { site } from "./site"` here breaks that script. The
 * metadata builder that does need `site` lives in guide-meta.ts.
 */

export type Guide = {
  slug: string;
  /** The H1. Written for a person, not for a keyword. */
  title: string;
  /** The <title>. Written for the search result, and kept under ~60 chars
   *  before the site-name suffix so it does not get truncated. */
  metaTitle: string;
  description: string;
  /** Standfirst under the H1. */
  dek: string;
  category: string;
  published: string;
  updated: string;
  readMinutes: number;
  /** The primary question this guide exists to answer, verbatim, as a
   *  person would ask it. Used for the FAQ-style summary block. */
  question: string;
  /** Accent token, so each guide carries a colour like services do. */
  accent: "pink" | "green" | "spruce" | "clay" | "ochre" | "wine";
  /** Internal links that belong at the foot of this guide. */
  related: { label: string; href: string }[];
};

export const guides: Guide[] = [
  {
    slug: "what-in-home-care-costs-in-mississippi",
    title: "What in-home care actually costs in Mississippi",
    metaTitle: "What In-Home Care Costs in Mississippi",
    description:
      "Real hourly ranges for non-medical in-home care in Mississippi, how many hours families usually start with, and the four ways people pay for it.",
    dek: "Mississippi has the lowest in-home care rates in the country. That is genuinely good news, and it still adds up faster than most families expect.",
    category: "Paying for care",
    published: "2026-08-25",
    updated: "2026-08-25",
    readMinutes: 7,
    question: "How much does in-home care cost per hour in Mississippi?",
    accent: "pink",
    related: [
      { label: "How families pay for care", href: "/paying-for-care" },
      { label: "What we do in the home", href: "/services" },
      { label: "Answers for families", href: "/answers" },
    ],
  },
  {
    slug: "elderly-and-disabled-waiver-north-mississippi",
    title:
      "How to apply for the Elderly and Disabled Waiver in North Mississippi",
    metaTitle: "Applying for the E&D Waiver in North Mississippi",
    description:
      "Mississippi's waiver pays for in-home care instead of a nursing home. Who qualifies, who runs it in our seven counties, and how to start.",
    dek: "If your parent would otherwise need a nursing home, Mississippi Medicaid may pay for care at home instead. Almost nobody explains how to actually start that process locally, so here it is.",
    category: "Paying for care",
    published: "2026-08-25",
    updated: "2026-08-25",
    readMinutes: 8,
    question:
      "How do I apply for the Mississippi Elderly and Disabled Waiver near Tupelo?",
    accent: "green",
    related: [
      { label: "How families pay for care", href: "/paying-for-care" },
      { label: "Personal care at home", href: "/services/personal-care" },
      { label: "The seven counties we serve", href: "/service-area" },
    ],
  },
  {
    slug: "home-health-vs-in-home-care",
    title: "Home health or in-home care: which one do you actually need?",
    metaTitle: "Home Health vs In-Home Care: What Medicare Pays",
    description:
      "They sound identical and are not. One is skilled care Medicare may pay for. The other is daily help at home that it will not.",
    dek: "Two different services, two different rulebooks, and one very expensive misunderstanding. Most families find out which is which after they have already been billed.",
    category: "Getting started",
    published: "2026-08-25",
    updated: "2026-08-25",
    readMinutes: 6,
    question:
      "What is the difference between home health care and in-home care, and does Medicare pay?",
    accent: "spruce",
    related: [
      { label: "What we do in the home", href: "/services" },
      { label: "Answers for families", href: "/answers" },
      { label: "How families pay for care", href: "/paying-for-care" },
    ],
  },
  {
    slug: "signs-a-parent-needs-help-at-home",
    title: "The signs a parent needs help at home, and the ones people miss",
    metaTitle: "Signs an Aging Parent Needs Help at Home",
    description:
      "What to look for in the house, the kitchen, the mail, and in how they move, plus how to raise it without starting a fight.",
    dek: "Nobody announces that they have started struggling. It shows up in the mail pile, the pantry, and the way they get out of a chair.",
    category: "Knowing when",
    published: "2026-08-25",
    updated: "2026-08-25",
    readMinutes: 8,
    question: "How do I know when my elderly parent needs in-home care?",
    accent: "clay",
    related: [
      { label: "How care starts with us", href: "/contact" },
      { label: "Companion care", href: "/services/companion-care" },
      { label: "Respite for family", href: "/services/respite-for-family" },
    ],
  },
  {
    slug: "va-aid-and-attendance-for-in-home-care",
    title: "VA Aid and Attendance, and how families use it to pay for care",
    metaTitle: "VA Aid & Attendance for In-Home Care in Mississippi",
    description:
      "A monthly VA supplement wartime veterans and surviving spouses can put toward in-home care. Who qualifies, current rates, and free help filing.",
    dek: "It is one of the most underclaimed benefits in the country, and in a state with as many veterans as Mississippi that is a lot of families paying out of pocket for something already owed to them.",
    category: "Paying for care",
    published: "2026-08-25",
    updated: "2026-08-25",
    readMinutes: 7,
    question:
      "Can VA benefits pay for in-home care for a veteran or surviving spouse?",
    accent: "wine",
    related: [
      { label: "How families pay for care", href: "/paying-for-care" },
      { label: "Personal care at home", href: "/services/personal-care" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);

/* "25 August 2026" rather than "8/25/2026". Unambiguous, and easier to
 * read at a glance for someone who is skimming. */
export function formatGuideDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
