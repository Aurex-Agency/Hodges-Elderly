import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:60928";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });

const btn = page.getByRole("button", { name: /menu/i });
console.log("closed:", await btn.getAttribute("aria-expanded"));
await btn.click();
await page.waitForTimeout(500);
console.log("opened:", await btn.getAttribute("aria-expanded"),
  "| links:", await page.locator("#mobile-nav a").count(),
  "| visible:", await page.locator("#mobile-nav").isVisible());
await page.screenshot({ path: ".shots/mobile-nav.png" });

await page.keyboard.press("Escape");
await page.waitForTimeout(500);
console.log("after Escape:", await btn.getAttribute("aria-expanded"),
  "| focus back on trigger:", await btn.evaluate((el) => el === document.activeElement));

await btn.click();
await page.waitForTimeout(400);
await page.locator("#mobile-nav a", { hasText: "Answers" }).click();
await page.waitForTimeout(900);
console.log("after link click, url:", new URL(page.url()).pathname,
  "| panel closed:", await btn.getAttribute("aria-expanded"));
await browser.close();
