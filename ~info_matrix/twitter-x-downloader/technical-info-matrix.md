# Technical Info Matrix — Twitter X Downloader

## Extension: `twitter-x-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Twitter X Downloader |
| **Slug / ID** | `twitter-x-downloader` |
| **Gecko ID** | `twitter-x-downloader@serpapps.com` |
| **Category** | Social Media Downloader |
| **Target Site(s)** | x.com (Twitter), twitter.com, and subdomains |
| **Description** | Download X (Twitter) videos, images, and post text from visible posts. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/twitter-x-downloader` |
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
| **Store-Sanitized Build?** | No |
| **GitHub Releases Repo** | `serpapps/twitter-x-downloader` |
| **Product Page** | https://serp.ly/twitter-x-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (chrome.downloads API), Blob fallback (authenticated fetch), X API resolution (status + syndication), page-side download delegation |
| **Quality Selection** | Yes — parsed from URL resolution patterns (e.g. `720p`, `1080p`), scored by bitrate and format |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — modular download manager (`download-manager/`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all items in the active tab (videos, images, or texts) |
| **In-Page Player Button?** | Yes — inline overlay download buttons on videos and images (`overlay-buttons.css`) |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Twitter X Downloader/{source}/{title}.{ext}`, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Multi-source: DOM `<video>` elements, inline script data (twimg URLs), Performance API resource entries, feed permalink scanning, X API (status + syndication) |
| **Image Detection** | DOM `<img>` elements filtered by twimg.com host, minimum 180x180px, sorted by area |
| **Text Extraction** | Post text from `[data-testid='tweet']`, `[role='article']` roots with "See more" auto-expansion |
| **Asset Types** | Videos, Images, Text Posts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `cookies`, `declarativeNetRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://api.x.com/*`, `https://x.com/*`, `https://www.x.com/*`, `https://twitter.com/*`, `https://www.twitter.com/*`, `https://mobile.twitter.com/*`, `https://*.x.com/*`, `https://*.twitter.com/*`, `https://*.twimg.com/*`, `https://t.co/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` + CSS `styles/overlay-buttons.css` -- injected on x.com and twitter.com at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` (loads `indexed-db.js` + `offscreen-faststream-legacy.js` for HLS processing) |
| **Offscreen FastStream?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (web-accessible resource) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (file store for offscreen segment caching) |
| **Page Injection** | None (no `inject.js` — uses content script + DNR header rules) |
| **Declarative Net Request** | Yes — 3 dynamic rules (IDs 42001-42003) to set Origin/Referer headers for twimg.com, x.com, twitter.com, t.co |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), X API v1.1 (`api.x.com/1.1/statuses/show`), X Syndication API (`cdn.syndication.twimg.com`), X Guest Token API (`api.x.com/1.1/guest/activate.json`) |
| **X API Bearer Token** | `AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs...` |
| **X Legacy Bearer Token** | `AAAAAAAAAAAAAAAAAAAAAIK1zgAAAAAA2tUWuhGZ2JceoId5GwYWU5GspY4...` |
| **X Guest Token TTL** | 20 minutes |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Multi-source video/image/text detection, DOM scanning, inline script parsing, Performance API monitoring, feed permalink extraction, overlay button injection |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, X API video resolution (status + syndication), DNR header rules, blob fallback downloads, page-side download delegation |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI with tabbed asset list (Videos/Images/Text), bulk download, rescan |
| Offscreen | `offscreen.html` + `offscreen-faststream-legacy.js` | HLS segment processing via SimpleHLS2MP4Converter |
| Auth | `auth.js` + `auth/auth-config.js` + `auth/auth-api.js` + `auth/auth-storage.js` + `auth/auth-token.js` + `auth/auth-telemetry.js` | OTP login, entitlement checks, trial management |
| Auth UI | `auth-ui.js` | OTP activation section rendering and form handling |
| Download Manager | `download-manager/download-manager.js` + `download-manager-config.js` + `download-manager-state.js` + `download-manager-ui.js` + `download-task-registry.js` + `integration-helper.js` | Modular in-page download progress panel |
| Logger | `logger.js` | Structured logging with level control, console patching, prefix `TWITTER_X` |
| Site Config | `site-config.js` | Brand colors, auth endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks and popup banner |
| Trial Banner | `trial-banner.js` | Free trial remaining badge in popup |
| Popup UI Overrides | `popup-ui-overrides.js` | Header text customization, error message normalization |
| IndexedDB | `indexed-db.js` | Key-value store for offscreen file caching |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://x.com/*`, `https://www.x.com/*`, `https://twitter.com/*`, `https://www.twitter.com/*`, `https://mobile.twitter.com/*`, `https://*.x.com/*`, `https://*.twitter.com/*` |
| **Tweet/Status ID Patterns** | `/status/(\d{6,})`, `tweet_?id["':=\s]+(\d{6,})`, `conversation_id["':=\s]+(\d{6,})`, `/ext_tw_video/(\d{6,})/`, `/amplify_video/(\d{6,})/`, `/tweet_video/(\d{6,})/` |
| **Post Root Selectors** | `[data-testid='tweet']`, `[role='article']`, `[data-pagelet*='FeedUnit']`, `div[aria-posinset]` |
| **Title Sources** | `document.title`, author from `h2, h3, h4` in post root |
| **Thumbnail Sources** | `<video poster>`, largest `<img>` in post root (aspect ratio scoring) |
| **Format Sources** | A) DOM `<video>` / `<source>` elements, B) Inline script regex for twimg.com mp4/m3u8 URLs, C) Performance API CDN entries, D) Feed permalink + DOM video, E) X API status variants (mp4 + m3u8), F) X Syndication API |
| **Media Host Pattern** | `/(twimg\.com\|pbs\.twimg\.com\|video\.twimg\.com\|x\.com\|twitter\.com\|t\.co)/i` |
| **Escaped Media URL Regex** | `/https?:\\\/\\\/(?:video\|pbs)\.twimg\.com\/[^"'\s<>]+?\.(?:mp4\|m3u8)[^"'\s<>]*/gi` |
| **Plain Media URL Regex** | `/https?:\/\/(?:video\|pbs)\.twimg\.com\/[^"'\s<>]+?\.(?:mp4\|m3u8)[^"'\s<>]*/gi` |
| **Inline Script Targets** | Scripts containing `video.twimg.com`, `ext_tw_video`, `amplify_video`, `"video_info"`, `videoDeliveryResponseResult`, `dash_manifest` |
| **Video Key Scoring** | `playable_url_quality_hd(180)`, `browser_native_hd_url(170)`, `playable_url(155)`, `browser_native_sd_url(150)`, `progressive_url(140)`, `dom_video(70)`, `regex_media_url(35)`, `playable_url_dash(20)`, `hls_playlist_url(-140)`, `dash_manifest_url(-170)` |
| **X API Resolution** | Guest token -> `statuses/show/{id}.json` -> `extended_entities.media[].video_info.variants[]`, falls back to Syndication API (`cdn.syndication.twimg.com/tweet-result`) |
| **Syndication Token** | `((tweetId / 1e15) * Math.PI).toString(36).replace(/(0+\|\.)/g, "")` |

### Format Object Structure

```json
{
  "type": "video | image | text",
  "title": "string",
  "url": "string | null",
  "poster": "string | null",
  "permalink": "string | null",
  "quality": "string | null (e.g. '720p')",
  "bitrate": "number",
  "score": "number",
  "source": "string (e.g. 'DOM video', 'X API MP4 variant', 'Feed permalink')",
  "pageUrl": "string"
}
```

### DNR Header Rules

| Rule ID | Condition | Headers Set |
|---|---|---|
| 42001 | Request domains: `twimg.com`, `x.com`, `twitter.com`, `t.co` | Origin: `https://x.com`, Referer: `https://x.com/` |
| 42002 | URL filter: `\|\|scontent.` | Origin: `https://x.com`, Referer: `https://x.com/` |
| 42003 | Request domains: `x.com`, `twitter.com` (XHR/media) | Origin: `https://x.com`, Referer: `https://x.com/` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.7 KB) |
| **Content Script CSS** | `styles/overlay-buttons.css` (2.1 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header (SERP Labs / Twitter X Downloader), Trial banner, Activation section, Stats grid (Videos/Images/Text counts), Tabs (Videos/Images/Text), Download Visible button, Asset list with cards, Status footer |
| **Asset Card Features** | Thumbnail/poster preview, title, quality/source subline, URL body text, per-item Download button, Open post link, text expand/collapse |
| **Tabs** | Videos, Images, Text |
| **Rescan** | Shift+Click for hard reset; normal click for incremental merge |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (PowerShell Compress-Archive, LOG_LEVEL patching) |
| **Watermarked?** | No |
| **GitHub Release?** | Yes — `serpapps/twitter-x-downloader` |
| **Has Worktree?** | Yes — `.worktrees/twitter-x-downloader/` |

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
| **Stripe Product IDs** | `prod_TxtfRQmTHWRA5s`, `prod_U5nhHNtGBSxuEg` |
| **Stripe Product Names** | Twitter Downloader, Twitter X Downloader |
| **Stripe Monthly Price** | USD 9.00/month | USD 9.00/month [twitter-x-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1SzxruDP7AOTRcvmD5KUuruh`, `price_1T7c6EDP7AOTRcvmmjjQsu2U` |
| **Stripe Entitlement Name** | twitter-downloader |
| **Stripe Entitlement Source** | metadata.license_entitlements |
| **Stripe Notes** | multiple_products_matched |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Prefix** | `TWITTER_X` |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16-x.png` |
| Default 48px | 48x48 | `icons/icon48-x.png` |
| Default 128px | 128x128 | `icons/icon128-x.png` |
| Standard 16px | 16x16 | `icons/icon16.png` |
| Standard 32px | 32x32 | `icons/icon32.png` |
| Standard 48px | 48x48 | `icons/icon48.png` |
| Standard 128px | 128x128 | `icons/icon128.png` |
| Debug 128px | 128x128 | `icons/icon128-debug.png` |
| X-branded 32px | 32x32 | `icons/icon32-x.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#1A8CD8` | Primary action/CTA (Twitter/X blue) |
| `brandAccentHover` | `#167ABB` | Hover state (darker blue) |
| `bgDark` | `#000000` | Main dark background (X black) |
| `bgDarker` | `#0A0A0A` | Secondary dark background |
| `borderDark` | `#2F3336` | Dark borders (X border color) |
| `inputBorder` | `#2F3336` | Input field borders |
| `textPrimary` | `#E7E9EA` | Main text (X primary text) |
| `textMuted` | `#71767B` | Secondary text (X muted) |
| `textSubtle` | `#AAB8C2` | Subtle accent text |
| `success` | `#00BA7C` | Success state (X green) |
| `error` | `#F4212E` | Error state (X red) |
| `info` | `#1A8CD8` | Info state (X blue) |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#CFD9DE` | Light mode borders |
| `lightMutedText` | `#536471` | Light mode muted text |
| `lightPanelBg` | `#F7F9F9` | Light mode panel background |
| `lightMutedText2` | `#8B98A5` | Light mode secondary muted |
| `darkTextStrong` | `#0F1419` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.5 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.6 KB) |
| Localize | `modules/Localize.mjs` | i18n support |

### Auth Module Structure

| File | Purpose |
|---|---|
| `auth/auth-config.js` | Auth configuration (baseUrl, entitlementName, storagePrefix) derived from SiteConfig |
| `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume, message listener |
| `auth/auth-storage.js` | Read stored auth data, device ID generation |
| `auth/auth-token.js` | Entitlement validation, name resolution |
| `auth/auth-telemetry.js` | Auth event telemetry logging, dump, clear |

### Download Manager Module Structure

| File | Purpose |
|---|---|
| `download-manager/download-manager.js` | Main download manager orchestration |
| `download-manager/download-manager-config.js` | Configuration constants |
| `download-manager/download-manager-state.js` | State management for active downloads |
| `download-manager/download-manager-ui.js` | UI rendering and panel interactions |
| `download-manager/download-task-registry.js` | Task lifecycle tracking |
| `download-manager/integration-helper.js` | Integration helper for external callers |
