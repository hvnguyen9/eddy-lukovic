import type { Metadata } from "next";
import Image from "next/image";
import { VideoBlock } from "@/components/video-block";
import { getPhotos, getVideos } from "@/lib/content";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const [videos, photos] = await Promise.all([getVideos(), getPhotos()]);
  const [featured, ...rest] = [...videos].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  return (
    <>
      {/* Videos — dark screening-room section */}
      <section className="bg-night text-bone">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24">
          <p className="eyebrow">Media</p>
          <h1 className="display mt-6 text-5xl font-medium sm:text-6xl">
            Watch & <em className="text-oxblood-bright">see</em>
          </h1>

          {featured && (
            <div className="mt-14">
              <VideoBlock video={featured} dark />
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              {rest.map((video) => (
                <VideoBlock key={video.title} video={video} dark />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photos */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
          Photos
          <span className="h-px flex-1 bg-line" aria-hidden />
        </h2>
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>figure]:mb-6 [&>figure]:break-inside-avoid">
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
    </>
  );
}
