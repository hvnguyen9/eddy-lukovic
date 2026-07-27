import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPhotos } from "@/lib/content";

export const metadata: Metadata = { title: "Acting Gallery" };

export default async function ActingGalleryPage() {
  const photos = await getPhotos();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Gallery</p>
      <h1 className="display mt-6 text-5xl font-medium sm:text-6xl">
        Acting <em className="text-oxblood">photos</em>
      </h1>
      <Link
        href="/gallery/directing"
        className="nav-link mt-5 inline-block text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-ink-soft"
      >
        Switch to directing →
      </Link>

      <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>figure]:mb-6 [&>figure]:break-inside-avoid">
        {photos.map((photo) => (
          <figure key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.aspect === "portrait" ? 800 : 1200}
              height={photo.aspect === "portrait" ? 1000 : 800}
              className="block w-full object-cover"
            />
            <figcaption className="mt-2 text-xs tracking-wider text-muted uppercase">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
