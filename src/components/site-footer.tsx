import Link from "next/link";
import { getContact, getFooter, getHome, getResumePage } from "@/lib/content";

const SIZE_PADDING = {
  compact: "py-8",
  medium: "py-14",
  tall: "py-24",
} as const;

export async function SiteFooter() {
  const [footer, contact, home, resume] = await Promise.all([
    getFooter(),
    getContact(),
    getHome(),
    getResumePage(),
  ]);

  const showEmail = footer.showEmail && Boolean(contact.email);
  const showSocials = footer.showSocials && contact.socials.length > 0;

  return (
    <footer className="bg-night text-bone">
      <div className={`mx-auto max-w-6xl px-6 ${SIZE_PADDING[footer.size] ?? SIZE_PADDING.compact}`}>
        {(showEmail || footer.showNav) && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            {showEmail && (
              <a
                href={`mailto:${contact.email}`}
                className="display text-xl italic underline decoration-oxblood-bright decoration-1 underline-offset-6 transition-colors hover:text-oxblood-bright sm:text-2xl"
              >
                {contact.email}
              </a>
            )}
            {footer.showNav && (
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                <Link href="/about" className="text-bone/70 hover:text-oxblood-bright">About</Link>
                <Link href="/actor" className="text-bone/70 hover:text-oxblood-bright">Actor</Link>
                <Link href="/director" className="text-bone/70 hover:text-oxblood-bright">Director</Link>
                {resume.resumes.length > 0 && (
                  <Link href="/resume" className="text-bone/70 hover:text-oxblood-bright">Resume</Link>
                )}
                <Link href="/contact" className="text-bone/70 hover:text-oxblood-bright">Contact</Link>
              </nav>
            )}
          </div>
        )}

        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 text-xs text-bone/50 ${
            showEmail || footer.showNav ? "mt-6 border-t border-bone/15 pt-5" : ""
          }`}
        >
          <p>
            © {new Date().getFullYear()} {home.name}.{home.location ? ` ${home.location}.` : ""}
            {footer.customText ? ` ${footer.customText}` : ""}
          </p>
          {showSocials && (
            <span className="flex flex-wrap gap-x-5 gap-y-2">
              {contact.socials.map((social) => (
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
