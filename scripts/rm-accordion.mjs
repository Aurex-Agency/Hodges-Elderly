import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), list.y - 200);
await p.waitForTimeout(1200);
const open = await p.evaluate(() =>
  [...document.querySelectorAll('[id^="svc-button-"]')].filter(b => b.getAttribute("aria-expanded") === "true").length);
console.log("reduced motion, rows auto-opened by scroll:", open, "(expected 0)");
await p.locator("#svc-button-personal-care").click();
await p.waitForTimeout(400);
console.log("click still opens:", await p.locator("#svc-button-personal-care").getAttribute("aria-expanded"));
await b.close();
