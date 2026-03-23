# Technical Info Matrix — Facebook Downloader

## Extension: `facebook-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Facebook Downloader by SERP |
| **Slug / ID** | `facebook-downloader` |
| **Gecko ID** | `facebook-downloader@serpapps.com` |
| **Category** | Video/Image/Text Downloader (Social Media) |
| **Target Site(s)** | facebook.com and subdomains |
| **Description** | Download Facebook videos, images, and post text from visible posts. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 3.0.0 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/facebook-downloader` |
| **Last Updated** | 2026-03-06 |
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
| **GitHub Releases Repo** | `serpapps/facebook-downloader` |
| **Product Page** | https://serp.ly/facebook-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct URL download + Authenticated blob fetch fallback + Page-side fetch/anchor fallback |
| **Asset Types** | Videos, Images, Post Text |
| **Quality Selection** | Yes — parsed from inline data keys (`playable_url_quality_hd`, `browser_native_hd_url`, `playable_url`, `browser_native_sd_url`, `progressive_url`), URL resolution patterns, DOM video sources |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — `download-manager/` directory (modular: config, state, UI, task registry, integration helper) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all assets of the active tab type |
| **In-Page Overlay Buttons?** | Yes — inline overlay buttons on videos, images, and text posts (per-video "Download video", per-image down-arrow, "Download image(s)", "Save text") |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Downloads/Facebook Downloader/{source}/{title}.{ext}`, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Multi-source: DOM `<video>` elements, inline script data (playable_url keys), feed permalink traversal, regex MP4 URL extraction, MutationObserver for dynamic feed |
| **Image Detection** | DOM `<img>` elements filtered by fbcdn.net/fbsbx.com/scontent/cdninstagram.com hosts, minimum 180x180px, excludes icons |
| **Text Detection** | Post message extraction from `[data-ad-preview='message']`, `div[dir='auto']`, `span[dir='auto']`, with "See more" auto-expansion |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `cookies`, `declarativeNetRequest` |
| **Host Permissions** | `https://auth.serp.co/*`, `https://facebook.com/*`, `https://www.facebook.com/*`, `https://m.facebook.com/*`, `https://*.facebook.com/*`, `https://*.fbcdn.net/*`, `https://*.fbsbx.com/*`, `https://*.cdninstagram.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` + CSS `styles/overlay-buttons.css` -- injected on `facebook.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` (loads `indexed-db.js` + `offscreen-faststream-legacy.js`) and `offscreen-faststream.html` |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` (SimpleHLS2MP4Converter in offscreen-faststream-legacy.js) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (file store for offscreen segment caching) |
| **Page Injection** | None (no separate inject.js — content script runs directly in page context via IIFE) |
| **External APIs Called** | SERP Auth (`auth.serp.co`) |
| **Update Check** | Not configured (no update-notifier.js) |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **DNR Rules** | 3 dynamic rules (IDs 42001-42003) — sets `Origin` and `Referer` headers to `https://www.facebook.com/` for requests to fbcdn.net, fbsbx.com, cdninstagram.com, scontent.*, and facebook.com |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Multi-source video/image/text extraction, inline overlay buttons, feed MutationObserver, asset caching, permalink resolution |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, DNR header rules, blob fallback, permalink tab resolution, download retry logic |
| Popup | `popup.html` + `popup-enhanced.js` | Tabbed UI (Videos/Images/Text), asset grid with counts, bulk download, rescan |
| Offscreen | `offscreen.html` + `offscreen-faststream-legacy.js` | FastStream HLS processing with fMP4 support |
| Auth | `auth.js` + `auth/auth-config.js` + `auth/auth-api.js` + `auth/auth-storage.js` + `auth/auth-token.js` + `auth/auth-telemetry.js` | OTP login, entitlement checks, trial management |
| Auth UI | `auth-ui.js` | OTP activation form rendering in popup |
| Download Manager | `download-manager/download-manager.js` + `download-manager-config.js` + `download-manager-state.js` + `download-manager-ui.js` + `download-task-registry.js` + `integration-helper.js` | Modular download management system |
| Logger | `logger.js` | Structured logging with level control (debug/info/warn/error/silent), console patching, prefix `FACEBOOK` |
| Site Config | `site-config.js` | Brand colors, auth endpoints, feature flags, CSS variable injection |
| Trial Banner | `trial-banner.js` | Free trial remaining badge in popup |
| IndexedDB | `indexed-db.js` | Key-value store for offscreen file caching |
| Overlay CSS | `styles/overlay-buttons.css` | Inline download button styling |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://facebook.com/*`, `https://www.facebook.com/*`, `https://m.facebook.com/*`, `https://*.facebook.com/*` |
| **Media Host Detection** | `/(fbcdn\.net\|fbsbx\.com\|scontent\.\|cdninstagram\.com)/i` |
| **Video URL Key Scoring** | `playable_url_quality_hd` (180), `browser_native_hd_url` (170), `playable_url` (155), `browser_native_sd_url` (150), `progressive_url` (140), `dom_video` (70), `regex_media_url` (35), `playable_url_dash` (20), `hls_playlist_url` (-140), `dash_manifest_url` (-170) |
| **Inline Key Pattern** | `/"(playable_url_quality_hd\|playable_url\|playable_url_dash\|browser_native_hd_url\|browser_native_sd_url\|progressive_url\|hls_playlist_url\|dash_manifest_url)"\s*:\s*"([^"]+)"/gi` |
| **Media URL Regex** | `/https?:\\\/\\\/[^"'\s<>]+?\.(?:mp4)[^"'\s<>]*/gi` |
| **Video ID Pattern** | `/video_id[^0-9]{0,32}(\d{5,})/gi` |
| **Permalink Patterns** | `/reel/{id}`, `/reels/{id}`, `/videos/{id}`, `/watch/?v={id}`, `/share/v/{id}`, `/share/r/{id}`, `/posts/{id}`, `/groups/{id}/posts/{id}`, `story_fbid={id}` |
| **Title Sources** | `h2, h3, h4` (author name), `document.title` |
| **Thumbnail Sources** | `<video poster>`, largest landscape-ratio `<img>` in post root |
| **Resolution Parsing** | URL pattern `/(?:_\|-)(\d{3,4})p(?:[_\-.\|$)/i` |
| **Post Root Selectors** | `[role='article']`, `[data-pagelet*='FeedUnit']`, `div[aria-posinset]` |
| **Video Sources** | A) DOM `<video>` elements (currentSrc, src, `<source>` tags), B) Inline script keys (playable_url family), C) Regex MP4 URL extraction from scripts, D) Feed permalink traversal with video ID linkage |
| **Deduplication** | Canonical URL key (host+path for fbcdn domains), permalink matching, score-based merge |

### Format Object Structure

```json
{
  "id": "string",
  "type": "video | image | text",
  "title": "string",
  "url": "string | null",
  "poster": "string | null",
  "permalink": "string | null",
  "quality": "string | null (e.g. '720p')",
  "score": "number",
  "source": "string (e.g. 'DOM video', 'Inline playable_url', 'Feed permalink')",
  "pageUrl": "string"
}
```

### DNR Header Rules

| Rule ID | Condition | Action |
|---|---|---|
| 42001 | requestDomains: `fbcdn.net`, `fbsbx.com`, `cdninstagram.com` | Set Origin + Referer to facebook.com |
| 42002 | urlFilter: `\|\|scontent.` | Set Origin + Referer to facebook.com |
| 42003 | requestDomains: `facebook.com` | Set Origin + Referer to facebook.com |

### Download Fallback Chain

| Step | Method | Trigger |
|---|---|---|
| 1 | Direct `chrome.downloads.download()` with media URL | Primary path |
| 2 | Authenticated blob fetch (`fetchMediaBlob`) -> blob download | Direct download fails |
| 3 | Page-side fetch + `<a>` click download (`downloadAssetInPage`) | Blob fetch fails |
| 4 | Permalink tab resolution -> retry from step 1 | No direct URL available for video |

### Permalink Resolution Strategy

| Step | Method |
|---|---|
| 1 | In-page `resolveVideoAssetByPermalink` — matches cached assets by permalink |
| 2 | In-page `resolvePrimaryVisibleVideoAsset` — picks largest visible video element |
| 3 | Background `resolveVideoViaPermalinkTab` — opens permalink in hidden tab, injects content script, extracts assets |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (7.9 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) |
| **Tabs** | Videos, Images, Text |
| **Sections** | Boot splash, Header (SERP Labs / Facebook Downloader), Trial banner, Activation section, Stats grid (Videos/Images/Text counts), Tab buttons, Download Visible button, Asset list, Status footer |
| **Asset Cards** | Video: thumbnail/poster/placeholder + title + quality/source + download button + permalink link; Image: thumbnail + title + dimensions + download; Text: expandable body + save button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | <!-- TODO --> |
| **GitHub Release?** | Yes — `serpapps/facebook-downloader` |
| **Has Worktree?** | Yes — `.worktrees/facebook-downloader/` |

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
| **Pricing Model** | Freemium (3 free downloads, then paid license) |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | Not configured (empty) |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TxZnTCI57ZLwsn` |
| **Stripe Product Name** | Facebook Downloader |
| **Stripe Monthly Price** | USD 9.00/month [facebook-downloader-9-mo] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1Szee5DP7AOTRcvmUxSKMqkE` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Prefix** | `FACEBOOK` |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Auth Telemetry** | Yes — `auth/auth-telemetry.js` (structured event logging for auth flows) |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 32px | 32x32 | `icons/icon32.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#0A8FDC` | Primary action/CTA (Facebook blue) |
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
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |
| MP4Box | `modules/mp4box.mjs` (319 KB) | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` (4.3 KB) | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` (3.5 KB) | Event dispatch |
| Localize | `modules/Localize.mjs` (1.2 KB) | i18n support |
