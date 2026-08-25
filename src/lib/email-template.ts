import { site } from "./site";

/* HTML email templates.
 *
 * Email HTML is not web HTML. Outlook renders through Word, Gmail strips
 * <style> blocks in some contexts, and flexbox and grid are unreliable
 * everywhere that matters. So: tables for layout, inline styles only, and
 * a 600px shell. Nothing here is clever, on purpose.
 *
 * No images. The mark is drawn as a styled table cell rather than a file,
 * because most clients block remote images by default and a logo that
 * shows as a grey box is worse than no logo. It also means these render
 * fully offline and cost nothing to load.
 *
 * Merriweather is not available in email, so the stack falls back to
 * Georgia, which is the closest thing on almost every machine and keeps
 * the same bookish feel as the site.
 */

const PINK = "#a83896";
const GREEN = "#1a6347";
const INK = "#14171a";
const INK_SOFT = "#454d52";
const INK_FAINT = "#667079";
const RULE = "#dde4df";
const WASH = "#fbeff8";
const FONT = "Merriweather, Georgia, 'Times New Roman', serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;");

/* Turn newlines into real breaks so a paragraph someone typed does not
 * arrive as one run-on line. */
const para = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

/* The H mark, as a table cell. Same pink tile and white letter as the
 * favicon, which is the point: it should be the same thing they saw in
 * the browser tab. */
const mark = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate">
  <tr><td width="40" height="40" align="center" valign="middle"
      style="width:40px;height:40px;background:${PINK};border-radius:8px;
             font-family:${FONT};font-size:22px;font-weight:bold;color:#ffffff;
             line-height:40px;text-align:center">H</td></tr>
</table>`;

function shell(bodyRows: string, footNote: string) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(site.name)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f5f3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f5f3;">
<tr><td align="center" style="padding:28px 14px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
         style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${RULE};border-radius:12px;overflow:hidden;">

    <tr><td style="height:6px;line-height:6px;font-size:0;
        background:${PINK};">&nbsp;</td></tr>

    <tr><td style="padding:26px 32px 0 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle">${mark}</td>
        <td valign="middle" style="padding-left:13px;font-family:${FONT};">
          <div style="font-size:19px;font-weight:bold;color:${PINK};line-height:1.1;">Hodges</div>
          <div style="font-size:10px;font-weight:bold;color:${GREEN};letter-spacing:1.3px;
                      text-transform:uppercase;padding-top:4px;">Elderly &amp; Disable Services</div>
        </td>
      </tr></table>
    </td></tr>

    ${bodyRows}

    <tr><td style="padding:8px 32px 30px 32px;">
      <div style="border-top:1px solid ${RULE};padding-top:18px;
                  font-family:${FONT};font-size:13px;line-height:1.6;color:${INK_FAINT};">
        ${footNote}
      </div>
    </td></tr>
  </table>

  <div style="font-family:${FONT};font-size:12px;color:${INK_FAINT};padding-top:16px;">
    ${esc(site.name)} &middot; ${esc(site.address.city)}, ${esc(site.address.state)}
  </div>

</td></tr></table>
</body></html>`;
}

/* A big, tappable phone button. On a care enquiry the single most likely
 * next action is ringing the person back, and on a phone that should be
 * one tap, not a copy and paste. */
const callButton = (number: string, label: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td align="center" style="background:${PINK};border-radius:10px;">
    <a href="tel:${number.replace(/[^0-9+]/g, "")}"
       style="display:inline-block;padding:15px 28px;font-family:${FONT};font-size:18px;
              font-weight:bold;color:#ffffff;text-decoration:none;">${esc(label)}</a>
  </td>
</tr></table>`;

const row = (label: string, value: string, last = false) => `
<tr>
  <td style="padding:11px 0;${last ? "" : `border-bottom:1px solid ${RULE};`}font-family:${FONT};
             font-size:12px;font-weight:bold;letter-spacing:1.1px;text-transform:uppercase;
             color:${GREEN};width:34%;vertical-align:top;">${esc(label)}</td>
  <td style="padding:11px 0;${last ? "" : `border-bottom:1px solid ${RULE};`}font-family:${FONT};
             font-size:16px;color:${INK};vertical-align:top;">${value}</td>
</tr>`;

/* ---------- What Aaliyah receives ---------- */

export function ownerEmail({
  kind,
  name,
  phone,
  fields,
  message,
}: {
  kind: "enquiry" | "application";
  name: string;
  phone: string;
  fields: { label: string; value: string }[];
  message?: { label: string; value: string };
}) {
  const heading = kind === "enquiry" ? "New enquiry" : "New caregiver application";
  const tel = phone.replace(/[^0-9+]/g, "");

  const body = `
    <tr><td style="padding:24px 32px 0 32px;font-family:${FONT};">
      <div style="font-size:12px;font-weight:bold;letter-spacing:1.6px;
                  text-transform:uppercase;color:${GREEN};">${esc(heading)}</div>
      <div style="font-size:30px;font-weight:bold;color:${INK};line-height:1.2;padding-top:9px;">
        ${esc(name)}
      </div>
      ${phone ? `<div style="font-size:17px;color:${INK_SOFT};padding-top:7px;">
        <a href="tel:${tel}" style="color:${PINK};text-decoration:none;font-weight:bold;">${esc(phone)}</a>
      </div>` : ""}
    </td></tr>

    ${phone ? `<tr><td style="padding:22px 32px 0 32px;">
      ${callButton(phone, `Call ${name.split(" ")[0] || "them"} back`)}
    </td></tr>` : ""}

    ${message ? `<tr><td style="padding:26px 32px 0 32px;">
      <div style="background:${WASH};border-left:4px solid ${PINK};border-radius:0 8px 8px 0;
                  padding:18px 20px;font-family:${FONT};">
        <div style="font-size:12px;font-weight:bold;letter-spacing:1.1px;text-transform:uppercase;
                    color:${GREEN};padding-bottom:8px;">${esc(message.label)}</div>
        <div style="font-size:17px;line-height:1.65;color:${INK};">${para(message.value)}</div>
      </div>
    </td></tr>` : ""}

    ${fields.length ? `<tr><td style="padding:24px 32px 0 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${fields.map((f, i) => row(f.label, esc(f.value), i === fields.length - 1)).join("")}
      </table>
    </td></tr>` : ""}
  `;

  return shell(
    body,
    `Sent from the contact form on <a href="${site.url}" style="color:${INK_FAINT};">${esc(site.url.replace("https://", ""))}</a>. Reply to this email to answer them directly.`,
  );
}

/* ---------- What the person who filled the form receives ---------- */

export function confirmationEmail({
  kind,
  name,
  phone,
  town,
}: {
  kind: "enquiry" | "application";
  name: string;
  phone: string;
  town?: string;
}) {
  const first = name.split(" ")[0] || "there";

  const lead =
    kind === "enquiry"
      ? `We have your message and somebody will call you back${phone ? ` on <strong style="color:${INK};">${esc(phone)}</strong>` : ""}. You will be speaking to ${esc(site.founder)}, who owns the agency, not a call center.`
      : `We have your application and ${esc(site.founder)} will be in touch${phone ? ` on <strong style="color:${INK};">${esc(phone)}</strong>` : ""}.`;

  const body = `
    <tr><td style="padding:24px 32px 0 32px;font-family:${FONT};">
      <div style="font-size:12px;font-weight:bold;letter-spacing:1.6px;
                  text-transform:uppercase;color:${GREEN};">We got it</div>
      <div style="font-size:29px;font-weight:bold;color:${INK};line-height:1.25;padding-top:9px;">
        Thank you, ${esc(first)}.
      </div>
      <div style="font-size:17px;line-height:1.7;color:${INK_SOFT};padding-top:14px;">
        ${lead}
      </div>
    </td></tr>

    ${kind === "enquiry" ? `<tr><td style="padding:22px 32px 0 32px;font-family:${FONT};">
      <div style="font-size:17px;line-height:1.7;color:${INK_SOFT};">
        There is nothing you need to do in the meantime. When we speak, we will
        ask what a normal day looks like and what has changed lately. There is
        no script and no obligation at the end of it.
      </div>
    </td></tr>` : ""}

    <tr><td style="padding:24px 32px 0 32px;">
      <div style="background:${WASH};border-radius:10px;padding:20px 22px;font-family:${FONT};">
        <div style="font-size:17px;line-height:1.6;color:${INK};padding-bottom:14px;">
          If something changes, or you would rather just talk now, call us.
        </div>
        ${callButton(site.phone, `Call ${site.phone}`)}
      </div>
    </td></tr>

    ${(phone || town) ? `<tr><td style="padding:24px 32px 0 32px;">
      <div style="font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1.1px;
                  text-transform:uppercase;color:${GREEN};padding-bottom:4px;">What you sent us</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${phone ? row("Phone", esc(phone), !town) : ""}
        ${town ? row("Town", esc(town), true) : ""}
      </table>
      <div style="font-family:${FONT};font-size:13px;line-height:1.6;color:${INK_FAINT};padding-top:11px;">
        If that number is wrong, reply to this email and tell us the right one.
      </div>
    </td></tr>` : ""}
  `;

  return shell(
    body,
    `You are getting this because you filled in the form on <a href="${site.url}" style="color:${INK_FAINT};">${esc(site.url.replace("https://", ""))}</a>. You have not been added to any mailing list. Replies go straight to ${esc(site.email ?? "us")}.`,
  );
}
