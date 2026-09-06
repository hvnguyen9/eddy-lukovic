import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { ResumeCard } from "@/components/resume-card";
import { SectionHeading } from "@/components/section-heading";
import { getContact, getResumePage } from "@/lib/content";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const [page, contact] = await Promise.all([getResumePage(), getContact()]);
  const { resumes, upcoming } = page;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 pb-14 md:pt-14">
      {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
      <AccentHeading text={page.heading} />

      {/* Upcoming work leads the page — it's the most current news */}
      {upcoming.length > 0 && (
        <div className="mt-10">
          <SectionHeading text={page.upcomingHeading} />
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {upcoming.map((project) => (
              <li
                key={project.title + project.dates}
                className="grid gap-1 py-5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-baseline sm:gap-4"
              >
                <span className="display text-xl">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-oxblood decoration-1 underline-offset-4 transition-colors hover:text-oxblood"
                    >
                      {project.title} ↗
                    </a>
                  ) : (
                    project.title
                  )}
                </span>
                {project.role && <span className="text-sm text-ink-soft">{project.role}</span>}
                {project.company && <span className="text-sm text-muted">{project.company}</span>}
                {project.dates && (
                  <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase sm:text-right">
                    {project.dates}
                  </span>
                )}
                {project.note && (
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-ink-soft sm:col-span-4">
                    {project.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumes.length > 0 ? (
        <div
          className={`grid gap-10 ${upcoming.length > 0 ? "mt-16" : "mt-10"} ${
            resumes.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-xl"
          }`}
        >
          {resumes.map((resume) => (
            <ResumeCard key={resume.fileUrl} resume={resume} />
          ))}
        </div>
      ) : (
        <p className="mt-10 max-w-md leading-relaxed text-ink-soft">
          The resume is being updated — check back soon
          {contact.email ? (
            <>
              , or{" "}
              <a
                href={`mailto:${contact.email}`}
                className="underline underline-offset-4 hover:text-oxblood"
              >
                request a copy by email
              </a>
            </>
          ) : null}
          .
        </p>
      )}
    </section>
  );
}
