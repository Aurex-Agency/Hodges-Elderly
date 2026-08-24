import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:55843/", { waitUntil: "networkidle" });
const btn = page.locator("#svc-button-meals-and-homemaking");
await btn.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const idle = await btn.evaluate((el) => {
  const kids = [...el.querySelectorAll(":scope > span")];
  return { barScale: getComputedStyle(kids[0]).scale };
});
await btn.hover();
await page.waitForTimeout(700);
const out = await btn.evaluate((el) => {
  const kids = [...el.querySelectorAll(":scope > span")];
  const bar = kids[0];
  const chev = kids[kids.length - 1];
  const numeral = kids[1].querySelector("span");
  return {
    barScale: getComputedStyle(bar).scale,
    barClass: bar.className,
    chevTag: chev.tagName,
    chevClass: String(chev.className).slice(0, 90),
    chevColor: getComputedStyle(chev).color,
    numeralColor: numeral ? getComputedStyle(numeral).color : null,
  };
});
console.log(JSON.stringify({ idleBarScale: idle.barScale, ...out }, null, 1));
await browser.close();
