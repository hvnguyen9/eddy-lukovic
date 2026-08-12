// Single source of truth for all site content.
//
// Two modes, switched by NEXT_PUBLIC_SANITY_PROJECT_ID:
//  - CMS off: serves the demo seed content in /content/*.json.
//  - CMS on (production): everything comes from Sanity, and BLANK MEANS
//    HIDDEN — empty fields stay empty ("" / []) so pages can simply omit
//    them. No seed placeholders leak into the live site. The one exception
//    is the site name, which falls back so <title> and the wordmark never
//    render blank.

import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId, sanityEnabled } from "../../sanity/env";

import siteJson from "../../content/site.json";
import bioJson from "../../content/bio.json";
import actorJson from "../../content/actor.json";
import directorJson from "../../content/director.json";
import contactJson from "../../content/contact.json";
import galleriesJson from "../../content/galleries.json";
import projectsJson from "../../content/projects.json";
import videosJson from "../../content/videos.json";

export interface ImageRef {
  src: string;
  alt: string;
  // Uncropped original, used by the lightbox. Falls back to src.
  full?: string;
}

export interface CaptionedImage extends ImageRef {
  caption?: string;
}

export interface LinkRef {
  label: string;
  url: string;
}

export interface SiteContent {
  name: string;
  firstName: string;
  lastName: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  resumePdfUrl: string;
  contactFormKey: string;
  heroLinks: LinkRef[];
  socials: LinkRef[];
  representation: { label: string; name: string; contact: string };
}

export interface BioContent {
  shortBio: string;
  paragraphs: string[];
  pullQuote: string;
  headshot: ImageRef | null;
  secondaryPhoto: ImageRef | null;
  candids: ImageRef[];
}

export interface ActorPageContent {
  heading: string;
  image: ImageRef | null;
  extraImages: ImageRef[];
  intro: string;
}

export interface DirectorPageContent {
  heading: string;
  leadImage: ImageRef | null;
  statement: string;
}

export interface ContactPageContent {
  heading: string;
  formLabel: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  buttonText: string;
  successTitle: string;
  successText: string;
}

export interface ActingGallery {
  title: string;
  photos: CaptionedImage[];
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  company: string;
  role: string;
  description: string;
  cover: ImageRef | null;
  images: CaptionedImage[];
  videoUrl: string;
}

export interface Video {
  title: string;
  kind: string;
  year: string;
  duration: string;
  url: string;
  description: string;
  featured: boolean;
}

const client = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

// Published edits appear on the live site within a minute.
const REVALIDATE_SECONDS = 60;

async function fetchSanity<T>(query: string): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, {}, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch {
    return null;
  }
}

// GROQ fragment: image field -> {src, alt} object, or null when unset.
const img = (field: string, altFallback = '""') =>
  `select(defined(${field}.asset) => {"src": ${field}.asset->url, "alt": coalesce(${field}.alt, ${altFallback})})`;

// For fixed-aspect renders we build the URL through Sanity's image pipeline so
// the crop + hotspot set in the studio actually shape what visitors see.
const urlBuilder = sanityEnabled ? imageUrlBuilder({ projectId, dataset }) : null;

interface RawSanityImage {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
}

// Raw image object -> ImageRef with a crop/hotspot-aware `src` at w×h and an
// uncropped `full` for the lightbox. Returns null when no asset is attached.
function croppedImage(
  raw: RawSanityImage | null | undefined,
  width: number,
  height: number,
  altFallback = ""
): ImageRef | null {
  if (!urlBuilder || !raw?.asset?._ref) return null;
  const source = raw as SanityImageSource;
  return {
    src: urlBuilder.image(source).width(width).height(height).fit("crop").auto("format").url(),
    full: urlBuilder.image(source).width(2400).fit("max").auto("format").url(),
    alt: raw.alt || altFallback,
  };
}

export async function getSite(): Promise<SiteContent> {
  const seed = siteJson as SiteContent;
  if (!sanityEnabled) return seed;

  const doc = await fetchSanity<Partial<SiteContent>>(`
    *[_type == "siteSettings"][0]{
      "firstName": coalesce(firstName, ""),
      "lastName": coalesce(lastName, ""),
      "tagline": coalesce(tagline, ""),
      "location": coalesce(location, ""),
      "email": coalesce(email, ""),
      "phone": coalesce(phone, ""),
      "resumePdfUrl": coalesce(resumePdf.asset->url, ""),
      "contactFormKey": coalesce(contactFormKey, ""),
      "heroLinks": coalesce(heroLinks[defined(label) && defined(url)]{label, "url": url}, []),
      "socials": coalesce(socials[defined(label) && defined(url)]{label, url}, []),
      "representation": {
        "label": "Representation",
        "name": coalesce(representation.name, ""),
        "contact": coalesce(representation.contact, "")
      }
    }`);

  const first = doc?.firstName || seed.firstName;
  const last = doc?.lastName || seed.lastName;
  return {
    firstName: first,
    lastName: last,
    name: `${first} ${last}`.trim(),
    tagline: doc?.tagline ?? "",
    location: doc?.location ?? "",
    email: doc?.email ?? "",
    phone: doc?.phone ?? "",
    resumePdfUrl: doc?.resumePdfUrl ?? "",
    contactFormKey: doc?.contactFormKey ?? "",
    heroLinks: doc?.heroLinks ?? [],
    socials: doc?.socials ?? [],
    representation: doc?.representation ?? { label: "Representation", name: "", contact: "" },
  };
}

export async function getBio(): Promise<BioContent> {
  if (!sanityEnabled) return bioJson as BioContent;
  const doc = await fetchSanity<
    Omit<BioContent, "candids"> & { candidsRaw: RawSanityImage[] }
  >(`
    *[_type == "bio"][0]{
      "shortBio": coalesce(shortBio, ""),
      "paragraphs": coalesce(paragraphs, []),
      "pullQuote": coalesce(pullQuote, ""),
      "headshot": ${img("headshot", '"Headshot"')},
      "secondaryPhoto": ${img("secondaryPhoto", '"Portrait"')},
      "candidsRaw": coalesce(candids[defined(asset)], [])
    }`);
  if (!doc) {
    return { shortBio: "", paragraphs: [], pullQuote: "", headshot: null, secondaryPhoto: null, candids: [] };
  }
  return {
    ...doc,
    // Square crops honor the studio's crop/hotspot
    candids: doc.candidsRaw
      .map((raw) => croppedImage(raw, 800, 800, "Photo"))
      .filter((c): c is ImageRef => c !== null),
  };
}

export async function getActorPage(): Promise<ActorPageContent> {
  if (!sanityEnabled) return actorJson as ActorPageContent;
  const doc = await fetchSanity<{
    heading: string;
    image: ImageRef | null;
    extraImagesRaw: RawSanityImage[];
    intro: string;
  }>(`
    *[_type == "actorPage"][0]{
      "heading": coalesce(heading, ""),
      "image": ${img("image", '"Headshot"')},
      "extraImagesRaw": coalesce(extraImages[defined(asset)], []),
      "intro": coalesce(intro, "")
    }`);
  if (!doc) return { heading: "", image: null, extraImages: [], intro: "" };
  return {
    heading: doc.heading,
    image: doc.image,
    extraImages: doc.extraImagesRaw
      .map((raw) => croppedImage(raw, 1600, 2000, "Photo"))
      .filter((c): c is ImageRef => c !== null),
    intro: doc.intro,
  };
}

export async function getDirectorPage(): Promise<DirectorPageContent> {
  if (!sanityEnabled) return directorJson as DirectorPageContent;
  const doc = await fetchSanity<{
    heading: string;
    leadImageRaw: RawSanityImage | null;
    statement: string;
  }>(`
    *[_type == "directorPage"][0]{
      "heading": coalesce(heading, ""),
      "leadImageRaw": leadImage,
      "statement": coalesce(statement, "")
    }`);
  if (!doc) return { heading: "", leadImage: null, statement: "" };
  return {
    heading: doc.heading,
    // 21:9 cinematic crop that honors the studio's crop/hotspot
    leadImage: croppedImage(doc.leadImageRaw, 2400, 1029, "Directing work"),
    statement: doc.statement,
  };
}

export async function getContactPage(): Promise<ContactPageContent> {
  const fallback = contactJson as ContactPageContent;
  if (!sanityEnabled) return fallback;
  const doc = await fetchSanity<Partial<ContactPageContent>>(`
    *[_type == "contactPage"][0]{
      "heading": coalesce(heading, ""),
      formLabel, nameLabel, emailLabel, messageLabel, buttonText, successTitle, successText
    }`);
  // Functional strings (labels, button, success copy) keep working defaults
  // when blank — hiding a submit button would break the form. The heading is
  // content: blank hides it. With no doc yet, keep today's copy.
  if (!doc) return fallback;
  return {
    heading: doc.heading ?? "",
    formLabel: doc.formLabel || fallback.formLabel,
    nameLabel: doc.nameLabel || fallback.nameLabel,
    emailLabel: doc.emailLabel || fallback.emailLabel,
    messageLabel: doc.messageLabel || fallback.messageLabel,
    buttonText: doc.buttonText || fallback.buttonText,
    successTitle: doc.successTitle || fallback.successTitle,
    successText: doc.successText || fallback.successText,
  };
}

export async function getActingGalleries(): Promise<ActingGallery[]> {
  if (!sanityEnabled) return galleriesJson.galleries as ActingGallery[];
  const docs = await fetchSanity<ActingGallery[]>(`
    *[_type == "actingGallery"] | order(order asc){
      "title": coalesce(title, ""),
      "photos": coalesce(photos[defined(asset)]{
        "src": asset->url,
        "alt": coalesce(alt, caption, "Photo"),
        "caption": coalesce(caption, "")
      }, [])
    }`);
  return (docs ?? []).filter((g) => g.photos.length > 0);
}

export async function getProjects(): Promise<Project[]> {
  if (!sanityEnabled) return projectsJson.projects as Project[];
  const docs = await fetchSanity<Project[]>(`
    *[_type == "project"] | order(order asc){
      "slug": coalesce(slug.current, _id),
      title,
      "year": coalesce(year, ""),
      "company": coalesce(company, ""),
      "role": coalesce(role, ""),
      "description": coalesce(description, ""),
      "cover": ${img("cover", "title")},
      "images": coalesce(images[defined(asset)]{"src": asset->url, "alt": coalesce(alt, ^.title), "caption": coalesce(caption, "")}, []),
      "videoUrl": coalesce(videoUrl, "")
    }`);
  return docs ?? [];
}

export async function getVideos(): Promise<Video[]> {
  if (!sanityEnabled) return videosJson.videos as Video[];
  const docs = await fetchSanity<Video[]>(`
    *[_type == "video"] | order(order asc){
      title,
      "kind": coalesce(kind, ""),
      "year": coalesce(year, ""),
      "duration": coalesce(duration, ""),
      "url": coalesce(url, ""),
      "description": coalesce(description, ""),
      "featured": coalesce(featured, false)
    }`);
  return docs ?? [];
}

// Turns a YouTube or Vimeo URL into an embeddable iframe src, or null if the
// URL is empty/unrecognized.
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
