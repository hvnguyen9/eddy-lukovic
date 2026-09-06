import { defineField, defineType } from "sanity";

export const directorPage = defineType({
  name: "directorPage",
  title: "Director Page",
  type: "document",
  description: "The Director page. Productions are edited in the list under this page.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Section label",
      type: "string",
      description: 'The small label above the headline. Defaults to "Director" if left blank.',
      initialValue: "Director",
    }),
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
          rows: 4,
          description:
            "Appears exactly as you type it — press Enter wherever you want a new line. Quotation marks are added for you unless you turn that off below.",
        }),
        defineField({
          name: "attribution",
          title: "Credit",
          type: "string",
          description: 'Who said it, e.g. "Pam Kragen — San Diego Union-Tribune". Leave blank to hide.',
        }),
        defineField({
          name: "quotationMarks",
          title: "Add quotation marks",
          type: "boolean",
          description: "Turn off if you want to type your own punctuation.",
          initialValue: true,
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
          title: "Where the quote sits on the image",
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
          name: "align",
          title: "Text justification",
          type: "string",
          description: "How the lines line up with each other.",
          options: {
            list: [
              { title: "Left", value: "left" },
              { title: "Center", value: "center" },
              { title: "Right", value: "right" },
            ],
            layout: "radio",
          },
          initialValue: "left",
        }),
        defineField({
          name: "shadow",
          title: "Drop shadow on the text",
          type: "boolean",
          description: "Helps the words stand out against a busy photo.",
          initialValue: true,
        }),
        defineField({
          name: "scrim",
          title: "Darken the photo behind the text",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "statementRich",
      title: "Artistic statement",
      type: "richText",
      description:
        "Select any words and use the toolbar (or Cmd+I) to italicize them. Enter starts a new paragraph.",
    }),
    defineField({
      name: "productionsHeading",
      title: "Production photos section heading",
      type: "string",
      description: 'The subheading above your production galleries — e.g. "Production Photos".',
      initialValue: "Production Photos",
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
