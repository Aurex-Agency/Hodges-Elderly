import { chromium } from "playwright";
import { writeFileSync } from "fs";

/* Generates the favicon set and the Open Graph share image.
 *
 * Rendered in a real browser and committed as static files rather than
 * built at runtime with ImageResponse/satori. Satori supports a subset of
 * CSS and needs fonts hand-fed as buffers; a real browser gives the actual
 * Merriweather, real gradients, and something that can be looked at before
 * it ships. These are brand assets that change about once a year, so a
 * build-time cost every request would be paying rent on nothing.
 *
 * Re-run with: node scripts/social-assets.mjs
 */

const PINK = "#c250b2";
const PINK_TEXT = "#a83896";
const GREEN = "#1a6347";
const INK = "#14171a";
const INK_SOFT = "#454d52";

/* Her H, lifted from Logo.tsx so this is the same letter, not a second
 * slightly different one. */
const H = (cx, cy, w, h, stem, bar, lift) => {
  const L = cx - w / 2, R = cx + w / 2, T = cy - h / 2, B = cy + h / 2;
  const L2 = L + stem, R2 = R - stem;
  const CT = cy - bar / 2 - lift, CB = cy + bar / 2 - lift;
  return `M ${L} ${T} L ${L2} ${T} L ${L2} ${CT} L ${R2} ${CT} L ${R2} ${T} L ${R} ${T} L ${R} ${B} L ${R2} ${B} L ${R2} ${CB} L ${L2} ${CB} L ${L2} ${B} L ${L} ${B} Z`;
};

/* Pink tile, white H. Tested against three alternatives at 16px, which is
 * the size that actually decides a favicon: her real lockup (white ground,
 * green frame, pink H) turns to mud at that size because the frame eats
 * the letter. A solid tile keeps the H legible and leads with the colour
 * people recognise her by. */
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${PINK}"/><path d="${H(32, 32, 32, 36, 10, 9, 1)}" fill="#ffffff"/></svg>`;

const PETAL = "M 0 0 C -44 -16, -54 -60, -36 -92 C -23 -114, 23 -114, 36 -92 C 54 -60, 44 -16, 0 0 Z";
const CREASE = "M 0 -10 C -6 -42, -5 -74, 0 -96";
const LEAF = "M 0 0 C -34 -52, -36 -128, 0 -178 C 36 -128, 34 -52, 0 0 Z";
const BACK_WHORL = [4, 61, 122, 178, 241, 299];
const FRONT_WHORL = [32, 119, 208, 295];
const LEAVES = [[18, 1.0], [74, 0.86], [140, 0.94], [206, 0.8], [262, 0.9], [318, 0.84]];

const bloom = (scale) => `
<g transform="scale(${scale})">
  ${LEAVES.map(([a, s]) => `<g transform="rotate(${a}) scale(${s})"><path d="${LEAF}" fill="#1d5240" opacity="0.95"/></g>`).join("")}
  ${BACK_WHORL.map((a) => `<g transform="rotate(${a})"><path d="${PETAL}" fill="#eef1ec"/><path d="${CREASE}" stroke="#d6ddd4" stroke-width="1.6" fill="none"/></g>`).join("")}
  ${FRONT_WHORL.map((a) => `<g transform="rotate(${a}) scale(0.78)"><path d="${PETAL}" fill="#ffffff"/><path d="${CREASE}" stroke="#e2e7df" stroke-width="1.8" fill="none"/></g>`).join("")}
  <circle r="15" fill="#b8862b"/>
</g>`;

const ogHtml = ({ heading, kicker, eyebrow }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;font-family:Merriweather,Georgia,serif;background:#fff;position:relative;overflow:hidden}
  /* The same colour wash the site itself scrolls through, so the card and
     the page it opens feel like one thing. */
  .wash{position:absolute;inset:0}
  .wash i{position:absolute;display:block;border-radius:50%}
  .b1{width:760px;height:620px;left:-150px;top:-210px;background:radial-gradient(closest-side, ${PINK}2e, transparent)}
  .b2{width:700px;height:560px;right:-90px;bottom:-200px;background:radial-gradient(closest-side, ${GREEN}26, transparent)}
  .b3{width:520px;height:430px;left:380px;bottom:-180px;background:radial-gradient(closest-side, #86620f22, transparent)}
  .bar{position:absolute;left:0;right:0;top:0;height:9px;
       background:linear-gradient(90deg,${PINK},#86620f,#145c66,#9a4420,${GREEN},#7b2c4e)}
  .wrap{position:relative;padding:64px 72px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .lock{display:flex;align-items:center;gap:20px}
  .name{font-weight:700;font-size:40px;color:${PINK};line-height:1;letter-spacing:-.01em}
  .desc{font-weight:700;font-size:16px;color:${GREEN};letter-spacing:.09em;text-transform:uppercase;margin-top:9px}
  h1{font-weight:700;font-size:var(--h1,72px);line-height:1.09;color:${INK};letter-spacing:-.02em;max-width:830px}
  .eyebrow{font-weight:700;font-size:17px;color:${GREEN};letter-spacing:.16em;text-transform:uppercase;margin-bottom:20px}
  h1 span{color:${PINK_TEXT};display:block}
  .foot{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;position:relative}
  .where{font-size:22px;color:${INK_SOFT};line-height:1.5;max-width:640px}
  .phone{display:inline-flex;align-items:center;gap:14px;background:${PINK_TEXT};color:#fff;
         font-weight:700;font-size:30px;padding:19px 32px;border-radius:12px;white-space:nowrap}
  .mag{position:absolute;right:-118px;top:78px;width:474px;height:474px;opacity:.97}
</style></head><body>
  <div class="wash"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
  <div class="bar"></div>
  <svg class="mag" viewBox="-260 -260 520 520"><g transform="rotate(-14)">${bloom(1.28)}</g></svg>
  <div class="wrap">
    <div class="lock">
      <svg width="86" height="86" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${PINK}"/><path d="${H(32, 32, 32, 36, 10, 9, 1)}" fill="#fff"/></svg>
      <div>
        <div class="name">Hodges</div>
        <div class="desc">Elderly &amp; Disable Services</div>
      </div>
    </div>
    <div>
      ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
      <h1>${heading}</h1>
    </div>
    <div class="foot">
      <div class="where">${kicker}</div>
      <div class="phone">662-788-2032</div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();

/* --- Favicons --- */
writeFileSync("src/app/icon.svg", ICON_SVG);

const iconPage = await browser.newPage({ viewport: { width: 64, height: 64 } });
const pngAt = async (size) => {
  await iconPage.setViewportSize({ width: size, height: size });
  await iconPage.setContent(
    `<body style="margin:0">${ICON_SVG.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body>`,
  );
  return iconPage.screenshot({ omitBackground: true });
};

writeFileSync("src/app/apple-icon.png", await pngAt(180));

/* A real .ico, so /favicon.ico is not a 404 for older clients and for the
 * various crawlers that still ask for it by that exact path. ICO has
 * allowed embedded PNG since Vista, which means no BMP encoder is needed:
 * a 6-byte header, one 16-byte directory entry per size, then the PNGs. */
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await pngAt(s));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved
header.writeUInt16LE(1, 2);            // 1 = icon
header.writeUInt16LE(sizes.length, 4); // image count

let offset = 6 + 16 * sizes.length;
const dir = [];
pngs.forEach((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); // width
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); // height
  e.writeUInt8(0, 2);                  // palette count
  e.writeUInt8(0, 3);                  // reserved
  e.writeUInt16LE(1, 4);               // colour planes
  e.writeUInt16LE(32, 6);              // bits per pixel
  e.writeUInt32LE(png.length, 8);      // byte size
  e.writeUInt32LE(offset, 12);         // offset from file start
  offset += png.length;
  dir.push(e);
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...dir, ...pngs]));
await iconPage.close();

/* --- Open Graph cards --- */

/* JPEG, not PNG. The same card is 319KB as a PNG and 24KB as a quality-92
 * JPEG, and this is a soft gradient behind large type, which is exactly
 * what JPEG is good at. Thirteen times smaller matters when there is one
 * per guide and every scraper fetches them. */
async function card(path, opts, fontSize) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(ogHtml(opts), { waitUntil: "networkidle" });
  if (fontSize) await page.evaluate((v) => document.body.style.setProperty("--h1", v), fontSize);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path, type: "jpeg", quality: 92 });
  await page.close();
  console.log("  ", path);
}

const HOME = {
  heading: "You can&rsquo;t be there<br>every day.<span>We can.</span>",
  kicker: "In-home care for aging parents across Lee, Pontotoc, Union, Chickasaw, Monroe, Lafayette and Itawamba counties.",
  eyebrow: "",
};
await card("src/app/opengraph-image.jpg", HOME);
await card("src/app/twitter-image.jpg", HOME);

/* One per guide, carrying its own headline. These are the pages built to
 * be shared, and a generic card on all five wastes the only line of copy a
 * reader sees before deciding whether to click. */
const { guides } = await import("../src/lib/guides.ts");

for (const g of guides) {
  /* Headlines vary a lot in length. Step the size down rather than letting
   * a long one overflow the card or a short one look lost. */
  const n = g.title.length;
  const size = n > 62 ? "50px" : n > 48 ? "56px" : "64px";
  await card(
    `src/app/guides/${g.slug}/opengraph-image.jpg`,
    { heading: g.title, kicker: g.description, eyebrow: g.category },
    size,
  );
  writeFileSync(
    `src/app/guides/${g.slug}/opengraph-image.alt.txt`,
    `${g.title}. A guide from Hodges Elderly and Disable Services, in-home care in North Mississippi. ${g.description}`,
  );
}
await browser.close();
console.log("wrote icon.svg, apple-icon.png, favicon.ico, opengraph-image.png, twitter-image.png");
