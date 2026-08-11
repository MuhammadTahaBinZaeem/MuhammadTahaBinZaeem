# Customization checklist

The portfolio is already populated for Muhammad Taha Bin Zaeem. This guide is for changing records later or reusing the project as a starter without hunting through every animation.

## 1. Update the typed content control panel

Start with [`../app/portfolio-data.ts`](../app/portfolio-data.ts).

- `PROFILE` controls the canonical identity, role, headline, location, domain, biography, roles, and portrait metadata.
- `SOCIAL_LINKS` controls GitHub, LinkedIn, lablab.ai, product, and future public-profile destinations. Keep an unavailable URL as `null`; do not invent one.
- `PORTALS` controls the four doors on the threshold and their transition copy.
- `PROJECTS` controls all eight project worlds: story, proof, stack, verified links, unique media, and theme.
- `CERTIFICATES` controls the 14 archive records, local PDF destinations, verification URLs, preview images, issuer scene, and theme.
- `ACHIEVEMENTS` controls the five chronological memories and their evidence.
- `EDUCATION` controls the three formation stations.

The components derive lists, selectors, themes, alt text, dimensions, and external actions from these records. Keep IDs lowercase and stable because focus URLs, section anchors, clip filenames, and dwell-memory values use them.

## 2. Update identity outside the data file

A complete identity change also requires these deliberately authored surfaces:

1. `app/layout.tsx` — title, description, author, creator, keywords, and social-card alt text.
2. `app/site-config.ts` — fallback canonical origin.
3. `app/page.tsx` — threshold statements, venture copy, and contact actions.
4. `app/components/experience-shell.tsx` — brand lockup, boot copy, footer statement, and footer destinations.
5. `app/sitemap.ts` — only if routes change.

Set `NEXT_PUBLIC_SITE_URL` to the final origin. For this portfolio the production value is:

```dotenv
NEXT_PUBLIC_SITE_URL=https://tahabinzaeem.tech
```

After changing identity, run a final source search so the previous owner cannot leak into metadata or interface copy:

```powershell
rg -n "Muhammad Taha|tahabinzaeem|MuhammadTahaBinZaeem" app
```

## 3. Replace project, achievement, and education media

Place optimized evidence in the matching folder:

```text
public/media/projects/
public/media/achievements/
public/media/identity/
public/media/ventures/
```

For every `MediaAsset`, update all of `src`, `alt`, `width`, and `height`. Use the real encoded dimensions, not the intended CSS display size.

Media rules:

- use a distinct asset for each narrative role; do not reuse one image to fill unrelated scenes;
- preserve the full subject and important edges—never fix composition by cropping away evidence;
- remove metadata and encode photographic or screenshot material as WebP;
- keep the longest edge at or below 1600 px unless a real display inspection proves more is needed;
- target 310 KB or less per WebP, with hero-critical images substantially smaller when quality allows;
- keep text-heavy screenshots large enough to read in the expanded frame;
- write useful alt text that says what the image proves.

`public/media/media-manifest.json` records sanitized labels, dimensions, byte sizes, and public paths. Update it when replacing staged evidence, but never add local extraction paths, archive names, chat filenames, or other private provenance to the public file.

## 4. Replace certificates without breaking proof links

Each source certificate has two public files:

```text
public/certificates/<certificate-id>.pdf
public/media/certificates/<certificate-id>.webp
```

For the matching `CERTIFICATES` entry:

- set `documentUrl` to the local PDF;
- set `preview.src` and its encoded dimensions;
- keep `credentialUrl` as the issuer’s public verification page when one exists;
- copy the exact credential ID and issue date;
- set `documentUrl` or `credentialUrl` to `null` when no legitimate destination exists.

The current archive contains 13 source PDFs plus one lablab.ai completion record. PDF files are intentionally loaded only when a visitor asks to inspect them.

## 5. Maintain the original 2D identity system

The brand animation is raster-based and transparent:

```text
public/media/identity/mtbz-signal-mark.webp
public/media/identity/signal-frame-01.webp
...
public/media/identity/signal-frame-08.webp
public/media/identity/favicon.png
```

The still mark is 720×720. Animation frames are 520×640 and share the same canvas, registration point, padding, and transparent background. If the mark changes, regenerate the complete set as one coherent motion rather than mixing unrelated icons. Inspect every isolated frame at actual display size and confirm that no stroke, orbit, or glow is clipped.

Do not replace the mark with a stock framework, social-network, or AI-service logo. Text labels identify external destinations; the site’s visual identity remains original.

## 6. Add the short project clips later

The project component currently exposes a clearly labeled six-second motion slot. Store delivered clips at:

```text
public/media/clips/<project-id>.webm
```

When the final clips arrive, update `MediaSequence` in `app/projects/projects-experience.tsx` to render a muted, looped, `playsInline` video on hover/focus. Keep these requirements:

- no autoplay with sound;
- show the project’s still frame until the clip is ready;
- pause when offscreen and for reduced-motion users;
- expose the same information without hover on touch devices;
- provide a compressed WebM and stay within the tested loading budget.

## 7. Tune typography and color without flattening the rooms

Typography roles live at the top of `app/globals.css`:

```css
--font-display: /* expressive, forceful headlines */;
--font-body: /* highly readable narrative copy */;
--font-mono: /* assembly labels and evidence metadata */;
```

Choose distinctive typefaces with a clear reason for each role. Prefer self-hosted, subset WOFF2 files for predictable loading. Retain sensible local fallbacks and test the widest headings at 320 px before shipping. Avoid defaulting to the familiar generic tech-startup fonts simply because they are available.

Global structural tokens also live in `app/globals.css`. Per-room and per-record palettes live in the `theme` fields in `app/portfolio-data.ts`:

```ts
{
  "--story-bg": "#...",
  "--story-surface": "#...",
  "--story-ink": "#...",
  "--story-muted": "#...",
  "--story-accent": "#...",
  "--story-accent-2": "#...",
  "--story-glow": "rgba(...) ",
  "--story-overlay": "rgba(...) ",
}
```

Derive colors from the artifact or institution in that room—silicon, paper, oxidized metal, workshop paint, stone, archival ink, or a verified institutional palette. Preserve text contrast. Avoid the interchangeable violet/cyan glow scheme commonly associated with generic AI sites.

## 8. Replace the social card and icon

- `public/og.png` must remain 1200×630, legible at small share-preview size, and at or below 700 KB.
- `public/media/identity/favicon.png` must retain transparency, safe padding, and recognizable detail at 32 px.
- Keep the exact title and alt text in `app/layout.tsx` synchronized with the image.

## 9. Verify every route and transition

Run the full release gate:

```bash
npm run check
```

Then capture screenshots of these authored states:

- boot veil and settled `/`;
- at least three project worlds via `/projects?focus=<project-id>`;
- Duke, Stanford, and Google certificate rooms via `/certifications?focus=<certificate-id>`;
- at least two achievement memories;
- all three education stations;
- the open mobile menu at portrait and short-landscape widths;
- a portal transition;
- `prefers-reduced-motion: reduce` on every route.

Inspect each capture for image cropping, tiny evidence, repeated media, contrast, overflow, focus visibility, and motion residue. Also confirm:

- all five routes return 200;
- every external destination is verified and opens correctly;
- every local PDF and WebP responds;
- no 3D or Three.js dependency has returned;
- project dwell scoring writes `mtbz:project-dwell-scores` and `mtbz:dominant-project-theme` without errors;
- the mobile menu closes on Escape and on resize above 1100 px;
- no console error, hydration warning, or unexpected layout shift appears.
