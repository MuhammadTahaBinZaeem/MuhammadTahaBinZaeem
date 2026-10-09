# People, profiles and pictures

Checked on 8 October 2026. Identity matches follow the existing project credits, the official [Type2Learn team](https://type2learn.tech/team/), and public profiles that link to the same accounts or shared projects. A matching name alone is insufficient.

Three LinkedIn links are confirmed. Public LinkedIn picture access was unavailable during this check, so the four displayed photo covers use confirmed GitHub or official team sources. Alizay and Tooba use initials until a confirmed photograph is available. Their records can accept a photo without changing the layout.

| Person | Confirmed LinkedIn | Displayed picture | Background focus |
| --- | --- | --- | --- |
| Muhammad Hamiz bin Kashif | Awaiting a confirmed URL | [Official Type2Learn supplied photograph](https://type2learn.tech/assets/team/muhammad-hamiz-bin-kashif.webp) | Dependable systems and engineering |
| Alizay Hassan | Awaiting a confirmed URL | Initials; confirmed accounts use default icons or a published placeholder | Product strategy and co-design |
| Lameea Mubashir Khan | [LinkedIn](https://www.linkedin.com/in/lameea-khan-745b04385) · self-linked by [rosseaaq](https://github.com/rosseaaq) | [Public GitHub profile photo](https://avatars.githubusercontent.com/u/233437868?v=4) | Accessible interface design |
| Idrees Babar | [LinkedIn](https://www.linkedin.com/in/idrees-babar-23833339a) · public Type2Learn activity names the exact team and official site | [Public GitHub profile photo](https://github.com/meidreesbabar-crypto) | Research, evidence and measurement |
| Muhammad Fahad Younus | Awaiting a confirmed URL | [Official Type2Learn supplied-image portrait](https://type2learn.tech/assets/team/muhammad-fahad-younus-studio.webp) | AI evaluation and computer vision |
| Tooba Fatima | [LinkedIn](https://www.linkedin.com/in/tooba-fatimaa/) · self-linked by her confirmed [lablab profile](https://lablab.ai/u/@toobaafatima) | Initials; confirmed GitHub/lablab accounts use an identicon | CPU datapaths and clear reasoning |

Tooba's identity chain starts with the shared [Debate Club project](https://lablab.ai/ai-hackathons/ai-genesis/vincero/debate-club), whose current member link leads to `@toobaafatima`. That profile identifies NUST CEME and the same collaborators, then publishes the LinkedIn URL. The old indexed `@toobaafatima855` profile redirects to the current account.

Fahad's established [lablab account](https://lablab.ai/u/@fahadyounus62) links the GitHub identity [FahadYounus](https://github.com/FahadYounus). His [ASL translator repository](https://github.com/FahadYounus/ASL-Translator-Test-Model) supports the computer-vision theme. Lameea and Tooba's hardware work is documented in the shared [20-bit CPU authorship record](https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors). The remaining role themes follow the official Type2Learn team responsibilities.

## Local image files

All files below live under `public/media/people/`. The viewer presents complete original frames; portrait covers may use CSS framing without modifying the saved image.

| File | Size | Published source |
| --- | --- | --- |
| `hamiz-kashif-portrait.webp` | 900 × 1439 | Type2Learn supplied photograph; original WebP bytes |
| `hamiz-kashif-devpost-profile.webp` | 1254 × 1254 | [Hamiz's confirmed Devpost account](https://devpost.com/hamiz5625), linked by the [official project showcase](https://devpost.com/software/type2learn-eywzdo); his chosen illustration appears as a related profile picture |
| `lameea-mubashir-khan-portrait.webp` | 460 × 460 | Full GitHub profile photo, encoded as WebP quality 80 |
| `idrees-babar-github-profile.webp` | 460 × 460 | [GitHub avatar original](https://avatars.githubusercontent.com/u/264662503?s=1200&v=4), encoded as WebP quality 93 |
| `idrees-babar-portrait.webp` | 720 × 1466 | [Type2Learn supplied photograph](https://type2learn.tech/assets/team/idrees-babar.webp), original WebP bytes; related photograph |
| `fahad-younus-portrait.webp` | 960 × 1200 | Type2Learn's published portrait, described by its source as prepared from a supplied image; re-encoded as WebP quality 90 with the complete source frame |

Hamiz's Devpost illustration is his chosen public profile picture. It is described as an illustration in the gallery. Its [published original](https://d112y698adiu2z.cloudfront.net/photos/production/user_photos/005/070/098/datas/original.png) is encoded as WebP quality 91 with the complete original frame. His main card uses the separately published team photograph.

Each `<person-id>-background.webp` is a new 1500 × 1000 conceptual illustration generated with the built-in imagegen tool and encoded as WebP quality 87. The six scenes interpret the documented work above. Their captions identify them as conceptual artwork; they open in their own viewers. Prompts, style references and asset paths are in [GENERATED-ART.md](GENERATED-ART.md).

## Editing

Edit `COLLABORATORS` in `app/collaborators-data.ts`. `linkedin` supplies an optional confirmed LinkedIn link; `profile` and `platform` retain the established public profile. `portrait` sets the visible picture, and `media` adds related pictures to its gallery. `background` sets the separate illustrated cover. `focus` and `accent` set the role label and color. Omitting either image uses the ordinary card or initials without an empty viewer. Array order remains the display order.

Add confirmed photos for Alizay and Tooba, or confirmed LinkedIn URLs for Hamiz, Alizay and Fahad, in those fields when available. Update `public/media/media-manifest.json` when replacing an image. The browser regression checks the shipped counts of four photo covers, two initials and three LinkedIn links; adjust those counts only when the actual confirmed content changes.
