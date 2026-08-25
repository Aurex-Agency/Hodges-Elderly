import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:60928";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const total = await page.evaluate(() => document.body.scrollHeight);
// Sample the tint at several depths so the colour drift is visible in one strip.
const stops = [0, 0.2, 0.4, 0.6, 0.8, 0.97];
for (const [i, f] of stops.entries()) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round((total - 900) * f));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `.shots/tint-${i}.png` });
}

// Report the composited opacity of each field layer at the bottom of the page.
const layers = await page.evaluate(() =>
  [...document.querySelectorAll(".fixed.inset-0.-z-10 > div")].map((d) =>
    Number(getComputedStyle(d).opacity).toFixed(3),
  ),
);
console.log("field opacities at page end:", layers.join(", "));
await browser.close();
