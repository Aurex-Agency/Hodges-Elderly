import { chromium } from "playwright";
/* Scroll to the bottom of the list, then back up, and check that rows
 * close on the way and that nothing jolts while doing it. */
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 400, behavior: "instant" }), list.y);
await p.waitForTimeout(1000);

// Down through the whole list.
await p.evaluate(async () => {
  for (let i = 0; i < 220; i++) {
    window.scrollBy({ top: 14, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 16));
  }
});
await p.waitForTimeout(700);
const openAtBottom = await p.evaluate(() =>
  [...document.querySelectorAll('[id^="svc-button-"]')].filter((x) => x.getAttribute("aria-expanded") === "true").length);

// Back up.
const trace = await p.evaluate(async () => {
  const s = []; let stop = false;
  const tick = () => {
    if (stop) return;
    const pos = {};
    document.querySelectorAll('[id^="svc-button-"]').forEach((el) => {
      pos[el.id.replace("svc-button-", "")] = Math.round(el.getBoundingClientRect().top);
    });
    s.push({ y: Math.round(window.scrollY), pos,
      open: [...document.querySelectorAll('[id^="svc-button-"]')].filter((x) => x.getAttribute("aria-expanded") === "true").length });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  for (let i = 0; i < 260; i++) {
    window.scrollBy({ top: -14, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 16));
  }
  stop = true;
  await new Promise((r) => setTimeout(r, 300));
  return s;
});

let worst = 0, at = null;
for (let i = 1; i < trace.length; i++) {
  for (const [slug, top] of Object.entries(trace[i].pos)) {
    const prev = trace[i - 1].pos[slug];
    if (prev === undefined) continue;
    if (!((top > -40 && top < 844) || (prev > -40 && prev < 844))) continue;
    const drift = Math.abs((top - prev) - 14); // expected +14 scrolling up
    if (drift > worst) { worst = drift; at = { i, slug, prev, top }; }
  }
}
console.log("rows open at bottom of list:", openAtBottom);
console.log("rows open after scrolling back up:", trace.at(-1).open);
console.log("worst on-screen content jolt scrolling UP:", Math.round(worst) + "px",
  at ? `(frame ${at.i}, ${at.slug}: ${at.prev} -> ${at.top})` : "");
let back = 0, worstBack = 0;
for (let i = 1; i < trace.length; i++) {
  const d = trace[i].y - trace[i - 1].y;
  if (d > 1) { back++; worstBack = Math.max(worstBack, d); }
}
console.log("frames where scroll went FORWARDS while scrolling up:", back, "worst", worstBack + "px");
await b.close();
