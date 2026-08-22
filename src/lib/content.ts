// Single source of truth for all site content.
//
// Two modes, switched by NEXT_PUBLIC_SANITY_PROJECT_ID:
//  - CMS off: serves the demo seed content in /content/*.json.
//  - CMS on (production): everything comes from Sanity, and BLANK MEANS
//    HIDDEN — empty fields stay empty ("" / []) so pages can simply omit
//    them. The only fallback is the site name, so <title> and the wordmark
//    never render blank.
//
// Each getter maps to one page of the studio, mirroring how Eddy edits.

import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId, sanityEnabled } from "../../sanity/env";

import homeJson from "../../content/home.json";
import aboutJson from "../../content/about.json";
import actorJson from "../../content/actor.json";
import directorJson from "../../content/director.json";
import resumeJson from "../../content/resume.json";
import contactJson from "../../content/contact.json";
import footerJson from "../../content/footer.json";
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

export interface HomeContent {
  firstName: string;
  lastName: string;
  name: string;
  tagline: string;
  location: string;
  shortBio: string;
  headshot: ImageRef | null;
  heroLinks: LinkRef[];
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  pullQuote: string;
  mainPhoto: ImageRef | null;
  candids: ImageRef[];
}

export interface ImageQuote {
  text: string;
  attribution: string;
  size: "small" | "medium" | "large";
  color: "light" | "dark" | "accent";
  position: string;
  scrim: boolean;
}

export interface ActorPageContent {
  heading: string;
  image: ImageRef | null;
  extraImages: ImageRef[];
  intro: string;
  videosHeading: string;
  photosHeading: string;
}

export interface DirectorPageContent {
  heading: string;
  leadImage: ImageRef | null;
  quote: ImageQuote | null;
  statement: string;
  productionsHeading: string;
}

export interface ResumeEntry {
  label: string;
  fileUrl: string;
  fileName: string;
  preview: ImageRef | null;
}

export interface UpcomingProject {
  title: string;
  role: string;
  company: string;
  dates: string;
  note: string;
}

export interface ResumePageContent {
  heading: string;
  resumes: ResumeEntry[];
  upcomingHeading: string;
  upcoming: UpcomingProject[];
}

export interface ContactContent {
  heading: string;
  formLabel: string;
  directLabel: string;
  elsewhereLabel: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  buttonText: string;
  successTitle: string;
  successText: string;
  email: string;
  phone: string;
  socials: LinkRef[];
  representation: { label: string; name: string; contact: string };
  contactFormKey: string;
}

export type FooterSize = "compact" | "medium" | "tall";

export interface FooterContent {
  pages: string[];
  size: FooterSize;
  showEmail: boolean;
  showNav: boolean;
  showSocials: boolean;
  customText: string;
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
const urlBuilder = sanityEnabled ? createImageUrlBuilder({ projectId, dataset }) : null;

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

// Internal links are case-sensitive in the browser; "/Actor" would 404.
function normalizeUrl(url: string): string {
  const trimmed = (url ?? "").trim();
  return trimmed.startsWith("/") ? trimmed.toLowerCase() : trimmed;
}

export async function getHome(): Promise<HomeContent> {
  const seed = homeJson as HomeContent;
  if (!sanityEnabled) return seed;

  const doc = await fetchSanity<Partial<HomeContent>>(`
    *[_type == "siteSettings"][0]{
      "firstName": coalesce(firstName, ""),
      "lastName": coalesce(lastName, ""),
      "tagline": coalesce(tagline, ""),
      "location": coalesce(location, ""),
      "shortBio": coalesce(shortBio, ""),
      "headshot": ${img("headshot", '"Headshot"')},
      "heroLinks": coalesce(heroLinks[defined(label) && defined(url)]{label, url}, [])
    }`);

  const first = doc?.firstName || seed.firstName;
  const last = doc?.lastName || seed.lastName;
  return {
    firstName: first,
    lastName: last,
    name: `${first} ${last}`.trim(),
    tagline: doc?.tagline ?? "",
    location: doc?.location ?? "",
    shortBio: doc?.shortBio ?? "",
    headshot: doc?.headshot ?? null,
    heroLinks: (doc?.heroLinks ?? []).map((l) => ({ ...l, url: normalizeUrl(l.url) })),
  };
}

export async function getAbout(): Promise<AboutContent> {
  if (!sanityEnabled) return aboutJson as AboutContent;
  const doc = await fetchSanity<
    Omit<AboutContent, "candids"> & { candidsRaw: RawSanityImage[] }
  >(`
    *[_type == "bio"][0]{
      "heading": coalesce(heading, ""),
      "paragraphs": coalesce(paragraphs, []),
      "pullQuote": coalesce(pullQuote, ""),
      "mainPhoto": ${img("secondaryPhoto", '"Portrait"')},
      "candidsRaw": coalesce(candids[defined(asset)], [])
    }`);
  if (!doc) {
    return { heading: "", paragraphs: [], pullQuote: "", mainPhoto: null, candids: [] };
  }
  return {
    ...doc,
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
    videosHeading: string;
    photosHeading: string;
  }>(`
    *[_type == "actorPage"][0]{
      "heading": coalesce(heading, ""),
      "image": ${img("image", '"Headshot"')},
      "extraImagesRaw": coalesce(extraImages[defined(asset)], []),
      "intro": coalesce(intro, ""),
      "videosHeading": coalesce(videosHeading, ""),
      "photosHeading": coalesce(photosHeading, "")
    }`);
  if (!doc) {
    return { heading: "", image: null, extraImages: [], intro: "", videosHeading: "", photosHeading: "" };
  }
  return {
    heading: doc.heading,
    image: doc.image,
    extraImages: doc.extraImagesRaw
      .map((raw) => croppedImage(raw, 1600, 2000, "Photo"))
      .filter((c): c is ImageRef => c !== null),
    intro: doc.intro,
    videosHeading: doc.videosHeading,
    photosHeading: doc.photosHeading,
  };
}

export async function getDirectorPage(): Promise<DirectorPageContent> {
  if (!sanityEnabled) return directorJson as DirectorPageContent;
  const doc = await fetchSanity<{
    heading: string;
    leadImageRaw: RawSanityImage | null;
    quote: Partial<ImageQuote> | null;
    statement: string;
    productionsHeading: string;
  }>(`
    *[_type == "directorPage"][0]{
      "heading": coalesce(heading, ""),
      "leadImageRaw": leadImage,
      quote,
      "statement": coalesce(statement, ""),
      "productionsHeading": coalesce(productionsHeading, "")
    }`);
  if (!doc) {
    return { heading: "", leadImage: null, quote: null, statement: "", productionsHeading: "" };
  }
  const quoteText = doc.quote?.text?.trim();
  return {
    heading: doc.heading,
    // 21:9 cinematic crop that honors the studio's crop/hotspot
    leadImage: croppedImage(doc.leadImageRaw, 2400, 1029, "Directing work"),
    quote: quoteText
      ? {
          text: quoteText,
          attribution: doc.quote?.attribution ?? "",
          size: doc.quote?.size ?? "medium",
          color: doc.quote?.color ?? "light",
          position: doc.quote?.position ?? "bottom-left",
          scrim: doc.quote?.scrim ?? true,
        }
      : null,
    statement: doc.statement,
    productionsHeading: doc.productionsHeading,
  };
}

export async function getResumePage(): Promise<ResumePageContent> {
  if (!sanityEnabled) return resumeJson as ResumePageContent;
  const doc = await fetchSanity<{
    heading: string;
    resumes: { label: string; fileUrl: string; fileName: string; previewRaw: RawSanityImage | null }[];
    upcomingHeading: string;
    upcoming: UpcomingProject[];
  }>(`
    *[_type == "resumePage"][0]{
      "heading": coalesce(heading, ""),
      "resumes": coalesce(resumes[defined(file.asset)]{
        "label": coalesce(label, ""),
        "fileUrl": file.asset->url,
        "fileName": coalesce(file.asset->originalFilename, "resume.pdf"),
        "previewRaw": preview
      }, []),
      "upcomingHeading": coalesce(upcomingHeading, ""),
      "upcoming": coalesce(upcoming[]{
        "title": coalesce(title, ""),
        "role": coalesce(role, ""),
        "company": coalesce(company, ""),
        "dates": coalesce(dates, ""),
        "note": coalesce(note, "")
      }, [])
    }`);
  if (!doc) return { heading: "", resumes: [], upcomingHeading: "", upcoming: [] };
  return {
    heading: doc.heading,
    resumes: doc.resumes.map((r) => ({
      label: r.label,
      fileUrl: r.fileUrl,
      fileName: r.fileName,
      preview: croppedImage(r.previewRaw, 1200, 1553, r.label || "Resume"),
    })),
    upcomingHeading: doc.upcomingHeading,
    upcoming: doc.upcoming.filter((u) => u.title),
  };
}

export async function getContact(): Promise<ContactContent> {
  const fallback = contactJson as ContactContent;
  if (!sanityEnabled) return fallback;
  const doc = await fetchSanity<Partial<ContactContent>>(`
    *[_type == "contactPage"][0]{
      "heading": coalesce(heading, ""),
      formLabel, directLabel, elsewhereLabel, nameLabel, emailLabel, messageLabel,
      buttonText, successTitle, successText,
      "email": coalesce(email, ""),
      "phone": coalesce(phone, ""),
      "socials": coalesce(socials[defined(label) && defined(url)]{label, url}, []),
      "representation": {
        "label": "Representation",
        "name": coalesce(representation.name, ""),
        "contact": coalesce(representation.contact, "")
      },
      "contactFormKey": coalesce(contactFormKey, "")
    }`);
  // Functional strings (field labels, button, success copy) keep working
  // defaults when blank — hiding a submit button would break the form.
  // Headings and details are content: blank hides them.
  if (!doc) return fallback;
  return {
    heading: doc.heading ?? "",
    formLabel: doc.formLabel ?? fallback.formLabel,
    directLabel: doc.directLabel ?? fallback.directLabel,
    elsewhereLabel: doc.elsewhereLabel ?? fallback.elsewhereLabel,
    nameLabel: doc.nameLabel || fallback.nameLabel,
    emailLabel: doc.emailLabel || fallback.emailLabel,
    messageLabel: doc.messageLabel || fallback.messageLabel,
    buttonText: doc.buttonText || fallback.buttonText,
    successTitle: doc.successTitle || fallback.successTitle,
    successText: doc.successText || fallback.successText,
    email: doc.email ?? "",
    phone: doc.phone ?? "",
    socials: doc.socials ?? [],
    representation: doc.representation ?? { label: "Representation", name: "", contact: "" },
    contactFormKey: doc.contactFormKey ?? "",
  };
}

export async function getFooter(): Promise<FooterContent> {
  const fallback = footerJson as FooterContent;
  if (!sanityEnabled) return fallback;
  const doc = await fetchSanity<Partial<FooterContent>>(`
    *[_type == "footerSettings"][0]{
      pages, size, showEmail, showNav, showSocials,
      "customText": coalesce(customText, "")
    }`);
  if (!doc) return fallback;
  return {
    pages: doc.pages ?? fallback.pages,
    size: doc.size ?? "compact",
    showEmail: doc.showEmail ?? true,
    showNav: doc.showNav ?? true,
    showSocials: doc.showSocials ?? true,
    customText: doc.customText ?? "",
  };
}

// Repeatable content (galleries, productions, videos) is ordered by a
// drag-to-reorder list on its page document. An empty list means "show
// everything", so nothing disappears before the list has been filled in.
async function ordered<T>(
  orderQuery: string,
  allQuery: string
): Promise<T[]> {
  const picked = await fetchSanity<T[]>(orderQuery);
  if (picked && picked.length > 0) return picked;
  return (await fetchSanity<T[]>(allQuery)) ?? [];
}

const GALLERY_FIELDS = `{
  "title": coalesce(title, ""),
  "photos": coalesce(photos[defined(asset)]{
    "src": asset->url,
    "alt": coalesce(alt, caption, "Photo"),
    "caption": coalesce(caption, "")
  }, [])
}`;

export async function getActingGalleries(): Promise<ActingGallery[]> {
  if (!sanityEnabled) return galleriesJson.galleries as ActingGallery[];
  const docs = await ordered<ActingGallery>(
    `*[_type == "actorPage"][0].galleries[]->${GALLERY_FIELDS}`,
    `*[_type == "actingGallery"] | order(_createdAt asc) ${GALLERY_FIELDS}`
  );
  return docs.filter((g) => g.photos.length > 0);
}

const PROJECT_FIELDS = `{
  "slug": _id,
  title,
  "year": coalesce(year, ""),
  "company": coalesce(company, ""),
  "role": coalesce(role, ""),
  "description": coalesce(description, ""),
  "cover": ${img("cover", "title")},
  "images": coalesce(images[defined(asset)]{"src": asset->url, "alt": coalesce(alt, ^.title), "caption": coalesce(caption, "")}, []),
  "videoUrl": coalesce(videoUrl, "")
}`;

export async function getProjects(): Promise<Project[]> {
  if (!sanityEnabled) return projectsJson.projects as Project[];
  return ordered<Project>(
    `*[_type == "directorPage"][0].productions[]->${PROJECT_FIELDS}`,
    `*[_type == "project"] | order(_createdAt asc) ${PROJECT_FIELDS}`
  );
}

const VIDEO_FIELDS = `{
  title,
  "kind": coalesce(kind, ""),
  "year": coalesce(year, ""),
  "duration": coalesce(duration, ""),
  "url": coalesce(url, ""),
  "description": coalesce(description, "")
}`;

export async function getVideos(): Promise<Video[]> {
  if (!sanityEnabled) return videosJson.videos as Video[];
  return ordered<Video>(
    `*[_type == "actorPage"][0].videos[]->${VIDEO_FIELDS}`,
    `*[_type == "video"] | order(_createdAt asc) ${VIDEO_FIELDS}`
  );
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
