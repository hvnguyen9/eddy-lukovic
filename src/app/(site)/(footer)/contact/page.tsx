import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { ContactForm } from "@/components/contact-form";
import { getContactPage, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [site, page] = await Promise.all([getSite(), getContactPage()]);
  const hasRepresentation = Boolean(site.representation.name || site.representation.contact);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Contact</p>
      <AccentHeading
        text={page.heading}
        className="display mt-6 max-w-3xl text-5xl leading-tight font-medium sm:text-7xl"
      />

      <div className="mt-14 grid gap-14 border-t border-line pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
        <div>
          {page.formLabel && (
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
              {page.formLabel}
            </p>
          )}
          <div className="mt-6">
            <ContactForm
              fallbackEmail={site.email}
              accessKey={site.contactFormKey}
              text={{
                nameLabel: page.nameLabel,
                emailLabel: page.emailLabel,
                messageLabel: page.messageLabel,
                buttonText: page.buttonText,
                successTitle: page.successTitle,
                successText: page.successText,
              }}
            />
          </div>
        </div>

        <div className="space-y-12">
          {site.email && (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                Direct
              </p>
              <a
                href={`mailto:${site.email}`}
                className="display mt-3 block text-2xl italic underline decoration-oxblood decoration-1 underline-offset-6 hover:text-oxblood"
              >
                {site.email}
              </a>
              {site.phone && <p className="mt-2 text-sm text-ink-soft">{site.phone}</p>}
            </div>
          )}

          {hasRepresentation && (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                {site.representation.label}
              </p>
              {site.representation.name && (
                <p className="mt-3 text-lg">{site.representation.name}</p>
              )}
              {site.representation.contact && (
                <a
                  href={`mailto:${site.representation.contact}`}
                  className="mt-1 block text-sm text-ink-soft hover:text-oxblood"
                >
                  {site.representation.contact}
                </a>
              )}
            </div>
          )}

          {site.socials.length > 0 && (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-2">
                {site.socials.map((social) => (
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
