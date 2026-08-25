import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 500, behavior: "instant" }), list.y);
await p.waitForTimeout(1400);
const out = await p.evaluate(async () => {
  const seen = [];
  for (let i = 0; i < 250; i++) {
    window.scrollBy({ top: 10, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 14));
    const d = window.__diag;
    if (d && d.__seen !== true) { d.__seen = true; seen.push({ i, ...d }); }
  }
  return seen;
});
console.log(JSON.stringify(out, null, 1));
await b.close();
