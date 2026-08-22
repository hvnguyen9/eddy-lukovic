"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/lightbox";
import type { CaptionedImage } from "@/lib/content";

const THUMB_GRID = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-3 sm:grid-cols-6",
} as const;

// Lead photo with arrows and a strip of small thumbnails beneath it. The main
// image is letterboxed (never cropped); clicking it opens the full-size
// lightbox. Used for acting galleries, directing production galleries, and
// the Actor page's main images.
export function GalleryViewer({
  photos,
  ratio = "aspect-[3/2]",
  thumbCols = 3,
}: {
  photos: CaptionedImage[];
  ratio?: string;
  // How many thumbnails fit per row under the lead image.
  thumbCols?: 3 | 4 | 6;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  if (photos.length === 0) return null;
  const safeIndex = Math.min(index, photos.length - 1);
  const active = photos[safeIndex];

  const prev = () => setIndex((safeIndex - 1 + photos.length) % photos.length);
  const next = () => setIndex((safeIndex + 1) % photos.length);

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-night/45 text-bone/90 backdrop-blur-[2px] transition-colors hover:bg-night/70";

  return (
    <figure>
      <div className={`group relative w-full overflow-hidden bg-bone-deep ${ratio}`}>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View full size${active.caption ? ` — ${active.caption}` : ""}`}
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-contain"
          />
        </button>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className={`${arrowClass} left-3`}
            >
              <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
                <path d="M7 1 L1 7 L7 13" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className={`${arrowClass} right-3`}
            >
              <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
                <path d="M1 1 L7 7 L1 13" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
          </>
        )}
      </div>
      {active.caption ? (
        <figcaption className="mt-2 text-xs tracking-wider text-muted uppercase">
          {active.caption}
        </figcaption>
      ) : null}

      {photos.length > 1 && (
        <div className={`mt-3 grid gap-2 ${THUMB_GRID[thumbCols]}`}>
          {photos.map((photo, i) => (
            <button
              key={photo.src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}${photo.caption ? ` — ${photo.caption}` : ""}`}
              aria-current={i === safeIndex}
              className={`relative aspect-[3/2] overflow-hidden transition-opacity ${
                i === safeIndex
                  ? "opacity-100 outline-2 -outline-offset-2 outline-oxblood"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          index={safeIndex}
          onClose={() => setLightboxOpen(false)}
          onIndex={setIndex}
        />
      )}
    </figure>
  );
}
