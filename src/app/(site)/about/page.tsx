import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBio, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [site, bio] = await Promise.all([getSite(), getBio()]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-24 md:grid-cols-[0.9fr_1.1fr] md:pt-24">
        <div>
          <div className="frame">
            <Image
              src={bio.secondaryPhoto.src}
              alt={bio.secondaryPhoto.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8">
            {site.vitals.map((vital) => (
              <div key={vital.label}>
                <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase">
                  {vital.label}
                </dt>
                <dd className="mt-1 text-sm">{vital.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h1 className="display mt-6 text-5xl leading-tight font-medium sm:text-6xl">
            The long version,
            <br />
            <em className="text-oxblood">kept short.</em>
          </h1>
          <div className="mt-10 max-w-xl space-y-6 text-lg leading-relaxed text-ink-soft">
            {bio.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="display mt-12 border-l-2 border-oxblood pl-6 text-2xl leading-snug italic">
            “{bio.pullQuote}”
          </blockquote>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/resume"
              className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
            >
              View resume
            </Link>
            <Link
              href="/contact"
              className="border border-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-oxblood hover:text-oxblood"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
