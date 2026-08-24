import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const SLUGS = ["personal-care","companion-care","idd-and-mental-health-support",
  "meals-and-homemaking","errands-and-transportation","respite-for-family"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });

// Pull each rendered illustration plus the page's CSS custom properties, then
// assemble one contact sheet so the six can be judged as a system.
const svgs = [];
let vars = "";
for (const slug of SLUGS) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/services/${slug}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const r = await page.evaluate(() => {
    const svg = document.querySelector("main svg[viewBox='0 0 120 120']");
    const cs = getComputedStyle(document.documentElement);
    const names = ["--color-green","--color-green-soft","--color-plum","--color-plum-soft",
      "--color-plum-wash","--color-ink","--color-rule","--color-mist"];
    return {
      html: svg ? svg.outerHTML : null,
      vars: names.map((n) => `${n}:${cs.getPropertyValue(n)}`).join(";"),
    };
  });
  if (!r.html) throw new Error("no illustration on " + slug);
  svgs.push({ slug, html: r.html });
  vars = r.vars;
  await page.close();
}

const sheet = await ctx.newPage();
await sheet.setContent(`<!doctype html><html><head><style>
  :root{${vars}}
  body{margin:0;background:#fff;font:14px system-ui;padding:28px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .cell{border:1px solid var(--color-rule);border-radius:14px;padding:18px;text-align:center}
  .cell svg{width:150px;height:150px}
  .cap{margin-top:10px;color:#454d52;font-size:13px}
</style></head><body><div class="grid">
${svgs.map((s) => `<div class="cell">${s.html}<div class="cap">${s.slug}</div></div>`).join("")}
</div></body></html>`);
await sheet.waitForTimeout(400);
await sheet.screenshot({ path: ".shots/illustrations.png", fullPage: true });
console.log("contact sheet written");
await browser.close();
