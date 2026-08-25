import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

/* Renders the email templates so they can be looked at before they are
 * sent to anybody. Email HTML fails in ways that only show up visually,
 * and "it compiled" is not evidence that it renders.
 *
 *   node scripts/email-preview.mjs
 */
const { ownerEmail, confirmationEmail } = await import("../src/lib/email-template.ts");

mkdirSync(".shots", { recursive: true });
const b = await chromium.launch();

const CASES = [
  ["email-owner-enquiry", ownerEmail({
    kind: "enquiry",
    name: "Denise Carter",
    phone: "662-555-0147",
    fields: [
      { label: "Email", value: "denise.carter@example.com" },
      { label: "Town", value: "Pontotoc" },
    ],
    message: {
      label: "What is going on",
      value: "Mama is 84 and living on her own since Daddy passed.\nShe fell in June and has stopped getting in the shower. I am two hours away in Memphis and I am not sleeping.\n\nWe need somebody a few mornings a week to start with.",
    },
  })],
  ["email-owner-application", ownerEmail({
    kind: "application",
    name: "Marcus Bell",
    phone: "662-555-0900",
    fields: [
      { label: "Email", value: "marcus.bell@example.com" },
      { label: "Town", value: "New Albany" },
      { label: "Availability", value: "Weekdays and every other weekend" },
    ],
    message: { label: "Experience", value: "Six years as a CNA in a nursing home in Tupelo. Two years before that supporting an adult with autism." },
  })],
  ["email-confirm-enquiry", confirmationEmail({
    kind: "enquiry", name: "Denise Carter", phone: "662-555-0147", town: "Pontotoc",
  })],
  ["email-confirm-application", confirmationEmail({
    kind: "application", name: "Marcus Bell", phone: "662-555-0900", town: "New Albany",
  })],
  /* The awkward ones: no phone, no town, one-word name. */
  ["email-owner-minimal", ownerEmail({
    kind: "enquiry", name: "Jo", phone: "", fields: [], message: undefined,
  })],
];

for (const [name, html] of CASES) {
  writeFileSync(`.shots/${name}.html`, html);
  for (const [w, suffix] of [[700, ""], [380, "-m"]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    await p.setContent(html, { waitUntil: "networkidle" });
    await p.waitForTimeout(250);
    await p.screenshot({ path: `.shots/${name}${suffix}.png`, fullPage: true });
    await p.close();
  }
  console.log("  ", name);
}
await b.close();
console.log("previews in .shots/");
