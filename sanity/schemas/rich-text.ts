import { defineArrayMember, defineType } from "sanity";

// A paragraph field with a formatting toolbar (italic, bold, links).
// Select text in the editor and use the toolbar or Cmd+I to italicize.
export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Plain paragraphs only — page headings are separate fields.
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Italic", value: "em" },
          { title: "Bold", value: "strong" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (r: any) =>
                  r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
