"use client";

import { useActionState } from "react";
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
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="rounded-2xl border-2 border-green bg-green-wash p-8"
      >
        <h3 className="font-display text-2xl font-semibold text-forest">
          Message received
        </h3>
        <p className="mt-3 text-lg text-ink-soft">{state.message}</p>
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
          className="rounded-xl border-2 border-plum bg-plum-wash p-5"
        >
          <p className="text-lg font-semibold text-plum-deep">{state.message}</p>
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
            <label htmlFor={id} className="block text-lg font-semibold text-ink">
              {field.label}
              {field.required ? (
                <span className="ml-1 text-plum" aria-hidden="true">
                  *
                </span>
              ) : (
                <span className="ml-2 text-base font-normal text-ink-faint">
                  optional
                </span>
              )}
            </label>

            {field.help && (
              <p id={`${id}-help`} className="mt-1 text-base text-ink-faint">
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
                className="mt-2 w-full rounded-xl border-2 border-rule bg-page px-4 py-3 text-lg text-ink transition-colors duration-200 focus:border-plum"
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="mt-2 min-h-[3.25rem] w-full rounded-xl border-2 border-rule bg-page px-4 text-lg text-ink transition-colors duration-200 focus:border-plum"
              />
            )}

            {error && (
              <p
                id={`${id}-error`}
                className="mt-2 text-base font-semibold text-plum-deep"
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
        className="inline-flex min-h-[3.5rem] items-center rounded-full bg-plum px-9 text-lg font-semibold text-white transition-colors duration-200 hover:bg-plum-deep disabled:opacity-70"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
