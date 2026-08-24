import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:55843";
const PATH = process.env.PATH_ ?? "";
const W = Number(process.env.W ?? 1440);
const TAG = process.env.TAG ?? `d${W}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 1000 } });
await page.goto(BASE + PATH, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Scroll the whole page so every whileInView reveal has fired, then return
// to the top. Without this the captures show elements mid-transition.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 130));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1400);

// Capture each band separately so nothing gets downscaled into mush.
const bands = await page.evaluate(() =>
  [...document.querySelectorAll("header, main > section, footer")].map((el, i) => ({
    i,
    id: el.id || el.tagName.toLowerCase(),
    top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    h: Math.round(el.offsetHeight),
  })),
);

for (const b of bands) {
  await page.screenshot({
    path: `.shots/${TAG}-${b.i}-${b.id}.png`,
    fullPage: true,
    clip: { x: 0, y: b.top, width: W, height: Math.min(b.h, 1400) },
  });
  console.log(`${TAG}-${b.i}-${b.id}: ${b.h}px`);
}
await browser.close();
