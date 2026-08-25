import { chromium } from "playwright";
/* The honest measure: track where a real on-screen element sits in the
 * viewport, frame by frame. Raw scrollY moving is meaningless if the
 * content stayed put; what the reader sees is the element's position. */
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
if (process.env.NOCORRECT) await p.addInitScript(() => { window.__NOCORRECT = 1; });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 400, behavior: "instant" }), list.y);
await p.waitForTimeout(1200);

const trace = await p.evaluate(async () => {
  const s = [];
  let stop = false;
  const tick = () => {
    if (stop) return;
    // Every service heading's viewport position, keyed by slug.
    const pos = {};
    document.querySelectorAll('[id^="svc-button-"]').forEach((el) => {
      pos[el.id.replace("svc-button-", "")] = Math.round(el.getBoundingClientRect().top);
    });
    s.push({ y: Math.round(window.scrollY), pos });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  for (let i = 0; i < 160; i++) {
    window.scrollBy({ top: 14, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 16));
  }
  stop = true;
  await new Promise((r) => setTimeout(r, 300));
  return s;
});

/* Expected drift per frame is -14px (we scroll down 14). Anything far from
 * that for an element that is on screen is a visible jolt. */
let worst = 0, worstAt = null;
for (let i = 1; i < trace.length; i++) {
  for (const [slug, top] of Object.entries(trace[i].pos)) {
    const prev = trace[i - 1].pos[slug];
    if (prev === undefined) continue;
    const onScreen = (top > -40 && top < 844) || (prev > -40 && prev < 844);
    if (!onScreen) continue;
    const drift = Math.abs((top - prev) - -14);
    if (drift > worst) { worst = drift; worstAt = { i, slug, prev, top }; }
  }
}
console.log("worst on-screen content jolt:", Math.round(worst) + "px",
  worstAt ? `(frame ${worstAt.i}, ${worstAt.slug}: ${worstAt.prev} -> ${worstAt.top})` : "");
await b.close();
