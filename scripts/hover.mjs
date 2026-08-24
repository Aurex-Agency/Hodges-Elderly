import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  const step = innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 130));
  }
});
await page.waitForTimeout(1200);

async function shot(locator, file, pad = 0) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await locator.hover();
  await page.waitForTimeout(900);
  const b = await locator.boundingBox();
  await page.screenshot({
    path: `.shots/${file}`,
    clip: { x: 0, y: Math.max(0, b.y - pad), width: 1440, height: Math.min(b.height + pad * 2, 900) },
  });
}

await shot(page.locator("#svc-button-meals-and-homemaking"), "hover-services.png", 200);
await shot(page.locator('a[href="/in-home-care/new-albany"]').first(), "hover-counties.png", 200);
console.log("done");
await browser.close();
