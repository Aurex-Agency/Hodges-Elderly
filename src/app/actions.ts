"use server";

import { sendConfirmation, sendLead } from "@/lib/mail";
import { site } from "@/lib/site";

export type FormState = {
  status: "idle" | "ok" | "error";
  message: string;
  /* Field name -> error, so the form can mark the specific input. */
  fieldErrors?: Record<string, string>;
};

/* Enquiries email Aaliyah at the address published on the site.
 *
 * This still FAILS LOUDLY when the mail provider is unconfigured or the
 * send errors, rather than showing a success message. A contact form that
 * silently drops a family's enquiry is far worse than one that tells them
 * to pick up the phone, and these are people deciding what to do about a
 * parent. Never pretend a message arrived. */

/* Labels for the email body, so the message reads as a note rather than a
 * dump of form field names. Anything not listed still gets through under
 * its raw key, so adding a field to a form can never silently drop it. */
const LABELS: Record<string, string> = {
  name: "Name",
  phone: "Phone",
  email: "Email",
  town: "Town",
  message: "What is going on",
  experience: "Experience",
  availability: "Availability",
};

/* Name and phone lead the email in their own right, and the free-text
 * answer gets pulled into a quote block, so neither is repeated in the
 * details table underneath. */
const LEAD_FIELDS = new Set(["website", "name", "phone"]);

function toLines(fields: Record<string, string>, omit: string[] = []) {
  const skip = new Set([...LEAD_FIELDS, ...omit]);
  return Object.entries(fields)
    .filter(([k, v]) => !skip.has(k) && v)
    .map(([k, v]) => ({ label: LABELS[k] ?? k, value: v }));
}

function validate(
  formData: FormData,
  required: { name: string; label: string }[],
): { fields: Record<string, string>; fieldErrors: Record<string, string> } {
  const fields: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    /* Skip React's own Server Action fields. A form posted to a Server
     * Action carries $ACTION_ID, $ACTION_KEY and the serialised bound
     * arguments alongside the real inputs. Copying everything meant the
     * email to Aaliyah opened with three blocks of React internals before
     * it got to the family's name. Nothing a person types starts with $. */
    if (key.startsWith("$")) continue;
    if (typeof value === "string") fields[key] = value.trim();
  }

  for (const { name, label } of required) {
    if (!fields[name]) fieldErrors[name] = `Please enter ${label}.`;
  }

  // Honeypot: bots fill hidden fields, people do not.
  if (fields.website) fieldErrors.website = "spam";

  return { fields, fieldErrors };
}

const UNDELIVERED = `We could not send that just now. Please call ${site.phone} and someone will answer.`;

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
    return { status: "error", message: UNDELIVERED };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const sent = await sendLead({
    kind: "enquiry",
    subject: `New enquiry from ${fields.name}`,
    name: fields.name,
    phone: fields.phone,
    fields: toLines(fields, ["message"]),
    message: fields.message
      ? { label: "What is going on", value: fields.message }
      : undefined,
    replyTo: fields.email || undefined,
  });
  if (!sent.ok) {
    return { status: "error", message: UNDELIVERED };
  }

  /* Not awaited for its result, and never allowed to fail the submission.
   * Aaliyah has the enquiry; a courtesy receipt that bounced is not a
   * reason to tell a worried family their message did not go through. */
  await sendConfirmation({
    kind: "enquiry",
    to: fields.email,
    name: fields.name,
    phone: fields.phone,
    town: fields.town,
  });

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
    return { status: "error", message: UNDELIVERED };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const sent = await sendLead({
    kind: "application",
    subject: `Caregiver application from ${fields.name}`,
    name: fields.name,
    phone: fields.phone,
    fields: toLines(fields, ["experience"]),
    message: fields.experience
      ? { label: "Experience", value: fields.experience }
      : undefined,
    replyTo: fields.email || undefined,
  });
  if (!sent.ok) {
    return { status: "error", message: UNDELIVERED };
  }

  await sendConfirmation({
    kind: "application",
    to: fields.email,
    name: fields.name,
    phone: fields.phone,
    town: fields.town,
  });

  return {
    status: "ok",
    message: "Thank you. We have your application and will be in touch.",
  };
}
