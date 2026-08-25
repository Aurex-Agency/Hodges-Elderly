"use client";

import { useActionState, useEffect, useRef } from "react";
import { trackLead } from "@/lib/analytics";
import type { FormState } from "@/app/actions";

const INITIAL: FormState = { status: "idle", message: "" };

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea";
  required?: boolean;
  help?: string;
  autoComplete?: string;
};

export default function LeadForm({
  action,
  fields,
  submitLabel,
  formName,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  /** Which form this is, for the analytics event. Nothing else. */
  formName: "contact" | "careers";
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  /* Fired on the transition into "ok", not on every render while the
   * success panel is on screen, and only when the server actually
   * confirmed the send. A lead event on a submission that failed to
   * deliver would be worse than no measurement at all.
   *
   * Carries the form name and nothing the person typed. */
  const counted = useRef(false);
  useEffect(() => {
    if (state.status === "ok" && !counted.current) {
      counted.current = true;
      trackLead(formName);
    }
  }, [state.status, formName]);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="rounded-panel border-2 border-green bg-green-wash p-8"
      >
        <h3 className="font-display text-[1.7rem] font-semibold text-forest">
          Message received
        </h3>
        <p className="mt-3 text-xl text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Error summary first: screen-reader users should not have to hunt
          through the form to find out what went wrong. */}
      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-panel border-2 border-pink bg-pink-wash p-5"
        >
          <p className="text-xl font-semibold text-pink-deep">{state.message}</p>
        </div>
      )}

      {fields.map((field) => {
        const id = `f-${field.name}`;
        const error = state.fieldErrors?.[field.name];
        const describedBy =
          [field.help ? `${id}-help` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <div key={field.name}>
            <label htmlFor={id} className="block text-xl font-semibold text-ink">
              {field.label}
              {field.required ? (
                <span className="ml-1 text-pink" aria-hidden="true">
                  *
                </span>
              ) : (
                <span className="ml-2 text-lg font-normal text-ink-faint">
                  optional
                </span>
              )}
            </label>

            {field.help && (
              <p id={`${id}-help`} className="mt-1 text-lg text-ink-faint">
                {field.help}
              </p>
            )}

            {field.type === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                rows={5}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="mt-2 w-full rounded-control border-2 border-rule bg-page px-4 py-3 text-xl text-ink transition-colors duration-200 focus:border-pink"
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="mt-2 min-h-[3.25rem] w-full rounded-control border-2 border-rule bg-page px-4 text-xl text-ink transition-colors duration-200 focus:border-pink"
              />
            )}

            {error && (
              <p
                id={`${id}-error`}
                className="mt-2 text-lg font-semibold text-pink-deep"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="f-website">Website</label>
        <input
          id="f-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[3.5rem] items-center rounded-control bg-pink px-9 text-xl font-semibold text-white transition-colors duration-200 hover:bg-pink-deep disabled:opacity-70"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
