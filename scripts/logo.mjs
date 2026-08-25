import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1000, height: 700 } });
const p = await ctx.newPage();
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);

const grab = await p.evaluate(() => {
  const link = document.querySelector('header a[aria-label]');
  const cs = getComputedStyle(document.documentElement);
  const names = ["--color-green","--color-plum","--color-ink","--color-rule","--color-mist","--color-forest"];
  return {
    lockup: link.innerHTML,
    mark: link.querySelector("svg").outerHTML,
    vars: names.map(n => `${n}:${cs.getPropertyValue(n)}`).join(";"),
    font: getComputedStyle(document.body).fontFamily,
  };
});

// Geometry check: do the frame and the monogram share a centre?
const geom = await p.evaluate(() => {
  const svg = document.querySelector('header a[aria-label] svg');
  const rect = svg.querySelector("rect").getBBox();
  const path = svg.querySelector("path").getBBox();
  const c = (bb) => [ +(bb.x + bb.width / 2).toFixed(2), +(bb.y + bb.height / 2).toFixed(2) ];
  return { frameCentre: c(rect), monogramCentre: c(path) };
});
console.log("frame centre   :", geom.frameCentre.join(", "));
console.log("monogram centre:", geom.monogramCentre.join(", "));
console.log("offset         :", (geom.monogramCentre[0]-geom.frameCentre[0]).toFixed(2),
            (geom.monogramCentre[1]-geom.frameCentre[1]).toFixed(2));

const sheet = await ctx.newPage();
await sheet.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<style>
:root{${grab.vars}}
body{margin:0;padding:36px;background:#fff;font-family:${grab.font};display:grid;gap:28px}
.row{display:flex;align-items:center;gap:40px;padding:22px;border:1px solid var(--color-rule);border-radius:14px}
.dark{background:var(--color-forest)}
.big svg{width:240px;height:240px}
.mid svg{width:96px;height:96px}
.lock{transform:scale(2);transform-origin:left center}
.grid{position:relative}
.grid::after{content:"";position:absolute;inset:0;background:
  linear-gradient(to right, rgba(255,0,0,.35) 1px, transparent 1px) 50% 0/100% 100%,
  linear-gradient(to bottom, rgba(255,0,0,.35) 1px, transparent 1px) 0 50%/100% 100%;}
</style></head><body>
<div class="row"><div class="big grid">${grab.mark}</div><div class="mid">${grab.mark}</div></div>
<div class="row"><span class="lock" style="display:inline-flex;align-items:center;gap:.875rem">${grab.lockup}</span></div>
<div class="row dark"><div class="big">${grab.mark}</div></div>
</body></html>`);
await sheet.waitForTimeout(600);
await sheet.screenshot({ path: ".shots/logo.png", fullPage: true });
console.log("sheet written");
await b.close();
