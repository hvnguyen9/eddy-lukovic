import { bio } from "./bio";
import { photo } from "./photo";
import { project } from "./project";
import { actingResume, directingResume } from "./resume";
import { siteSettings } from "./site-settings";
import { video } from "./video";

export const schemaTypes = [
  siteSettings,
  bio,
  actingResume,
  directingResume,
  photo,
  project,
  video,
];
