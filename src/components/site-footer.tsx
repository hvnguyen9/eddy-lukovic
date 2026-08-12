import Link from "next/link";
import { getSite } from "@/lib/content";

export async function SiteFooter() {
  const site = await getSite();
  const hasRepresentation = Boolean(site.representation.name || site.representation.contact);

  return (
    <footer className="bg-night text-bone">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          {site.email && (
            <a
              href={`mailto:${site.email}`}
              className="display text-xl italic underline decoration-oxblood-bright decoration-1 underline-offset-6 transition-colors hover:text-oxblood-bright sm:text-2xl"
            >
              {site.email}
            </a>
          )}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
            <Link href="/about" className="text-bone/70 hover:text-oxblood-bright">About</Link>
            <Link href="/actor" className="text-bone/70 hover:text-oxblood-bright">Actor</Link>
            <Link href="/director" className="text-bone/70 hover:text-oxblood-bright">Director</Link>
            {site.resumePdfUrl && (
              <a href="/resume" target="_blank" rel="noreferrer" className="text-bone/70 hover:text-oxblood-bright">
                Resume
              </a>
            )}
            <Link href="/contact" className="text-bone/70 hover:text-oxblood-bright">Contact</Link>
          </nav>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-bone/15 pt-5 text-xs text-bone/50">
          <p>
            © {new Date().getFullYear()} {site.name}.{site.location ? ` ${site.location}.` : ""}
            {hasRepresentation && (
              <span>
                {" "}{site.representation.label}:{" "}
                {[site.representation.name, site.representation.contact].filter(Boolean).join(" · ")}
              </span>
            )}
          </p>
          {site.socials.length > 0 && (
            <span className="flex flex-wrap gap-x-5 gap-y-2">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone/70 hover:text-oxblood-bright"
                >
                  {social.label} ↗
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
