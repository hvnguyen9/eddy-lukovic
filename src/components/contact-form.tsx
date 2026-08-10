"use client";

import { useState } from "react";

// Sends via Web3Forms (free, no backend): https://web3forms.com
// The access key is public-safe (it only identifies the destination inbox).
// It normally comes from Site Settings → "Contact form key" in the studio;
// the NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY env var works as a fallback. With
// neither set, submitting shows a friendly "not connected yet" notice.
const ENV_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

const labelClass =
  "block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted";
const inputClass =
  "mt-2 w-full border border-line bg-transparent px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-oxblood";

export function ContactForm({
  fallbackEmail,
  accessKey,
}: {
  fallbackEmail: string;
  accessKey?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const key = accessKey || ENV_ACCESS_KEY;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (data.get("botcheck")) return;

    if (!key) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          subject: `Website inquiry from ${data.get("name")}`,
          from_name: "eddylukovic.com contact form",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-bone-deep p-8">
        <p className="display text-2xl italic">Message sent.</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Thanks for reaching out — you&rsquo;ll hear back soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from real users, catnip for bots */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] size-px opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Project, dates, and anything else worth knowing…"
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-ink px-8 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "error" && (
        <p className="text-sm text-oxblood">
          Something went wrong sending your message.
          {fallbackEmail ? (
            <>
              {" "}Please email{" "}
              <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4">
                {fallbackEmail}
              </a>{" "}
              directly.
            </>
          ) : (
            " Please try again in a moment."
          )}
        </p>
      )}
      {status === "unconfigured" && (
        <p className="text-sm text-oxblood">
          The form isn&rsquo;t taking messages yet.
          {fallbackEmail ? (
            <>
              {" "}Please email{" "}
              <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4">
                {fallbackEmail}
              </a>{" "}
              directly for now.
            </>
          ) : (
            " Please check back soon."
          )}
        </p>
      )}
    </form>
  );
}
