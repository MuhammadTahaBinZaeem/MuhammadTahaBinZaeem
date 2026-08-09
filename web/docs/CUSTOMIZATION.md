# Customization checklist

## 1. Replace the content

Edit only [`../app/content.ts`](../app/content.ts) for normal portfolio updates.

- `PROFILE` controls the identity, headline, contact details, and social destinations.
- `SIGNALS` controls the three thesis metrics.
- `PROJECTS` controls all case-study panels, links, accent colors, unique schematic variants, and constraint/build/proof evidence.
- `CAPABILITIES` controls the hardware/software/intelligence rows and their transparent icon paths.
- `EXPERIENCE` controls the timeline.
- `CREDENTIALS` controls the credential chips.
- `ASSEMBLY_FEED` controls the decorative hero program.

Keep project summaries to roughly the existing length for the strongest visual rhythm.

## 2. Replace downloadable files

Add a résumé at `public/resume.pdf`, or change `PROFILE.resume` to its actual path. The starter does not include a fake résumé.

## 3. Replace the generated brand assets

- Hero model: replace `public/models/machine-core.glb` with another GLB. The scene automatically normalizes the model from its bounding box.
- Mobile fallback: replace `public/generated/meshy-core-preview-hd.webp` with a high-density image that preserves transparency.
- Social card: replace `public/og.png` with a 1200×630 image.
- Brand and interface emblems: replace the individually padded PNGs in `public/generated/icons/`; keep transparency and do not reuse one mark for multiple roles.

Set `NEXT_PUBLIC_SITE_URL` in `.env` to the final public origin so social metadata resolves to the deployed domain.

## 4. Tune the visual system

The core palette is at the top of `app/globals.css`:

```css
--ink: #0b0b0a;
--paper: #eee9df;
--signal: #ff5c35;
```

Changing those three values updates nearly the entire site.

## 5. Verify before publishing

Run `npm run check`, then check the hero, every project schematic, the capability section, and the contact section at desktop, portrait mobile, and short-landscape widths. Also verify every link in `app/content.ts`.
