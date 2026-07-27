// Single source of truth for all site content.
//
// Two modes, switched by NEXT_PUBLIC_SANITY_PROJECT_ID:
//  - CMS off (default): serves the seed content in /content/*.json.
//  - CMS on: fetches from Sanity (edited at /studio), falling back to the
//    seed JSON for any document that hasn't been created yet.
// The JSON shapes mirror the Sanity schemas, so pages never care which
// mode is active.

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityEnabled } from "../../sanity/env";

import siteJson from "../../content/site.json";
import bioJson from "../../content/bio.json";
import resumeJson from "../../content/resume.json";
import photosJson from "../../content/photos.json";
import projectsJson from "../../content/projects.json";
import videosJson from "../../content/videos.json";

export interface SocialLink {
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
  socials: SocialLink[];
  representation: { label: string; name: string; contact: string };
  vitals: { label: string; value: string }[];
}

export interface ImageRef {
  src: string;
  alt: string;
}

export interface BioContent {
  shortBio: string;
  paragraphs: string[];
  pullQuote: string;
  headshot: ImageRef;
  secondaryPhoto: ImageRef;
}

export interface Credit {
  title: string;
  role: string;
  company: string;
  director: string;
  year: string;
}

export interface ResumeContent {
  sections: { title: string; credits: Credit[] }[];
  training: { title: string; detail: string; year: string }[];
  skills: string[];
}

export type Discipline = "acting" | "directing";

export interface Project {
  slug: string;
  title: string;
  year: string;
  company: string;
  role: string;
  description: string;
  cover: ImageRef;
  images: (ImageRef & { caption?: string })[];
  videoUrl: string;
}

export interface Photo extends ImageRef {
  caption: string;
  aspect: "portrait" | "landscape";
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
    // CMS unreachable — serve seed content rather than crashing the site.
    return null;
  }
}

export async function getSite(): Promise<SiteContent> {
  const fallback = siteJson as SiteContent;
  const doc = await fetchSanity<Partial<SiteContent> | null>(`
    *[_type == "siteSettings"][0]{
      firstName, lastName, tagline, location, email, phone,
      "resumePdfUrl": resumePdf.asset->url,
      socials[]{label, url},
      "representation": {"label": "Representation", "name": representation.name, "contact": representation.contact},
      vitals[]{label, value}
    }`);
  if (!doc) return fallback;
  const merged = { ...fallback, ...Object.fromEntries(Object.entries(doc).filter(([, v]) => v != null)) } as SiteContent;
  merged.name = `${merged.firstName} ${merged.lastName}`;
  return merged;
}

export async function getBio(): Promise<BioContent> {
  const fallback = bioJson as BioContent;
  const doc = await fetchSanity<Partial<BioContent> | null>(`
    *[_type == "bio"][0]{
      shortBio, paragraphs, pullQuote,
      "headshot": select(defined(headshot.asset) => {"src": headshot.asset->url, "alt": coalesce(headshot.alt, "Headshot")}),
      "secondaryPhoto": select(defined(secondaryPhoto.asset) => {"src": secondaryPhoto.asset->url, "alt": coalesce(secondaryPhoto.alt, "Portrait")})
    }`);
  if (!doc) return fallback;
  return { ...fallback, ...Object.fromEntries(Object.entries(doc).filter(([, v]) => v != null)) } as BioContent;
}

// Acting and directing resumes are separate CMS documents with the same shape.
export async function getResume(discipline: Discipline): Promise<ResumeContent> {
  const docType = discipline === "acting" ? "actingResume" : "directingResume";
  const doc = await fetchSanity<ResumeContent | null>(`
    *[_type == "${docType}"][0]{
      sections[]{title, credits[]{
        title, role, company,
        "director": coalesce(director, ""),
        year
      }},
      "training": coalesce(training[]{title, detail, year}, []),
      "skills": coalesce(skills, [])
    }`);
  return doc ?? (resumeJson[discipline] as ResumeContent);
}

export async function getProjects(): Promise<Project[]> {
  const docs = await fetchSanity<Project[] | null>(`
    *[_type == "project" && defined(slug.current)] | order(order asc){
      "slug": slug.current,
      title,
      "year": coalesce(year, ""),
      "company": coalesce(company, ""),
      "role": coalesce(role, ""),
      "description": coalesce(description, ""),
      "cover": select(defined(cover.asset) => {"src": cover.asset->url, "alt": coalesce(cover.alt, title)}),
      "images": coalesce(images[defined(asset)]{"src": asset->url, "alt": coalesce(alt, ^.title), "caption": coalesce(caption, "")}, []),
      "videoUrl": coalesce(videoUrl, "")
    }`);
  if (docs && docs.length > 0) {
    // A project without a cover falls back to its first gallery image.
    return docs.map((p) => ({ ...p, cover: p.cover ?? p.images[0] ?? { src: "", alt: p.title } }));
  }
  return projectsJson.projects as Project[];
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getPhotos(): Promise<Photo[]> {
  const docs = await fetchSanity<Photo[] | null>(`
    *[_type == "photo" && defined(image.asset)] | order(order asc){
      "src": image.asset->url,
      "alt": coalesce(alt, caption, "Photo"),
      "caption": coalesce(caption, ""),
      "aspect": coalesce(aspect, "portrait")
    }`);
  if (docs && docs.length > 0) return docs;
  return photosJson.photos as Photo[];
}

export async function getVideos(): Promise<Video[]> {
  const docs = await fetchSanity<Video[] | null>(`
    *[_type == "video"] | order(order asc){
      title,
      "kind": coalesce(kind, "Reel"),
      "year": coalesce(year, ""),
      "duration": coalesce(duration, ""),
      "url": coalesce(url, ""),
      "description": coalesce(description, ""),
      "featured": coalesce(featured, false)
    }`);
  if (docs && docs.length > 0) return docs;
  return videosJson.videos as Video[];
}

export async function getFeaturedVideo(): Promise<Video | undefined> {
  const videos = await getVideos();
  return videos.find((v) => v.featured) ?? videos[0];
}

// Turns a YouTube or Vimeo URL into an embeddable iframe src, or null if the
// URL is empty/unrecognized (pages then render a "coming soon" placeholder).
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
