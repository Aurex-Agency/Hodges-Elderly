import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(process.env.W||390), height: 844 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 500, behavior: "instant" }), list.y);
await p.waitForTimeout(1400);

const log = await p.evaluate(async () => {
  const out = [];
  let lastPair = "";
  for (let i = 0; i < 600; i++) {
    window.scrollBy({ top: 10, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 14));
    const line = innerHeight / 2;
    const rows = [...document.querySelectorAll("li[data-slug]")];
    const shouldBe = rows.find((r) => {
      const b = r.getBoundingClientRect();
      return b.top <= line && b.bottom >= line;
    })?.dataset.slug || "(none)";
    const isOpen = rows.find((r) =>
      r.querySelector("button").getAttribute("aria-expanded") === "true"
    )?.dataset.slug || "(none)";
    const pair = shouldBe + "|" + isOpen;
    if (pair !== lastPair) {
      out.push({ i, y: Math.round(scrollY), shouldBe: shouldBe.slice(0,14), isOpen: isOpen.slice(0,14) });
      lastPair = pair;
    }
  }
  return out;
});
for (const r of log) console.log(`i=${String(r.i).padStart(3)} y=${String(r.y).padStart(6)}  line-over: ${r.shouldBe.padEnd(15)} open: ${r.isOpen}`);
await b.close();
