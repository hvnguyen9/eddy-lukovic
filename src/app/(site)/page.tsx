import Image from "next/image";
import Link from "next/link";
import { getHome } from "@/lib/content";

// The homepage is deliberately minimal: toolbar, name, headshot.
export default async function HomePage() {
  const home = await getHome();

  const eyebrow = [home.tagline, home.location].filter(Boolean).join(" — ");
  const [primaryLink, ...secondaryLinks] = home.heroLinks;

  return (
    <section className="relative overflow-hidden">
      <span
        aria-hidden
        className="ghost-text display absolute -bottom-8 left-1/2 -translate-x-1/2 text-[24vw] leading-none font-semibold whitespace-nowrap italic"
      >
        {home.lastName}
      </span>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-14 px-6 py-12 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="display mt-6 text-6xl leading-[0.95] font-medium sm:text-7xl lg:text-8xl">
            {home.firstName}
            <br />
            <em className="text-oxblood">{home.lastName}</em>
          </h1>
          {home.shortBio && (
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              {home.shortBio}
            </p>
          )}
          {home.heroLinks.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {primaryLink && (
                <Link
                  href={primaryLink.url}
                  className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
                >
                  {primaryLink.label}
                </Link>
              )}
              {secondaryLinks.map((link) => (
                <Link
                  key={link.label + link.url}
                  href={link.url}
                  className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>

        {home.headshot && (
          <div className="frame mx-auto w-full max-w-sm md:mx-0 md:ml-auto">
            <Image
              src={home.headshot.src}
              alt={home.headshot.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
