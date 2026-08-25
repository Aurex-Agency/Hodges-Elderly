import { chromium } from "playwright";
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);

const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 400, behavior: "instant" }), list.y);
await p.waitForTimeout(1200);

/* Scroll continuously, the way a finger or wheel does, and record the open
 * row and scroll position every frame. */
const trace = await p.evaluate(async () => {
  const samples = [];
  let stop = false;
  const tick = () => {
    if (stop) return;
    const open = [...document.querySelectorAll('[id^="svc-button-"]')]
      .filter((x) => x.getAttribute("aria-expanded") === "true")
      .map((x) => x.id.replace("svc-button-", ""))[0] || "-";
    samples.push({ y: Math.round(window.scrollY), open });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  for (let i = 0; i < 160; i++) {
    window.scrollBy({ top: 14, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 16));
  }
  stop = true;
  await new Promise((r) => setTimeout(r, 300));
  return samples;
});

let flips = 0, backwards = 0, biggestBack = 0, changes = [];
for (let i = 1; i < trace.length; i++) {
  if (trace[i].open !== trace[i - 1].open) { flips++; changes.push(`${trace[i-1].open}->${trace[i].open}`); }
  const d = trace[i].y - trace[i - 1].y;
  if (d < -1) { backwards++; biggestBack = Math.min(biggestBack, d); }
}
console.log("frames:", trace.length);
console.log("open-row changes:", flips);
console.log("sequence:", changes.join("  "));
console.log("frames where scroll went BACKWARDS while scrolling down:", backwards, "worst", biggestBack + "px");
await b.close();
