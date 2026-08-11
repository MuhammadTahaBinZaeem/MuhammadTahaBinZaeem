# Muhammad Taha Bin Zaeem — Field System

An animation-led portfolio for Muhammad Taha Bin Zaeem, Computer Engineer and founder of Type2Learn and ProGenEDA.

This is a story with separate rooms, not a résumé grid:

1. **The Threshold** introduces the builder, operating principle, two live ventures, and four doors.
2. **The Engine Room** gives eight projects their own full-screen worlds, media, evidence, and source links.
3. **The Hall of Institutions** turns 14 credentials into issuer-specific environments; 13 include local source PDFs and public verification links.
4. **The Trophy Voltage** presents five achievements as chronological memories rather than badges.
5. **The Foundry** follows three education stations from early computer science through GCU Lahore to NUST CEME.

Portal transitions, GSAP scroll choreography, Lenis scrolling, an original transparent eight-frame signal animation, a custom cursor, route-specific art direction, mobile navigation, and reduced-motion fallbacks connect the experience. There is deliberately no 3D scene, stock logo pack, or WebGL dependency.

## Architecture

| Area | Source of truth | Responsibility |
| --- | --- | --- |
| Portfolio records | `app/portfolio-data.ts` | Identity, verified destinations, portals, projects, credentials, achievements, education, media metadata, and per-story themes |
| Global shell | `app/components/experience-shell.tsx` | Boot veil, 2D signal sequence, portal travel, header, mobile menu, cursor, scroll meter, and footer |
| Shared motion | `app/components/story-motion.tsx` | Intro, reveal, and drift choreography with reduced-motion handling |
| Threshold | `app/page.tsx` | Hero, room doors, live venture captures, and contact routing |
| Story rooms | `app/{projects,certifications,achievements,education}/` | Route metadata and each room’s client-side experience |
| Visual system | `app/globals.css` | Typography roles, base tokens, scene layouts, responsive behavior, focus states, and motion fallbacks |
| Metadata | `app/layout.tsx`, `app/site-config.ts`, `app/sitemap.ts` | Canonical origin, social card, icons, robots, and all five sitemap routes |
| Media archive | `public/media/`, `public/certificates/` | Optimized WebP evidence, transparent signal frames, live-site captures, and original PDFs |
| Hosting runtime | `worker/`, `build/`, `../.openai/hosting.json` | Vinext/Cloudflare worker entry point and OpenAI Sites packaging |

The server renders the semantic content of every route. Motion enriches that content in the browser; it is not required to read the portfolio or follow its links.

## Content and media

Normal portfolio updates begin in [`app/portfolio-data.ts`](app/portfolio-data.ts). Its typed records keep copy, dates, proof, URLs, asset dimensions, alt text, and scene colors together.

The supplied personal archive is staged as:

- `public/media/projects/` — 23 optimized project images;
- `public/media/certificates/` — 13 uncropped certificate previews;
- `public/certificates/` — the matching 13 original PDFs;
- `public/media/achievements/` — award, leadership, and education evidence;
- `public/media/identity/` — two portraits, the original signal mark, favicon, and eight transparent animation frames;
- `public/media/ventures/` — current captures of ProGenEDA, Type2Learn, and Debate Club;
- `public/media/media-manifest.json` — sanitized labels, dimensions, byte sizes, and public paths; local extraction paths are deliberately excluded.

Every scene uses its own evidence instead of recycling a generic hero image. The generated signal frames are 2D transparent WebPs, so the global identity animation remains sharp without a 3D runtime.

See [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md) for the replacement workflow. The previous GitHub profile README remains at [`docs/profile-readme-source.md`](docs/profile-readme-source.md).

## Run locally

Node 22.13 or newer is required.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production validation:

```bash
npm run check
```

`npm run check` runs strict TypeScript, ESLint, a production Vinext build, and server-render tests for all five routes. The tests also enforce the verified identity and destinations, the no-3D dependency contract, staged media/PDF paths, asset budgets, mobile-menu behavior, reduced-motion behavior, and project dwell-memory keys.

The same command runs in `.github/workflows/ci.yml` on pull requests and pushes to `main`.

## Browser QA and screenshots

Automated checks cannot judge composition. Before publishing, capture and inspect each state at desktop, portrait mobile, and short landscape:

- `/` — boot veil and settled threshold;
- `/projects?focus=vector-cpu`, `/projects?focus=debate-club`, and `/projects?focus=arduino-robot-car`;
- `/certifications?focus=think-again-i`, `/certifications?focus=machine-learning-specialization`, and `/certifications?focus=foundations-of-cybersecurity`;
- `/achievements?focus=sempec-junior-hardware-runner-up` and `/achievements?focus=stem-2024-runner-up-photo-story`;
- `/education?focus=nust`, `/education?focus=gcu-lahore`, and `/education?focus=qazi-grammar`;
- the mobile menu opened, keyboard focus, portal transition, and `prefers-reduced-motion: reduce` fallback.

Check for cropping, unreadably small media, repeated evidence, overflow, missing files, broken links, console errors, and unexpected layout shifts. QA captures belong in `qa-artifacts/`, which is intentionally ignored.

## Future project clips

Each project world reserves a motion slot for the short clips described in the brief. Use the project ID naming convention:

```text
public/media/clips/vector-cpu.webm
public/media/clips/debate-club.webm
public/media/clips/autodecomp.webm
```

Continue the pattern for the remaining IDs. Keep a poster image and a non-autoplay fallback; wire the clip into `MediaSequence` in `app/projects/projects-experience.tsx` after the final files arrive.

## Interaction and accessibility contract

- The boot veil dismisses automatically and is much shorter for reduced-motion users.
- Internal room links receive a 2D portal transition before navigation.
- Project dwell time is stored locally; the most-inspected project becomes the remembered affinity theme.
- The mobile menu traps background interaction with `inert`, closes on Escape, and closes when resized above the mobile breakpoint.
- Fine pointers receive the custom cursor; coarse pointers and reduced-motion users retain native behavior.
- All primary controls have visible keyboard focus, semantic labels, and text alternatives.
- Certificate PDFs open only on request and are not part of the initial route payload.

## Technology

Vinext / Next-compatible App Router, React 19, TypeScript, GSAP + ScrollTrigger, Lenis, Vite, CSS, and the OpenAI Sites deployment target.

## Reference source vault

Design research repositories remain separated from the shipped site under the ignored `.reference-sources/` vault. Rebuild the repository reference collection with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\fetch-references.ps1
```

See [`docs/SOURCE-VAULT.md`](docs/SOURCE-VAULT.md) for its grouping and provenance notes.
