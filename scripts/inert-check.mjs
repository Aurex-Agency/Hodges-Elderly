import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(() => {
  const panels = [...document.querySelectorAll('[id^="svc-panel-"]')];
  const closed = panels.filter((x) => x.hasAttribute("inert"));
  // Links inside a collapsed panel must not be reachable.
  const reachable = closed.flatMap((x) => [...x.querySelectorAll("a")])
    .filter((a) => {
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length;
  return {
    panels: panels.length,
    collapsedWithInert: closed.length,
    focusableInsideCollapsed: reachable,
    collapsedHeights: closed.map((x) => x.getBoundingClientRect().height),
  };
}), null, 1));
await b.close();
