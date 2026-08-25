import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(process.env.W||390), height: 844 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
const list = await p.locator("ul:has(#svc-button-personal-care)").boundingBox();
await p.evaluate((y) => scrollTo({ top: y - 500, behavior: "instant" }), list.y);
await p.waitForTimeout(1200);

/* Did any row collapse while still on screen? That is the thing that looked
   wrong, so measure it directly. */
await p.evaluate((n) => { window.__steps = n; }, +(process.env.STEPS || 600));
const r = await p.evaluate(async () => {
  const state = new Map();
  const violations = [];
  const opened = new Set();
  let maxOpen = 0;
  const STEPS = Number(window.__steps || 600);
  for (let i = 0; i < STEPS; i++) {
    window.scrollBy({ top: 8, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 12));
    let openCount = 0;
    for (const li of document.querySelectorAll("li[data-slug]")) {
      const slug = li.dataset.slug;
      const isOpen = li.querySelector("button").getAttribute("aria-expanded") === "true";
      if (isOpen) { openCount++; opened.add(slug); }
      const box = li.getBoundingClientRect();
      const onScreen = box.bottom > 0 && box.top < innerHeight;
      const was = state.get(slug);
      if (was === true && !isOpen && onScreen) {
        violations.push({ slug, top: Math.round(box.top), bottom: Math.round(box.bottom) });
      }
      state.set(slug, isOpen);
    }
    maxOpen = Math.max(maxOpen, openCount);
  }
  const last = document.querySelector("li[data-slug]:last-child").getBoundingClientRect();
  return { violations, opened: [...opened], maxOpen, reachedEnd: last.bottom < innerHeight };
});
console.log("rows that closed while still visible:", r.violations.length);
if (r.violations.length) console.log(JSON.stringify(r.violations.slice(0, 5)));
console.log("rows that opened during the pass:", r.opened.length, "of 6");
console.log("most open at once:", r.maxOpen);
console.log("reached end of list:", r.reachedEnd);
await b.close();
