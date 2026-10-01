import type { Metadata } from "next";
import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { GalleryViewer } from "@/components/gallery-viewer";
import { ImageQuote } from "@/components/image-quote";
import { RichText } from "@/components/rich-text";
import { SectionHeading } from "@/components/section-heading";
import { getDirectorPage, getProjects, toEmbedUrl } from "@/lib/content";

export const metadata: Metadata = { title: "Director" };

export default async function DirectorPage() {
  const [page, projects] = await Promise.all([getDirectorPage(), getProjects()]);

  return (
    <>
      {/* Lead photo — edge to edge, with an optional review quote over it */}
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
          {page.quote && <ImageQuote quote={page.quote} />}
        </div>
      )}

      {/* Artistic statement */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-10 md:pt-14">
        {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
        <AccentHeading text={page.heading} />
        {/* Same body type as the About and Actor paragraphs */}
        <RichText
          value={page.statementRich}
          fallback={page.statement}
          className="mt-8 text-lg leading-relaxed text-ink-soft"
        />
      </section>

      {/* Production galleries — lead photo + thumbnails per production */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <SectionHeading text={page.productionsHeading} />
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
                  <div className="mt-3">
                    <GalleryViewer photos={photos} ratio="aspect-[3/2]" thumbCols={6} />
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
