"use server";

import { site } from "@/lib/site";

export type FormState = {
  status: "idle" | "ok" | "error";
  message: string;
  /* Field name -> error, so the form can mark the specific input. */
  fieldErrors?: Record<string, string>;
};

/* Lead delivery is not wired yet — the client has no business email and has
 * not said where submissions should go.
 *
 * This deliberately FAILS LOUDLY when unconfigured rather than showing a
 * success message. A contact form that silently drops a family's enquiry is
 * far worse than one that tells them to pick up the phone.
 *
 * TODO(launch): set LEAD_ENDPOINT to the webhook that emails/texts Aaliyah,
 * then verify end to end before the domain goes live. */
async function deliver(kind: string, fields: Record<string, string>) {
  const endpoint = process.env.LEAD_ENDPOINT;
  if (!endpoint) return false;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, fields, receivedAt: new Date().toISOString() }),
  });
  return res.ok;
}

function validate(
  formData: FormData,
  required: { name: string; label: string }[],
): { fields: Record<string, string>; fieldErrors: Record<string, string> } {
  const fields: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") fields[key] = value.trim();
  }

  for (const { name, label } of required) {
    if (!fields[name]) fieldErrors[name] = `Please enter ${label}.`;
  }

  // Honeypot: bots fill hidden fields, people do not.
  if (fields.website) fieldErrors.website = "spam";

  return { fields, fieldErrors };
}

const UNCONFIGURED = `Our contact form is not connected yet. Please call ${site.phone} — someone will answer.`;

export async function submitEnquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { fields, fieldErrors } = validate(formData, [
    { name: "name", label: "your name" },
    { name: "phone", label: "a phone number we can reach you on" },
    { name: "message", label: "a short note about what is going on" },
  ]);

  if (fieldErrors.website) {
    return { status: "error", message: UNCONFIGURED };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const delivered = await deliver("enquiry", fields);
  if (!delivered) {
    return { status: "error", message: UNCONFIGURED };
  }

  return {
    status: "ok",
    message: `Thank you. We have your message and will call you back on ${fields.phone}.`,
  };
}

export async function submitApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { fields, fieldErrors } = validate(formData, [
    { name: "name", label: "your name" },
    { name: "phone", label: "a phone number" },
    { name: "town", label: "the town you live in" },
  ]);

  if (fieldErrors.website) {
    return { status: "error", message: UNCONFIGURED };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const delivered = await deliver("application", fields);
  if (!delivered) {
    return { status: "error", message: UNCONFIGURED };
  }

  return {
    status: "ok",
    message: "Thank you. We have your application and will be in touch.",
  };
}
