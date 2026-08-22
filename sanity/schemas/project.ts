import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Production",
  type: "document",
  description:
    'A production gallery. Set the order they appear in on the Director Page, under "Productions".',
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
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
      description: "The gallery's lead image. Landscape works best.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "images",
      title: "Photo gallery",
      type: "array",
      description: "Shown as thumbnails under the cover — drag to reorder. Remember to hit Publish after adding photos!",
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
  ],
  preview: {
    select: { title: "title", year: "year", company: "company", media: "cover" },
    prepare: ({ title, year, company, media }) => ({
      title,
      subtitle: [year, company].filter(Boolean).join(" · "),
      media,
    }),
  },
});
