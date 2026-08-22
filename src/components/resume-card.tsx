"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/lightbox";
import type { ResumeEntry } from "@/lib/content";

// One resume: a preview (image if provided, otherwise the PDF itself),
// with full-screen and download actions.
export function ResumeCard({ resume }: { resume: ResumeEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <figure>
      {resume.label && (
        <figcaption className="mb-3 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
          {resume.label}
        </figcaption>
      )}

      {resume.preview ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View ${resume.label || "resume"} full screen`}
          className="relative block aspect-[1/1.294] w-full cursor-zoom-in overflow-hidden border border-line bg-bone-deep transition-opacity hover:opacity-90"
        >
          <Image
            src={resume.preview.src}
            alt={resume.preview.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </button>
      ) : (
        <object
          data={`${resume.fileUrl}#toolbar=0&navpanes=0&view=FitH`}
          type="application/pdf"
          aria-label={`${resume.label || "Resume"} preview`}
          className="block aspect-[1/1.294] w-full border border-line bg-bone-deep"
        >
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-ink-soft">
            Your browser can&rsquo;t show the PDF here — use the buttons below.
          </div>
        </object>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={resume.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-ink px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-oxblood hover:text-oxblood"
        >
          Full screen
        </a>
        <a
          href={resume.fileUrl}
          download={resume.fileName}
          className="bg-ink px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
        >
          Download
        </a>
      </div>

      {open && resume.preview && (
        <Lightbox
          photos={[{ ...resume.preview, caption: resume.label }]}
          index={0}
          onClose={() => setOpen(false)}
          onIndex={() => {}}
        />
      )}
    </figure>
  );
}
