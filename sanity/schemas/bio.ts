import { defineField, defineType } from "sanity";

export const bio = defineType({
  name: "bio",
  title: "Bio",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 3,
      description: "One or two sentences — appears on the homepage under your name.",
    }),
    defineField({
      name: "paragraphs",
      title: "Full bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Each item is one paragraph on the About page.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      type: "string",
      description: "A short line you'd want highlighted in big type.",
    }),
    defineField({
      name: "headshot",
      title: "Primary headshot",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "secondaryPhoto",
      title: "Secondary photo",
      type: "image",
      options: { hotspot: true },
      description: "Shown on the About page.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Bio" }) },
});
