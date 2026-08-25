import { chromium } from "playwright";
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 500, behavior: "instant" }), list.y);
await p.waitForTimeout(1200);

/* Slow, continuous scroll all the way past the section. */
const seen = await p.evaluate(async () => {
  const order = [];
  let last = null;
  const sample = () => {
    const open = [...document.querySelectorAll('[id^="svc-button-"]')]
      .filter((x) => x.getAttribute("aria-expanded") === "true")
      .map((x) => x.id.replace("svc-button-", ""))[0] || null;
    if (open !== last) { order.push(open || "(none)"); last = open; }
  };
  for (let i = 0; i < 700; i++) {
    window.scrollBy({ top: 8, behavior: "instant" });
    sample();
    await new Promise((r) => setTimeout(r, 12));
    sample();
  }
  return order;
});
const all = ["personal-care","companion-care","idd-and-mental-health-support",
  "meals-and-homemaking","errands-and-transportation","respite-for-family"];
const opened = new Set(seen.filter(s => s !== "(none)"));
console.log("sequence:", seen.join(" -> "));
console.log("rows that never opened:", all.filter(s => !opened.has(s)).join(", ") || "none");
await b.close();
