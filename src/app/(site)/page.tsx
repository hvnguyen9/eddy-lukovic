import Image from "next/image";
import Link from "next/link";
import { VideoBlock } from "@/components/video-block";
import {
  getBio,
  getFeaturedVideo,
  getPhotos,
  getResume,
  getSite,
} from "@/lib/content";

export default async function HomePage() {
  const [site, bio, resume, featuredVideo, allPhotos] = await Promise.all([
    getSite(),
    getBio(),
    getResume(),
    getFeaturedVideo(),
    getPhotos(),
  ]);
  const photos = allPhotos.slice(0, 4);

  // Top credit from each resume section → "Selected work" strip
  const selectedWork = resume.sections
    .map((section) => ({ section: section.title, credit: section.credits[0] }))
    .filter((entry) => entry.credit);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden
          className="ghost-text display absolute -bottom-8 left-1/2 -translate-x-1/2 text-[24vw] leading-none font-semibold whitespace-nowrap italic"
        >
          {site.lastName}
        </span>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-16 pb-28 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
          <div>
            <p className="eyebrow">
              {site.tagline} — {site.location}
            </p>
            <h1 className="display mt-6 text-6xl leading-[0.95] font-medium sm:text-7xl lg:text-8xl">
              {site.firstName}
              <br />
              <em className="text-oxblood">{site.lastName}</em>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              {bio.shortBio}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/media"
                className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
              >
                Watch the reel
              </Link>
              <Link
                href="/resume"
                className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
              >
                View resume →
              </Link>
            </div>
          </div>

          <div className="frame mx-auto w-full max-w-sm md:mx-0 md:ml-auto">
            <Image
              src={bio.headshot.src}
              alt={bio.headshot.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-t border-line bg-bone-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Selected work</p>
            <Link
              href="/resume"
              className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-ink-soft"
            >
              Full resume
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {selectedWork.map((entry, i) => (
              <li
                key={entry.credit.title}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 sm:grid-cols-[3rem_1.2fr_1fr_auto]"
              >
                <span className="font-(family-name:--font-display) text-sm text-muted italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display text-2xl transition-colors group-hover:text-oxblood sm:text-3xl">
                  {entry.credit.title}
                </span>
                <span className="hidden text-sm text-ink-soft sm:block">
                  {entry.credit.role} · {entry.credit.director}
                </span>
                <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-muted uppercase">
                  {entry.section} · {entry.credit.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reel — dark letterbox section */}
      {featuredVideo && (
        <section className="bg-night text-bone">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <p className="eyebrow">Showreel</p>
            <h2 className="display mt-5 mb-10 text-4xl italic sm:text-5xl">
              Two minutes, no warm-up.
            </h2>
            <VideoBlock video={featuredVideo} dark />
            <div className="mt-8">
              <Link
                href="/media"
                className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] text-bone/70 uppercase hover:text-bone"
              >
                All videos & photos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">About</p>
          <blockquote className="display mt-6 text-3xl leading-snug italic sm:text-4xl">
            “{bio.pullQuote}”
          </blockquote>
          <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
            {bio.paragraphs[0]}
          </p>
          <Link
            href="/about"
            className="nav-link mt-8 inline-block text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
          >
            Read the full bio →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, i) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={photo.aspect === "portrait" ? 750 : 400}
              className={`block w-full object-cover ${i % 2 === 1 ? "mt-8" : ""}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
