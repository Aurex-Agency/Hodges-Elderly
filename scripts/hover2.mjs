import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto(BASE + "/services", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  const step = innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 130));
  }
  scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1600);
const row = page.locator('a[href="/services/idd-and-mental-health-support"]').first();
await row.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await row.hover();
await page.waitForTimeout(900);
const list = await page.locator("main ul").first().boundingBox();
await page.screenshot({ path: ".shots/services-index.png",
  clip: { x: 0, y: list.y - 40, width: 1440, height: Math.min(list.height + 80, 1000) } });
console.log("ok");
await browser.close();
