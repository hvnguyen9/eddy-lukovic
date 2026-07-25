import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  description: "Your name, contact info, links, and stats shown across the site.",
  fields: [
    defineField({ name: "firstName", title: "First name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lastName", title: "Last name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'Shown under your name, e.g. "Actor".',
    }),
    defineField({ name: "location", title: "Location", type: "string", description: 'e.g. "New York City"' }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone (optional)", type: "string" }),
    defineField({
      name: "resumePdf",
      title: "Resume PDF",
      type: "file",
      description: "Upload your printable resume — the Download PDF button links here.",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
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
      title: "Representation",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Agency / manager name", type: "string" }),
        defineField({ name: "contact", title: "Contact email", type: "string" }),
      ],
    }),
    defineField({
      name: "vitals",
      title: "Vitals",
      type: "array",
      description: "Height, hair, eyes, unions… shown on the About page.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
