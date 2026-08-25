import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(() => {
  const wrap = document.querySelector(".fixed.inset-0.-z-10");
  const layers = wrap ? [...wrap.children] : [];
  return {
    wrapperPresent: !!wrap,
    layerCount: layers.length,
    firstOpacity: layers[0] ? getComputedStyle(layers[0]).opacity : null,
    firstBg: layers[0] ? getComputedStyle(layers[0]).backgroundImage.slice(0, 90) : null,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    htmlBg: getComputedStyle(document.documentElement).backgroundColor,
    progressBar: !!document.querySelector(".fixed.left-0.right-0.top-0"),
  };
}), null, 1));
await b.close();
