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

Acting and directing are split in the galleries (Gallery ▾ dropdown); the resume is one
combined page (Acting block, then Directing block).

| Route | Content |
|---|---|
| `/` | Hero + selected acting work + directing teaser grid + showreel + about teaser + photo strip |
| `/about` | Full bio, pull quote, vitals (height/hair/unions/…) |
| `/resume` | Combined credit tables — Acting then Directing — plus merged training/skills, Download PDF |
| `/gallery/acting` | Photo masonry (headshots + stills) |
| `/gallery/directing` | Minimal project grid (Saki-Kawamura-style) |
| `/gallery/directing/[slug]` | Project page: description, photo gallery, optional video embed (SSG) |
| `/media` | Reel + video clips (dark section; not in the nav — linked from home/footer) |
| `/contact` | Contact form (Web3Forms) + direct email, representation, social links |
| `/studio` | Sanity Studio — Eddy's editing UI |

`/resume/acting` + `/resume/directing` redirect to `/resume`; `/gallery` → `/gallery/acting`.
The acting/directing resumes remain **separate CMS documents** — the page merges them, so a
future "PDF-only resume page" change is a page-level swap with no schema migration.

## Content architecture

**Every word, photo, and video on the site flows through `src/lib/content.ts`.** It has two modes:

1. **Seed mode (current):** serves the JSON files in `/content` (`site.json`, `bio.json`,
   `resume.json` — `acting` + `directing` keys, `photos.json`, `projects.json`, `videos.json`).
   Edit those files to change the site.
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
5. Open `/studio`, create the four singletons (Site Settings, Bio, Acting Resume, Directing
   Resume) and add Acting Gallery Photos / Directing Projects / Videos. Anything he doesn't fill
   in falls back to the seed JSON, so the site never breaks mid-migration.

Published edits appear on the live site within ~60 seconds (ISR revalidate).

For Eddy's non-technical instructions, see [EDITING-GUIDE.md](EDITING-GUIDE.md).

## Connecting the contact form (one-time, ~2 minutes)

The `/contact` form sends through [Web3Forms](https://web3forms.com) — free (250
submissions/month), no backend, no dashboard to maintain, honeypot spam protection built in.
Until connected, submitting shows a "not connected yet — email directly" notice.

1. Go to web3forms.com → **Create your Access Key** → enter the email that should receive
   messages (Eddy's). The key arrives by email instantly; no account needed.
2. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=<key>` in `.env.local` and in Vercel env vars, redeploy.
3. The key is public-safe (it only routes to the inbox), so `NEXT_PUBLIC_` is fine. If spam ever
   becomes a problem, Web3Forms supports hCaptcha — add it then, not before.

## Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check-types
pnpm build
```

Deploy: standard Vercel project, build command `next build`, no required env vars
(Sanity vars optional as above).
