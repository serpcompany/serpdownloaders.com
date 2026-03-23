# Technical Info Matrix — PornHub Downloader

## Extension: `pornhub-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP PornHub Downloader |
| **Slug / ID** | `pornhub-downloader` |
| **Gecko ID** | `pornhub-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | pornhub.com, pornhubpremium.com, thumbzilla.com, and subdomains |
| **Description** | Download PornHub videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/pornhub-downloader` |
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
| **Store-Sanitized Build?** | Yes (`pornhub-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/pornhub-video-downloader` |
| **Product Page** | https://serp.ly/pornhub-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from flashvars mediaDefinitions, `<video>`/`<source>` tags, script regex, M3U8 master playlist parsing |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player`, `.mainPlayerDiv`) |
| **Context Menu** | Yes — "Download PornHub Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/PornHub/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" |
| **Video Detection** | Automatic — flashvars_* mediaDefinitions, HTML5 video, script regex, inject.js XHR/fetch monitor, M3U8 playlist parsing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.pornhub.com/*`, `https://*.pornhub.com/*`, `https://pornhub.com/*`, `https://www.pornhubpremium.com/*`, `https://*.pornhubpremium.com/*`, `https://www.thumbzilla.com/*`, `https://*.thumbzilla.com/*`, `https://*.phncdn.com/*`, `https://*.pornhub.net/*`, `https://*.pornhub.org/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `pornhub.com`, `pornhubpremium.com`, `thumbzilla.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), extracts flashvars_* and mediaDefinitions, posts `PORNHUB_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), PornHub `/video/get_media` endpoint |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, flashvars extraction, mediaDefinitions parsing, M3U8 format extraction, HLS segment download, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, M3U8 parsing, HLS download, MP4 download, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context flashvars extraction, XHR/fetch monitor for `/video/get_media` and `mediaDefinitions`, HLS pattern scanning |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.pornhub.com/*`, `https://*.pornhub.com/*`, `https://pornhub.com/*`, `https://www.pornhubpremium.com/*`, `https://*.pornhubpremium.com/*`, `https://www.thumbzilla.com/*`, `https://*.thumbzilla.com/*` |
| **Video ID Patterns** | `viewkey=([a-zA-Z0-9]+)` (primary URL param extraction) |
| **Title Sources** | `h1.title`, `[data-video-title]`, `meta[property="og:title"]` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `<video>` element `.duration`, `flashvars.video_duration`, `flashvars.videoDuration` |
| **Extra Metadata** | Views (`.count`), Likes (`.votesUp`), Dislikes (`.votesDown`), Tags (`.tagsWrapper a`), Categories (`.categoriesWrapper a`), Uploader (`.usernameBadgesWrapper a`, `.video-detailed-info a.bolded`, `.username`) |
| **Format Sources** | A) flashvars_* mediaDefinitions (inject.js + content.js), B) `/video/get_media` API endpoint, C) HTML5 `<video>`/`<source>`, D) M3U8 master/media playlist parsing, E) Script regex for HLS patterns |
| **Flashvars Extraction** | Scans `window` for `flashvars_*` keys; parses `var flashvars_\d+ = {...};` from inline scripts |
| **mediaDefinitions Fields** | `videoUrl`, `quality`, `format` (hls/mp4) — each definition yields format_id, ext, quality, url |
| **CDN Domains** | `*.phncdn.com`, `*.pornhub.net`, `*.pornhub.org` |
| **Media Request Patterns** | `/video/get_media`, `mediaDefinitions`, `.m3u8`, `.mp4` |
| **Inject Message Type** | `PORNHUB_PAGE_DATA` |
| **Inject XHR/Fetch Monitor** | Intercepts XMLHttpRequest and fetch for `/video/get_media` and `mediaDefinitions` URLs, re-sends page data on match |
| **HLS Pattern Scanning** | Regex in inline `<script>` tags: `videoUrl` + `.m3u8`, `format:'hls'`, `m3u8` + `videoUrl` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8 | https",
  "filesize": null,
  "tbr": null,
  "width": null,
  "height": "number | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` (offscreen), content-script segment stitching (fallback) |
| **Master Playlist Parsing** | Extracts `#EXT-X-STREAM-INF` attributes: BANDWIDTH, RESOLUTION, CODECS |
| **Media Playlist Parsing** | Extracts `#EXTINF` durations and segment URLs, handles relative/absolute URL resolution |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | `https://pornhub.com/` or current page URL |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36` |
| **Segment Concatenation** | Content-script fallback: fetches all `.ts` segments, concatenates as `Uint8Array`, creates `video/mp4` Blob |
| **Progress Events** | `HLS_PROCESSING_PROGRESS`, `HLS_PROCESSING_COMPLETE`, `HLS_PROCESSING_ERROR` forwarded from offscreen to content script |

### MP4 Download Specs

| Parameter | Value |
|---|---|
| **Method** | Offscreen streaming via `PROCESS_MP4_DOWNLOAD` message |
| **Content-Script Fallback** | `downloadVideoWithHeaders()` — streams via `response.body.getReader()`, tracks progress, creates Blob + `<a>` click |
| **Progress Update Interval** | Every 1% or every 2 MB |
| **Blob Download** | `chrome.downloads.download()` with `PornHub/` subfolder, `saveAs: false` |
| **Progress Events** | `MP4_DOWNLOAD_PROGRESS`, `MP4_DOWNLOAD_COMPLETE`, `MP4_DOWNLOAD_ERROR` forwarded from offscreen to content script |
| **Cancel Support** | `cancelDownload` handles `hls-*`, `mp4-*`, `blob-*`, `content-*` download ID prefixes; cancels Chrome downloads, HLS/MP4 offscreen processing, content-script readers |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player`, `.mainPlayerDiv` |
| **Button Class** | `ph-download-button` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), shows quality label + type (MP4/HLS) |
| **Visibility Gate** | Only visible if `isActivated = true` in `chrome.storage.local` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **Popover Behavior** | Loads formats via `getVideoFormats`, displays clickable quality rows, closes on outside click |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `pornhub-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons |
| **Guard Flag** | `window.__PH_DM_LOADED__` prevents double initialization |
| **Cancel Bridge** | Listens for `PH_CANCEL_DOWNLOAD` postMessage events |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-pornhub-video` |
| **Title** | "Download PornHub Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://www.pornhub.com/*`, `https://*.pornhub.com/*`, `https://www.pornhubpremium.com/*`, `https://*.pornhubpremium.com/*`, `https://www.thumbzilla.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (14.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (module) → `auth-ui.js` → `trial-banner.js` → `popup-ui-overrides.js` → `update-notifier.js` |
| **Sections** | Header, Quick help banner, Boot splash / loading, Activation section (email + license key), Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/pornhub-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/pornhub-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `pornhub-downloader.zip` | <!-- TODO --> |
| Chrome | `pornhub-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `pornhub-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `pornhub-downloader-brave.zip` | <!-- TODO --> |
| Edge | `pornhub-downloader-edge.zip` | <!-- TODO --> |
| Opera | `pornhub-downloader-opera.zip` | <!-- TODO --> |
| Whale | `pornhub-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `pornhub-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `pornhub-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `pornhub-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Gumroad Product ID** | `test-key` |
| **GH License ID** | `xgyskP4odp7omtju3QED` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNOFimNPRiIM` |
| **Stripe Product Name** | Pornhub Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [pornhub-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6sDP7AOTRcvmYmPqDT8x`, `price_1Symt1DP7AOTRcvmIqIWv9ps` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#ff9000` | Primary action/CTA (Pornhub orange) |
| `brandAccentHover` | `#ff7700` | Hover state (deeper orange) |
| `bgDark` | `#1b1b1b` | Main dark background |
| `bgDarker` | `#2a2a2a` | Secondary dark background |
| `borderDark` | `#333` | Dark borders |
| `inputBorder` | `#555` | Input field borders |
| `textPrimary` | `#ffffff` | Main text |
| `textMuted` | `#999999` | Secondary text |
| `textSubtle` | `#cccccc` | Subtle accent text |
| `success` | `#4caf50` | Success state |
| `error` | `#f44336` | Error state |
| `info` | `#2196f3` | Info state |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e9ecef` | Light mode borders |
| `lightMutedText` | `#6c757d` | Light mode muted text |
| `lightPanelBg` | `#f8f9fa` | Light mode panel background |
| `lightMutedText2` | `#95a5a6` | Light mode secondary muted |
| `darkTextStrong` | `#2c3e50` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities (BlobManager, CSSFilter, Env, URL, Video, Web, etc.) |
| YouTube | `modules/youtube/` | YouTube client/signature utilities (shared module) |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
