# Search visibility — Muhammad Taha Bin Zaeem

The canonical site is **https://tahabinzaeem.tech/**. Local preview remains **http://localhost:3000/**. This work keeps the existing Cloudflare deployment and does not change DNS or connect the public domain to localhost.

## Implemented in the 13 September 2026 SEO pass

- All eight canonical pages have distinct name-led titles, descriptions, canonical URLs, Open Graph and Twitter metadata. Sharing a chapter no longer identifies it as the homepage.
- The full name and natural name variants identify one Person, linked to the actual GitHub, LinkedIn, Devpost and lablab.ai profiles. Type2Learn and ProGenEDA are separate organizations with a founder relationship, not aliases of the person.
- The homepage has its own ProfilePage. Reader routes have their own page entity and breadcrumb hierarchy. Credentials identify their recognizing institutions and evidence, rather than falsely crediting the recipient as their creator. Research and awards retain their real unpublished/finalist status.
- The foreword visibly introduces Muhammad Taha Bin Zaeem / Taha Zaeem and links the four profiles. The atlas uses real reader URLs; the existing client intercept preserves animated in-book navigation. Crawlers and no-JavaScript readers receive ordinary links.
- `/sitemap.xml` lists eight real canonical pages and the actual related project, credential, education and achievement images. Images in overlay galleries are discoverable without preloading them. Editorial dates are explicit in `app/seo.ts`, not refreshed on every request. No invented hash pages, name-variant doorway pages or duplicate media files.
- The Worker issues one-hop permanent redirects from HTTP and known trailing-slash chapter URLs to HTTPS canonicals. Local/preview hosts are unaffected. The optional www redirect is implemented but **www currently lacks DNS/host binding**; code alone cannot make an unbound hostname resolve.
- `/robots.txt` advertises the sitemap and allows search crawlers. `/llms.txt` provides an additional plain-text summary, not a promised ranking mechanism. All substantive content and profile links remain present in initial server HTML without waiting for book animations.
- No new runtime dependencies, tracking scripts, images, or always-running animation code were added.

## Current external status and boundaries

During the audit, the live apex domain served complete portfolio HTML, a real sitemap, robots.txt and real HTTP 404 responses. A search query returned the portfolio. The Google DNS verification TXT record was present; there is no need to add it again. Search-result discovery is not proof of Google coverage for all eight pages or first-place ranking for any query. Search Console performance/indexing data were not available to this agent.

Cloudflare prepends a managed robots policy to the application's robots.txt. At audit time it allowed search while disallowing several training crawlers. This pass removes contradictory application-level GPTBot/ClaudeBot Allow groups; it does not change your Cloudflare bot policy. Training-crawler access is not a Google Search ranking requirement. See [Cloudflare's managed robots documentation](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).

## Search Console: the next external step

1. Open the **existing verified** `tahabinzaeem.tech` property. Check **Sitemaps** for `https://tahabinzaeem.tech/sitemap.xml`; submit it if absent, or inspect its last successful read if already submitted.
2. After the updated deployment is live, inspect the homepage and `/projects`, run **Test live URL**, and request indexing if needed. Do not repeatedly submit the same URL; it does not accelerate crawling. See [Google's recrawl instructions](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
3. Inspect **Page indexing** and the **Google-selected canonical**. Compare against the canonical URL exported by this site. Check Core Web Vitals once field data are available; local screenshot tests are not field measurements.
4. In **Performance → Search results**, track these queries separately: `tahabinzaeem`, `taha zaeem`, `muhammad taha bin zaeem`, and `taha bin zaeem`. Watch impressions, clicks, query position, country and device over several weeks, rather than promising a ranking from code changes alone.
5. Keep the Website field on your actual GitHub, LinkedIn, Devpost and lablab.ai profiles pointed at this canonical domain where each platform permits it. Relevant author/founder credits on your own products can link back too. These are genuine identity connections; this task did not edit external profiles or manufacture backlinks.

Optional: import the verified property into Bing Webmaster Tools and submit the same sitemap. Neither search service needs access to `.env` or your application secrets.

## Reproduce the checks

```powershell
cd web
npm run check
# Start the built preview in a separate terminal:
npm start -- --strictPort
# Local endpoint audit:
npm run seo:audit
# Public endpoint audit, after Cloudflare has deployed:
$env:SEO_AUDIT_ORIGIN = 'https://tahabinzaeem.tech'
npm run seo:audit
Remove-Item Env:SEO_AUDIT_ORIGIN
# Visual and interaction regression:
npm run test:browser
```

`seo:audit` is read-only. It checks real HTTP responses, per-page metadata, structured identity, visible profile links, sitemap URLs, delivery of all indexed images, robots discovery, missing-page status and the production HTTPS redirect. The built-HTML tests additionally cover precise canonical redirects without a production domain and validate credential/schema relationships. Neither test claims official Rich Results validation or access to Google's private indexing data.

Edit metadata and material revision dates in `app/seo.ts`, evidence discovery in `app/seo-images.ts`, and structured data in `app/seo-schema.tsx`. Existing content control panels remain the source for names, profiles, projects and credentials. Consult [Google's image sitemap specification](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps), [canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page) when extending this system.
