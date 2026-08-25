import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:59042";
const browser = await chromium.launch();
for (const [w, name] of [[1440, "g-footer"], [390, "g-footer-m"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  for (let y = 0; y < 14000; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => {
    const f = [...document.querySelectorAll("footer")].pop();
    f.scrollIntoView({ block: "start" });
    window.scrollBy(0, -40);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `.shots/${name}.png` });
  await page.close();
}
// And the homepage guides band.
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });
for (let y = 0; y < 14000; y += 600) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(70);
}
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")]
    .find((n) => n.textContent.includes("Working out what to do next"));
  const y = h.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo(0, y);
});
await page.waitForTimeout(1500);
await page.screenshot({ path: ".shots/g-home-guides.png" });
await browser.close();
console.log("done");
