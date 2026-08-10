import type { Metadata } from "next";
import Image from "next/image";
import { GalleryViewer } from "@/components/gallery-viewer";
import { VideoBlock } from "@/components/video-block";
import { getActingGalleries, getActorPage, getVideos } from "@/lib/content";

export const metadata: Metadata = { title: "Actor" };

export default async function ActorPage() {
  const [page, videos, galleries] = await Promise.all([
    getActorPage(),
    getVideos(),
    getActingGalleries(),
  ]);

  return (
    <>
      {/* Intro — main image + text, like the About page */}
      <section className="mx-auto grid max-w-6xl items-start gap-14 px-6 pt-16 pb-20 md:grid-cols-[0.8fr_1.2fr] md:pt-24">
        {page.image && (
          <div className="frame mx-auto w-full max-w-xs md:mx-0">
            <Image
              src={page.image.src}
              alt={page.image.alt}
              width={800}
              height={1000}
              priority
              className="block w-full object-cover"
            />
          </div>
        )}
        <div>
          <p className="eyebrow">Actor</p>
          <h1 className="display mt-6 text-5xl leading-tight font-medium sm:text-6xl">
            On camera, <em className="text-oxblood">on stage.</em>
          </h1>
          {page.intro && (
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink-soft">
              {page.intro}
            </p>
          )}
        </div>
      </section>

      {/* Videos — embeds in rows of two */}
      {videos.length > 0 && (
        <section id="videos" className="bg-night text-bone scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood-bright uppercase">
              Videos
              <span className="h-px flex-1 bg-bone/15" aria-hidden />
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {videos.map((video) => (
                <VideoBlock key={video.title} video={video} dark />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos — labeled galleries, lead photo + thumbnails */}
      {galleries.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            Photos
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {galleries.map((gallery) => (
              <div key={gallery.title}>
                <h3 className="display text-2xl italic">{gallery.title}</h3>
                <div className="mt-4">
                  <GalleryViewer photos={gallery.photos} ratio="aspect-[4/3]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
