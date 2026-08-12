import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CandidGrid } from "@/components/candid-grid";
import { getBio, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [bio, site] = await Promise.all([getBio(), getSite()]);

  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-24 md:grid-cols-[0.9fr_1.1fr] md:pt-24">
      <div>
        {bio.secondaryPhoto && (
          <div className="frame mx-auto w-full max-w-sm md:mx-0">
            <Image
              src={bio.secondaryPhoto.src}
              alt={bio.secondaryPhoto.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>
        )}

        {/* Candid montage — click any photo for full size */}
        <CandidGrid photos={bio.candids} />
      </div>

      <div>
        <p className="eyebrow">About</p>
        <h1 className="display mt-6 text-5xl leading-tight font-medium sm:text-6xl">
          The long version,
          <br />
          <em className="text-oxblood">kept short.</em>
        </h1>
        {bio.paragraphs.length > 0 && (
          <div className="mt-10 max-w-xl space-y-6 text-lg leading-relaxed text-ink-soft">
            {bio.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        {bio.pullQuote && (
          <blockquote className="display mt-12 border-l-2 border-oxblood pl-6 text-2xl leading-snug italic">
            “{bio.pullQuote}”
          </blockquote>
        )}
        <div className="mt-12 flex flex-wrap gap-4">
          {site.resumePdfUrl && (
            <a
              href="/resume"
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
            >
              View resume
            </a>
          )}
          <Link
            href="/contact"
            className="border border-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-oxblood hover:text-oxblood"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
