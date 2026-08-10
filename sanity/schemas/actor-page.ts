import { defineField, defineType } from "sanity";

export const actorPage = defineType({
  name: "actorPage",
  title: "Actor Page",
  type: "document",
  description: "The intro at the top of the Actor page. Videos and photo galleries are added separately.",
  fields: [
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 5,
      description: "A paragraph about your acting work, shown beside the main image.",
    }),
  ],
  preview: { prepare: () => ({ title: "Actor Page" }) },
});
