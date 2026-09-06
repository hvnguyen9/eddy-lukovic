import { actingGallery } from "./acting-gallery";
import { actorPage } from "./actor-page";
import { bio } from "./bio";
import { contactPage } from "./contact-page";
import { directorPage } from "./director-page";
import { footerSettings } from "./footer-settings";
import { project } from "./project";
import { richText } from "./rich-text";
import { resumePage } from "./resume-page";
import { siteSettings } from "./site-settings";
import { video } from "./video";

export const schemaTypes = [
  richText,
  siteSettings,
  bio,
  actorPage,
  directorPage,
  resumePage,
  contactPage,
  footerSettings,
  actingGallery,
  project,
  video,
];
