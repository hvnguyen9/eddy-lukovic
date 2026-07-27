import { defineField, defineType } from "sanity";

const credit = {
  type: "object" as const,
  fields: [
    defineField({ name: "title", title: "Project title", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string", description: 'e.g. "Lead — Marko", "Co-Star", or "Director"' }),
    defineField({ name: "company", title: "Production / company", type: "string" }),
    defineField({ name: "director", title: "Director (optional)", type: "string", description: 'e.g. "dir. A. Reyes" — usually left empty on the directing resume' }),
    defineField({ name: "year", title: "Year", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "role" },
  },
};

// Acting and directing resumes share the same shape but are separate
// documents, mirroring the site's Resume → Acting / Directing split.
const resumeFields = [
  defineField({
    name: "sections",
    title: "Credit sections",
    type: "array",
    description: "Film, Television, Theatre… each with its list of credits. Drag to reorder.",
    of: [
      {
        type: "object" as const,
        fields: [
          defineField({ name: "title", title: "Section title", type: "string" }),
          defineField({ name: "credits", title: "Credits", type: "array", of: [credit] }),
        ],
        preview: { select: { title: "title" } },
      },
    ],
  }),
  defineField({
    name: "training",
    title: "Training",
    type: "array",
    of: [
      {
        type: "object" as const,
        fields: [
          defineField({ name: "title", title: "Program", type: "string" }),
          defineField({ name: "detail", title: "School / detail", type: "string" }),
          defineField({ name: "year", title: "Year(s)", type: "string" }),
        ],
        preview: { select: { title: "title", subtitle: "year" } },
      },
    ],
  }),
  defineField({
    name: "skills",
    title: "Special skills",
    type: "array",
    of: [{ type: "string" as const }],
  }),
];

export const actingResume = defineType({
  name: "actingResume",
  title: "Acting Resume",
  type: "document",
  fields: resumeFields,
  preview: { prepare: () => ({ title: "Acting Resume" }) },
});

export const directingResume = defineType({
  name: "directingResume",
  title: "Directing Resume",
  type: "document",
  fields: resumeFields,
  preview: { prepare: () => ({ title: "Directing Resume" }) },
});
