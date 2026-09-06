import { defineField, defineType } from "sanity";

export const actorPage = defineType({
  name: "actorPage",
  title: "Actor Page",
  type: "document",
  description: "The Actor page. Videos and photo galleries are edited in the lists under this page.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Section label",
      type: "string",
      description: 'The small label above the headline. Defaults to "Actor" if left blank.',
      initialValue: "Actor",
    }),
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
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
      title: "Extra images",
      type: "array",
      description:
        "Shown as thumbnails under the main image (three fit per row). Click any image on the site to see it full size.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "introRich",
      title: "Intro paragraph",
      type: "richText",
      description:
        "Shown beside the main image. Select any words and use the toolbar (or Cmd+I) to italicize them. Enter starts a new paragraph.",
    }),
    defineField({
      name: "videosHeading",
      title: "Videos section heading",
      type: "string",
      description: "The subheading above your videos. Leave blank to hide the heading.",
      initialValue: "Videos",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      description:
        "Drag to set the order they appear on the page. Use ＋ to add one (pick an existing video or create a new one). Removing one here hides it from the page without deleting it. Leave this list empty and every video shows, oldest first.",
      of: [{ type: "reference", to: [{ type: "video" }] }],
    }),
    defineField({
      name: "photosHeading",
      title: "Photos section heading",
      type: "string",
      description: "The subheading above your photo galleries. Leave blank to hide the heading.",
      initialValue: "Photos",
    }),
    defineField({
      name: "galleries",
      title: "Photo galleries",
      type: "array",
      description:
        "Drag to set the order they appear on the page. Use ＋ to add one (pick an existing gallery or create a new one). Removing one here hides it from the page without deleting it. Leave this list empty and every gallery shows, oldest first.",
      of: [{ type: "reference", to: [{ type: "actingGallery" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Actor Page" }) },
});
