"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

// One entry per page of the website, in menu order. Repeatable content
// (galleries, productions, videos) is nested under the page it belongs to;
// the order those appear in is set on the page document itself.
const singletons = [
  { type: "siteSettings", title: "Home Page" },
  { type: "bio", title: "About" },
  { type: "actorPage", title: "Actor Page" },
  { type: "directorPage", title: "Director Page" },
  { type: "resumePage", title: "Resume Page" },
  { type: "contactPage", title: "Contact Page" },
  { type: "footerSettings", title: "Footer" },
];

const singletonItem = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

const structure = (S: StructureBuilder) =>
  S.list()
    .title("Website")
    .items([
      singletonItem(S, "siteSettings", "Home Page"),
      singletonItem(S, "bio", "About"),

      // Actor page + the galleries and videos it shows
      S.listItem()
        .title("Actor Page")
        .id("actorGroup")
        .child(
          S.list()
            .title("Actor Page")
            .items([
              singletonItem(S, "actorPage", "Page content"),
              S.documentTypeListItem("actingGallery").title("Photo Galleries"),
              S.documentTypeListItem("video").title("Videos"),
            ])
        ),

      // Director page + the productions it shows
      S.listItem()
        .title("Director Page")
        .id("directorGroup")
        .child(
          S.list()
            .title("Director Page")
            .items([
              singletonItem(S, "directorPage", "Page content"),
              S.documentTypeListItem("project").title("Productions"),
            ])
        ),

      singletonItem(S, "resumePage", "Resume Page"),
      singletonItem(S, "contactPage", "Contact Page"),
      S.divider(),
      singletonItem(S, "footerSettings", "Footer"),
    ]);

export default defineConfig({
  name: "eddy-lukovic",
  title: "Eddy Lukovic — Site Content",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons are opened from the list, never created from "＋ Create"
    templates: (prev) =>
      prev.filter((t) => !singletons.some((s) => s.type === t.schemaType)),
  },
  document: {
    // No duplicating or deleting the one-per-site page documents
    actions: (prev, { schemaType }) =>
      singletons.some((s) => s.type === schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // Vision is a developer query console — keep it out of Eddy's studio.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
