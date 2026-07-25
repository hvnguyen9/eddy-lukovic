import type { Metadata } from "next";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSite();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-28 md:pt-24">
      <p className="eyebrow">Contact</p>
      <h1 className="display mt-6 max-w-3xl text-5xl leading-tight font-medium sm:text-7xl">
        Casting? Booking? <em className="text-oxblood">Say hello.</em>
      </h1>

      <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-3">
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

        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
            {site.representation.label}
          </p>
          <p className="mt-3 text-lg">{site.representation.name}</p>
          <a
            href={`mailto:${site.representation.contact}`}
            className="mt-1 block text-sm text-ink-soft hover:text-oxblood"
          >
            {site.representation.contact}
          </a>
        </div>

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
      </div>
    </section>
  );
}
