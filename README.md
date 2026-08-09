# The Machine Remembers

An immersive portfolio starter pack for a computer engineer working across hardware, software, assembly, AI, and product systems.

The site is intentionally built as a story rather than a stack of résumé cards:

1. A skippable assembly-language boot sequence
2. An interactive Meshy-generated machine core
3. A systems thesis and signal counters
4. Five large project case studies with distinct code-native schematics and constraint/build/proof evidence
5. A hardware/software/intelligence capability bus
6. Experience, credentials, operating rules, and contact routing

It includes smooth scrolling, GSAP scroll choreography, WebGL interaction, an optional sound layer, a custom cursor, responsive navigation, Open Graph artwork, keyboard controls, reduced-motion handling, and a lightweight mobile 3D fallback.

## Architecture

| Area | Source of truth | Responsibility |
| --- | --- | --- |
| Portfolio content | `app/content.ts` | Identity, links, case studies, capabilities, timeline, credentials, and assembly copy |
| Experience shell | `app/page.tsx` | Boot sequence, navigation, sections, interaction state, and project visuals |
| 3D scene | `app/MachineCanvas.tsx` | Normalized GLB scene, lighting, direct manipulation, and GPU lifecycle |
| Visual system | `app/globals.css` | Tokens, typography, responsive layouts, focus states, and motion fallbacks |
| Metadata | `app/layout.tsx`, `app/site-config.ts` | Canonical URL, social cards, robots, and sitemap |
| Hosting runtime | `worker/`, `build/`, `.openai/hosting.json` | Vinext/Cloudflare worker entrypoint and OpenAI Sites packaging |

The page server-renders a complete semantic shell. The heavier Three.js client is loaded only after the intro, browser capability checks, and an idle window. Small screens, Save-Data clients, WebGL failures, and reduced-motion users receive the generated static core instead.

## Personalize it in five minutes

Open [`app/content.ts`](app/content.ts). Every personal value and portfolio record is kept there: name, role, location, email, social links, project stories, capability copy, timeline, and credentials.

The starter ships with deliberately obvious placeholders such as `YOUR NAME`, `YOUR CITY`, and `your-handle`. No personal identity is hard-coded into the interface components.

For a more detailed checklist, see [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md).
The previous GitHub profile README is preserved at [`docs/profile-readme-source.md`](docs/profile-readme-source.md), so the website starter does not erase that source material.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production validation:

```bash
npm run build
npm test
npm run check
```

Node 22.13 or newer is required.

## Release gates

`npm run check` is the single release command. It runs strict TypeScript, scoped ESLint, a production Vinext build, and server-render tests. Before publishing, also inspect these interaction paths in a real browser:

- boot dialog completion and Escape skip;
- keyboard skip navigation and visible focus;
- mobile menu open, close, Escape, short-landscape scrolling, and resize above 1100px;
- reduced-motion, Save-Data, WebGL failure, and model-loading fallbacks;
- every external project/contact link and every public image/model response;
- desktop, portrait mobile, and short-landscape composition with no console errors.

Generated build output, QA screenshots, downloaded references, local Cloudflare state, dependencies, and all `.env` variants except `.env.example` are intentionally ignored.
The same release command runs in `.github/workflows/ci.yml` for every pull request and every push to `main`.

## Generated assets

- `public/models/machine-core.glb` — custom textured 3D asset generated through Meshy Text-to-3D
- `public/generated/meshy-core-preview-hd.webp` — 1254px transparent, high-density mobile/performance fallback refined with OpenAI Imagegen from the Meshy task preview
- `public/og.png` — bespoke social-preview artwork generated with OpenAI Imagegen
- `public/generated/icons/*.png` — eight original, transparent, non-branded interface emblems generated as one Imagegen atlas and individually isolated with safe padding
- UI arrows, audio state, and menu controls are lightweight original CSS primitives, so the live experience ships no stock logo or icon library

The included `scripts/resize-glb-textures.mjs` and `scripts/split-icon-atlas.mjs` utilities make the optimization workflow reproducible when replacing the 3D core or icon system.

The `.env` file is intentionally ignored. The optional `meshyapi` value is used only when regenerating the 3D source asset; the published site does not expose or require that credential.

## Performance and accessibility contract

- No autoplay audio; sound is opt-in and keyboard-toggleable.
- The intro is a focus-managed dialog and can be skipped immediately.
- Long-form content remains server-rendered and usable without WebGL.
- The interactive core stops continuous rendering when offscreen or when the tab is hidden.
- Native cursor behavior is preserved for coarse pointers and reduced motion.
- All primary controls have high-contrast focus-visible styles, active-section state, and accessible labels.
- Project art is distinct per case study and horizontally inspectable on narrow screens.

## Reference source vault

The design research list from the original brief is captured in [`scripts/fetch-references.ps1`](scripts/fetch-references.ps1). It downloads the referenced repositories into six clearly separated groups under `.reference-sources/`:

- personal project sources
- original award-recognized portfolios
- praised spatial/editorial portfolios
- Awwwards recreations and study projects
- production-grade websites
- reusable motion, 3D, and interface libraries

The vault is ignored by Git because it is large and remains separate from the original portfolio implementation. Rebuild it at any time with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\fetch-references.ps1
```

See [`docs/SOURCE-VAULT.md`](docs/SOURCE-VAULT.md) for the design synthesis and provenance policy.

## Interaction controls

- Scroll to move through the narrative and rotate the 3D signal rig
- Drag the machine core on desktop to inspect it
- Press `S` or use the speaker control to toggle interface audio
- Press `Esc` to skip the boot sequence or close the mobile menu
- Keyboard focus and `prefers-reduced-motion` are respected

## Technology

Vinext / Next-compatible App Router, React 19, TypeScript, GSAP + ScrollTrigger, Lenis, Three.js, React Three Fiber, Drei, Vite, and the OpenAI Sites deployment target.
