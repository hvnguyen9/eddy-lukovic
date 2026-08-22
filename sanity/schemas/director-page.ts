import { defineField, defineType } from "sanity";

export const directorPage = defineType({
  name: "directorPage",
  title: "Director Page",
  type: "document",
  description: "The Director page. Productions are edited in the list under this page.",
  fields: [
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
      initialValue: "The director's cut.",
    }),
    defineField({
      name: "leadImage",
      title: "Lead image",
      type: "image",
      options: { hotspot: true },
      description:
        "Displayed edge-to-edge in a wide cinematic strip. Use the crop tool, then drag the hotspot circle onto the focal point — the site keeps that point in view.",
      fields: [defineField({ name: "alt", title: "Description (for accessibility)", type: "string" })],
    }),
    defineField({
      name: "quote",
      title: "Review quote on the lead image",
      type: "object",
      description: "Optional. Leave the quote text blank and nothing appears on the image.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "text",
          title: "Quote",
          type: "text",
          rows: 3,
          description: 'The quote itself — no need to type quotation marks, the site adds them.',
        }),
        defineField({
          name: "attribution",
          title: "Credit",
          type: "string",
          description: 'Who said it, e.g. "San Diego Union-Tribune". Leave blank to hide.',
        }),
        defineField({
          name: "size",
          title: "Text size",
          type: "string",
          options: {
            list: [
              { title: "Small", value: "small" },
              { title: "Medium", value: "medium" },
              { title: "Large", value: "large" },
            ],
            layout: "radio",
          },
          initialValue: "medium",
        }),
        defineField({
          name: "color",
          title: "Text color",
          type: "string",
          options: {
            list: [
              { title: "Light (for dark photos)", value: "light" },
              { title: "Dark (for light photos)", value: "dark" },
              { title: "Accent red", value: "accent" },
            ],
            layout: "radio",
          },
          initialValue: "light",
        }),
        defineField({
          name: "position",
          title: "Position on the image",
          type: "string",
          options: {
            list: [
              { title: "Top left", value: "top-left" },
              { title: "Top center", value: "top-center" },
              { title: "Top right", value: "top-right" },
              { title: "Middle left", value: "middle-left" },
              { title: "Middle center", value: "middle-center" },
              { title: "Middle right", value: "middle-right" },
              { title: "Bottom left", value: "bottom-left" },
              { title: "Bottom center", value: "bottom-center" },
              { title: "Bottom right", value: "bottom-right" },
            ],
          },
          initialValue: "bottom-left",
        }),
        defineField({
          name: "scrim",
          title: "Darken the photo behind the text",
          type: "boolean",
          description: "Helps the words stay readable over a busy photo.",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "statement",
      title: "Artistic statement",
      type: "text",
      rows: 6,
      description: "A brief statement about how you work. Press Enter for paragraph breaks.",
    }),
    defineField({
      name: "productionsHeading",
      title: "Productions section heading",
      type: "string",
      description: "The subheading above your production galleries. Leave blank to hide the heading.",
      initialValue: "Productions",
    }),
    defineField({
      name: "productions",
      title: "Productions",
      type: "array",
      description:
        "Drag to set the order they appear on the page. Use ＋ to add one (pick an existing production or create a new one). Removing one here hides it from the page without deleting it. Leave this list empty and every production shows, oldest first.",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Director Page" }) },
});
