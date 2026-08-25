import { chromium } from "playwright";
import { readFileSync } from "fs";
/* Pixel comparison of the tint before and after the fill-rate change.
 * A performance fix that alters the design is not a performance fix. */
const browser = await chromium.launch();
const page = await browser.newPage();
for (const p of [0, 1400, 2800, 4200, 5600, 7000]) {
  const a = readFileSync(`.shots/tint-before-${p}.png`).toString("base64");
  const b = readFileSync(`.shots/tint-after-${p}.png`).toString("base64");
  const r = await page.evaluate(async ([a, b]) => {
    const load = (d) => new Promise((res) => {
      const i = new Image(); i.onload = () => res(i); i.src = "data:image/png;base64," + d;
    });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const draw = (img) => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      return c.getContext("2d").getImageData(0, 0, img.width, img.height).data;
    };
    const da = draw(ia), db = draw(ib);
    let maxD = 0, sum = 0, over8 = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i]-db[i]), Math.abs(da[i+1]-db[i+1]), Math.abs(da[i+2]-db[i+2]));
      maxD = Math.max(maxD, d); sum += d; if (d > 8) over8++;
    }
    const n = da.length / 4;
    return { maxDelta: maxD, meanDelta: +(sum / n).toFixed(2), pctOver8: +(over8 / n * 100).toFixed(2) };
  }, [a, b]);
  console.log(`scrollY ${String(p).padEnd(5)} maxDelta ${String(r.maxDelta).padStart(3)}/255  mean ${String(r.meanDelta).padStart(5)}  pixels >8 differing: ${r.pctOver8}%`);
}
await browser.close();
