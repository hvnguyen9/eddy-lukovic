import { defineField, defineType } from "sanity";

export const actingGallery = defineType({
  name: "actingGallery",
  title: "Acting Gallery",
  type: "document",
  description: 'A labeled photo gallery on the Actor page (e.g. "Headshots", "Production Stills"). The first photo is the lead; the rest appear as thumbnails.',
  fields: [
    defineField({
      name: "title",
      title: "Gallery title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description: "Drag to reorder — the first photo is the gallery's lead image. Remember to hit Publish after adding photos!",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Description (for accessibility)", type: "string" }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
          ],
        },
      ],
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
  preview: {
    select: { title: "title", order: "order", media: "photos.0" },
    prepare: ({ title, order, media }) => ({
      title,
      subtitle: `Sort order: ${order ?? "—"}`,
      media,
    }),
  },
});
