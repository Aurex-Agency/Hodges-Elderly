import { confirmationEmail, ownerEmail } from "./email-template";
import { site } from "./site";

/* Lead delivery.
 *
 * Deliberately a plain fetch against Resend's REST API rather than their
 * SDK. It is one POST, the project has three runtime dependencies and is
 * better for staying that way, and keeping the provider behind this one
 * function means swapping it later is a single file.
 *
 * Configuration, all via environment:
 *   RESEND_API_KEY  required, or nothing sends
 *   LEAD_TO         who receives enquiries. Defaults to the site email.
 *   LEAD_FROM       the From header. MUST be a Resend-verified domain.
 *
 * On the From address: the root domain's MX records point at Proofpoint,
 * so her real mailbox is already hosted elsewhere. Verifying the ROOT
 * domain with a sending provider means editing the existing SPF record,
 * and an SPF record that gets replaced rather than merged silently breaks
 * her actual email. Verify a SUBDOMAIN instead, which is what the provider
 * recommends and which leaves her mail flow completely untouched:
 *
 *   LEAD_FROM="Hodges Website <website@team.hodgeselderlyanddisable.com>"
 */

/* Overridable only so the send path can be exercised against a local mock
 * in development. Unset in production, where it must be the real API. */
const API = process.env.LEAD_API_URL ?? "https://api.resend.com/emails";

/* Resend rejects the whole send with a 422 if reply_to is not a valid
 * address, and the email field on both forms is OPTIONAL. So anyone who
 * typed a phone number, "n/a", or a plain typo into it lost their entire
 * enquiry and saw "we could not send that just now".
 *
 * Deliberately permissive: this is not trying to decide whether an address
 * is real, only whether handing it to the provider will blow up the send.
 * Anything that fails is simply not used as reply_to. The raw value the
 * person typed still goes in the body, so nothing they told us is lost and
 * she can see the typo and correct it herself. */
function usableReplyTo(value: string | undefined) {
  if (!value) return undefined;
  const v = value.trim();
  return /^[^\s@<>,;]+@[^\s@<>,;.]+\.[^\s@<>,;]+$/.test(v) ? v : undefined;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "failed" };

/* The one place that talks to the provider. */
async function send(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<LeadResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "unconfigured" };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from,
        to: [payload.to],
        subject: payload.subject,
        /* Both parts, always. HTML for the ninety-odd percent of clients
         * that render it, and a real plain-text alternative rather than an
         * auto-stripped one, because text/plain is what shows up in
         * notification previews and in the clients that refuse HTML. */
        html: payload.html,
        text: payload.text,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[mail] send failed", res.status, await res.text());
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mail] send threw", err);
    return { ok: false, reason: "failed" };
  }
}

/* ---------- To Aaliyah ---------- */

export async function sendLead({
  kind,
  subject,
  name,
  phone,
  fields,
  message,
  replyTo,
}: {
  kind: "enquiry" | "application";
  subject: string;
  name: string;
  phone: string;
  fields: { label: string; value: string }[];
  message?: { label: string; value: string };
  replyTo?: string;
}): Promise<LeadResult> {
  const from = process.env.LEAD_FROM;
  const to = process.env.LEAD_TO ?? site.email;
  if (!from || !to) return { ok: false, reason: "unconfigured" };

  const text = [
    message ? `${message.label}:\n${message.value}` : null,
    ...fields.map((f) => `${f.label}:\n${f.value}`),
    "",
    "----",
    `Sent from ${site.url}`,
  ]
    .filter((x): x is string => x !== null)
    .join("\n\n");

  return send({
    from,
    to,
    subject,
    html: ownerEmail({ kind, name, phone, fields, message }),
    text,
    replyTo: usableReplyTo(replyTo),
  });
}

/* ---------- To the person who filled the form ---------- */

/* Best effort, and deliberately separate from the lead itself.
 *
 * If this fails, the submission has still succeeded: Aaliyah has the
 * enquiry and that is the part that matters. Nobody should be told their
 * message did not go through because a courtesy receipt bounced.
 *
 * Only sent when they gave an address that will not blow up the send. The
 * email field is optional on both forms, so most of the time there is
 * simply nobody to confirm to. */
export async function sendConfirmation({
  kind,
  to,
  name,
  phone,
  town,
}: {
  kind: "enquiry" | "application";
  to: string | undefined;
  name: string;
  phone: string;
  town?: string;
}): Promise<void> {
  const address = usableReplyTo(to);
  const from = process.env.LEAD_FROM;
  if (!address || !from) return;

  /* Sent under the agency's name rather than "Hodges Website". A receipt
   * from a person's business should look like it came from the business. */
  const sender = from.includes("<")
    ? `${site.shortName} <${from.slice(from.indexOf("<") + 1, from.indexOf(">"))}>`
    : from;

  const text = [
    `Thank you, ${name.split(" ")[0] || "there"}.`,
    "",
    kind === "enquiry"
      ? `We have your message and somebody will call you back${phone ? ` on ${phone}` : ""}. You will be speaking to ${site.founder}, who owns the agency.`
      : `We have your application and ${site.founder} will be in touch${phone ? ` on ${phone}` : ""}.`,
    "",
    `If something changes, or you would rather just talk now, call ${site.phone}.`,
    "",
    "----",
    `You are getting this because you filled in the form on ${site.url}.`,
    "You have not been added to any mailing list.",
  ].join("\n");

  await send({
    from: sender,
    to: address,
    subject:
      kind === "enquiry"
        ? `We got your message, ${name.split(" ")[0] || "thank you"}`
        : `We got your application, ${name.split(" ")[0] || "thank you"}`,
    html: confirmationEmail({ kind, name, phone, town }),
    text,
    /* Replies land in her real inbox, not on the sending subdomain. */
    replyTo: site.email ?? undefined,
  });
}
