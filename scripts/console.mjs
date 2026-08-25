import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const ROUTES = ["/", "/about", "/services", "/services/personal-care", "/services/supervised-living", "/service-area",
  "/in-home-care/tupelo", "/paying-for-care", "/answers", "/careers", "/contact",
  "/guides", "/guides/what-in-home-care-costs-in-mississippi",
  "/guides/elderly-and-disabled-waiver-north-mississippi",];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let bad = 0;
for (const route of ROUTES) {
  const page = await ctx.newPage();
  const msgs = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") msgs.push(`[${m.type()}] ${m.text().slice(0, 200)}`); });
  page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message.slice(0, 200)}`));
  page.on("response", (r) => { if (r.status() >= 400) msgs.push(`[${r.status()}] ${r.url()}`); });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  if (msgs.length) { bad += msgs.length; console.log(`\n${route}`); msgs.forEach((m) => console.log("  " + m)); }
  await page.close();
}
await browser.close();
console.log(bad === 0 ? "\nClean: no console errors/warnings or failed requests." : `\n${bad} issues.`);
