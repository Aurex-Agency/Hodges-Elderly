import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(process.env.W||390), height: 844 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 300, behavior: "instant" }), list.y);
await p.waitForTimeout(1400);
console.log(JSON.stringify(await p.evaluate(() => {
  const vh = innerHeight;
  return {
    viewport: vh,
    bandPx: Math.round(vh * 0.10),
    rows: [...document.querySelectorAll("li[data-slug]")].map((li) => {
      const btn = li.querySelector("button");
      const panel = li.querySelector('[role="region"]');
      return {
        slug: li.dataset.slug.slice(0, 14),
        liH: Math.round(li.offsetHeight),
        headerH: Math.round(btn.offsetHeight),
        panelH: panel ? Math.round(panel.offsetHeight) : 0,
      };
    }),
  };
}), null, 1));
await b.close();
