import { defineField, defineType } from "sanity";

// Document type stays "siteSettings" so existing content is preserved; the
// studio presents it as "Home Page".
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Home Page",
  type: "document",
  description: "Everything that appears on the home page.",
  fields: [
    defineField({
      name: "firstName",
      title: "First name",
      type: "string",
      description: "Shown large on the home page (also used for the logo and browser tab).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'The small line ABOVE your name, e.g. "Actor & Director". Leave blank to hide.',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Shown next to the tagline, e.g. "San Diego, CA". Leave blank to hide.',
    }),
    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 3,
      description: "The sentence BELOW your name. Leave blank to hide.",
    }),
    defineField({
      name: "headshot",
      title: "Home page headshot",
      type: "image",
      options: { hotspot: true },
      description: "The large photo on the home page.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "heroLinks",
      title: "Home page buttons",
      type: "array",
      description:
        'Buttons under your intro. The first is a solid button, the rest are text links. Use /actor, /director, /resume, /about, /contact — or a full https:// link. Delete an entry to hide it.',
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Button text", type: "string" }),
            defineField({
              name: "url",
              title: "Where it goes",
              type: "string",
              description: "A page on your site (/actor, /resume, /contact…) or a full https:// link.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
