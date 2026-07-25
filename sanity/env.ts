export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-07-01";

// The whole CMS is optional: until a Sanity project is configured, the site
// serves the seed content in /content/*.json.
export const sanityEnabled = projectId.length > 0;
