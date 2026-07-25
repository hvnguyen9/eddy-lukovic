import type { Metadata } from "next";
import { getResume, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const [site, resume] = await Promise.all([getSite(), getResume()]);

  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Resume</p>
          <h1 className="display mt-6 text-5xl font-medium sm:text-6xl">
            Credits & <em className="text-oxblood">training</em>
          </h1>
        </div>
        <a
          href={site.resumePdfUrl}
          download
          className="bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-oxblood"
        >
          Download PDF
        </a>
      </div>

      {resume.sections.map((section) => (
        <div key={section.title} className="mt-16">
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            {section.title}
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <ul className="mt-4 divide-y divide-line border-b border-line">
            {section.credits.map((credit) => (
              <li
                key={`${credit.title}-${credit.role}`}
                className="grid gap-1 py-5 sm:grid-cols-[1.3fr_1fr_1fr_4rem] sm:items-baseline sm:gap-4"
              >
                <span className="display text-xl">{credit.title}</span>
                <span className="text-sm text-ink-soft">{credit.role}</span>
                <span className="text-sm text-muted">
                  {credit.company} · {credit.director}
                </span>
                <span className="text-sm text-muted sm:text-right">{credit.year}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            Training
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <ul className="mt-4 space-y-5">
            {resume.training.map((item) => (
              <li key={item.title}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.detail} · {item.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] text-oxblood uppercase">
            Special skills
            <span className="h-px flex-1 bg-line" aria-hidden />
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <li
                key={skill}
                className="border border-line px-3.5 py-1.5 text-sm text-ink-soft"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
