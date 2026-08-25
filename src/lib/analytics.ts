/* Analytics events.
 *
 * One rule, and it is the important one on this site: NEVER pass anything a
 * person typed. No name, no phone number, no email, no description of what
 * is happening to their mother. Google's own terms prohibit sending PII,
 * and beyond that, visitors here are researching care for a failing parent
 * and that is not data to hand to an ad platform. Events carry which form
 * and which part of the page, nothing else.
 *
 * Every call is a no-op when gtag is absent, which is the case in
 * development, on preview deployments, and for anyone running an ad
 * blocker. Nothing here should ever be able to throw. */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Params = Record<string, string | number | boolean>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, params);
  } catch {
    /* Analytics must never break the page it is measuring. */
  }
}

/* GA4's own recommended event name for a contact-form submission, so it
 * shows up in the standard reports rather than as a custom event nobody
 * configured. Mark it as a key event in the GA4 admin to count conversions. */
export function trackLead(form: "contact" | "careers") {
  track("generate_lead", { form_name: form });
}

export function trackCall(location: string, path: string) {
  track("click_to_call", { link_location: location, page_path: path });
}
