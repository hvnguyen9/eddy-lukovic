import { defineField, defineType } from "sanity";

export const actorPage = defineType({
  name: "actorPage",
  title: "Actor Page",
  type: "document",
  description: "The intro at the top of the Actor page. Videos and photo galleries are added separately.",
  fields: [
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline on the Actor page (the last word gets the accent style). Leave blank to hide.",
      initialValue: "On camera, on stage.",
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "extraImages",
      title: "Extra images (up to 2)",
      type: "array",
      description: "Shown as thumbnails under the main image. Click any image on the site to see it full size.",
      validation: (r) => r.max(2),
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 5,
      description: "A paragraph about your acting work, shown beside the main image. Blank lines create paragraph breaks.",
    }),
  ],
  preview: { prepare: () => ({ title: "Actor Page" }) },
});
