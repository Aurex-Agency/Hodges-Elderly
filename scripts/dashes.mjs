import { chromium } from "playwright";

/* The client does not want em or en dashes in visible copy: they read as an
 * AI tell. This checks the RENDERED text, so it also catches anything
 * assembled at runtime that a source grep would miss.
 *
 * En dashes in a genuine numeric range (9–5, 2020–2024) are allowed. */
const BASE = process.env.BASE ?? "http://localhost:55843";
const ROUTES = ["/", "/about", "/services", "/service-area", "/paying-for-care",
  "/answers", "/careers", "/contact",
  ...["personal-care","companion-care","idd-and-mental-health-support",
      "meals-and-homemaking","errands-and-transportation","respite-for-family",
      "home-and-community-supports","supervised-living",
      "behavioral-supervised-living","behavior-support"]
    .map((s) => `/services/${s}`),
  ...["tupelo","new-albany","pontotoc"].map((t) => `/in-home-care/${t}`),
  "/guides",
  ...["what-in-home-care-costs-in-mississippi",
      "elderly-and-disabled-waiver-north-mississippi",
      "home-health-vs-in-home-care",
      "signs-a-parent-needs-help-at-home",
      "va-aid-and-attendance-for-in-home-care"]
    .map((g) => `/guides/${g}`)];

const RANGE = /\d\s*–\s*\d/;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let hits = 0;

for (const route of ROUTES) {
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const found = await page.evaluate(() => {
    const out = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const t = n.textContent ?? "";
      if (t.includes("—") || t.includes("–")) out.push(t.trim().slice(0, 130));
    }
    // Titles are visible in the tab and in search results.
    if (document.title.includes("—") || document.title.includes("–"))
      out.push("<title> " + document.title);
    return out;
  });
  const bad = found.filter((t) => !(t.includes("–") && RANGE.test(t) && !t.includes("—")));
  if (bad.length) {
    hits += bad.length;
    console.log(`\n${route}`);
    bad.forEach((t) => console.log("  " + t));
  }
  await page.close();
}
await browser.close();
console.log(hits === 0
  ? `\nNo em or en dashes in visible copy across ${ROUTES.length} routes.`
  : `\n${hits} dash(es) still present.`);
process.exit(hits === 0 ? 0 : 1);
