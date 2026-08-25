import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:60928";
const browser = await chromium.launch();

// 1. Reduced motion: no tint, no progress bar, content fully visible.
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p1 = await rm.newPage();
await p1.goto(BASE + "/", { waitUntil: "networkidle" });
await p1.waitForTimeout(900);
console.log("reduced motion:", JSON.stringify(await p1.evaluate(() => ({
  tintLayers: document.querySelectorAll(".fixed.inset-0.-z-10 > div").length,
  progressBars: document.querySelectorAll(".fixed.left-0.right-0.top-0").length,
  h1Opacity: getComputedStyle(document.querySelector("h1")).opacity,
  driftingPetals: document.querySelectorAll("svg.absolute.h-44").length,
}))));

// 2. Frame timing across a scripted scroll of the full page.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await ctx.newPage();
await p2.goto(BASE + "/", { waitUntil: "networkidle" });
await p2.waitForTimeout(800);
const perf = await p2.evaluate(async () => {
  const frames = [];
  let last = performance.now();
  let raf = 0;
  const tick = (t) => { frames.push(t - last); last = t; raf = requestAnimationFrame(tick); };
  raf = requestAnimationFrame(tick);
  const total = document.body.scrollHeight - innerHeight;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    window.scrollTo({ top: (total * i) / steps, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 16));
  }
  cancelAnimationFrame(raf);
  const f = frames.slice(3);
  f.sort((a, b) => a - b);
  return {
    frames: f.length,
    median: +f[Math.floor(f.length / 2)].toFixed(1),
    p95: +f[Math.floor(f.length * 0.95)].toFixed(1),
    worst: +f[f.length - 1].toFixed(1),
    over50ms: f.filter((x) => x > 50).length,
  };
});
console.log("scroll frame times (ms):", JSON.stringify(perf));
await browser.close();
