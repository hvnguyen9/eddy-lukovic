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
      description: "The sentence BELOW your name on the homepage. Leave blank to hide.",
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
      description: "A short line highlighted in big type on the About page. Leave blank to hide.",
    }),
    defineField({
      name: "headshot",
      title: "Homepage headshot",
      type: "image",
      options: { hotspot: true },
      description: "The big photo on the homepage.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "secondaryPhoto",
      title: "About page main photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "candids",
      title: "About page candid photos",
      type: "array",
      description: "Small fun/candid photos shown in a row under the main About photo — a little montage of you.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Bio" }) },
});
