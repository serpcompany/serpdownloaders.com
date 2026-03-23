# Technical Info Matrix — Reddit Downloader

## Extension: `reddit-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Reddit Downloader |
| **Slug / ID** | `reddit-downloader` |
| **Gecko ID** | `reddit-downloader@serpapps.com` |
| **Category** | Multi-Asset Downloader (Video, Image, Text) |
| **Target Site(s)** | reddit.com and subdomains |
| **Description** | Download Reddit videos, images, and post text from visible posts. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/reddit-downloader` |
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
| **Store-Sanitized Build?** | Yes (`reddit-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/reddit-downloader` |
| **Product Page** | https://serp.ly/reddit-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct media download (images, MP4 video), blob URL delegation, permalink tab resolution, authenticated fetch fallback, page-side anchor click fallback |
| **Quality Selection** | Yes — parsed from URL resolution patterns (e.g. `720p`, `1080p`) and DOM video/source elements |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — download-manager module (`download-manager/`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all assets in the active tab (Videos, Images, or Text) |
| **In-Page Player Button?** | No |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Reddit Downloader/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — DOM `<video>` elements, `<source>` tags, anchor `href` video links, Performance API resource entries, blob URLs |
| **Image Detection** | Automatic — DOM `<img>` elements with srcset parsing, filtered by size (min 120px) and Reddit image host matching |
| **Text Detection** | Automatic — post text body extraction from `[slot='text-body']`, `[data-click-id='text']`, `.md`, and longest `<p>`/`<div>` fallback |
| **Asset Types** | Video, Image, Text |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://reddit.com/*`, `https://www.reddit.com/*`, `https://*.reddit.com/*`, `https://redd.it/*`, `https://*.redd.it/*`, `https://v.redd.it/*`, `https://i.redd.it/*`, `https://preview.redd.it/*`, `https://external-preview.redd.it/*`, `https://*.redditmedia.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` + CSS `styles/overlay-buttons.css` — injected on `reddit.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-reddit.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` -> `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS/fMP4 processing via FastStream) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` (SimpleHLS2MP4Converter via offscreen FastStream) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (file storage for offscreen segments) |
| **Page Injection** | None — content script runs directly in page context |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Web Accessible Resources** | `offscreen-faststream.html`, `offscreen-faststream-legacy.js` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Asset harvesting: video, image, and text detection from Reddit post roots |
| Service Worker | `background-reddit.js` (module) | Download orchestration, auth gating, content script injection, permalink tab resolution, blob/fallback handling |
| Background Enhanced | `background-enhanced.js` (module) | X/Twitter API integration layer (DNR rules, guest token, syndication API) — shared codebase |
| Popup | `popup.html` + `popup-enhanced.js` | Multi-tab asset browser (Videos/Images/Text), rescan, download visible, per-asset download |
| Offscreen | `offscreen.html` + `offscreen-faststream-legacy.js` | HLS/fMP4 segment processing and transmuxing via FastStream |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` | Modular download task registry, state management, UI panel, integration helper |
| Logger | `logger.js` | Structured logging with level control, console patching, bg mirroring |
| Site Config | `site-config.js` | Brand colors (Reddit orange), endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks with semver comparison |
| Trial Banner | `trial-banner.js` | Free trial remaining badge in popup |
| Popup UI Overrides | `popup-ui-overrides.js` | Header text normalization, error message overrides |
| IndexedDB | `indexed-db.js` | Key/value file storage for offscreen processing |

### Asset Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://reddit.com/*`, `https://www.reddit.com/*`, `https://*.reddit.com/*` |
| **Post Root Selectors** | `shreddit-post`, `[data-testid='post-container']`, `article`, `div[id^='t3_']`, `faceplate-tracker` |
| **Max Roots Scanned** | 220 |
| **Title Sources** | `post-title` attribute, `title` attribute, `data-postTitle`, `h1`, `h2`, `h3`, `a[slot='title']`, `[slot='title']` |
| **Permalink Sources** | `permalink` attr, `post-permalink` attr, `content-href` attr, `data-permalink`, `data-url`, anchor `href` matching `/comments/`, `window.location.href` |
| **Text Sources** | `[slot='text-body']`, `[data-click-id='text']`, `[data-testid='post-content']`, `.md`, longest `<p>`/`<div>`/`<span>` (min 60 chars) |
| **Video Sources** | DOM `<video>` elements (currentSrc, src, `<source>` children), anchor `href` video links, Performance API resource entries |
| **Image Sources** | DOM `<img>` elements with srcset parsing (largest candidate), filtered by Reddit image hosts and minimum dimensions (120px) |
| **Image Host Regex** | `/(?:^|\.)(?:i\.redd\.it|preview\.redd\.it|external-preview\.redd\.it|redditmedia\.com|redd\.it)$/i` |
| **Video Host Regex** | `/(?:^|\.)(?:v\.redd\.it|reddit\.com|redditmedia\.com|redd\.it)$/i` |
| **Video Hint Regex** | `/(?:\.mp4|\.webm|\.m3u8|\.mpd|\/HLSPlaylist\.m3u8|\/DASHPlaylist\.mpd|\/DASH_\d+|\/dash)/i` |
| **Image Hint Regex** | `/(?:\.jpe?g|\.png|\.webp|\.gif|\.avif)/i` |
| **Blocked Image Regex** | `/(?:avatar|award|emoji|icon|communityIcon|profileIcon|snoo|logo|sprite|thumbnail-default|vote|badge|awards)/i` |
| **Audio-Only Filter** | URLs matching `dash_audio`, `/audio/`, `_audio.mp4` are excluded |
| **Deduplication** | By URL for videos/images, by `permalink:text` composite for text posts |
| **Video Scoring** | Blob: 960, Direct MP4: 900, Link MP4: 840, Resource MP4: 820, HLS DOM: 680, Link non-MP4: 560, Resource non-MP4: 520 |
| **Cache Key** | `__REDDIT_ASSET_CACHE__` (global) |

### Content Script Message Actions

| Action | Purpose |
|---|---|
| `extractFacebookAssets` | Full asset harvest — returns `{ success, assets: { page, counts, videos, images, texts } }` |
| `resetFacebookAssetCache` | Clears cache, re-harvests |
| `resolveVideoAssetByPermalink` | Finds best video for a specific permalink |
| `resolvePrimaryVisibleVideoAsset` | Finds largest visible `<video>` element's best asset |
| `downloadAssetInPage` | Page-side anchor-click download fallback |

### Download Resolution Chain

| Step | Method | Condition |
|---|---|---|
| 1 | Direct URL from asset | If asset.url is present |
| 2 | resolveVideoAssetByPermalink | If no URL and has permalink, via content script |
| 3 | resolvePrimaryVisibleVideoAsset | If no URL and no permalink, via content script |
| 4 | Permalink tab resolution | Opens background tab, loads content script, extracts video |
| 5 | Blob delegation | If URL is `blob:`, delegates to page-side anchor click |
| 6 | chrome.downloads.download | Direct download attempt |
| 7 | fetchMediaBlob + objectURL | Authenticated fetch fallback on direct failure |
| 8 | Page-side download | Final fallback via content script anchor click |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.7 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` (inline) -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Boot splash, Header (SERP Labs / Reddit Downloader), Trial banner, Activation section, Stats grid (Videos/Images/Text Posts), Tab bar (Videos/Images/Text), Download Visible button, Asset list, Status footer |
| **Tab System** | Videos, Images, Text — each tab renders asset cards with preview, metadata, download/open-post buttons |
| **Rescan** | Click = incremental merge scan; Shift+Click = hard reset and fresh scan |
| **Download All** | Downloads all assets in the currently active tab sequentially |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/reddit-downloader` |
| **Has Worktree?** | Yes — `.worktrees/reddit-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `reddit-downloader.zip` | <!-- TODO --> |
| Chrome | `reddit-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `reddit-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `reddit-downloader-brave.zip` | <!-- TODO --> |
| Edge | `reddit-downloader-edge.zip` | <!-- TODO --> |
| Opera | `reddit-downloader-opera.zip` | <!-- TODO --> |
| Whale | `reddit-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `reddit-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `reddit-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `reddit-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_U56DpnQjYZpJ1s` |
| **Stripe Product Name** | Reddit Downloader |
| **Stripe Monthly Price** | USD 9.00/month [reddit-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T6w0pDP7AOTRcvmWQfNfHNX` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Logger Prefix** | `TWITTER_X` (shared logger codebase) |
| **Console Patching** | Yes — auto-patches `console.log/info/warn/error/debug/trace` |

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
| `brandAccent` | `#ff4500` | Primary action/CTA (Reddit orange-red) |
| `brandAccentHover` | `#e03d00` | Hover state (darker orange) |
| `bgDark` | `#1a1a1b` | Main dark background (Reddit dark mode) |
| `bgDarker` | `#111113` | Secondary dark background |
| `borderDark` | `#343536` | Dark borders |
| `inputBorder` | `#444546` | Input field borders |
| `textPrimary` | `#f6f7f8` | Main text |
| `textMuted` | `#818384` | Secondary text |
| `textSubtle` | `#b5b7b8` | Subtle accent text |
| `success` | `#46d160` | Success state (Reddit green) |
| `error` | `#ff585b` | Error state |
| `info` | `#ff7a33` | Info state (orange) |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#d7dadc` | Light mode borders |
| `lightMutedText` | `#6b6f73` | Light mode muted text |
| `lightPanelBg` | `#f6f7f8` | Light mode panel background |
| `lightMutedText2` | `#878a8c` | Light mode secondary muted |
| `darkTextStrong` | `#1a1a1b` | Dark strong text |

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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
| Download Manager | `download-manager/` | Modular download task registry, state, UI, config |
| Auth Module | `auth/` | auth-api, auth-config, auth-storage, auth-telemetry, auth-token |
