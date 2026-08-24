/* Single source of truth for business facts.
 *
 * Everything here is either confirmed by the client or drawn from her
 * NPPES record (NPI 1376496257). Anything unconfirmed is marked TODO and
 * must not be rendered as a claim until she clears it.
 */

export const site = {
  name: "Hodges Elderly and Disabled Services",
  shortName: "Hodges Elderly & Disabled Services",
  founder: "Aaliyah Hodges",
  founderTitle: "Founder & Administrator",

  phone: "662-788-2032",
  phoneHref: "tel:+16627882032",

  // TODO(client): business email is being created after launch.
  email: null as string | null,

  // From NPPES. TODO(client): confirm this is the address she wants
  // published — a home-care agency's office address is a trust signal,
  // but only if visitors can actually reach someone there.
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

  // Package 2 buys dedicated pages for the three towns she most needs
  // to rank in. The rest are covered by the service-area page.
  towns: [
    { name: "Tupelo", county: "Lee", page: true },
    { name: "New Albany", county: "Union", page: true },
    { name: "Pontotoc", county: "Pontotoc", page: true },
    { name: "Oxford", county: "Lafayette", page: false },
    { name: "Amory", county: "Monroe", page: false },
    { name: "Aberdeen", county: "Monroe", page: false },
    { name: "Houston", county: "Chickasaw", page: false },
    { name: "Okolona", county: "Chickasaw", page: false },
    { name: "Fulton", county: "Itawamba", page: false },
  ],

  /* Claims we are NOT permitted to publish yet. Kept here so nobody
   * quietly reintroduces them later. Client said "hold off" on 2026-08-24. */
  withheldClaims: [
    "insured and bonded",
    "Medicaid E&D Waiver enrolled provider",
    "specific license or certification numbers",
  ],
} as const;

/* TODO(client): confirm this service list. Derived from her NPPES taxonomy
 * (In Home Supportive Care; Personal Care Attendant) and her stated eight
 * years with IDD and mental-health clients — not from a service menu she
 * has actually approved. */
export const services = [
  {
    slug: "personal-care",
    name: "Personal care",
    blurb:
      "Bathing, dressing, grooming, and help getting safely in and out of bed. The daily things that get harder to do alone.",
  },
  {
    slug: "companion-care",
    name: "Companion care",
    blurb:
      "Someone in the house. Conversation, a shared meal, a hand of cards — and a person who notices when something is off.",
  },
  {
    slug: "idd-and-mental-health-support",
    name: "IDD and mental health support",
    blurb:
      "Aaliyah spent eight years supporting adults with intellectual and developmental disabilities and mental illness before opening her own agency.",
  },
  {
    slug: "meals-and-homemaking",
    name: "Meals and homemaking",
    blurb:
      "Cooking, laundry, dishes, and keeping the house in the condition she kept it herself.",
  },
  {
    slug: "errands-and-transportation",
    name: "Errands and transportation",
    blurb:
      "Rides to the doctor, the pharmacy, and the grocery store — with someone who walks in alongside her.",
  },
  {
    slug: "respite-for-family",
    name: "Respite for family",
    blurb:
      "If you have been the one doing all of it, this is the service that lets you sleep, work, or leave town without worrying.",
  },
] as const;
