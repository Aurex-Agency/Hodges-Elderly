import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:55843/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const out = await page.evaluate(() => {
  const host = document.querySelector('.lg\\:block svg[viewBox="0 0 400 400"]')
    || [...document.querySelectorAll('svg[viewBox="0 0 400 400"]')].find(s => s.getBoundingClientRect().width > 100);
  if (!host) return { err: "no visible bloom svg" };
  const gs = [...host.querySelectorAll(":scope > g")];
  return {
    rect: host.getBoundingClientRect().toJSON(),
    count: gs.length,
    groups: gs.slice(0, 4).map(g => ({
      transform: getComputedStyle(g).transform,
      origin: getComputedStyle(g).transformOrigin,
      box: getComputedStyle(g).transformBox,
      opacity: getComputedStyle(g).opacity,
      attrTransform: g.getAttribute("transform"),
      bbox: (() => { const b = g.getBBox(); return [b.x|0, b.y|0, b.width|0, b.height|0]; })(),
      screen: (() => { const b = g.getBoundingClientRect(); return [b.x|0, b.y|0, b.width|0, b.height|0]; })(),
    })),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
