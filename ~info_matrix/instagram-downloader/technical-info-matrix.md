# Technical Info Matrix — Instagram Downloader

## Extension: `instagram-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Instagram Downloader by SERP |
| **Slug / ID** | `instagram-downloader` |
| **Gecko ID** | `instagram-downloader@serpapps.com` |
| **Category** | Media Downloader (Mainstream Social) |
| **Target Site(s)** | instagram.com and subdomains (including m.instagram.com) |
| **Description** | Download Instagram videos, images, and post text from visible posts. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 3.0.0 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/instagram-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- TODO --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | <!-- TODO --> |
| **GitHub Releases Repo** | `serpapps/instagram-downloader` |
| **Product Page** | https://serp.ly/instagram-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct media download (MP4/JPEG via CDN) + authenticated blob fallback + page-side fetch fallback |
| **Media Types Supported** | Videos (Posts, Reels, IGTV, Stories), Images (Posts, Stories, Carousel), Post Text |
| **Quality Selection** | Automatic — best quality selected via multi-source scoring (HD preferred, MP4 over HLS) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | Yes (freemium via SERP Auth) |
| **Has Download Manager?** | Yes — modular download manager (`download-manager/`) with configurable UI, progress tracking, cross-tab sync |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all detected media on the current page |
| **In-Page Overlay Buttons?** | Yes — per-video "Download video" button, per-image download icon, "Download images (N)" for carousels, "Save text" button |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Instagram Downloader/{source}/{title}.{ext}` folder structure, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Multi-source: DOM `<video>` elements, inline script data (playable_url, video_versions, etc.), feed permalink traversal, Performance API CDN entries, Instagram GraphQL API, permalink HTML fetch |
| **Image Detection** | DOM `<img>` elements on Instagram CDN hosts (cdninstagram.com, fbcdn.net, fbsbx.com, scontent.*), minimum 180x180px filter |
| **Text Detection** | Post message extraction from `[role='article']` roots, "See more" auto-expansion |
| **Carousel Support** | Yes — detects and downloads multiple images per post via `edge_sidecar_to_children` in GraphQL data |
| **Reels Support** | Yes — `/reel/` and `/reels/` URL patterns, shortcode extraction, GraphQL video resolution |
| **Stories Support** | Yes — `/stories/{username}/{id}` URL pattern detection and permalink scoring |
| **IGTV Support** | Yes — `/tv/{shortcode}` URL pattern detection |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `cookies`, `declarativeNetRequest` |
| **Host Permissions** | `https://auth.serp.co/*`, `https://instagram.com/*`, `https://www.instagram.com/*`, `https://m.instagram.com/*`, `https://*.instagram.com/*`, `https://*.fbcdn.net/*`, `https://*.fbsbx.com/*`, `https://*.cdninstagram.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` + `styles/overlay-buttons.css` — injected on `instagram.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (web-accessible resources) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` |
| **Page Injection** | No dedicated `inject.js` — content script runs directly in page context via `content-enhanced-modular.js` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), Instagram GraphQL API (`www.instagram.com/graphql/query/`), Instagram permalink fetch |
| **Update Check** | <!-- TODO --> |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **DNR Rules** | 3 dynamic rules (IDs 42001-42003) — sets `Origin` and `Referer` headers for `fbcdn.net`, `fbsbx.com`, `cdninstagram.com`, `scontent.*`, and `instagram.com` media requests |
| **Cookies Used** | `csrftoken` from `www.instagram.com` — passed as `X-CSRFToken` header in GraphQL requests |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` (2065 lines) | Multi-source asset extraction (videos, images, text), inline overlay buttons, DOM observation, caching, permalink resolution |
| Service Worker | `background-enhanced.js` (1310 lines, module) | Download orchestration, auth gating, DNR header rules, GraphQL API calls, permalink HTML fetch, blob fallback, page-side retry |
| Popup | `popup.html` + `popup-enhanced.js` (556 lines) | Tabbed UI (Videos/Images/Text), asset counts, "Download Visible" button, "Rescan" button, auth flow |
| Auth | `auth.js` + `auth-ui.js` + `auth/` (5 modules) | OTP login, entitlement checks, trial management, token storage, telemetry |
| Download Manager | `download-manager/` (6 modules) | Configurable in-page download progress panel with cross-tab sync |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, auth endpoints, feature flags |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Overlay Styles | `styles/overlay-buttons.css` | Inline download button styling |
| IndexedDB | `indexed-db.js` | Persistent storage for caching |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://instagram.com/*`, `https://www.instagram.com/*`, `https://m.instagram.com/*`, `https://*.instagram.com/*` |
| **Shortcode Patterns** | `/p/{shortcode}` (post), `/reel/{shortcode}` or `/reels/{shortcode}` (Reel), `/tv/{shortcode}` (IGTV), `/stories/{username}/{id}` (Story) |
| **Shortcode Validation** | 5-11 character alphanumeric token, excludes reserved segments (`audio`, `videos`, `explore`, `channels`, `discover`) |
| **Title Sources** | `document.title`, `h2`/`h3`/`h4` author node within `[role='article']` root |
| **Thumbnail / Poster Sources** | `<video poster>`, largest image in article root (aspect-ratio scored, 9:16 preferred for Reels) |
| **Format Sources** | A) DOM `<video>` src/currentSrc/`<source>`, B) Inline script known keys (playable_url_quality_hd, browser_native_hd_url, video_versions, video_url, playable_url, etc.), C) Regex mp4 URL extraction from scripts, D) Performance API CDN entries, E) Instagram GraphQL API (`doc_id: 8845758582119845`), F) Permalink HTML fetch + extraction |
| **CDN Detection** | Hostname regex: `/(cdninstagram\.com|instagram\.com|fbcdn\.net|fbsbx\.com|scontent\.)/i` |
| **Video Scoring System** | Weighted scoring: key-based score (playable_url_quality_hd=200, browser_native_hd_url=180, video_versions=170, etc.) + MP4 bonus (+170/+90) + CDN host bonus (+35) + quality bonus (height/8) + manifest penalty (-180) |
| **GraphQL API** | Endpoint: `www.instagram.com/graphql/query/?doc_id=8845758582119845`, extracts `xdt_shortcode_media.video_url` and `edge_sidecar_to_children` for carousel videos |
| **GraphQL Headers** | `X-CSRFToken`, `X-IG-App-ID: 936619743392459`, `X-ASBD-ID: 198387`, `X-IG-WWW-Claim: 0`, `X-Requested-With: XMLHttpRequest` |
| **Resolution Fallback Chain** | 1) Content script DOM video -> 2) Content script permalink cache -> 3) Content script primary visible video -> 4) Background GraphQL API -> 5) Background permalink HTML fetch |

### Video Key Score Table

| Key | Score |
|---|---|
| `playable_url_quality_hd` | 200 |
| `browser_native_hd_url` | 180 |
| `video_hd_url` | 175 |
| `video_versions` | 170 |
| `video_url` | 165 |
| `playable_url` | 160 |
| `browser_native_sd_url` | 150 |
| `video_sd_url` | 145 |
| `progressive_url` | 140 |
| `regex_media_url` | 115 |
| `og_video` | 105 |
| `dom_video` | 70 |
| `playable_url_dash` | 20 |
| `hls_playlist_url` | -120 / -140 |
| `dash_manifest_url` | -150 / -170 |

### DNR Header Rules

| Rule ID | Condition | Action |
|---|---|---|
| 42001 | `requestDomains: [fbcdn.net, fbsbx.com, cdninstagram.com]` | Set `Origin: https://www.instagram.com` + `Referer: https://www.instagram.com/` |
| 42002 | `urlFilter: \|\|scontent.` | Set `Origin: https://www.instagram.com` + `Referer: https://www.instagram.com/` |
| 42003 | `requestDomains: [instagram.com]` | Set `Origin: https://www.instagram.com` + `Referer: https://www.instagram.com/` |

### Download Fallback Chain

| Step | Method | Condition |
|---|---|---|
| 1 | Direct `chrome.downloads.download(url)` | First attempt with CDN URL |
| 2 | Authenticated blob fetch + blob download | If direct download throws error |
| 3 | Page-side fetch + `<a>` click download | If auth blob fallback fails |
| 4 | Auth-fetch retry after SERVER_FORBIDDEN | If chrome download interrupted with SERVER_FORBIDDEN |
| 5 | Page-side retry after interruption | If auth-fetch retry fails |

### Inline Overlay Button System

| Setting | Value |
|---|---|
| **Root Selectors** | `[role='article']`, `[data-pagelet*='FeedUnit']`, `div[aria-posinset]` |
| **Video Button** | "Download video" — positioned absolute top-right (8px) on video parent wrapper |
| **Image Button** | Down arrow icon — positioned absolute bottom-right (8px) on image parent wrapper |
| **Multi-Image Button** | "Download images (N)" — in overlay container for carousel posts |
| **Text Button** | "Save text" — in overlay container when post text detected (min 20 chars) |
| **Z-Index** | 2147483647 (max safe integer) |
| **MutationObserver** | Watches `document.body` with `childList: true, subtree: true`; debounced refresh (150ms) |
| **Dedup Signature** | `v{videoCount}-i{imageCount}-{imageKeyHash}-t{hasText}` per root |
| **CSS Class** | `facebook-inline-image-btn`, `facebook-inline-video` (data-skool-dl-btn attribute) |

### Download Manager Configuration

| Setting | Value |
|---|---|
| **Position** | Right side |
| **Theme** | Dark |
| **Max Visible Downloads** | 5 |
| **Auto-Hide After Complete** | 8000ms (8 seconds) |
| **Cross-Tab Sync** | Enabled |
| **Z-Index Base** | 2147483647 |
| **Primary Color** | `#4CAF50` |
| **Font** | system-ui, -apple-system, sans-serif |
| **Presets Available** | minimal, mobile, enterprise |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) |
| **Tabs** | Videos, Images, Text |
| **Stats Grid** | Video count, Image count, Text Post count |
| **Actions** | "Download Visible" button, "Rescan" button |
| **Sections** | Boot splash, Header (SERP Labs / Instagram Downloader), Trial banner, Activation section, Main content (stats + tabs + asset list), Status footer |
| **Subtitle** | "Capture visible videos, images, and post text from the current Instagram page." |

### Asset Output Structure

| Asset Type | Filename Pattern | Format |
|---|---|---|
| Video | `Instagram Downloader/{source}/{title}.mp4` | MP4 |
| Image | `Instagram Downloader/{source}/{title}.{jpg\|png\|webp\|gif\|avif}` | Original format preserved |
| Text | `Instagram Downloader/{source}/{title}.txt` | Plain text with header, post URL, content, save timestamp |

### Text Document Format

```
{title}
========================================

Post URL: {permalink}

{post text content}

Saved from: {pageUrl}
Saved at: {ISO timestamp}
```

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` + `generate-icons.js` |
| **Dependencies** | `archiver@^7.0.1`, `mediabunny@^1.8.0`, `sharp@^0.34.3` |
| **Has Worktree?** | Yes — `.worktrees/instagram-downloader/` |
| **GitHub Release?** | <!-- TODO --> |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | <!-- TODO --> |
| **Site API Changed?** | <!-- TODO --> |
| **User Reports** | <!-- TODO --> |

### Business / Monetization

| Field | Value |
|---|---|
| **Pricing Model** | Freemium (trial downloads, then paid license) |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | Not configured (empty) |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_Txptmus04z0233` |
| **Stripe Product Name** | Instagram Downloader |
| **Stripe Monthly Price** | USD 9.00/month [instagram-downloader-9-mo] |
| **Stripe One-Time Price** | None |
| **Stripe Price IDs** | `price_1SzuDwDP7AOTRcvm3ENEldam` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#0A8FDC` | Primary action/CTA (blue) |
| `brandAccentHover` | `#066BA5` | Hover state (darker blue) |
| `bgDark` | `#0F1626` | Main dark background |
| `bgDarker` | `#131D33` | Secondary dark background |
| `borderDark` | `#2B3A5F` | Dark borders |
| `inputBorder` | `#3A4E7E` | Input field borders |
| `textPrimary` | `#F8FBFF` | Main text |
| `textMuted` | `#93A7CC` | Secondary text |
| `textSubtle` | `#B7C5E3` | Subtle accent text |
| `success` | `#1FBF75` | Success state |
| `error` | `#EB5757` | Error state |
| `info` | `#2D9CDB` | Info state |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e9ecef` | Light mode borders |
| `lightMutedText` | `#6c757d` | Light mode muted text |
| `lightPanelBg` | `#f8f9fa` | Light mode panel background |
| `lightMutedText2` | `#95a5a6` | Light mode secondary muted |
| `darkTextStrong` | `#17243D` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
| YouTube | `modules/youtube/` | YouTube client/signature/SABR/UMP utilities |

### URL Normalization

| Feature | Implementation |
|---|---|
| **Permalink Normalization** | Strips tracking params (igshid, img_index, utm_*, fbclid, mibextid, ref, refsrc), normalizes hostname to `www.instagram.com`, removes trailing slashes, truncates shortcodes to 11 chars |
| **Link Unwrapping** | Detects `l.instagram.com/l.php?u=` and `lm.instagram.com/l.php?u=` redirect wrappers, extracts inner URL |
| **Canonical Key Format** | `post:{shortcode}`, `reel:{shortcode}`, `tv:{shortcode}`, `story:{username}:{id}` |
| **Media URL Canonicalization** | Strips `bytestart`/`byteend` params, normalizes to `{hostname}{pathname}` for dedup |

### Content Script Message Handlers

| Action | Purpose |
|---|---|
| `extractInstagramAssets` | Harvest and return cached videos, images, texts from current page |
| `resetInstagramAssetCache` | Clear asset cache and return fresh scan |
| `downloadAssetInPage` | Page-side fetch + `<a>` click download fallback |
| `resolveVideoAssetByPermalink` | Find cached video matching a specific permalink |
| `resolvePrimaryVisibleVideoAsset` | Find the largest visible video element and resolve its download URL |

### Background Message Handlers

| Action | Purpose |
|---|---|
| `extractInstagramAssets` | Delegates to content script with auth gate, optional cache reset |
| `downloadVideo` | Full download pipeline: access check, asset normalization, multi-step URL resolution, download with fallbacks |
| `checkDownloadStatus` | Status check (returns `{ success: true, inProgress: false }`) |
