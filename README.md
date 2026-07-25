# Eddy Lukovic — Actor Site

Marketing site for actor Eddy Lukovic: bio, resume, photos, videos, contact.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Sanity CMS (optional, embedded studio).

## Design

"Playbill editorial" — warm bone paper background, warm ink text, oxblood accent, film-grain
overlay. Fraunces (display serif, optical sizing) + Archivo (body). Distinctive touches: ghost
outline type behind the hero, offset-frame photos, numbered credit rows, a dark "screening room"
section for video. All design tokens live in `src/app/globals.css` (`@theme` block) — palette or
font swaps are one-file changes.

## Pages

| Route | Content |
|---|---|
| `/` | Hero + selected work + showreel + about teaser + photo strip |
| `/about` | Full bio, pull quote, vitals (height/hair/unions/…) |
| `/resume` | Credit tables (Film/TV/Theatre), training, skills, Download PDF |
| `/media` | Videos (dark section) + photo gallery |
| `/contact` | Direct email, representation, social links |
| `/studio` | Sanity Studio — Eddy's editing UI (shows a setup notice until the CMS is connected) |

## Content architecture

**Every word, photo, and video on the site flows through `src/lib/content.ts`.** It has two modes:

1. **Seed mode (current):** serves the JSON files in `/content` (`site.json`, `bio.json`,
   `resume.json`, `photos.json`, `videos.json`). Edit those files to change the site.
2. **CMS mode:** when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, it fetches the same shapes from
   Sanity (60s ISR revalidate), falling back per-document to the seed JSON until Eddy has created
   each document in the studio. The Sanity schemas (`sanity/schemas/`) mirror the JSON 1:1.

Placeholder assets to replace with real ones: SVGs in `public/images/`, the placeholder PDF at
`public/resume/eddy-lukovic-resume.pdf`, and all names/credits in `/content` (invented seed copy).

## Connecting the CMS (one-time, ~10 minutes)

1. Create a free account + project at [sanity.io/manage](https://www.sanity.io/manage)
   (project name "eddy-lukovic", dataset `production`, visibility public).
2. Put the project ID in `.env.local` (copy `.env.example`) and in the Vercel project env vars.
3. In the project's **API → CORS origins**, add `http://localhost:3000` and the production domain
   (with credentials allowed) so the embedded studio at `/studio` can talk to the API.
4. Invite Eddy as a member (role: Editor) so he can log into `/studio` with just his email.
5. Open `/studio`, create the three singletons (Site Settings, Bio, Resume) and add Photos/Videos.
   Anything he doesn't fill in falls back to the seed JSON, so the site never breaks mid-migration.

Published edits appear on the live site within ~60 seconds (ISR revalidate).

For Eddy's non-technical instructions, see [EDITING-GUIDE.md](EDITING-GUIDE.md).

## Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check-types
pnpm build
```

Deploy: standard Vercel project, build command `next build`, no required env vars
(Sanity vars optional as above).
