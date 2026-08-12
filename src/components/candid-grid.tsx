"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/lightbox";
import type { ImageRef } from "@/lib/content";

// The About page's candid-photo montage: small squares that open a
// full-size lightbox when clicked.
export function CandidGrid({ photos }: { photos: ImageRef[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <>
      <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3 md:mx-0 md:max-w-none">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View full size — ${photo.alt}`}
            className="relative aspect-square cursor-zoom-in overflow-hidden bg-bone-deep transition-opacity hover:opacity-85"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="160px" className="object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      )}
    </>
  );
}
