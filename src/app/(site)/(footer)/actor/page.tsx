import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
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

  // Main image + up to two extras: thumbnails under the lead, all lightboxable
  const mainImages = [
    ...(page.image ? [page.image] : []),
    ...page.extraImages,
  ];

  return (
    <>
      {/* Intro — main image(s) + text */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 pt-12 pb-12 md:grid-cols-[0.8fr_1.2fr] md:pt-16">
        {mainImages.length > 0 && (
          <div className="mx-auto w-full max-w-xs md:mx-0">
            <GalleryViewer photos={mainImages} ratio="aspect-[4/5]" />
          </div>
        )}
        <div>
          <p className="eyebrow">Actor</p>
          <AccentHeading text={page.heading} />
          {page.intro && (
            <p className="mt-8 max-w-xl text-lg leading-relaxed whitespace-pre-line text-ink-soft">
              {page.intro}
            </p>
          )}
        </div>
      </section>

      {/* Videos — three per row on desktop */}
      {videos.length > 0 && (
        <section id="videos" className="bg-night text-bone scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood-bright uppercase">
              Videos
              <span className="h-px flex-1 bg-bone/15" aria-hidden />
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoBlock key={video.title} video={video} dark />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos — labeled galleries, lead photo + thumbnails */}
      {galleries.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            Photos
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
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
