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

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "failed" };

export async function sendLead({
  subject,
  fields,
  replyTo,
}: {
  subject: string;
  fields: { label: string; value: string }[];
  replyTo?: string;
}): Promise<LeadResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM;
  const to = process.env.LEAD_TO ?? site.email;

  if (!key || !from || !to) return { ok: false, reason: "unconfigured" };

  /* Plain text on purpose. This lands on a phone, is read in a hurry, and
   * often gets forwarded. HTML buys nothing and renders unpredictably in
   * the mail clients small businesses actually use. */
  const body = [
    ...fields.map((f) => `${f.label}:\n${f.value}`),
    "",
    "----",
    `Sent from ${site.url}`,
  ].join("\n\n");

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
        /* So she can hit reply and reach the family directly, rather than
         * replying to a no-reply address and wondering why nobody got it. */
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[lead] send failed", res.status, await res.text());
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[lead] send threw", err);
    return { ok: false, reason: "failed" };
  }
}
