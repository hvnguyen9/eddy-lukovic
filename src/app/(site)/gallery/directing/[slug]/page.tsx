import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, toEmbedUrl } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gallery/directing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project ? `${project.title} — Directing` : "Directing" };
}

export default async function ProjectPage({
  params,
}: PageProps<"/gallery/directing/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const embed = toEmbedUrl(project.videoUrl);

  return (
    <article className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24">
      <Link
        href="/gallery/directing"
        className="nav-link text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-ink-soft"
      >
        ← All directing work
      </Link>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-5xl font-medium sm:text-6xl">{project.title}</h1>
        <span className="text-[0.72rem] font-semibold tracking-[0.22em] text-oxblood uppercase">
          {project.year}
        </span>
      </div>
      <p className="mt-3 text-lg text-ink-soft">
        {[project.role, project.company].filter(Boolean).join(" · ")}
      </p>

      {project.description && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {project.description}
        </p>
      )}

      {embed && (
        <div className="relative mt-12 aspect-video w-full overflow-hidden bg-night">
          <iframe
            src={embed}
            title={`${project.title} — video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
      )}

      <div className="mt-12 space-y-10">
        {project.images.map((image) => (
          <figure key={image.src + (image.caption ?? "")}>
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={800}
              className="block w-full object-cover"
            />
            {image.caption && (
              <figcaption className="mt-2 text-xs tracking-wider text-muted uppercase">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </article>
  );
}
