import type { Metadata } from "next";
import Link from "next/link";
import { VideoBlock } from "@/components/video-block";
import { getVideos } from "@/lib/content";

export const metadata: Metadata = { title: "Reel & Media" };

export default async function MediaPage() {
  const videos = await getVideos();
  const [featured, ...rest] = [...videos].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  return (
    <section className="bg-night text-bone">
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24">
        <p className="eyebrow">Reel & media</p>
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

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-bone/15 pt-8">
          <Link
            href="/gallery/acting"
            className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] text-bone/70 uppercase hover:text-bone"
          >
            Acting photo gallery →
          </Link>
          <Link
            href="/gallery/directing"
            className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] text-bone/70 uppercase hover:text-bone"
          >
            Directing work →
          </Link>
        </div>
      </div>
    </section>
  );
}
