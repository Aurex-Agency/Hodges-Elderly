import { chromium } from "playwright";
const BASE = process.env.BASE, W = +(process.env.W||390), PATH_ = process.env.PATH_||"";
const SEL = process.env.SEL, OUT = process.env.OUT, H = +(process.env.H||1000), OFF = +(process.env.OFF||0);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 900 } });
await p.goto(BASE + PATH_, { waitUntil: "networkidle" });
await p.evaluate(async () => {
  const s = innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += s) { scrollTo({top:y,behavior:"instant"}); await new Promise(r=>setTimeout(r,120)); }
  scrollTo({top:0,behavior:"instant"});
});
await p.waitForTimeout(1500);
const el = await p.locator(SEL).first().boundingBox();
await p.screenshot({ path: `.shots/${OUT}.png`, fullPage: true, clip: { x: 0, y: el.y + OFF, width: W, height: H } });
console.log(OUT, "at y", Math.round(el.y));
await b.close();
