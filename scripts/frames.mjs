import { chromium } from "playwright";
/* Long-frame counter during a realistic continuous scroll. Anything over
 * ~32ms is a visibly dropped frame at 60Hz. */
const BASE = process.env.BASE ?? "http://localhost:59042";
const ROUTES = ["/", "/services", "/guides/what-in-home-care-costs-in-mississippi"];
const browser = await chromium.launch();
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    window.__f = [];
    let last = performance.now();
    const tick = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h - 900; y += 48) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(16);
  }
  const f = await page.evaluate(() => window.__f.slice(5));
  const long = f.filter((d) => d > 32).length;
  const worst = Math.round(Math.max(...f));
  console.log(`${route}\n  frames ${f.length}  >32ms ${long} (${(long/f.length*100).toFixed(1)}%)  worst ${worst}ms`);
  await page.close();
}
await browser.close();
