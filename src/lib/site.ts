/* Single source of truth for business facts and page content.
 *
 * Everything here is either confirmed by the client or drawn from her
 * NPPES record (NPI 1376496257). Anything unconfirmed is marked TODO and
 * must not be rendered as a claim until she clears it.
 */

/* One switch for everything that must not happen before the real domain
 * is live: search indexing, the robots file, and the sitemap. Flipping
 * this to true is the launch step, and it is deliberately a single edit
 * rather than three scattered ones that can be half-done.
 *
 * Live since 2026-08-25 on hodgeselderlyanddisable.com. */
export const LAUNCH_READY = true;

export const site = {
  /* "Disable", not "Disabled", and "Services", not "Service".
   *
   * This is what the client says the business is called and it matches her
   * own logo artwork, which reads "HODGES ELDERLY & DISABLE SERVICES". An
   * earlier version of this file assumed the logo contained a typo and
   * published "Disabled Services". That was wrong, and it is a reminder
   * that a client's own name is a fact to be confirmed with them, not
   * corrected on their behalf.
   *
   * TODO(client): her NPI record (1376496257) is registered under a THIRD
   * spelling, "HODGES ELDERLY AND DISABLED SERVICE", differing on both
   * words. The website follows what she has told us. Worth her checking
   * whether the NPI registration should be amended to match, because that
   * is the name Medicaid and any insurer will be matching against, and a
   * mismatch causes real administrative friction at enrollment. */
  name: "Hodges Elderly and Disable Services",
  shortName: "Hodges Elderly & Disable Services",
  founder: "Aaliyah Hodges",
  firstName: "Aaliyah",
  founderTitle: "Founder & Administrator",

  phone: "662-788-2032",
  phoneHref: "tel:+16627882032",

  email: "admin@hodgeselderlyanddisable.com",

  // From NPPES. TODO(client): confirm this address should be published.
  address: {
    street: "3166 W Jackson St, Suite 3",
    city: "Tupelo",
    state: "MS",
    zip: "38801",
  },

  /* The real domain, live and pointing at Vercel. Everything canonical,
   * every sitemap URL, and the metadataBase all derive from this, so it
   * has to be exact and it has to have no trailing slash. */
  url: "https://hodgeselderlyanddisable.com",

  counties: [
    { name: "Lee", accent: "green", href: "/in-home-care/tupelo" },
    { name: "Pontotoc", accent: "pink", href: "/in-home-care/pontotoc" },
    { name: "Union", accent: "spruce", href: "/in-home-care/new-albany" },
    { name: "Chickasaw", accent: "clay", href: "/service-area" },
    { name: "Monroe", accent: "ochre", href: "/service-area" },
    { name: "Lafayette", accent: "wine", href: "/service-area" },
    { name: "Itawamba", accent: "green", href: "/service-area" },
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
    /* Added 2026-08-25 with the confirmed service list. Home and Community
     * Supports, Supervised Living and Behavior Support are ID/DD Waiver
     * categories, and providing them under the waiver requires Department
     * of Mental Health provider certification. The site describes what she
     * does and does NOT claim she is certified or waiver-enrolled. Publishing
     * those service names invites the question, so it needs answering. */
    "DMH provider certification for ID/DD Waiver services",
    "ability to bill the ID/DD Waiver for supervised living or behavior support",
  ],
} as const;

/* The three steps between "I should probably call someone" and someone
 * actually turning up. Families put this call off for months because they
 * do not know what happens next, so the site says it plainly. */
export const howItStarts = [
  {
    scene: "call" as const,
    accent: "pink",
    title: "You call",
    body: `You describe what is going on at home. ${site.firstName} asks what a normal day looks like and what has changed lately. No script, no pressure, and no obligation at the end of it.`,
  },
  {
    scene: "visit" as const,
    accent: "spruce",
    title: "We come to the house",
    body: "We meet the person who needs care, in their own home, alongside whoever else in the family wants to be there. Together we work out the hours and the help that would actually make a difference.",
  },
  {
    scene: "care" as const,
    accent: "green",
    title: "Care begins",
    body: "A caregiver starts on the schedule you agreed. If something is not working, you call and we change it. Needs shift over time and the schedule shifts with them.",
  },
];

export const countyNames = site.counties.map((c) => c.name);

export const NAV = [
  { label: "Services", href: "/services" },
  { label: "Her Story", href: "/about" },
  { label: "Where We Go", href: "/service-area" },
  { label: "What It Costs", href: "/paying-for-care" },
  { label: "Answers", href: "/answers" },
  { label: "Contact", href: "/contact" },
];

/* Confirmed by the client 2026-08-25, replacing the earlier inferred list.
 *
 * Her own words: "we also do in home respite, home community support,
 * supervised living, behavioral supervised living, and behavior support for
 * the autistic. We also serve mental illness, elderly and disabled, and
 * veterans."
 *
 * Those are not loose descriptions. Home and Community Supports, Supervised
 * Living, Behavior Support and In-Home Respite are all named service
 * categories in Mississippi's ID/DD Waiver, administered by the Division of
 * Medicaid with provider certification through the Department of Mental
 * Health. So the copy below uses the real category names and describes them
 * the way the state does.
 *
 * What it does NOT do is claim she is a certified or enrolled provider of
 * any of them. That sits in withheldClaims until she says otherwise, and it
 * is the single most important thing not to get wrong on this page.
 *
 * SUPERVISED LIVING IS RESIDENTIAL. Staff on site 24 hours, generally no
 * more than six people to a home. That is a different service model from
 * the rest of this list, which is why the two are separated into groups
 * rather than listed as though they were interchangeable. */

/* The two things she does are genuinely different: going to someone's own
 * home, and staffing a home people live in. A reader looking for help for
 * their mother and a family looking for a placement for their adult son
 * are not the same reader and should not have to sort the list themselves. */
export const SERVICE_GROUPS = [
  {
    id: "at-home",
    name: "In their own home",
    blurb:
      "We come to them. Hours are built around what is actually hard right now, and change as that changes.",
  },
  {
    id: "supported-living",
    name: "Supported living and behavior support",
    blurb:
      "For adults who need more than a few hours a day, including a staffed home to live in and specialist behavior support.",
  },
] as const;
export const services = [
  {
    slug: "personal-care",
    group: "at-home",
    accent: "pink",
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
    group: "at-home",
    accent: "ochre",
    name: "Companion care",
    blurb:
      "Someone in the house. Conversation, a shared meal, a hand of cards, and a person who notices when something is off.",
    forWhom:
      "Someone who is managing physically but is alone most of the day, and a family that has started worrying about what they would not hear about.",
    includes: [
      "Conversation and company through the day",
      "Shared meals rather than eating alone",
      "Cards, puzzles, television, reading aloud",
      "Walks and time outside when the weather allows",
      "A regular set of eyes on how they are really doing",
      "A phone call to you if something changes",
    ],
    note: "Isolation is not a small problem. A caregiver who is there three afternoons a week often catches a decline weeks before anyone else would.",
  },
  {
    slug: "idd-and-mental-health-support",
    group: "at-home",
    accent: "spruce",
    name: "IDD and mental health support",
    blurb:
      "Aaliyah spent eight years supporting adults with intellectual and developmental disabilities and mental illness before opening her own agency.",
    forWhom:
      "An adult with an intellectual or developmental disability, or with a serious mental illness, who needs consistent daily support to live in the community.",
    includes: [
      "Support with daily routines and personal care",
      "Help keeping appointments and taking medication on schedule",
      "Community access for errands, activities, and getting out of the house",
      "Consistency of caregiver, which matters more here than anywhere",
      "Communication with family and support coordinators",
    ],
    note: "This is the work Aaliyah did for eight years before she opened Hodges. It is not an add-on service here.",
  },
  {
    slug: "meals-and-homemaking",
    group: "at-home",
    accent: "clay",
    name: "Meals and homemaking",
    blurb:
      "Cooking, laundry, dishes, and keeping the house in the condition they always kept it themselves.",
    forWhom:
      "Someone whose house has quietly gotten away from them, and who would be embarrassed to have you notice.",
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
    group: "at-home",
    accent: "green",
    name: "Errands and transportation",
    blurb:
      "Rides to the doctor, the pharmacy, and the grocery store, with someone who walks in alongside them.",
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
    slug: "home-and-community-supports",
    group: "at-home",
    accent: "spruce",
    name: "Home and community supports",
    blurb:
      "Daily help at home plus getting out into the community, for adults who need support to live independently rather than in a facility.",
    forWhom:
      "An adult with an intellectual or developmental disability, or with a mental illness, who can live in the community with the right support in place for a few hours a day.",
    includes: [
      "Help with bathing, dressing, and personal care",
      "Meal preparation and eating",
      "Keeping the home clean, safe, and running",
      "Getting to appointments, work, church, and activities",
      "Building the everyday skills that keep independence going",
      "Support with money, shopping, and planning the week",
    ],
    note: "Home and Community Supports is a named service in Mississippi's ID/DD Waiver. Whether the waiver pays for it in a particular case is decided by the Division of Medicaid, not by us.",
  },
  {
    slug: "supervised-living",
    group: "supported-living",
    accent: "green",
    name: "Supervised living",
    blurb:
      "A staffed home to live in, with someone there around the clock. A small household, not an institution.",
    forWhom:
      "An adult who cannot safely live alone and needs support available at any hour, but who should not be in a nursing facility to get it.",
    includes: [
      "Staff on site 24 hours a day, every day",
      "A small household rather than a facility",
      "Personal care, meals, and help running the home",
      "Transport to day programs, work, and community activities",
      "Shopping for food and personal things",
      "Help managing money",
    ],
    note: "This one is residential. The person lives here, rather than us coming to them, which makes it a different arrangement from the rest of what we do. Under Mississippi's ID/DD Waiver definition, supervised living means staff on site around the clock who can answer a call for help within five minutes, in a home of generally no more than six people.",
  },
  {
    slug: "behavioral-supervised-living",
    group: "supported-living",
    accent: "wine",
    name: "Behavioral supervised living",
    blurb:
      "Supervised living for someone whose behavior needs a staff team trained specifically for it, working to a written plan.",
    forWhom:
      "An adult who needs a staffed home and whose behavior has made other placements break down, or who has been told repeatedly that a service is not equipped for them.",
    includes: [
      "Everything supervised living covers",
      "Staff trained for the specific behaviors involved",
      "A written behavior support plan the whole team works to",
      "Consistency of approach, which matters more here than anywhere",
      "Close communication with family and support coordinators",
      "Careful, documented review of what is and is not working",
    ],
    note: "Families reach this point having usually been turned away before. Being told a service is not equipped for your son is its own kind of exhausting, and it is worth saying plainly on the phone what has already been tried.",
  },
  {
    slug: "behavior-support",
    group: "supported-living",
    accent: "clay",
    name: "Behavior support for autistic adults",
    blurb:
      "Working out what a behavior is actually communicating, then building a plan around it and training everyone who needs to follow it.",
    forWhom:
      "An autistic adult, or an adult with an intellectual or developmental disability, whose behavior is getting in the way of the other support they receive.",
    includes: [
      "Understanding what the behavior is doing for the person",
      "A written support plan built around that, not around compliance",
      "Training the staff who deliver it day to day",
      "Training family members who want to use the same approach",
      "Reviewing and adjusting as things change",
      "Working alongside the other services already in place",
    ],
    note: "Mississippi's ID/DD Waiver describes behavior support as a service for people whose behavior stops them benefiting from the other services they receive. The point is not to make someone easier to manage. It is to work out what they are trying to tell us and remove the reason.",
  },
  {
    slug: "respite-for-family",
    group: "at-home",
    accent: "wine",
    name: "In-home respite",
    blurb:
      "If you have been the one doing all of it, this is the service that lets you sleep, work, or leave town without worrying. The caregiver comes to them, so nobody has to be moved.",
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

/* Who she serves, in her words: "mental illness, elderly and disabled, and
 * veterans", plus autistic adults, which her behavior support work implies.
 *
 * This is its own section on the site because the service list alone does
 * not answer the question people are actually asking, which is "do you deal
 * with someone like my son". A list of tasks does not answer that. Naming
 * the person does. */
export const WHO_WE_SERVE = [
  {
    id: "elderly",
    accent: "pink",
    name: "Elderly and disabled adults",
    body: "Someone who wants to stay in the house they know, and needs help with the parts of the day that have got harder. This is most of the families who call us.",
  },
  {
    id: "idd",
    accent: "spruce",
    name: "Adults with IDD and autistic adults",
    body: `${site.firstName} spent eight years supporting adults with intellectual and developmental disabilities before she opened this agency. It is not a service she added on. It is where she started.`,
  },
  {
    id: "mental-illness",
    accent: "ochre",
    name: "Adults living with mental illness",
    body: "Consistent daily support from people who are not startled by a bad week. Keeping appointments, keeping medication on schedule, and keeping a life going around it.",
  },
  {
    id: "veterans",
    accent: "green",
    name: "Veterans",
    body: "North Mississippi has a lot of veterans, and a lot of them are paying out of pocket for care a benefit would cover. We serve veterans and their surviving spouses, and we will point you at the people who file those claims for free.",
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
    a: `A caregiver ${site.firstName} has personally hired. This is a small local agency, not a franchise office assigning whoever is free. You will know who is coming, and if a caregiver is not the right match for your parent, tell us and we will change it.`,
    group: "Trust and safety",
  },
  {
    q: "What if they do not like the caregiver?",
    a: "Say so. This happens and it is nobody's fault. Personalities either fit or they do not. We would far rather change a caregiver than have your parent dread the doorbell.",
    group: "Trust and safety",
  },
  {
    q: "Are your caregivers background checked?",
    a: "TODO(client): confirm before publishing. Do not answer this question on the site until the client has cleared exactly what may be stated about screening, insurance, and bonding.",
    group: "Trust and safety",
    withheld: true,
  },
  {
    q: "Do you have somewhere for someone to live, or do you only come to the house?",
    a: "Both. Most of what we do is in someone's own home, on a schedule. We also provide supervised living, which is a staffed home with someone on site around the clock, for adults who cannot safely live alone. Those are different arrangements and we will be straight with you about which one fits.",
    group: "What we do",
  },
  {
    q: "Do you work with autistic adults and people with intellectual disabilities?",
    a: `Yes, and it is where ${site.firstName} started. She spent eight years supporting adults with intellectual and developmental disabilities and with mental illness before opening this agency. We provide home and community supports, supervised living, behavioral supervised living, and behavior support.`,
    group: "What we do",
  },
  {
    q: "We have been turned away before. Is it worth calling?",
    a: "Yes, and please say so on the phone. Families whose relative has been told a service is not equipped for them usually spend the first ten minutes bracing for it to happen again. Tell us what has already broken down and what was tried, because that is the useful information.",
    group: "Trust and safety",
  },
  {
    q: "Do you work with veterans?",
    a: "Yes. A lot of families here are paying privately for care that a VA benefit would help with, and never knew the benefit existed. We are not a VA provider and we do not file claims, but we will point you at the county veterans service officers who do it for free.",
    group: "Paying for care",
  },
  {
    q: "Is this medical care?",
    a: "No. This is non-medical in-home care, meaning help with daily living rather than skilled nursing. We do not provide wound care, injections, or therapy. If those are needed, they come from a home health agency, and the two often run alongside each other.",
    group: "What we do",
  },
  {
    q: "How many hours do we have to book?",
    a: "It depends on what they need. Some families start with a few hours a week for bathing and errands. Others need daily help or overnight cover. Start with what is actually a problem right now.",
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
