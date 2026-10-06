# Editing the portfolio

Content is separate from its layouts, galleries, and motion. Edit a record in the files below and both the continuous home page and its standalone chapter update. Array order controls display order; move a complete object to reorder it, delete it to remove it, and copy a neighboring object to add one. Keep each `id` unique and stable so existing section links keep working.

| What you want to change | File and export |
| --- | --- |
| Canonical name, portrait, biography, email, official profiles | `app/portfolio-data.ts`: `PROFILE`, `SOCIAL_LINKS` |
| Cover/foreword wording, portraits, ventures and process | `app/homepage-data.ts`: `HOME_COVER`, `HOME_INTRO` |
| Chapter order, names, colors and transitions on the home page | `app/book-data.ts`: `BOOK_WORLDS` |
| Atlas and standalone chapter navigation | `app/dossier-data.ts`: `CHAPTERS` |
| Flagship products and their roles, links, evidence | `app/dossier-data.ts`: `FEATURED` |
| Engineering projects, stack, proof and photographs | `app/portfolio-data.ts`: `PROJECTS` |
| Extra flagship application screenshots | `app/project-galleries.ts`: `PROJECT_GALLERIES` |
| Research studies and their evidence | `app/dossier-data.ts`: `RESEARCH` |
| Internships and employment | `app/dossier-data.ts`: `EXPERIENCE` |
| Leadership and volunteering | `app/dossier-data.ts`: `LEADERSHIP` |
| People, their order, project credits and profiles | `app/collaborators-data.ts`: `COLLABORATORS` |
| Education, campus banners and institution galleries | `app/portfolio-data.ts`: `EDUCATION` |
| Skills and research interests | `app/dossier-data.ts`: `SKILLS`, `DOSSIER.interests` |
| Credentials, PDFs and issuer galleries | `app/portfolio-data.ts`: `CERTIFICATES`, `CERTIFICATE_GROUPS` |
| Achievement cards and their evidence | `app/portfolio-data.ts`: `ACHIEVEMENTS` |
| Large achievement spotlights, including P@SHA | `app/portfolio-data.ts`: `ACHIEVEMENT_SPOTLIGHTS` |
| CV cards and optional evidence | `app/dossier-data.ts`: `CVS` |
| Contact email and extra official destinations | `app/dossier-data.ts`: `DOSSIER`, `ALL_LINKS` |
| Complete repository directory | `app/github-repositories.json` (`npm run sync:github`) |
| Search titles, descriptions and editorial dates | `app/seo.ts`: `SEO_PAGES` |

`PORTALS` and the old `*-experience.tsx` scene components are historical sources, not the mounted portfolio. Current chapters render from `app/<chapter>/page.tsx`. A data record should never need a new condition in an animation component.

## Add, replace, reorder or remove gallery images

The shared image format is the same everywhere:

```ts
media: [
  {
    src: "/media/achievements/sempec-award-presentation.webp",
    alt: "Muhammad Taha and teammates at the SEMPEC prize presentation",
    width: 1600,
    height: 1067,
    caption: "Junior Hardware · the prize presentation", // optional
    objectPosition: "50% 50%", // optional cover framing
  },
  {
    src: "/media/achievements/stem-judging-session.webp",
    alt: "Junior Hardware project during SEMPEC judging",
    width: 1182,
    height: 1331,
  },
],
```

Copy this field onto an achievement, engineering project, education entry, researcher, internship, leadership role, collaborator, CV, or achievement spotlight. `PROJECTS`, `ACHIEVEMENTS`, and `EDUCATION` require the `media` field; use `media: []` when there are no photographs. On other records, `media` is optional and may be omitted or set to `[]`. No empty gallery appears. The first image becomes the visible cover for record galleries. Moving an image to the first position changes the cover. Moving any remaining image changes the gallery sequence. Removing its object removes it from the gallery.

For flagships, `image` sets the visible screenshot (or `drawing` sets notebook artwork); `media` adds related images. `PROJECT_GALLERIES[project.id]` also supplies archived application screenshots. Pocket Engineer uses `legacyId` to keep its original engineering evidence inside the same project, so update that original `PROJECTS` media array when replacing the FOP photographs.

For engineering cards, `PROJECT_GALLERIES[project.id]` images precede the record's `media` images, so the first supplemental image becomes the cover when present. Remove that supplemental entry to use the first image in the record's `media` array, or put the desired cover photograph first in the supplemental array.

For education, `campus` is the wide illustrated banner. It joins the institution's evidence gallery with `media`, so clicking either opens the complete group. Change GCU's photographs in the `media` array of `id: "gcu-lahore"`; change its illustrated background in `campus`. `campusLabel` controls the banner lettering (`GCUL` / `NUST CEME`). `periodNote`, `institutionNote` and `focus` contain optional education context. Generated campus art is explicitly captioned as an illustration; the references and prompts are documented in [GENERATED-ART.md](GENERATED-ART.md).

For certificates, `preview` remains the visible credential and `media` adds optional related evidence. Credentials with the same `groupId` share one issuer gallery. Their original PDF and verification links remain separate.

For foreword portraits, edit `HOME_INTRO.portraits`; `PROFILE.portrait` remains the canonical portrait for search metadata. Notebook drawings also open in the shared viewer. You can keep a gallery to one item; navigation controls appear when useful.

The viewer keeps photographs in their natural aspect ratio. Visitors can move with arrows, thumbnail buttons, Left/Right keys, or phone swipes, and return with Close, Escape, or browser Back. Image metadata is included in server HTML, while large images load on demand.

## Add an achievement

Copy an existing object inside `ACHIEVEMENTS` and give it a new ID:

```ts
{
  id: "new-project-recognition",
  kind: "honor", // or "photo-story"
  title: "Your achievement title",
  dateLabel: "October 2026",
  summary: "Describe the actual result and the project behind it.",
  evidence: ["The original certificate records the result."],
  media: [
    { src: "/media/achievements/new-award.webp", alt: "Describe the evidence", width: 1600, height: 1067 },
  ],
  theme: THEMES.achievements,
},
```

These filenames are examples: add the actual file before referencing it. Evidence can be empty; a card can use `media: []` if there is no photograph. Move the full record to set its display order. The STEM competition is one record, `stem-2024-runner-up`; its award photograph belongs there. The project-judging photograph belongs in `sempec-junior-hardware-runner-up`.

Large spotlight records live in `ACHIEVEMENT_SPOTLIGHTS`. Their `eyebrow`, `title`, `emphasis`, `summary`, `status`, `link`, `drawing`, and optional `media` all come from data. Delete the P@SHA object to remove that feature, or copy it to add another spotlight.

## Add another project, person or timeline item

For an engineering project, copy a `PROJECTS` record and change the ID, title, story, proof, stack, links and media. For a flagship, copy a `FEATURED` record; select `drawing` or `image` as its cover. Set `founderWork: true` and `founderPeriod` only when it belongs in the founder-work timeline. Omitting those fields leaves it in projects. Keep `legacyId` only when deliberately promoting an existing engineering project.

For research, internship, leadership, CV and collaborator entries, copy a record in the corresponding array. Their optional `media` uses the same format above; no JSX change is required to add evidence. A collaborator's `projects` array controls their project buttons, and `profile`, `platform`, `source` control their real public credit links. Use `profile: null` and `platform: null` when a profile has not been confirmed.

The requested people order is stored directly in `COLLABORATORS`: Hamiz, Alizay, Lameea, Idrees, Fahad, Tooba. Reorder those objects to change it later. Their numbers follow automatically.

Move whole `BOOK_WORLDS` objects to reorder the continuous book. The chapter content registry in `app/page.tsx` connects existing IDs to components, and is independent of their order. Change `CHAPTERS` when you also want to change atlas/navigation order and labels. Retain `foreword` as the first world for the cover's opening destination. Adding a wholly new chapter requires its page component and registry entry; adding content inside an existing chapter requires only data.

## Add a certificate or issuer

Copy a `CERTIFICATES` object, update its ID, title, issuer, date, preview and links, and set `groupId` to an existing issuer ID. The new certificate appears in that group and its gallery automatically. Credential order follows `CERTIFICATES` within each issuer.

For a new issuer, add a record to `CERTIFICATE_GROUPS`:

```ts
{ id: "new-issuer", name: "Institution name", color: "#376045", navLabel: "Institution" },
```

Then set the new certificate's `groupId: "new-issuer"`. Issuer order follows this array. `summary: { title, copy }` adds an optional issuer introduction without route code. A PDF lives at `public/certificates/<id>.pdf`; its preview can live at `public/media/certificates/<id>.webp`. Set unavailable `documentUrl`, `credentialUrl`, or `credentialId` to `null`.

## Store media and check the result

Put files under `public/media/<section>/`; URLs omit the `public` prefix. Set `width` and `height` to the actual encoded dimensions. Keep photographic evidence uncropped and text readable; WebP usually provides a useful delivery size. Use accurate alt text and an optional caption to distinguish documentary photographs from illustrations.

`public/media/media-manifest.json` records sanitized labels, public paths, dimensions and byte sizes. Update it when adding or replacing archived media. Avoid copying private extraction paths into it. The image sitemap derives its groups from displayed data; no manual sitemap entry is needed for a new gallery image.

Run the checks after content changes:

```bash
npm run check
npm run test:browser
```

`check` runs TypeScript, lint, a production build and rendered-HTML validation. Browser QA needs the built local preview (`npm start`) on port 3000. Inspect the home chapter and its reader edition at phone and desktop sizes; open the new gallery, verify every image and PDF, try a swipe and keyboard navigation, and check reduced-motion mode. Gallery assertions intentionally check the shipped evidence counts; update a count when a real content change requires it. `tests/editable-data.test.mjs` also simulates removing individual records, emptying every record list, and adding optional evidence entirely in the compiler's memory, so editing checks never alter your actual content.

The mouse wheel, trackpad and phone retain ordinary vertical scrolling. GSAP maps that progress to sideways or upward visual motion. Data edits and image replacements do not require changing the scroll engine.

## Visuals and motion

`app/portfolio-polish.css` contains the visual finish for the cover and all chapters. `app/storybook.css` defines the book mechanics, and `app/globals.css` defines the base layouts. The polish selectors include `html:root` so route CSS load order cannot undo them. Direction, distance and reveal poses live in `app/components/motion-vocabulary.ts`. `data-motion-direction="left"`, `"right"`, `"up"` or `"down"` can override an individual reveal. Wheel, trackpad, touch and keyboard always keep native vertical input. The engineering rail uses that vertical position to animate sideways on desktop; smaller screens, reader mode, reduced motion and expanded build notes show an ordinary list.

Optional galleries use `EntryGallery`; all image collections use `GalleryImage` and the shared `ImageGallery`. Do not add a modal per record. Campus artwork prompts, reference sources and saved paths are recorded in [GENERATED-ART.md](GENERATED-ART.md).
