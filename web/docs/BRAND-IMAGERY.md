# Official project imagery

Retrieved and checked on 7 October 2026. ProGenEDA and Type2Learn now use their own published imagery as flagship covers and gallery content. The official websites and GitHub organizations link to one another: [ProGenEDA](https://progeneda.app/) / [its organization](https://github.com/ProGenEDA), and [Type2Learn](https://type2learn.tech/) / [its organization](https://github.com/Type2Learn).

`FEATURED.image` in `app/dossier-data.ts` sets each primary cover. `FEATURED.media` adds optional project-specific evidence, and `app/project-galleries.ts` supplies the remaining images in display order. Following the 8 October 2026 library audit, the galleries contain eight ProGenEDA images and four Type2Learn images. The shared founder portrait belongs to the author introduction, and supplemental organization avatars remain source archives rather than product-gallery entries. Remove or reorder the data entries to change the galleries without changing a layout or animation.

The ProGenEDA cover is its official brand card. Its gallery includes published application screenshots and native-editor examples. The Type2Learn cover and active-recall image are actual captures of its live website; two additional images are explanatory artwork published by Type2Learn and are explicitly captioned as artwork. A screenshot of a website may contain that website's editorial visuals; it does not establish that the pictured learner is a participant. Native-editor examples document what the official site publishes and do not imply additional validation or simulation results.

## Saved files and original sources

Every filename below is under `public/media/projects/`. Sizes are the encoded image dimensions; nothing was enlarged or cropped.

| Local filename | Dimensions | Original source and role |
| --- | --- | --- |
| `progeneda-official-brand-card.webp` | 1200 × 630 | [Official social card](https://progeneda.app/assets/progeneda-social.png) · brand artwork |
| `progeneda-official-generate-workspace.webp` | 1600 × 1000 | [Generate workspace](https://progeneda.app/media/product/generate.png) · published application screenshot |
| `progeneda-official-components-catalogue.webp` | 1600 × 1000 | [Supported Components](https://progeneda.app/media/product/components-home.png) · published application screenshot |
| `progeneda-official-generation-history.webp` | 1600 × 1000 | [Generation History](https://progeneda.app/media/product/history.png) · published application screenshot |
| `progeneda-official-proteus-schematic.webp` | 1600 × 1000 | [Proteus example](https://progeneda.app/media/circuits/proteus-schematic-01.png) · native-editor screenshot |
| `progeneda-official-easyeda-schematic.webp` | 1608 × 946 | [EasyEDA Pro example](https://progeneda.app/media/circuits/easyeda-schematic-01.png) · native-editor screenshot |
| `progeneda-official-kicad-board.webp` | 1293 × 879 | [KiCad board example](https://progeneda.app/media/circuits/kicad-pcb-01.png) · native-editor screenshot |
| `progeneda-official-ltspice-schematic.webp` | 1914 × 1024 | [LTspice example](https://progeneda.app/media/circuits/ltspice-schematic-01.png) · native-editor screenshot |
| `progeneda-official-github-mark.webp` | 448 × 448 | [Organization avatar](https://avatars.githubusercontent.com/u/307885477?s=1024&v=4) displayed on [ProGenEDA's GitHub organization](https://github.com/ProGenEDA) · brand mark |
| `type2learn-official-home-capture.webp` | 1600 × 1000 | [Official home page](https://type2learn.tech/) · live website screenshot |
| `type2learn-official-recall-capture.webp` | 1600 × 1000 | [Official active-recall interaction](https://type2learn.tech/#demo) · live website screenshot |
| `type2learn-official-learning-path-artwork.webp` | 1672 × 941 | [Learning-path visual](https://type2learn.tech/assets/product-views/guided-lesson-preview.png) · explanatory artwork |
| `type2learn-official-learner-controls-artwork.webp` | 1586 × 992 | [Learner-controls visual](https://type2learn.tech/assets/product-views/learner-controls-preview.png) · explanatory artwork |
| `type2learn-official-github-mark.webp` | 460 × 460 | [Organization avatar](https://avatars.githubusercontent.com/u/306594002?s=1024&v=4) displayed on [Type2Learn's GitHub organization](https://github.com/Type2Learn) · brand mark |
| `muhammad-taha-founder-headshot.webp` | 988 × 970 | Founder portrait from [ProGenEDA](https://progeneda.app/media/team/founder-muhammad-taha.webp) and [Type2Learn](https://type2learn.tech/assets/team/founder-muhammad-taha.webp), where it appears on the [team page](https://type2learn.tech/team/) |

The two founder source files are byte-identical. One local copy is used by the chapter author introduction and preserved without reencoding. The organization-avatar files listed above are retained as source archives and excluded from displayed galleries. The original files in `public/media/ventures/` also remain historical archives; the two project galleries point to the curated official imagery.

## Repository provenance and delivery

The downloaded ProGenEDA brand card, three application screenshots, four native-editor examples, and founder portrait match their originals byte-for-byte at [ProGenEDA/ProGenEDA-WEB, commit `d3d38dda1ba0ad4f4fb0d63c52941b3fc9f7ad95`](https://github.com/ProGenEDA/ProGenEDA-WEB/tree/d3d38dda1ba0ad4f4fb0d63c52941b3fc9f7ad95). Their paths begin with `public/` and otherwise match the official asset URL paths above.

The two Type2Learn explanatory visuals match their originals byte-for-byte at [Type2Learn/web, commit `5395b4b27ef86815de8c1bf936b91e4b1e8b8ec5`](https://github.com/Type2Learn/web/tree/5395b4b27ef86815de8c1bf936b91e4b1e8b8ec5). The official source describes them as editorial graphics; the filenames containing `preview` do not make them application screenshots. GitHub avatars are downloaded from each organization's declared `avatar_url` without enlarging their available resolution.

The two live Type2Learn captures used Chromium 149 at a 1600 × 1000 viewport and device scale factor 1. The browser used reduced motion, declined optional analytics through the site's own button, and waited for fonts and visible images to decode. The second capture scrolled normally to `#demo`. No page content, answers, feedback, or styling was fabricated for the captures.

Sharp encodes the ProGenEDA screenshots, brand card, and organization marks as lossless WebP. The Type2Learn website captures and explanatory artwork use WebP quality 94 with their original dimensions. Encoded metadata is stripped; the founder portrait retains the original WebP bytes. Source URLs, repository revisions, SHA-256 checksums of the downloaded originals, dimensions, delivery byte sizes, and conversion settings are recorded under `projects` in `public/media/media-manifest.json`. These entries are separate from the generated decorative artwork described in [GENERATED-ART.md](GENERATED-ART.md).

To replace a cover or gallery image, obtain the new official file or capture the actual site, add it under `public/media/projects/`, update the corresponding typed data entry, and record its source in the manifest and this document. Keep the distinction between product screenshots, portraits, and explanatory artwork in the alt text and captions. Run `npm run check` after the edit; shipped gallery-count assertions should change only when the actual gallery content changes.
