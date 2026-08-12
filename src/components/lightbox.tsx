"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { CaptionedImage } from "@/lib/content";

// Full-screen image viewer: click-outside or Esc to close, arrows/keys to
// navigate. Shows the uncropped image (photo.full when available).
export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: CaptionedImage[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const photo = photos[index];
  const prev = useCallback(
    () => onIndex((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % photos.length),
    [index, photos.length, onIndex]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && photos.length > 1) prev();
      if (e.key === "ArrowRight" && photos.length > 1) next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next, photos.length]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt || "Photo"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night/95 p-4 sm:p-10"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full text-2xl leading-none text-bone/80 transition-colors hover:bg-bone/10 hover:text-bone"
      >
        ×
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[80vh] w-full max-w-6xl"
      >
        <Image
          key={photo.src}
          src={photo.full ?? photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      {photo.caption ? (
        <p
          onClick={(e) => e.stopPropagation()}
          className="mt-4 text-xs tracking-wider text-bone/70 uppercase"
        >
          {photo.caption}
        </p>
      ) : null}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute top-1/2 left-2 -translate-y-1/2 grid size-11 place-items-center rounded-full text-bone/80 transition-colors hover:bg-bone/10 hover:text-bone sm:left-6"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
              <path d="M9 1 L1 9 L9 17" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute top-1/2 right-2 -translate-y-1/2 grid size-11 place-items-center rounded-full text-bone/80 transition-colors hover:bg-bone/10 hover:text-bone sm:right-6"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
              <path d="M1 1 L9 9 L1 17" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
