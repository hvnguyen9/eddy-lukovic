import { defineField, defineType } from "sanity";

export const PAGE_CHOICES = [
  { title: "Home", value: "home" },
  { title: "About", value: "about" },
  { title: "Actor", value: "actor" },
  { title: "Director", value: "director" },
  { title: "Resume", value: "resume" },
  { title: "Contact", value: "contact" },
];

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  description: "What the footer shows, how tall it is, and which pages it appears on.",
  fields: [
    defineField({
      name: "pages",
      title: "Show the footer on these pages",
      type: "array",
      of: [{ type: "string" }],
      options: { list: PAGE_CHOICES },
      description: "Untick a page and the footer disappears from it.",
      initialValue: ["about", "actor", "director", "resume", "contact"],
    }),
    defineField({
      name: "size",
      title: "Footer size",
      type: "string",
      options: {
        list: [
          { title: "Compact", value: "compact" },
          { title: "Medium", value: "medium" },
          { title: "Tall", value: "tall" },
        ],
        layout: "radio",
      },
      initialValue: "compact",
    }),
    defineField({
      name: "showEmail",
      title: "Show your email",
      type: "boolean",
      description: "Uses the email from the Contact Page.",
      initialValue: true,
    }),
    defineField({
      name: "showNav",
      title: "Show the page links",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSocials",
      title: "Show your social links",
      type: "boolean",
      description: "Uses the social links from the Contact Page.",
      initialValue: true,
    }),
    defineField({
      name: "customText",
      title: "Extra line of text",
      type: "string",
      description:
        "Optional line shown next to the copyright, e.g. a credit or a tagline. Leave blank to hide.",
    }),
  ],
  preview: { prepare: () => ({ title: "Footer" }) },
});
