import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  description: "Your name, contact info, links, and resume PDF.",
  fields: [
    defineField({ name: "firstName", title: "First name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lastName", title: "Last name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'The small line ABOVE your name on the homepage, e.g. "Actor & Director". (The sentence BELOW your name is edited in Bio → "Short bio".)',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Shown next to the tagline, e.g. "New York City". Leave blank to hide.',
    }),
    defineField({ name: "email", title: "Email", type: "string", description: "Shown on the Contact page and in the footer. Leave blank to hide." }),
    defineField({ name: "phone", title: "Phone (optional)", type: "string", description: "Leave blank to hide." }),
    defineField({
      name: "resumePdf",
      title: "Resume PDF",
      type: "file",
      description: "The Resume page displays and offers a download of this exact file.",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "heroLinks",
      title: "Homepage buttons",
      type: "array",
      description: 'The buttons under your intro on the homepage (e.g. "Watch the reel" → /actor#videos, "View resume" → /resume). The first is a solid button, the rest are text links. Delete an entry to hide it.',
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
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      description: "Shown on the Contact page and in the footer. Delete an entry to hide it.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "representation",
      title: "Representation (optional)",
      type: "object",
      description: "Agent or manager. Leave both fields blank to hide it everywhere.",
      fields: [
        defineField({ name: "name", title: "Agency / manager name", type: "string" }),
        defineField({ name: "contact", title: "Contact email", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
