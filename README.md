# Eddy Lukovic — Actor & Director Site

Marketing site for actor/director Eddy Lukovic: bio, split acting/directing resumes and
galleries, directing project pages, reel, contact.
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
| `/` | Minimal hero only: toolbar, name, headshot, optional CMS-driven buttons. No footer. |
| `/about` | Bio paragraphs + pull quote; main photo with a candid-photo montage beneath |
| `/actor` | Main image + intro, Videos band (embeds), labeled photo galleries (lead + thumbnails) |
| `/director` | Edge-to-edge lead image, artistic statement, production galleries (lead + thumbnails) |
| `/resume` | Redirects straight to the uploaded PDF (Site Settings → Resume PDF); opens in a new tab from the nav. The Resume link hides site-wide when no PDF is uploaded |
| `/contact` | Contact form (Web3Forms) + whatever contact fields are filled in |
| `/studio` | Sanity Studio — Eddy's editing UI |

Old routes (`/media`, `/gallery/*`, `/resume/acting|directing`) redirect to their successors.

**Blank-means-hidden:** with the CMS connected, every empty field/document simply hides its
element — no seed placeholders leak into production. The seed JSON in `/content` is used only
when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset (local demo mode). The only fallback in CMS mode
is the site name (so `<title>`/wordmark never render blank).

The shared `GalleryViewer` component (lead photo + clickable thumbnail strip) powers both the
acting galleries and the directing production galleries.

## Content architecture

**Every word, photo, and video on the site flows through `src/lib/content.ts`.** It has two modes:

1. **Seed mode:** serves the JSON files in `/content` (`site.json`, `bio.json`, `actor.json`,
   `director.json`, `galleries.json`, `projects.json`, `videos.json`). Demo/local only.
2. **CMS mode:** when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, everything comes from Sanity
   (60s ISR revalidate) and blank means hidden — no seed fallbacks except the site name. The
   Sanity schemas (`sanity/schemas/`) mirror the JSON shapes.

Placeholder assets to replace with real ones: SVGs in `public/images/`, the placeholder PDF at
`public/resume/eddy-lukovic-resume.pdf`, and all names/credits in `/content` (invented seed copy).

## Connecting the CMS (one-time, ~10 minutes)

1. Create a free account + project at [sanity.io/manage](https://www.sanity.io/manage)
   (project name "eddy-lukovic", dataset `production`, visibility public).
2. Put the project ID in `.env.local` (copy `.env.example`) and in the Vercel project env vars.
3. In the project's **API → CORS origins**, add `http://localhost:3000` and the production domain
   (with credentials allowed) so the embedded studio at `/studio` can talk to the API.
4. Invite Eddy as a member (role: Editor) so he can log into `/studio` with just his email.
5. Open `/studio`, fill the four singletons (Site Settings, Bio, Actor Page, Director Page)
   and add Acting Galleries / Directing Projects / Videos. Blank fields hide their elements.

Published edits appear on the live site within ~60 seconds (ISR revalidate).

For Eddy's non-technical instructions, see [EDITING-GUIDE.md](EDITING-GUIDE.md).

## Connecting the contact form (one-time, ~2 minutes)

The `/contact` form sends through [Web3Forms](https://web3forms.com) — free (250
submissions/month), no backend, no dashboard to maintain, honeypot spam protection built in.
Until connected, submitting shows a "not taking messages yet" notice.

1. Go to web3forms.com → **Create your Access Key** → enter the email that should receive
   messages (Eddy's). The key arrives by email instantly; no account needed.
2. Paste the key into **Studio → Site Settings → Contact form key** and Publish. Live within a
   minute — no deploy needed. (`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` still works as an env-var
   fallback when the CMS field is blank.)
3. The key is public-safe (it only routes to the inbox). If spam ever becomes a problem,
   Web3Forms supports hCaptcha — add it then, not before.

## Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check-types
pnpm build
```

Deploy: standard Vercel project, build command `next build`, no required env vars
(Sanity vars optional as above).
