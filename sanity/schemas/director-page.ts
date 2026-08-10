import { defineField, defineType } from "sanity";

export const directorPage = defineType({
  name: "directorPage",
  title: "Director Page",
  type: "document",
  description: "The lead image and statement at the top of the Director page. Production galleries are the Directing Projects.",
  fields: [
    defineField({
      name: "leadImage",
      title: "Lead image",
      type: "image",
      options: { hotspot: true },
      description: "Displayed edge-to-edge across the top of the page. Wide/landscape images work best.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "statement",
      title: "Artistic statement",
      type: "text",
      rows: 6,
      description: "A brief statement (≈5 sentences) about how you work as a director.",
    }),
  ],
  preview: { prepare: () => ({ title: "Director Page" }) },
});
