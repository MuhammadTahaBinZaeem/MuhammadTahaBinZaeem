# Reference source vault

The research brief included dozens of award-recognized portfolios, recreations, production websites, and reusable visual libraries. They are kept outside the product source under `.reference-sources/` so the final portfolio remains original, fast, and auditable.

## Arrangement

| Group | Purpose |
| --- | --- |
| `personal-work` | Project repositories named in the supplied GitHub and LinkedIn source material |
| `awwwards-originals` | Spatial navigation, 3D staging, editorial WebGL, and distinctive portfolio mechanics |
| `praised-portfolios` | Recruiter-friendly content hierarchy, responsive experimentation, and narrative pacing |
| `recreations` | Learning-oriented motion, GSAP, brutalist, and game-site implementations |
| `production-sites` | Mature responsive systems, content architecture, and product storytelling |
| `visual-libraries` | Motion, smooth scroll, 3D, shaders, and accessible interface primitives |

The executable catalog is [`../scripts/fetch-references.ps1`](../scripts/fetch-references.ps1). Each repository is shallow-cloned into `GROUP/OWNER__REPOSITORY`, preserving its Git metadata and upstream attribution.

## What influenced this starter

- Spatial focal point and direct manipulation from interactive 3D portfolios
- Editorial typography and layered depth from WebGL gallery work
- Case-study clarity from modern open product sites
- Smooth-scrolling and scroll-triggered reveals from GSAP/Lenis references
- Lightweight, accessible mobile fallback instead of forcing desktop WebGL everywhere

The final concept, layout, writing system, assembly theme, generated machine core, and visual composition are original to this starter. Third-party repositories are research material and are not bundled into the production application.

## Provenance practice

Before publishing borrowed code or assets, inspect each upstream repository's current license and asset terms. Code, models, music, fonts, textures, and brand material can have different permissions even when they live in the same repository.
