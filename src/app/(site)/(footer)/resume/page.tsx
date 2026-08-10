import type { Metadata } from "next";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const site = await getSite();
  const pdf = site.resumePdfUrl;

  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Resume</p>
          <h1 className="display mt-6 text-5xl font-medium sm:text-6xl">
            The <em className="text-oxblood">paperwork</em>
          </h1>
        </div>
        {pdf && (
          <a
            href={pdf}
            download
            className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
          >
            Download PDF
          </a>
        )}
      </div>

      {pdf ? (
        <object
          data={pdf}
          type="application/pdf"
          className="mt-12 h-[85vh] w-full border border-line bg-bone-deep"
        >
          {/* Fallback for browsers that can't embed PDFs (most mobile) */}
          <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
            <p className="text-ink-soft">
              Your browser can&rsquo;t display the PDF inline.
            </p>
            <a
              href={pdf}
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
            >
              Open the resume
            </a>
          </div>
        </object>
      ) : (
        <p className="mt-12 max-w-md leading-relaxed text-ink-soft">
          The resume is being updated — check back soon, or{" "}
          {site.email ? (
            <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-oxblood">
              request a copy by email
            </a>
          ) : (
            "request a copy via the contact page"
          )}
          .
        </p>
      )}
    </section>
  );
}
