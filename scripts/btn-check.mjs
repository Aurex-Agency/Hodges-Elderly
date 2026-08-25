import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const a = document.querySelector('a[href^="tel:"]');
  return { text: JSON.stringify(a.textContent), html: a.innerHTML.replace(/<svg[\s\S]*?<\/svg>/, "[svg]") };
});
console.log(r.text);
console.log(r.html);
await b.close();
