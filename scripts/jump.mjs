import { chromium } from "playwright";
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);

const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), list.y - 250);
await p.waitForTimeout(1200);

/* Perceived jump: take whatever the reader is looking at near the top of the
 * viewport, scroll a fixed amount, and see whether THAT element moved by
 * exactly that amount. Anything else is a visible lurch. */
const STEP = 120;
let worst = 0;
for (let i = 1; i <= 12; i++) {
  await p.evaluate(() => {
    /* Track a row header rather than panel content: headers survive the
       open/close, so the measurement covers the transition itself. */
    /* Probe the row the reader is actually looking at: the <li> nearest the
       middle of the screen. Rows survive open and close, so the measurement
       spans the transition, and anything above the fold is irrelevant to
       whether the page appears to lurch. */
    const rows = [...document.querySelectorAll("li[data-slug]")];
    const mid = innerHeight / 2;
    const el = rows
      .map((r) => ({ r, d: Math.abs(r.getBoundingClientRect().top - mid) }))
      .sort((a, b) => a.d - b.d)[0]?.r
      || document.elementFromPoint(innerWidth / 2, mid);
    window.__probe = el;
    window.__top = el.getBoundingClientRect().top;
  });
  await p.evaluate((s) => scrollBy({ top: s, behavior: "instant" }), STEP);
  await p.waitForTimeout(700);
  const r = await p.evaluate((s) => {
    const el = window.__probe;
    if (!el || !el.isConnected) return null;
    const drift = el.getBoundingClientRect().top - (window.__top - s);
    return {
      drift: Math.round(drift),
      tag: el.tagName + (el.className ? "." + String(el.className).slice(0, 24) : ""),
      open: [...document.querySelectorAll('[id^="svc-button-"]')]
        .filter(x => x.getAttribute("aria-expanded") === "true")
        .map(x => x.id.replace("svc-button-", ""))[0] || "-",
    };
  }, STEP);
  if (!r) { console.log(`step ${i}: probe detached`); continue; }
  worst = Math.max(worst, Math.abs(r.drift));
  console.log(`step ${i}: perceived jump ${r.drift > 0 ? "+" : ""}${r.drift}px  open ${r.open}`);
}
console.log("worst perceived jump:", worst + "px");
await b.close();
