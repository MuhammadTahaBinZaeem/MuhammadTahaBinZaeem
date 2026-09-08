# The Engineering Notebook

This revision uses original, code-authored pen-and-ink-style artwork, real photographs and original credential documents. It does not request or display AI-generated decorative images, 3D models, boot screens, or delayed portal navigation. Older assets and components remain in Git history/the source tree; the current pages do not mount them.

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
| Site identity and structured data                                                     | `app/layout.tsx`, `app/seo-schema.tsx` |
| Crawlable page list                                                                   | `app/sitemap.ts`                       |

Refresh all public repositories with `npm run sync:github`. The paginated GitHub API request happens at authoring time, never on page load. Failed requests preserve the previous snapshot. Forks remain labeled, and missing repository descriptions do not become invented project claims.

The source-to-section audit is in [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md). Keep unpublished studies, expected graduation, planned workshops, finalist selections, and applications distinct from completed outcomes.

## Artwork and motion

`npm run art:build` rebuilds the original SVG line illustrations, favicon, social image, and **40 transparent 960 × 760 PNG frames** from `scripts/build-notebook-art.mjs`. The sequence is approximately 608 KB in total; the manifest records exact file sizes. No remote image generator or stock asset dependency is involved.

The home processor sequence advances with scroll position using GSAP ScrollTrigger. It uses native sticky positioning, a maximum eight-frame decoded cache and at most three concurrent frame requests. It does not run a perpetual canvas loop or set React state on every scroll. A static poster remains available while frames load or when motion is disabled.

Other chapters use GSAP section arrivals, drawn rules, and paper-settling transforms. Motion is a progressive enhancement: content is server-rendered and visible before JavaScript. System reduced-motion and the footer's saved motion preference both remove the sequence's long scroll stage. Navigation has no artificial timer.

## Verify

```powershell
npm run check
# With npm start running in another terminal:
npm run test:browser
```

`check` runs TypeScript, ESLint, a production build, and rendered-HTML/content/asset-budget tests. The browser suite uses an existing Chrome/Chromium installation; set `BROWSER_PATH` if it cannot locate one. It checks eight routes at 320/390/768/1440 pixels, keyboard menu behavior, client navigation, repository filters, frame progression, reduced motion, PDF bytes, HTTP/runtime errors, and a no-JavaScript screenshot.

For a different preview port, set `TEST_BASE_URL`, for example `$env:TEST_BASE_URL='http://localhost:3001'`. Reports and screenshots are saved under the ignored `qa-artifacts/notebook-browser/` folder. Performance numbers there describe this local headless test, not field Core Web Vitals or a guarantee on every device.
