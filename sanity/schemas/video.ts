import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  description: "Reels, clips, and self-tapes. Paste a YouTube or Vimeo link.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["Reel", "Film Clip", "TV Clip", "Self Tape", "Interview"] },
      initialValue: "Reel",
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "duration", title: "Duration", type: "string", description: 'e.g. "2:14"' }),
    defineField({
      name: "url",
      title: "YouTube or Vimeo link",
      type: "url",
      description: "Paste the normal share link. Leave empty to show a “coming soon” slate.",
    }),
    defineField({ name: "description", title: "One-line description", type: "string" }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "The featured video is the big one on the homepage and Media page.",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 100 }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "kind" } },
});
