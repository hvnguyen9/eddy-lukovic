import { defineField, defineType } from "sanity";

const credit = {
  type: "object" as const,
  fields: [
    defineField({ name: "title", title: "Project title", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string", description: 'e.g. "Lead — Marko" or "Co-Star"' }),
    defineField({ name: "company", title: "Production / company", type: "string" }),
    defineField({ name: "director", title: "Director", type: "string", description: 'e.g. "dir. A. Reyes"' }),
    defineField({ name: "year", title: "Year", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "role" },
  },
};

export const resume = defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      title: "Credit sections",
      type: "array",
      description: "Film, Television, Theatre… each with its list of credits. Drag to reorder.",
      of: [
        {
          type: "object",
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
          type: "object",
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
      of: [{ type: "string" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Resume" }) },
});
