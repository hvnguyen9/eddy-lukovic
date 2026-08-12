import { defineField, defineType } from "sanity";

export const directorPage = defineType({
  name: "directorPage",
  title: "Director Page",
  type: "document",
  description: "The lead image and statement at the top of the Director page. Production galleries are the Directing Projects.",
  fields: [
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline on the Director page (the last word gets the accent style). Leave blank to hide.",
      initialValue: "The director's cut.",
    }),
    defineField({
      name: "leadImage",
      title: "Lead image",
      type: "image",
      options: { hotspot: true },
      description: "Displayed edge-to-edge in a wide cinematic strip. Use the crop tool and set the hotspot on the focal point — the site keeps that point in view.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "statement",
      title: "Artistic statement",
      type: "text",
      rows: 6,
      description: "A brief statement (≈5 sentences) about how you work as a director. Blank lines create paragraph breaks.",
    }),
  ],
  preview: { prepare: () => ({ title: "Director Page" }) },
});
