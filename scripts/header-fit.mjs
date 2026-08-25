import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:60928";
const browser = await chromium.launch();
for (const w of [1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const header = document.querySelector("header");
    const inner = header.firstElementChild;
    const nav = header.querySelector("nav");
    const wrapped = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      return el.getBoundingClientRect().height > lh * 1.6;
    };
    return {
      headerH: Math.round(header.offsetHeight),
      innerOverflows: inner.scrollWidth > inner.clientWidth + 1,
      navVisible: nav ? getComputedStyle(nav).display !== "none" : false,
      wrappedLinks: nav ? [...nav.querySelectorAll("a")].filter(wrapped).map(a => a.textContent.trim()) : [],
      btnWrapped: (() => {
        const b = header.querySelector('a[href^="tel:"]');
        return b ? b.scrollWidth > b.clientWidth + 1 : null;
      })(),
      navScrollW: nav ? nav.scrollWidth : 0, navClientW: nav ? nav.clientWidth : 0,
    };
  });
  console.log(w, JSON.stringify(r));
  await page.close();
}
await browser.close();
