import { defineField, defineType } from "sanity";

export const actingGallery = defineType({
  name: "actingGallery",
  title: "Photo Gallery",
  type: "document",
  description:
    'A labeled photo gallery (e.g. "Headshots", or a production name). Set the order they appear in on the Actor Page, under "Photo galleries".',
  fields: [
    defineField({
      name: "title",
      title: "Gallery title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "company",
      title: "Production / venue",
      type: "string",
      description: 'e.g. "Roustabouts Theatre Company". Leave blank to hide.',
    }),
    defineField({
      name: "role",
      title: "Your role",
      type: "string",
      description: 'e.g. "Benjamin". Leave blank to hide.',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "Leave blank to hide.",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description:
        "Drag to reorder — the first photo is the gallery's lead image. Remember to hit Publish after adding photos!",
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
  ],
  preview: {
    select: { title: "title", company: "company", year: "year", photos: "photos", media: "photos.0" },
    prepare: ({ title, company, year, photos, media }) => ({
      title,
      subtitle: [company, year, `${photos?.length ?? 0} photos`].filter(Boolean).join(" · "),
      media,
    }),
  },
});
