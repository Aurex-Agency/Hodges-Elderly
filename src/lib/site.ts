/* Single source of truth for business facts and page content.
 *
 * Everything here is either confirmed by the client or drawn from her
 * NPPES record (NPI 1376496257). Anything unconfirmed is marked TODO and
 * must not be rendered as a claim until she clears it.
 */

export const site = {
  name: "Hodges Elderly and Disabled Services",
  shortName: "Hodges Elderly & Disabled Services",
  founder: "Aaliyah Hodges",
  firstName: "Aaliyah",
  founderTitle: "Founder & Administrator",

  phone: "662-788-2032",
  phoneHref: "tel:+16627882032",

  // TODO(client): business email is being created after launch.
  email: null as string | null,

  // From NPPES. TODO(client): confirm this address should be published.
  address: {
    street: "3166 W Jackson St, Suite 3",
    city: "Tupelo",
    state: "MS",
    zip: "38801",
  },

  // TODO(client): domain not purchased yet; buying at the end of the build.
  url: "https://hodgeselderlycare.com",

  counties: [
    "Lee",
    "Pontotoc",
    "Union",
    "Chickasaw",
    "Monroe",
    "Lafayette",
    "Itawamba",
  ],

  towns: [
    { name: "Tupelo", slug: "tupelo", county: "Lee", page: true },
    { name: "New Albany", slug: "new-albany", county: "Union", page: true },
    { name: "Pontotoc", slug: "pontotoc", county: "Pontotoc", page: true },
    { name: "Oxford", slug: "oxford", county: "Lafayette", page: false },
    { name: "Amory", slug: "amory", county: "Monroe", page: false },
    { name: "Aberdeen", slug: "aberdeen", county: "Monroe", page: false },
    { name: "Houston", slug: "houston", county: "Chickasaw", page: false },
    { name: "Okolona", slug: "okolona", county: "Chickasaw", page: false },
    { name: "Fulton", slug: "fulton", county: "Itawamba", page: false },
  ],

  /* Claims we are NOT permitted to publish yet. Kept here so nobody
   * quietly reintroduces them later. Client said "hold off" 2026-08-24. */
  withheldClaims: [
    "insured and bonded",
    "Medicaid E&D Waiver enrolled provider",
    "specific license or certification numbers",
  ],
} as const;

export const NAV = [
  { label: "Services", href: "/services" },
  { label: "Her Story", href: "/about" },
  { label: "Where We Go", href: "/service-area" },
  { label: "What It Costs", href: "/paying-for-care" },
  { label: "Answers", href: "/answers" },
  { label: "Contact", href: "/contact" },
];

/* TODO(client): confirm this service list and the detail beneath it.
 * Derived from her NPPES taxonomy (In Home Supportive Care; Personal Care
 * Attendant) and her stated eight years with IDD and mental-health
 * clients — not from a service menu she has approved. */
export const services = [
  {
    slug: "personal-care",
    name: "Personal care",
    blurb:
      "Bathing, dressing, grooming, and help getting safely in and out of bed. The daily things that get harder to do alone.",
    forWhom:
      "Someone who is still at home and wants to stay there, but is no longer steady on their feet or can no longer manage washing and dressing without help.",
    includes: [
      "Bathing, showering, and help at the sink",
      "Dressing, grooming, and hair care",
      "Getting in and out of bed and chairs safely",
      "Walking assistance and fall prevention around the house",
      "Toileting and incontinence care, handled with dignity",
      "Medication reminders",
    ],
    note: "Personal care is hands-on but non-medical. We do not administer injections, change sterile dressings, or provide skilled nursing.",
  },
  {
    slug: "companion-care",
    name: "Companion care",
    blurb:
      "Someone in the house. Conversation, a shared meal, a hand of cards — and a person who notices when something is off.",
    forWhom:
      "Someone who is managing physically but is alone most of the day, and a family that has started worrying about what they would not hear about.",
    includes: [
      "Conversation and company through the day",
      "Shared meals rather than eating alone",
      "Cards, puzzles, television, reading aloud",
      "Walks and time outside when the weather allows",
      "A regular set of eyes on how she is really doing",
      "A phone call to you if something changes",
    ],
    note: "Isolation is not a small problem. A caregiver who is there three afternoons a week often catches a decline weeks before anyone else would.",
  },
  {
    slug: "idd-and-mental-health-support",
    name: "IDD and mental health support",
    blurb:
      "Aaliyah spent eight years supporting adults with intellectual and developmental disabilities and mental illness before opening her own agency.",
    forWhom:
      "An adult with an intellectual or developmental disability, or with a serious mental illness, who needs consistent daily support to live in the community.",
    includes: [
      "Support with daily routines and personal care",
      "Help keeping appointments and taking medication on schedule",
      "Community access — errands, activities, getting out of the house",
      "Consistency of caregiver, which matters more here than anywhere",
      "Communication with family and support coordinators",
    ],
    note: "This is the work Aaliyah did for eight years before she opened Hodges. It is not an add-on service here.",
  },
  {
    slug: "meals-and-homemaking",
    name: "Meals and homemaking",
    blurb:
      "Cooking, laundry, dishes, and keeping the house in the condition she kept it herself.",
    forWhom:
      "Someone whose house has quietly gotten away from them — and who would be embarrassed to have you notice.",
    includes: [
      "Cooking and preparing meals, including for specific diets",
      "Grocery shopping and putting it away",
      "Laundry, bed changing, and ironing",
      "Dishes, kitchen, and bathroom cleaning",
      "Tidying, sorting mail, and taking out the trash",
    ],
    note: "Housekeeping is often the first thing to slip and the last thing anyone will ask for help with. It is a normal part of care, not an admission of anything.",
  },
  {
    slug: "errands-and-transportation",
    name: "Errands and transportation",
    blurb:
      "Rides to the doctor, the pharmacy, and the grocery store — with someone who walks in alongside her.",
    forWhom:
      "Someone who has stopped driving, or should, and is missing appointments because getting there has become the hard part.",
    includes: [
      "Rides to medical and dental appointments",
      "Walking in and waiting through the visit",
      "Pharmacy pickups",
      "Grocery shopping and other errands",
      "Church, the bank, the barber, visiting family",
    ],
    note: "Giving up the keys is one of the hardest days in a person's life. Reliable rides are what makes it survivable.",
  },
  {
    slug: "respite-for-family",
    name: "Respite for family",
    blurb:
      "If you have been the one doing all of it, this is the service that lets you sleep, work, or leave town without worrying.",
    forWhom:
      "The daughter, son, or spouse who has become the full-time caregiver and is running out of room.",
    includes: [
      "Scheduled regular hours so you can work or rest",
      "Longer cover for a trip, a hospital stay, or a funeral",
      "Overnight and weekend availability",
      "Short-notice help when something comes up",
    ],
    note: "Family caregivers burn out, and when they do, the person they are caring for usually ends up in a facility. Respite is not a luxury.",
  },
] as const;

export type Service = (typeof services)[number];

/* TODO(client): REAL NUMBERS REQUIRED before this page can ship.
 * Package 2 sells published pricing as a differentiator, so these
 * placeholders must be replaced, not quietly deleted. */
export const PRICING_CONFIRMED = false;

export const faqs = [
  {
    q: "How quickly can you start?",
    a: `Call ${site.phone} and ${site.firstName} will tell you honestly. For most families the first conversation happens the same day, and care can usually begin within a few days once we have met and agreed on a schedule.`,
    group: "Getting started",
  },
  {
    q: "What happens on the first call?",
    a: "You describe what is going on. We ask what a normal day looks like, what has changed recently, and what worries you most. If we are not the right fit, we will say so and point you somewhere else. Nobody is going to pressure you.",
    group: "Getting started",
  },
  {
    q: "Do we have to sign a long contract?",
    a: "No. Care is arranged around a schedule you agree to, and schedules change as needs change.",
    group: "Getting started",
  },
  {
    q: "Who exactly is coming into my mother's home?",
    a: `A caregiver ${site.firstName} has personally hired. This is a small local agency, not a franchise office assigning whoever is free. You will know who is coming, and if a caregiver is not the right match for your mother, tell us and we will change it.`,
    group: "Trust and safety",
  },
  {
    q: "What if she does not like the caregiver?",
    a: "Say so. This happens and it is nobody's fault — personalities either fit or they do not. We would far rather change a caregiver than have your mother dread the doorbell.",
    group: "Trust and safety",
  },
  {
    q: "Are your caregivers background checked?",
    a: "TODO(client): confirm before publishing. Do not answer this question on the site until the client has cleared exactly what may be stated about screening, insurance, and bonding.",
    group: "Trust and safety",
    withheld: true,
  },
  {
    q: "Is this medical care?",
    a: "No. This is non-medical in-home care — help with daily living, not skilled nursing. We do not provide wound care, injections, or therapy. If those are needed, they come from a home health agency, and the two often run alongside each other.",
    group: "What we do",
  },
  {
    q: "How many hours do we have to book?",
    a: "It depends on what she needs. Some families start with a few hours a week for bathing and errands. Others need daily help or overnight cover. Start with what is actually a problem right now.",
    group: "What we do",
  },
  {
    q: "Can the schedule change later?",
    a: "Yes, and it usually does. Needs increase, families travel, someone comes home from the hospital. Tell us and we adjust.",
    group: "What we do",
  },
  {
    q: "What does in-home care cost?",
    a: "TODO(client): publish real private-pay hourly ranges here. This is the single most searched question in this category and Package 2 sells transparent pricing as the differentiator.",
    group: "Paying for care",
    withheld: true,
  },
  {
    q: "Does Medicaid pay for this?",
    a: "Mississippi's Medicaid Elderly and Disabled Waiver can cover in-home personal care for people who qualify. Eligibility is decided by the Division of Medicaid, not by us. TODO(client): confirm enrollment status before stating whether we can bill it.",
    group: "Paying for care",
    withheld: true,
  },
  {
    q: "Does Medicare pay for this?",
    a: "Generally no. Medicare covers short-term skilled care after a hospital stay, not ongoing help with bathing, meals, and housekeeping. Most families pay privately, use long-term care insurance, or qualify for a Medicaid waiver.",
    group: "Paying for care",
  },
] as const;
