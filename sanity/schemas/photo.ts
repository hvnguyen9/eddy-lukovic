import { defineField, defineType } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  description: "Headshots and production stills shown on the Media page and homepage.",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "alt",
      title: "Description (for accessibility)",
      type: "string",
      description: 'What\'s in the photo, e.g. "Eddy in a grey suit, smiling".',
    }),
    defineField({ name: "caption", title: "Caption", type: "string", description: 'e.g. "Primary headshot — 2026"' }),
    defineField({
      name: "aspect",
      title: "Orientation",
      type: "string",
      options: { list: ["portrait", "landscape"], layout: "radio" },
      initialValue: "portrait",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers show first.",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "caption", media: "image" } },
});
