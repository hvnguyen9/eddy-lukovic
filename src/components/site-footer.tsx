import Link from "next/link";
import { getSite } from "@/lib/content";

export async function SiteFooter() {
  const site = await getSite();

  return (
    <footer className="bg-night text-bone">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">Get in touch</p>
        <a
          href={`mailto:${site.email}`}
          className="display mt-6 block text-4xl leading-tight italic underline decoration-oxblood-bright decoration-1 underline-offset-8 transition-colors hover:text-oxblood-bright sm:text-6xl"
        >
          {site.email}
        </a>

        <div className="mt-16 grid gap-10 border-t border-bone/15 pt-10 sm:grid-cols-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/50">
              {site.representation.label}
            </p>
            <p className="mt-3 text-sm text-bone/90">{site.representation.name}</p>
            <p className="mt-1 text-sm text-bone/60">{site.representation.contact}</p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/50">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-1">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-bone/90 hover:text-oxblood-bright"
                  >
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/50">
              Site
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><Link href="/about" className="text-bone/90 hover:text-oxblood-bright">About</Link></li>
              <li><Link href="/resume" className="text-bone/90 hover:text-oxblood-bright">Resume</Link></li>
              <li><Link href="/media" className="text-bone/90 hover:text-oxblood-bright">Media</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-14 text-xs text-bone/40">
          © {new Date().getFullYear()} {site.name}. {site.location}.
        </p>
      </div>
    </footer>
  );
}
