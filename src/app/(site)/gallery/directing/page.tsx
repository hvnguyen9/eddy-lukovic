import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Directing" };

export default async function DirectingGalleryPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Gallery</p>
      <h1 className="display mt-6 text-5xl font-medium sm:text-6xl">
        Directing <em className="text-oxblood">work</em>
      </h1>
      <Link
        href="/gallery/acting"
        className="nav-link mt-5 inline-block text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-ink-soft"
      >
        Switch to acting →
      </Link>

      {/* Minimal project grid — image, then quiet meta underneath */}
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/gallery/directing/${project.slug}`}
            className="group block"
          >
            <div className="overflow-hidden">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={1200}
                height={800}
                className="block aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h2 className="display text-2xl transition-colors group-hover:text-oxblood">
                {project.title}
              </h2>
              <span className="shrink-0 text-[0.7rem] font-semibold tracking-[0.2em] text-muted uppercase">
                {project.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {[project.role, project.company].filter(Boolean).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
