import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(process.env.BASE + "/", { waitUntil: "networkidle" });
console.log(JSON.stringify(await p.evaluate(() => {
  const inner = document.querySelector("header").firstElementChild;
  const kids = [...inner.children].map(c => ({ cls: c.className.slice(0,30), w: Math.round(c.getBoundingClientRect().width) }));
  const sub = document.querySelector("header span span span:last-child");
  return { innerClient: inner.clientWidth, innerScroll: inner.scrollWidth, kids,
           subW: sub ? Math.round(sub.getBoundingClientRect().width) : null };
}), null, 1));
await b.close();
