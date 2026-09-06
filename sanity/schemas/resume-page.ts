import { defineField, defineType } from "sanity";

export const resumePage = defineType({
  name: "resumePage",
  title: "Resume Page",
  type: "document",
  description: "Your resume PDFs and any upcoming projects.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Section label",
      type: "string",
      description: 'The small label above the headline. Defaults to "Resume" if left blank.',
      initialValue: "Resume",
    }),
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
      initialValue: "Credits & training",
    }),
    defineField({
      name: "resumes",
      title: "Resumes (up to 2)",
      type: "array",
      description:
        "One resume shows centered; two show side by side. Visitors can click to view full screen or download.",
      validation: (r) => r.max(2),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Shown above the resume, e.g. "Theatre" or "Film & TV". Leave blank to hide.',
            }),
            defineField({
              name: "file",
              title: "Resume PDF",
              type: "file",
              options: { accept: ".pdf" },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "preview",
              title: "Preview image (optional)",
              type: "image",
              options: { hotspot: true },
              description:
                "Optional. A picture of the resume gives the crispest preview; without one the site shows the PDF itself.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "file.asset.originalFilename" } },
        },
      ],
      // Pre-loaded with the resume already uploaded in the studio.
      initialValue: [
        {
          label: "Theatre",
          file: {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: "file-0b2b3a65d2c04c9d0eb7baa6e47a6ec8e28a4145-pdf",
            },
          },
        },
      ],
    }),
    defineField({
      name: "upcomingHeading",
      title: 'Upcoming section heading',
      type: "string",
      description: 'The subheading above upcoming projects. Leave blank to hide the heading.',
      initialValue: "Upcoming Projects",
    }),
    defineField({
      name: "upcoming",
      title: "Upcoming projects",
      type: "array",
      description:
        "Acting or directing work on the horizon. Leave this empty and the whole section disappears from the page.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Project title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", title: "Your role", type: "string", description: 'e.g. "Director" or "Lead — Marko"' }),
            defineField({ name: "company", title: "Company / venue", type: "string" }),
            defineField({ name: "dates", title: "Dates", type: "string", description: 'e.g. "Spring 2027"' }),
            defineField({
              name: "url",
              title: "Link (optional)",
              type: "url",
              description: "Link the title to a ticket page or theatre website. Leave blank for no link.",
            }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2, description: "Optional extra detail." }),
          ],
          preview: { select: { title: "title", subtitle: "dates" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Resume Page" }) },
});
