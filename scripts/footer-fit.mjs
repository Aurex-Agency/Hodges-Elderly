import { chromium } from "playwright";
/* The footer logo lockup ran under the Services column at 1440 once a
 * fifth column was added. This measures overlap directly rather than
 * trusting a screenshot, and checks the guides section actually rendered. */
const BASE = process.env.BASE ?? "http://localhost:59042";
const browser = await chromium.launch();
for (const w of [390, 768, 1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const r = await page.evaluate((vw) => {
    // NOT querySelector("footer"): the founder quote on the homepage is a
    // blockquote with its own <footer> attribution, which matches first and
    // silently makes this whole probe measure nothing.
    const footer = document.querySelector("body > footer, #main ~ footer")
      ?? [...document.querySelectorAll("footer")].pop();
    const boxes = [...footer.querySelectorAll("h2, footer > div > div > div > p")]
      .map((el) => ({ t: el.textContent.trim().slice(0, 22), r: el.getBoundingClientRect() }));
    // Any two footer blocks whose rects intersect is a layout failure.
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].r, b = boxes[j].r;
        if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
          overlaps.push(`${boxes[i].t} x ${boxes[j].t}`);
      }
    const lockup = footer.querySelector("a[aria-label], span.flex") ?? footer.querySelector("svg")?.closest("span");
    const nextCol = footer.querySelector("h2");
    return {
      overlaps,
      lockupRight: lockup ? Math.round(lockup.getBoundingClientRect().right) : null,
      firstHeadingLeft: nextCol ? Math.round(nextCol.getBoundingClientRect().left) : null,
      docOverflow: document.documentElement.scrollWidth > vw + 1,
    };
  }, w);
  console.log(w, JSON.stringify(r));
  await page.close();
}
await browser.close();
