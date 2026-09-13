# Living Field Book — verification record

Verified locally on 12 September 2026 using the built Cloudflare Vite preview and installed Chromium. These are development-machine results, not production field performance claims. Production hosting and DNS were not changed.

## Build and content

- TypeScript, ESLint and production build: passed.
- Rendered-HTML/content tests: 9 passed, including the Pocket Engineer promotion.
- The landing page contains one main landmark, one primary heading and nine complete worlds: foreword, atlas, projects, research, experience, education, certifications, achievements, and links/CVs.
- The seven existing chapter routes remain standalone reader editions with their metadata and canonical links.
- The 23-repository snapshot, 14 certificate entries, original evidence and all three CV downloads remain included. Planned work, applications, unpublished research and finalist selections retain their factual qualifiers.
- All three CV downloads returned HTTP 200 with `application/pdf`; delivered bytes matched the original included PDFs.
- Sitemap, robots, structured data and crawler-facing links remain covered by automated tests.

## Browser checks

The book-motion baseline (`2dafb10`) captured **117 screenshots** under `qa-artifacts/book-browser/`. The current full command adds eight Pocket Engineer views, for 125 screenshots:

- Eight routes at 320, 390, 768 and 1440 pixels; no detected horizontal overflow or broken images.
- Edge-to-edge cover bounds, non-overlapping invitation/author, cover opening and all nine embedded worlds at the same four widths, plus desktop/mobile reading stages and a short landscape viewport.
- Every chapter's ending is reachable before its page turn starts.
- Four forward page-turn positions match the corresponding reverse-scroll transforms.
- All eight chapter boundaries tear during ordinary scrolling, not only navigation jumps; reverse scrolling reproduces the exact seam transform and opacity.
- Real wheel events interpolate forward and backward, settle at the expected coordinate, reverse during motion, stop with Escape and produce no idle drift.
- One contents menu replaces repeated side tabs and prompts. Escape returns focus to its toggle. Hidden menus and turning paper cannot receive keyboard focus.
- Atlas and certificate hover transforms are checked and captured; independent CSS properties preserve their GSAP scroll animations.
- Illustrated atlas leaves move with scroll; long chapter jumps tear outward inside the same document without a route reload.
- Browser Back, direct chapter/subsection hashes, wheel cancellation of an in-flight jump, expandable project evidence, repository search, empty state and fork filtering pass.
- Keyboard focus brings an offscreen certificate into view. Inactive worlds are inert and excluded from accessibility navigation.
- Resizing preserves the chapter and updates the stage height. Idle layout observation does not continuously rebuild the animation timelines.
- Reader mode retains the chapter, persists between visits and activates automatically for system reduced motion.
- Print restores unvisited image sources, overrides faded page opacity and returns to the same chapter/turn position when closed.
- Without JavaScript, all nine worlds are in normal document flow with usable cover instructions.
- No runtime, console or HTTP errors in the final suite.

Screenshots were visually inspected across the cover, atlas, all chapter worlds, intermediate reading positions, page turns, tearing transitions, certificate focus, mobile layout, reader mode and no-JavaScript view. The screenshot helper waits for visible images to decode and paint, not only for their network requests to complete. Fresh-load tests leave the old document before navigating, avoiding a hash/reload race in the harness. Headless focus emulation is explicitly enabled so focus events match an active browser tab.

## Corrections made during visual review

- Fixed cover/invitation overlap and portrait-caption collision on small screens.
- Rounded chapter distances to avoid one-pixel boundary leaks into an adjacent world.
- Kept interrupted chapter jumps from leaving the tearing overlay stuck after content reflow.
- Corrected research status-label, experience-note and CV-card contrast; regression checks require at least 4.5:1 for those text/background pairs.
- Made certificate preview links block-level so keyboard focus has a useful visible target.
- Added bounded chapter-image look-ahead and decoding instead of downloading the entire archive eagerly.
- Scoped the continuously changing reading-progress style to the small bottom control instead of the ancestor of every chapter.
- Expanded the cover and chapter canvas, removed duplicate name strips and embedded next-chapter cards, and consolidated navigation without removing content or reader-edition links.
- Replaced coarse sawtooth tears with finer irregular paper edges, removed repetitive transition lettering during ordinary turns, and faded outgoing content before it could overlap the incoming chapter.
- Parked inactive image sources after hydration to prevent absolute-positioned chapters from defeating native lazy loading. Server-rendered URLs, original aspect ratios and reader-mode restoration remain intact.
- Synchronized the existing Lenis smoother with ScrollTrigger using input-driven frames. Keyboard/touch can cancel residual wheel momentum, and the smoother sleeps at rest.

## Pocket Engineer addition — targeted verification

The featured-project update passed TypeScript, ESLint, the production build and all nine content tests. Its focused browser run (`PROJECT_ONLY=1`) captured nine screenshots: reader and book views at 320/390/1440 pixels, expanded original FOP evidence, the preserved legacy deep link, and the no-JavaScript page. Title bounds, four-project ordering, source-image dimensions, evidence-driven chapter remeasurement, PDF delivery and runtime/HTTP checks passed. Desktop, narrow-phone and expanded-evidence screenshots were visually inspected.

The actual app screenshot is 1440 × 1031, un-cropped and 46,814 bytes; tests enforce a 70 KB budget and lazy loading. Repository scope, private-source labeling and media provenance are recorded in [CONTENT-COVERAGE.md](../CONTENT-COVERAGE.md). This focused content pass does not constitute a fresh performance benchmark; the measurements below belong to the book-motion baseline.

## Related galleries and collaborators — 12–13 September 2026

The gallery pass adds no dependencies or media downloads to the repository. A shared native dialog exposes complete related-image groups in the book and reader editions, pauses book inertia, and preserves the reading position and opener focus. Tests caught and fixed Escape handling, Tab escaping the dialog's control loop, and a Vinext history fallback that jumped reader pages to their section heading on modal close. The fixes explicitly wrap the keyboard endpoints and record the router's scroll-state fields alongside the existing history state. Notebook illustrations use a paper-colored image background in the dark viewer so their transparent ink remains legible.

The automated gallery checks cover 320, 390, 768 and 1440-pixel widths: complete Pocket Engineer and Duke groups, both SEMPEC photographs, thumbnails, keyboard previous/next, Escape/Close/browser Back, intentional upward-wheel dismissal, blocked forward-wheel background movement, and real CDP touch swipes for navigation and downward dismissal. Image bounds and natural aspect ratios are asserted. Five collaborator entries fit at every width. Original PDFs remain exact-byte downloads and all nine worlds remain readable with JavaScript disabled.

The final complete book/browser regression passed with **155 screenshots**: no detected document overflow, missing media, runtime exceptions or HTTP errors; chapter transitions, reverse scrolling, hover effects, image deferral, print, reader mode and all four featured projects remained functional. Desktop and narrow-phone gallery, certificate-frame, achievement-frame and collaborator screenshots were visually inspected. The additional single-image and reduced-motion checks cover legible ink artwork, removal of redundant controls and keyboard focus containment.

Gallery source URLs, dimensions, deduplication, collaborator profile links and founder-role boundaries are covered by the 11 rendered-HTML tests. Reproduce focused QA with `$env:GALLERY_ONLY='1'; npm run test:browser`; clear that environment variable for the complete regression run. Screenshots remain in the ignored `qa-artifacts/book-browser/` directory, not the production bundle.

Tooba Fatima's contribution is credited from explicit project records, but her personal profile URL remains pending confirmation. No namesake link is substituted. Physical Safari/iOS testing is still outside this headless Chromium pass.

## SEO regression — 13 September 2026

The name/entity and crawlability pass passed TypeScript, ESLint, the production build and all **15 rendered-HTML/content tests**. The new checks cover unique metadata on all eight canonicals, exact Open Graph/Twitter alignment, a single current-page schema entity, personal-profile versus organization identity, credential issuer semantics, HTTPS/trailing-slash redirects, 404 status and evidence-image sitemap coverage. The read-only local endpoint audit passed for all eight pages and **51 distinct evidence images**.

The same endpoint audit passed against the public Cloudflare domain after `fec0546` deployed; GitHub CI and Cloudflare Workers Builds both reported success. The live HTTPS redirect, page-specific social URLs and all 51 indexed image responses were checked, not inferred from the local build.

The complete browser suite was rerun successfully with **155 screenshots** and zero detected runtime/HTTP errors. The updated foreword/profile row, mobile atlas and chapter transition screenshots were visually inspected. Changing atlas hrefs to real reader URLs preserves the existing in-book tear animation, browser Back and no-reload navigation; these are explicitly tested. Existing gallery, reduced-motion, print and no-JavaScript checks still pass.

This run's initial-load trace recorded the same **22 subresource requests**, 681,181 decoded subresource bytes and 445,112 decoded document bytes; only the portrait was requested initially. The additional schema/text adds about 10 KB of uncompressed HTML, not additional image downloads. The local two-second scroll trace recorded 84 intervals, a 33 ms P95, no tasks over 50 ms and no layout/timeline rebuilds. These are local diagnostics, not field Core Web Vitals or ranking measurements. See [SEO.md](SEO.md) for verification boundaries and the Search Console handoff.

## Performance and limitations (book baseline)

The machine-readable report records a two-second local scrolling sample, including frame intervals and tasks over 50 ms. This is a headless Chromium diagnostic, **not** a field Core Web Vitals measurement or a guarantee for every device. Only current/turning chapter layers are composited; there is no perpetual rendering loop or per-frame React state update.

The earlier book-motion baseline recorded 20 subresource requests, approximately 667 KB of decoded subresources plus 298 KB of HTML (965 KB combined, **not compressed transfer size**). The gallery integration's first full trace recorded 22 requests, approximately 681 KB of decoded subresources plus 435 KB of HTML. Gallery metadata increases the server-rendered document size, but only the portrait appeared in initial image requests: archived evidence and unused frame sequences are still deferred. All three local fonts loaded, with the display face preloaded.

The earlier book-motion sample recorded 87 frame intervals, a 33 ms P95, zero layout/timeline rebuilds, and two tasks over 50 ms (155 ms and 81 ms). The gallery integration's first full run recorded 106 intervals, the same 33 ms P95, zero rebuilds, and one roughly 50 ms task. These variable headless results mean this pass must **not** be described as universally lag-free. Physical-device profiling is still needed to characterize remaining frame spikes; resource deferral, bounded compositing and idle-loop behavior are retained. The latest exact sample is in the ignored `report.json`.

The original 40-frame transparent PNG sequence (approximately 608 KB total) is retained as an optional source asset, but is not mounted or downloaded by the current book. The book uses lightweight flat paper layers and GSAP; no WebGL models or generated decorative images are mounted.

Physical-device Safari/iOS testing and production field measurements remain outside this local pass. Reproduce with the commands in [NOTEBOOK.md](../NOTEBOOK.md). The screenshots and `report.json` are local, ignored QA artifacts rather than production assets.
