# The Living Field Book

The landing page is a single, continuous book: a cloth-bound cover, a foreword, an illustrated atlas, and seven complete chapter worlds. It uses original, code-authored pen-and-ink-style artwork, real photographs, and original credential documents. No AI-generated decorative artwork or 3D models are mounted. The top navigation bar is removed. The existing seven chapter URLs remain available as standalone reader editions and crawlable landing pages.

The closed cover is the readiness screen, not a timed loading interstitial. Once the local motion engine is ready, clicking the cover opens the foreword. Scrolling also opens it. There is always a reader-mode alternative, and without JavaScript every chapter remains in ordinary document flow.

## Run locally

```powershell
cd web
npm ci
npm run build
npm start
```

Open **http://localhost:3000**. `npm start` runs the Cloudflare Vite preview, including built assets. Do not substitute `vinext start`: for this Cloudflare output it renders HTML but does not serve the client asset directory correctly.

For editing, use `npm run dev -- --port 3000`. Stop the preview first, or choose a different port. If adding new client dependencies leaves an old Vite optimizer cache, restart development with `npx vite --force --port 3000`.

No DNS or production-domain changes are needed to review locally. The canonical domain remains `https://tahabinzaeem.tech`.

## Change content

| Content                                                                               | Source                                 |
| ------------------------------------------------------------------------------------- | -------------------------------------- |
| Identity, emails, CVs, research, founder work, leadership, skills, chapter navigation | `app/dossier-data.ts`                  |
| Existing engineering projects, certificates, education, achievement evidence          | `app/portfolio-data.ts`                |
| Complete public GitHub repository snapshot                                            | `app/github-repositories.json`         |
| Original CV downloads                                                                 | `public/cv/`                           |
| Original certificate files and previews                                               | `public/media/` and its manifest       |
| Palette, type, responsive layout                                                      | `app/globals.css`                      |
| Book worlds, names, colours and order                                                  | `app/book-data.ts`                     |
| Cover, atlas, and chapter composition                                                  | `app/page.tsx`, `app/storybook.css`    |
| Scroll-to-page mapping and chapter transitions                                         | `app/components/book-experience.tsx` |
| Site identity and structured data                                                     | `app/layout.tsx`, `app/seo-schema.tsx` |
| Crawlable page list                                                                   | `app/sitemap.ts`                       |

Refresh all public repositories with `npm run sync:github`. The paginated GitHub API request happens at authoring time, never on page load. Failed requests preserve the previous snapshot. Forks remain labeled, and missing repository descriptions do not become invented project claims.

The source-to-section audit is in [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md). Keep unpublished studies, expected graduation, planned workshops, finalist selections, and applications distinct from completed outcomes.

## How the book moves

One document scrollbar is the source of truth. The cover now fills the viewport edge to edge; chapter layouts use a shared fluid gutter rather than a narrow outer frame. The book stage stays in view while the current chapter's paper moves through it. Once the chapter has been read, a longer, eased scroll interval folds the leaf and tears open the next world. Scrolling backward reproduces the same fold and reseals the seam.

The already-installed Lenis library smooths wheel input and chapter jumps. Its frame loop wakes only for input or an intentional jump and sleeps once motion settles. Touch, scrollbar dragging and keyboard scrolling remain native. Reduced-motion/reader mode does not instantiate the smoothing engine. The integration follows [Lenis's documented GSAP synchronization](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger), with demand-driven frames rather than an always-running ticker.

The engine measures the real content height, so opening project evidence or filtering repositories changes that chapter's scroll distance. A dimension-guarded `ResizeObserver` recalculates the book without continuously rebuilding timelines. Distances use integer CSS pixels to avoid floating-point boundary artifacts. Inactive chapters and turning paper are inert. Only current/turning paper layers and their moving contents receive compositor hints; those hints are released when hidden. There is no perpetual rendering loop or React update on every frame.

GSAP timelines are scrubbed by the chapter's reading distance:

| World | Palette and scroll motion |
| --- | --- |
| Foreword | Warm paper, drifting workbench plate and settling portrait |
| Atlas | Large illustrated leaves slide and rotate into alignment |
| Projects | Copper workshop; alternating notes and drawing plates slide into place |
| Research | Deep blue-green ink; evidence panels converge from opposite sides |
| Experience | Terracotta; entries arrive along a connected timeline |
| Education | Sage paper; diagonal arrivals along a foundation line |
| Certifications | Parchment reading room; certificate sheets rotate and settle |
| Achievements | Charcoal and brass; archival photographs fan into position |
| Links & CVs | Forest correspondence; links and documents rise onto the page |

Atlas links and a single bottom contents menu jump within the document. Side tabs, repeated name strips and duplicate embedded next-chapter cards are removed. The menu supports Escape/focus return, outside-click dismissal and its own native scrolling. Both ordinary chapter-boundary scrolling and long jumps split the paper seam outward, driven by actual scroll distance. Wheel, touch, or a navigation key cancels a jump. Direct chapter and subsection hashes work, as does browser Back. Reader mode preserves the current chapter, remembers the preference, and is selected automatically for system reduced motion. Keyboard focus on an offscreen link brings its paper into view.

Hover feedback covers links, contents controls, evidence summaries, directory/CV cards, atlas illustrations and certificate previews. It uses independent CSS translate/scale properties rather than overwriting GSAP transforms; keyboard focus has an equivalent clear outline, and reduced-motion/reader mode removes transitions.

After hydration, unvisited chapter image sources are temporarily parked behind a tiny inline transparent image, with their original aspect ratios retained. This prevents the shared absolute viewport from defeating native lazy loading. The active chapter restores its real sources; only the first three images in the upcoming chapter are warmed. Previously visited images remain available. All original URLs are retained in server-rendered HTML, and every source is restored for reader mode, printing and cleanup. Printing pauses the book layout engine, reveals all paper and returns to the original scroll position afterward. No new dependencies, remote runtime requests, model downloads or generated image sequences were added. The critical display font is preloaded; existing cache headers remain in place.

## Artwork

`npm run art:build` rebuilds the original SVG line illustrations, favicon, social image, and **40 transparent 960 × 760 PNG frames** from `scripts/build-notebook-art.mjs`. The sequence is approximately 608 KB in total; the manifest records exact file sizes. No remote image generator or stock asset dependency is involved.

The original 40-frame processor sequence and its bounded-cache component remain available in the source tree, but are **not mounted or downloaded by the current book**. The book itself animates lightweight flat HTML/CSS paper layers, not a heavy image sequence or a WebGL model.

Standalone reader editions retain their lighter GSAP arrivals and optional footer motion control. The book's embedded copies disable those independent triggers and use the one shared book engine instead. Content, social links, project evidence, and all three CVs remain server-rendered.

## Verify

```powershell
npm run check
# With npm start running in another terminal:
npm run test:browser
```

`check` runs TypeScript, ESLint, a production build, and rendered-HTML/content/asset-budget tests. The browser suite uses an existing Chrome/Chromium installation; set `BROWSER_PATH` if it cannot locate one. It checks eight routes and nine embedded worlds at 320/390/768/1440 pixels, landscape cover composition, forward/reverse turns, tearing chapter jumps, browser Back, direct hashes, expandable evidence, repository filtering, keyboard focus, reader/reduced-motion modes, PDF bytes, HTTP/runtime errors, and a no-JavaScript view.

For a different preview port, set `TEST_BASE_URL`, for example `$env:TEST_BASE_URL='http://localhost:3001'`. Reports and screenshots are saved under the ignored `qa-artifacts/book-browser/` folder. Performance numbers there describe this local headless test, not field Core Web Vitals or a guarantee on every device. `BOOK_ONLY=1` skips the standalone route matrix for focused iteration; `BOOK_WIDTHS=1440` narrows the embedded-world matrix. Leave both unset for full verification.

`PROJECT_ONLY=1` runs the Pocket Engineer checks at desktop/phone widths, its original FOP evidence and legacy anchor, plus PDF/no-JavaScript checks. Leave this unset too for the complete book suite.
