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
  { type: "actorPage", title: "Actor Page" },
  { type: "directorPage", title: "Director Page" },
  { type: "contactPage", title: "Contact Page" },
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
      // Lists open sorted the same way the site sorts them (Sort order field)
      S.listItem()
        .title("Acting Galleries")
        .id("actingGalleries")
        .child(
          S.documentTypeList("actingGallery")
            .title("Acting Galleries")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Directing Projects")
        .id("directingProjects")
        .child(
          S.documentTypeList("project")
            .title("Directing Projects")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Videos")
        .id("videos")
        .child(
          S.documentTypeList("video")
            .title("Videos")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
    ]);

export default defineConfig({
  name: "eddy-lukovic",
  title: "Eddy Lukovic — Site Content",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision is a developer query console — keep it out of Eddy's studio.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
