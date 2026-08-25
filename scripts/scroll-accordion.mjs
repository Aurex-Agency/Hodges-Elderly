import { chromium } from "playwright";
const BASE = process.env.BASE, W = +(process.env.W || 390);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 844 } });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);

const SLUGS = ["personal-care","companion-care","idd-and-mental-health-support",
  "meals-and-homemaking","errands-and-transportation","respite-for-family"];
const state = () => p.evaluate((s) => Object.fromEntries(
  s.map(x => [x, document.getElementById("svc-button-"+x)?.getAttribute("aria-expanded")])
), SLUGS);
const openNow = async () => Object.entries(await state()).filter(([,v]) => v === "true").map(([k]) => k);

const listTop = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
console.log("before section:", await openNow());

// Walk down through the list and record which row is open at each step.
for (let i = 0; i <= 6; i++) {
  const target = listTop.y + (listTop.height * i) / 6 - 300;
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), target);
  await p.waitForTimeout(700);
  const o = await openNow();
  console.log(`step ${i}: open =`, o.length ? o.join(",") : "(none)", "| count:", o.length);
}

// Scroll well past the section: everything should be closed again.
await p.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await p.waitForTimeout(900);
console.log("past section:", await openNow());

// A click should hold even as the band would pick something else.
await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), listTop.y - 100);
await p.waitForTimeout(700);
await p.locator("#svc-button-respite-for-family").click();
await p.waitForTimeout(700);
console.log("after clicking respite:", await openNow());
await b.close();
