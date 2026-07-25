"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

// Singletons: one fixed document each, so Eddy can't accidentally create
// duplicates of Site Settings / Bio / Resume.
const singletons = [
  { type: "siteSettings", title: "Site Settings" },
  { type: "bio", title: "Bio" },
  { type: "resume", title: "Resume" },
];

const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      ...singletons.map((s) =>
        S.listItem()
          .title(s.title)
          .id(s.type)
          .child(S.document().schemaType(s.type).documentId(s.type))
      ),
      S.divider(),
      S.documentTypeListItem("photo").title("Photos"),
      S.documentTypeListItem("video").title("Videos"),
    ]);

export default defineConfig({
  name: "eddy-lukovic",
  title: "Eddy Lukovic — Site Content",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
