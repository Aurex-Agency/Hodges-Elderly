import { chromium } from "playwright";

/* Verifies the analytics actually fire, by intercepting the requests GA
 * sends rather than trusting that the code looks right. Blocks the real
 * gtag script and installs a stub, so nothing reaches Google during a test
 * and every event can be inspected. */
const BASE = process.env.BASE ?? "https://hodgeselderlyanddisable.com";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });

await p.route("**/googletagmanager.com/**", (r) => r.abort());
/* Do NOT stub window.gtag. The inline init script defines its own gtag and
 * overwrites any stub, which is exactly what happened the first time this
 * ran and made it look like nothing fired. Read dataLayer instead, which is
 * where gtag actually puts everything, and just block the remote script so
 * nothing reaches Google. */
await p.addInitScript(() => {
  window.__mark = 0;
});

const dump = async (label) => {
  const ev = await p.evaluate(() => {
    const dl = window.dataLayer ?? [];
    const out = dl.slice(window.__mark ?? 0).map((a) => Array.from(a));
    window.__mark = dl.length;
    return out;
  });
  console.log(`\n[${label}]`);
  if (!ev.length) { console.log("   (no events)"); return; }
  for (const e of ev) console.log("   " + JSON.stringify(e));
};

await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await dump("initial load");

// Client-side navigation: the case a pasted snippet would miss entirely.
await p.click('a[href="/services"]');
await p.waitForTimeout(1400);
await dump("client-side nav to /services");

await p.click('a[href="/guides"]').catch(async () => {
  await p.goto(BASE + "/guides", { waitUntil: "networkidle" });
});
await p.waitForTimeout(1400);
await dump("nav to /guides");

// Click to call, from the header.
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(1000);
await p.evaluate(() => { window.__mark = (window.dataLayer ?? []).length; });
await p.evaluate(() => {
  // Click the icon inside the button, not the anchor, to prove closest() works.
  const svg = document.querySelector('header a[href^="tel:"] svg');
  (svg ?? document.querySelector('header a[href^="tel:"]')).dispatchEvent(
    new MouseEvent("click", { bubbles: true }),
  );
});
await p.waitForTimeout(400);
await dump("click the icon inside the header call button");

// Footer phone link.
await p.evaluate(() => {
  document.querySelector('footer a[href^="tel:"]')
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
await p.waitForTimeout(400);
await dump("footer phone link");

/* Form submission.
 *
 * Guarded, because this genuinely submits: running it against production
 * puts a real email in the owner's inbox. It did exactly that once. The
 * page_view and click_to_call checks are safe anywhere; only this part
 * needs a local server, or an explicit ALLOW_LIVE_SUBMIT=1 if you really
 * mean it. */
const isProd = /hodgeselderlyanddisable\.com/.test(BASE);
if (isProd && process.env.ALLOW_LIVE_SUBMIT !== "1") {
  console.log("\n[form submit] SKIPPED against production.");
  console.log("   Run against a local server, or set ALLOW_LIVE_SUBMIT=1 to send a real enquiry.");
  await b.close();
  process.exit(0);
}

// Form submission.
await p.goto(BASE + "/contact", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
await p.evaluate(() => { window.__mark = (window.dataLayer ?? []).length; });
await p.fill("#f-name", "GA Check");
await p.fill("#f-phone", "662-555-0000");
await p.fill("#f-message", "Checking the lead event fires.");
await p.click('button[type="submit"]');
await p.waitForTimeout(4000);
const ok = await p.evaluate(() => !!document.querySelector('[role="status"]'));
console.log(`\n   form reported: ${ok ? "SUCCESS" : "ERROR"}`);
await dump("after form submit");

await b.close();
