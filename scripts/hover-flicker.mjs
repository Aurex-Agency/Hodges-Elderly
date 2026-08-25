import { chromium } from "playwright";
/* The classic transform-on-hover bug: the element lifts out from under the
 * cursor, fires mouseleave, drops back, fires mouseenter, and oscillates.
 * Park the pointer 1px inside the bottom edge and count state flips. */
const BASE = process.env.BASE ?? "http://localhost:59042";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const targets = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="tel:"]')].map((el, i) => {
    el.dataset.probe = `t${i}`;
    const r = el.getBoundingClientRect();
    return { id: `t${i}`, x: r.left + r.width / 2, y: r.bottom - 1, top: Math.round(r.top) };
  }).filter((t) => t.top > 0 && t.top < 800)
);

for (const t of targets) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-probe="${id}"]`);
    window.__flips = 0;
    el.addEventListener("mouseenter", () => window.__flips++);
    el.addEventListener("mouseleave", () => window.__flips++);
  }, t.id);
  // Approach from below, then hold exactly on the bottom edge.
  await page.mouse.move(t.x, t.y + 30);
  await page.mouse.move(t.x, t.y, { steps: 10 });
  await page.waitForTimeout(900);
  const flips = await page.evaluate(() => window.__flips);
  console.log(`${t.id} bottom-edge hover: ${flips} enter/leave events`,
    flips > 2 ? "  <-- FLICKER" : "");
  await page.mouse.move(10, 10);
  await page.waitForTimeout(300);
}
await browser.close();
