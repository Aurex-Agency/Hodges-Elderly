import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const ROUTES = ["/", "/about", "/services", "/services/personal-care", "/services/supervised-living", "/service-area",
  "/in-home-care/tupelo", "/paying-for-care", "/answers", "/careers", "/contact",
  "/guides", "/guides/what-in-home-care-costs-in-mississippi",
  "/guides/elderly-and-disabled-waiver-north-mississippi",];
const browser = await chromium.launch();
for (const w of [390, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const bad = await page.evaluate((vw) => {
      if (document.documentElement.scrollWidth <= vw) return null;
      return [...document.querySelectorAll("*")]
        .filter((el) => el.getBoundingClientRect().right > vw + 1)
        .slice(0, 4)
        .map((el) => el.tagName + "." + String(el.className).slice(0, 60));
    }, w);
    if (bad) console.log(`${w}px ${route}: OVERFLOW`, bad);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log("overflow scan done");
