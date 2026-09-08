# Engineering Notebook — verification record

Verified locally on 8 September 2026 using the built Cloudflare Vite preview and installed Chromium. These are development-machine results, not production field performance claims.

- TypeScript: passed.
- ESLint: passed.
- Production build: passed.
- Rendered-HTML/content tests: 7 passed.
- Browser suite: 37 screenshots; eight routes at 320, 390, 768 and 1440 pixels, plus three scroll stages, reduced-motion and no-JavaScript views.
- Additional visual review: 26 captures including Duke credentials, original PDF links, mobile index, project repository directory and scroll stages.
- Browser runtime, console and HTTP errors: none in the final suite.
- Horizontal overflow and broken images: none at the tested widths.
- Index dialog: opens, Escape closes, focus returns to the trigger.
- Chapter links: immediate client navigation without a forced document reload or artificial loading delay.
- Repository index: search, no-results state, clearing search and fork filter passed. Snapshot contains all 23 public repositories returned by the paginated GitHub API on 8 September 2026.
- Scroll sequence: first, midpoint and final frames verified. Midpoint allows one frame of rounding because the browser scrolls to integer CSS pixels.
- Saved motion preference and system reduced-motion: passed; canvas animation and extended sticky stage are removed.
- CV downloads: all three returned HTTP 200 with `application/pdf`; delivered bytes matched the included PDFs.
- Scroll performance sample: 121 frame intervals over a two-second scroll; 95th percentile 17 ms; no observed tasks over 50 ms. Headless local Chromium, not field Core Web Vitals.
- Asset budget: 40 transparent 960 × 760 PNG frames, approximately 608 KB total. At most eight decoded frames retained and three in flight.

Reproduce using the commands in [NOTEBOOK.md](../NOTEBOOK.md). Browser screenshots and the full machine-readable report are saved to the ignored `qa-artifacts/notebook-browser/` directory. The earlier manual capture set is under `qa-artifacts/screens/notebook-v4/`.
