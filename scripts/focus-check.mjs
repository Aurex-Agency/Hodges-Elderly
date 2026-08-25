import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const collapsed = [...document.querySelectorAll('[id^="svc-panel-"]')]
    .filter((x) => x.hasAttribute("inert"));
  const link = collapsed[0]?.querySelector("a");
  if (!link) return { note: "no collapsed link found" };
  link.focus();
  return {
    triedToFocus: link.textContent.trim().slice(0, 30),
    actuallyFocused: document.activeElement === link,
    activeElement: document.activeElement.tagName + "#" + (document.activeElement.id || ""),
  };
});
console.log(JSON.stringify(r, null, 1));

// Tab from the first service button and see where focus lands.
await p.locator("#svc-button-personal-care").focus();
const seq = [];
for (let i = 0; i < 4; i++) {
  await p.keyboard.press("Tab");
  seq.push(await p.evaluate(() => {
    const a = document.activeElement;
    const panel = a.closest('[id^="svc-panel-"]');
    return (a.id || a.tagName) + (panel ? ` [inside ${panel.id}, inert=${panel.hasAttribute("inert")}]` : "");
  }));
}
console.log("tab order from first row:", seq.join("  ->  "));
await b.close();
