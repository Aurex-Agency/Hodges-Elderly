import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:59042";
const shots = [
  ["/", 1440, "g-home-hero", 0],
  ["/", 1440, "g-home-guides", 6200],
  ["/guides", 1440, "g-index", 300],
  ["/guides/what-in-home-care-costs-in-mississippi", 1440, "g-cost", 300],
  ["/guides/elderly-and-disabled-waiver-north-mississippi", 1440, "g-waiver", 2200],
  ["/contact", 1440, "g-form", 900],
  ["/guides", 390, "g-index-m", 300],
  ["/guides/what-in-home-care-costs-in-mississippi", 390, "g-cost-m", 1400],
];
const browser = await chromium.launch();
for (const [route, w, name, scroll] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  if (scroll) { await page.evaluate((y) => window.scrollTo(0, y), scroll); }
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `.shots/${name}.png` });
  console.log(name);
  await page.close();
}
await browser.close();
