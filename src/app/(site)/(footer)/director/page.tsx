import type { Metadata } from "next";
import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { GalleryViewer } from "@/components/gallery-viewer";
import { getDirectorPage, getProjects, toEmbedUrl } from "@/lib/content";

export const metadata: Metadata = { title: "Director" };

export default async function DirectorPage() {
  const [page, projects] = await Promise.all([getDirectorPage(), getProjects()]);

  return (
    <>
      {/* Lead photo — edge to edge, crop/hotspot from the studio applied */}
      {page.leadImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-night">
          <Image
            src={page.leadImage.src}
            alt={page.leadImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Artistic statement */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-12 md:pt-16">
        <p className="eyebrow">Director</p>
        <AccentHeading text={page.heading} />
        {page.statement && (
          <p className="display mt-8 text-xl leading-relaxed whitespace-pre-line sm:text-2xl">
            {page.statement}
          </p>
        )}
      </section>

      {/* Production galleries — lead photo + thumbnails per production */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            Productions
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {projects.map((project) => {
              // Cover leads the gallery; skip it if it's repeated in images.
              const photos = [
                ...(project.cover && !project.images.some((i) => i.src === project.cover?.src)
                  ? [{ ...project.cover, caption: "" }]
                  : []),
                ...project.images,
              ];
              const embed = toEmbedUrl(project.videoUrl);

              return (
                <article key={project.slug}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display text-2xl italic">{project.title}</h3>
                    {project.year && (
                      <span className="shrink-0 text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase">
                        {project.year}
                      </span>
                    )}
                  </div>
                  {(project.role || project.company) && (
                    <p className="mt-1 text-sm text-ink-soft">
                      {[project.role, project.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <div className="mt-4">
                    <GalleryViewer photos={photos} ratio="aspect-[3/2]" />
                  </div>
                  {project.description && (
                    <p className="mt-4 max-w-prose text-sm leading-relaxed whitespace-pre-line text-ink-soft">
                      {project.description}
                    </p>
                  )}
                  {embed && (
                    <div className="relative mt-6 aspect-video w-full overflow-hidden bg-night">
                      <iframe
                        src={embed}
                        title={`${project.title} — video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 size-full"
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
