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

## Performance and limitations

The final machine-readable report records a two-second local scrolling sample, including frame intervals and tasks over 50 ms. This is a headless Chromium diagnostic, **not** a field Core Web Vitals measurement or a guarantee for every device. Only current/turning chapter layers are composited; there is no perpetual rendering loop or per-frame React state update.

The final fresh-document trace recorded 20 subresource requests, approximately 667 KB of decoded subresources plus 298 KB of HTML (965 KB combined, **not compressed transfer size**). Only the portrait appeared in initial image requests; the archived evidence and unused frame sequence were not eagerly downloaded. All three local fonts loaded, with the display face preloaded.

The final two-second scroll sample recorded 87 frame intervals, a 33 ms P95, zero layout/timeline rebuilds, and two tasks over 50 ms (155 ms and 81 ms). A preceding run of the compositor optimization recorded 109 intervals and no tasks over 50 ms. These variable headless results mean this pass must **not** be described as universally lag-free. Physical-device profiling is still needed to characterize remaining frame spikes; the reproducible resource deferral, bounded compositing and idle-loop improvements are retained.

The original 40-frame transparent PNG sequence (approximately 608 KB total) is retained as an optional source asset, but is not mounted or downloaded by the current book. The book uses lightweight flat paper layers and GSAP; no WebGL models or generated decorative images are mounted.

Physical-device Safari/iOS testing and production field measurements remain outside this local pass. Reproduce with the commands in [NOTEBOOK.md](../NOTEBOOK.md). The screenshots and `report.json` are local, ignored QA artifacts rather than production assets.
