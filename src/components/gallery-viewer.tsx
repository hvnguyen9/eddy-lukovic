"use client";

import Image from "next/image";
import { useState } from "react";
import type { CaptionedImage } from "@/lib/content";

// Lead photo with a strip of small thumbnails beneath it; clicking a
// thumbnail swaps the main image. Used for acting galleries and directing
// production galleries.
export function GalleryViewer({
  photos,
  ratio = "aspect-[3/2]",
}: {
  photos: CaptionedImage[];
  ratio?: string;
}) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const active = photos[Math.min(index, photos.length - 1)];

  return (
    <figure>
      <div className={`relative w-full overflow-hidden bg-bone-deep ${ratio}`}>
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-cover"
        />
      </div>
      {active.caption ? (
        <figcaption className="mt-2 text-xs tracking-wider text-muted uppercase">
          {active.caption}
        </figcaption>
      ) : null}

      {photos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}${photo.caption ? ` — ${photo.caption}` : ""}`}
              aria-current={i === index}
              className={`relative h-16 w-24 overflow-hidden transition-opacity ${
                i === index
                  ? "opacity-100 outline-2 outline-offset-2 outline-oxblood"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
