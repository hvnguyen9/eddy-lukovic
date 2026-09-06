import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AccentHeading } from "@/components/accent-heading";
import { CandidGrid } from "@/components/candid-grid";
import { getAbout, getResumePage } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [about, resume] = await Promise.all([getAbout(), getResumePage()]);

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-10 pb-14 md:grid-cols-[0.9fr_1.1fr] md:pt-14">
      {/* Main photo + candid montage share one width so three thumbnails
          line up exactly under the photo. */}
      <div className="mx-auto w-full max-w-[26.5rem] md:mx-0">
        {about.mainPhoto && (
          <div className="frame">
            <Image
              src={about.mainPhoto.src}
              alt={about.mainPhoto.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>
        )}
        <CandidGrid photos={about.candids} />
      </div>

      <div>
        {about.eyebrow && <p className="eyebrow">{about.eyebrow}</p>}
        <AccentHeading text={about.heading} />
        {about.paragraphs.length > 0 && (
          <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-ink-soft">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        {about.pullQuote && (
          <blockquote className="display mt-10 border-l-2 border-oxblood pl-6 text-2xl leading-snug italic">
            “{about.pullQuote}”
          </blockquote>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          {resume.resumes.length > 0 && (
            <Link
              href="/resume"
              className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
            >
              View resume
            </Link>
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
