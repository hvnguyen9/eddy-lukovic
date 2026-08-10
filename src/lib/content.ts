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
import { apiVersion, dataset, projectId, sanityEnabled } from "../../sanity/env";

import siteJson from "../../content/site.json";
import bioJson from "../../content/bio.json";
import actorJson from "../../content/actor.json";
import directorJson from "../../content/director.json";
import galleriesJson from "../../content/galleries.json";
import projectsJson from "../../content/projects.json";
import videosJson from "../../content/videos.json";

export interface ImageRef {
  src: string;
  alt: string;
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
  image: ImageRef | null;
  intro: string;
}

export interface DirectorPageContent {
  leadImage: ImageRef | null;
  statement: string;
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
  const doc = await fetchSanity<BioContent>(`
    *[_type == "bio"][0]{
      "shortBio": coalesce(shortBio, ""),
      "paragraphs": coalesce(paragraphs, []),
      "pullQuote": coalesce(pullQuote, ""),
      "headshot": ${img("headshot", '"Headshot"')},
      "secondaryPhoto": ${img("secondaryPhoto", '"Portrait"')},
      "candids": coalesce(candids[defined(asset)]{"src": asset->url, "alt": coalesce(alt, "Photo")}, [])
    }`);
  return (
    doc ?? { shortBio: "", paragraphs: [], pullQuote: "", headshot: null, secondaryPhoto: null, candids: [] }
  );
}

export async function getActorPage(): Promise<ActorPageContent> {
  if (!sanityEnabled) return actorJson as ActorPageContent;
  const doc = await fetchSanity<ActorPageContent>(`
    *[_type == "actorPage"][0]{
      "image": ${img("image", '"Headshot"')},
      "intro": coalesce(intro, "")
    }`);
  return doc ?? { image: null, intro: "" };
}

export async function getDirectorPage(): Promise<DirectorPageContent> {
  if (!sanityEnabled) return directorJson as DirectorPageContent;
  const doc = await fetchSanity<DirectorPageContent>(`
    *[_type == "directorPage"][0]{
      "leadImage": ${img("leadImage", '"Directing work"')},
      "statement": coalesce(statement, "")
    }`);
  return doc ?? { leadImage: null, statement: "" };
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
