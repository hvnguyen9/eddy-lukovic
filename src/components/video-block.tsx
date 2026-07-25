import { toEmbedUrl, type Video } from "@/lib/content";

// Renders a 16:9 video embed, or a styled "coming soon" slate when no URL yet.
export function VideoBlock({ video, dark = false }: { video: Video; dark?: boolean }) {
  const embed = toEmbedUrl(video.url);

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden bg-night">
        {embed ? (
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border border-bone/10">
            <span className="grid size-16 place-items-center rounded-full border border-bone/30 text-bone/70">
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
                <path d="M1 1.5 L17 10 L1 18.5 Z" fill="currentColor" />
              </svg>
            </span>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-bone/50">
              {video.kind} — coming soon
            </p>
          </div>
        )}
      </div>
      <figcaption
        className={`mt-3 flex items-baseline justify-between gap-4 text-sm ${dark ? "text-bone/70" : "text-muted"}`}
      >
        <span className={dark ? "text-bone" : "text-ink"}>
          <span className="font-semibold">{video.title}</span>
          {video.description ? <span className={dark ? "text-bone/60" : "text-muted"}> — {video.description}</span> : null}
        </span>
        <span className="shrink-0 text-xs tracking-wider">
          {[video.year, video.duration].filter(Boolean).join(" · ")}
        </span>
      </figcaption>
    </figure>
  );
}
