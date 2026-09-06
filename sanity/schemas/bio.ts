import { defineField, defineType } from "sanity";

// Document type stays "bio" so existing content is preserved; the studio
// presents it as "About".
export const bio = defineType({
  name: "bio",
  title: "About",
  type: "document",
  description: "Everything that appears on the About page.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Section label",
      type: "string",
      description: 'The small label above the headline. Defaults to "About" if left blank.',
      initialValue: "About",
    }),
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
      initialValue: "The long version, kept short.",
    }),
    defineField({
      name: "paragraphs",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description:
        "Each item is one paragraph. Pressing Enter inside an item also creates a line break.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      type: "string",
      description: "A short line highlighted in big type. Leave blank to hide.",
    }),
    defineField({
      name: "secondaryPhoto",
      title: "Main photo",
      type: "image",
      options: { hotspot: true },
      description: "The large photo on the About page.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "candids",
      title: "Candid photos",
      type: "array",
      description:
        "Small photos shown in rows of three under the main photo — your montage. Visitors can click one to see it full size.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
