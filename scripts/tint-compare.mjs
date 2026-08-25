import { chromium } from "playwright";
/* Captures the scroll tint at fixed points so a performance change can be
 * proved not to have altered the look. */
const BASE = process.env.BASE ?? "http://localhost:4399";
const TAG = process.env.TAG ?? "before";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
const h = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
console.log("scrollable height:", h);
const ABS = [0, 1400, 2800, 4200, 5600, 7000];
for (const y of ABS) {
  const p = y;
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1500);
  // Hide content so only the tint is captured.
  await page.evaluate(() => {
    document.querySelectorAll("header, main, footer").forEach((n) => (n.style.visibility = "hidden"));
  });
  await page.waitForTimeout(120);
  await page.screenshot({ path: `.shots/tint-${TAG}-${p}.png`, clip: { x: 0, y: 8, width: 1440, height: 892 } });
  await page.evaluate(() => {
    document.querySelectorAll("header, main, footer").forEach((n) => (n.style.visibility = ""));
  });
}
await browser.close();
console.log("captured", TAG);
