import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:59042";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
// Walk down so every whileInView reveal has fired before we land.
for (let y = 0; y < 12000; y += 700) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(90);
}
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")]
    .find((n) => n.textContent.includes("Working out what to do next"));
  h?.scrollIntoView({ block: "start" });
  window.scrollBy(0, -70);
});
await page.waitForTimeout(1600);
await page.screenshot({ path: ".shots/g-home-guides.png" });
await browser.close();
console.log("done");
