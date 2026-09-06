import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { GalleryViewer } from "@/components/gallery-viewer";
import { RichText } from "@/components/rich-text";
import { SectionHeading } from "@/components/section-heading";
import { VideoBlock } from "@/components/video-block";
import { getActingGalleries, getActorPage, getVideos } from "@/lib/content";

export const metadata: Metadata = { title: "Actor" };

export default async function ActorPage() {
  const [page, videos, galleries] = await Promise.all([
    getActorPage(),
    getVideos(),
    getActingGalleries(),
  ]);

  // Main image plus extras: thumbnails under the lead, all click-to-enlarge
  const mainImages = [...(page.image ? [page.image] : []), ...page.extraImages];

  return (
    <>
      {/* Intro — main image(s) + text */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 pt-10 pb-10 md:grid-cols-[0.8fr_1.2fr] md:pt-14">
        {mainImages.length > 0 && (
          <div className="mx-auto w-full max-w-[22rem] md:mx-0">
            <GalleryViewer photos={mainImages} ratio="aspect-[4/5]" thumbCols={3} />
          </div>
        )}
        <div>
          {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
          <AccentHeading text={page.heading} />
          <RichText
            value={page.introRich}
            fallback={page.intro}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft"
          />
        </div>
      </section>

      {/* Videos — three per row on desktop */}
      {videos.length > 0 && (
        <section id="videos" className="bg-night text-bone scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <SectionHeading text={page.videosHeading} dark />
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
          <SectionHeading text={page.photosHeading} />
          <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {galleries.map((gallery) => {
              const credits = [gallery.role, gallery.company].filter(Boolean).join(" · ");
              return (
                <div key={gallery.title}>
                  <div className="flex items-baseline justify-between gap-4">
                    {gallery.title && (
                      <h3 className="display text-2xl italic">{gallery.title}</h3>
                    )}
                    {gallery.year && (
                      <span className="shrink-0 text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase">
                        {gallery.year}
                      </span>
                    )}
                  </div>
                  {credits && <p className="mt-1 text-sm text-ink-soft">{credits}</p>}
                  <div className="mt-3">
                    <GalleryViewer photos={gallery.photos} ratio="aspect-[4/3]" thumbCols={6} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
