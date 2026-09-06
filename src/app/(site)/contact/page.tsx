import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { ContactForm } from "@/components/contact-form";
import { getContact } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const contact = await getContact();
  const hasRepresentation = Boolean(
    contact.representation.name || contact.representation.contact
  );

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-14">
      {contact.eyebrow && <p className="eyebrow">{contact.eyebrow}</p>}
      <AccentHeading
        text={contact.heading}
        className="display mt-6 max-w-3xl text-5xl leading-tight font-medium sm:text-6xl"
      />

      <div className="mt-10 grid gap-12 border-t border-line pt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
        <div>
          {contact.formLabel && (
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
              {contact.formLabel}
            </p>
          )}
          <div className="mt-5">
            <ContactForm
              fallbackEmail={contact.email}
              accessKey={contact.contactFormKey}
              text={{
                nameLabel: contact.nameLabel,
                emailLabel: contact.emailLabel,
                messageLabel: contact.messageLabel,
                buttonText: contact.buttonText,
                successTitle: contact.successTitle,
                successText: contact.successText,
              }}
            />
          </div>
        </div>

        <div className="space-y-10">
          {contact.email && (
            <div>
              {contact.directLabel && (
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                  {contact.directLabel}
                </p>
              )}
              <a
                href={`mailto:${contact.email}`}
                className="display mt-3 block text-2xl italic underline decoration-oxblood decoration-1 underline-offset-6 hover:text-oxblood"
              >
                {contact.email}
              </a>
              {contact.phone && <p className="mt-2 text-sm text-ink-soft">{contact.phone}</p>}
            </div>
          )}

          {hasRepresentation && (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                {contact.representation.label}
              </p>
              {contact.representation.name && (
                <p className="mt-3 text-lg">{contact.representation.name}</p>
              )}
              {contact.representation.contact && (
                <a
                  href={`mailto:${contact.representation.contact}`}
                  className="mt-1 block text-sm text-ink-soft hover:text-oxblood"
                >
                  {contact.representation.contact}
                </a>
              )}
            </div>
          )}

          {contact.socials.length > 0 && (
            <div>
              {contact.elsewhereLabel && (
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                  {contact.elsewhereLabel}
                </p>
              )}
              <ul className="mt-3 space-y-2">
                {contact.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="nav-link text-lg"
                    >
                      {social.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
