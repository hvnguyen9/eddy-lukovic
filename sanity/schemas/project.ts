import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Directing Project",
  type: "document",
  description: "A directing credit with its own page: photos, description, optional video.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Click Generate — becomes the page URL, e.g. /gallery/directing/the-pillowman",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "company", title: "Production / venue", type: "string", description: 'e.g. "Basement Theatre Lab"' }),
    defineField({ name: "role", title: "Your role", type: "string", description: 'e.g. "Director" or "Writer / Director"', initialValue: "Director" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "A short paragraph about the production.",
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description: "The image shown on the Directing grid. Landscape works best.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "images",
      title: "Photo gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Description (for accessibility)", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video link (optional)",
      type: "url",
      description: "YouTube or Vimeo link — trailer, archival footage, etc.",
    }),
    defineField({ name: "order", title: "Sort order", type: "number", description: "Lower numbers show first.", initialValue: 100 }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "year", media: "cover" } },
});
