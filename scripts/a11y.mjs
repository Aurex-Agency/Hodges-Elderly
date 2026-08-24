import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE ?? "http://localhost:55843";
const ROUTES = [
  "/", "/about", "/services", "/services/personal-care", "/service-area",
  "/in-home-care/tupelo", "/paying-for-care", "/answers", "/careers", "/contact",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let total = 0;
for (const route of ROUTES) {
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  if (violations.length) {
    total += violations.length;
    console.log(`\n${route}`);
    for (const v of violations) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(" ")}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(total === 0 ? "\nNo axe violations across " + ROUTES.length + " routes." : `\n${total} violation types found.`);
