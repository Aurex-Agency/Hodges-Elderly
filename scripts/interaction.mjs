import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:55843";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });

const first = page.locator("#svc-button-personal-care");
const second = page.locator("#svc-button-companion-care");

console.log("first open by default:", await first.getAttribute("aria-expanded"));

// Keyboard: focus the second trigger and activate with Enter.
await second.focus();
console.log("second focused:", await second.evaluate((el) => el === document.activeElement));
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
console.log("after Enter — second:", await second.getAttribute("aria-expanded"),
            "| first:", await first.getAttribute("aria-expanded"));

const panel = page.locator("#svc-panel-companion-care");
console.log("panel visible:", await panel.isVisible(), "| height:",
  Math.round((await panel.boundingBox())?.height ?? 0));

// Space should toggle it closed again.
await page.keyboard.press(" ");
await page.waitForTimeout(600);
console.log("after Space — second:", await second.getAttribute("aria-expanded"));

// Reduced motion: content must still be present and readable.
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const p2 = await ctx2.newPage();
await p2.goto(BASE + "/", { waitUntil: "networkidle" });
await p2.waitForTimeout(800);
const h1 = p2.locator("h1");
console.log("reduced-motion h1 visible:", await h1.isVisible(),
  "| opacity:", await h1.evaluate((el) => getComputedStyle(el).opacity));
const petals = await p2.locator("svg").count();
console.log("reduced-motion svg count:", petals);
await browser.close();
