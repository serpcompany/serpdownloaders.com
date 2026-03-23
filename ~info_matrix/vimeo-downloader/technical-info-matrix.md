# Technical Info Matrix — Vimeo Downloader

## Extension: `vimeo-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Vimeo |
| **Slug / ID** | `vimeo-downloader` |
| **Gecko ID** | `vimeo-downloader@serpapps.com` |
| **Category** | Video Downloader |
| **Target Site(s)** | vimeo.com, player.vimeo.com, *.vhx.tv, embed.vhx.tv, and any page embedding a Vimeo player |
| **Description** | Download Vimeo videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/vimeo-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-02-12 (BUILD TAG: adaptive-quality-fix-2026-02-12-c) |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`vimeo-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/vimeo-video-downloader` |
| **Product Page** | https://serp.ly/vimeo-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux via offscreen FastStream), Progressive MP4 direct download, DASH |
| **Quality Selection** | Yes -- parsed from playerConfig.request.files (HLS, progressive, DASH CDNs), Vimeo config API, JSON-LD, DOM heuristics |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes -- modular in-page download manager (`download-manager/inline-manager.js`) with cross-tab sync |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes -- overlay download button on Vimeo player containers (`content-enhanced.js` vimeoPlayerOverlayButtons) |
| **Context Menu** | No |
| **Auto-Save** | Yes -- uses `chrome.downloads.download()` with `conflictAction: 'uniquify'`, no subfolder |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic -- playerConfig, vimeo.config, inline script parsing, bootstrap_data, JSON-LD, DOM heuristics, Performance API resource observer, iframe embed probing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `storage`, `tabs`, `scripting`, `webNavigation`, `offscreen`, `cookies`, `declarativeNetRequest` |
| **Host Permissions** | `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `<all_urls>` |
| **Content Scripts (set 1)** | `site-config.js` -> `logger.js` -> `download-manager/inline-manager.js` -- injected on `<all_urls>` at `document_idle`, `all_frames: false` |
| **Content Scripts (set 2)** | `site-config.js` -> `logger.js` -> `content-enhanced.js` -- injected on `vimeo.com/*`, `*.vimeo.com/*`, `player.vimeo.com/*`, `*.vhx.tv/*`, `embed.vhx.tv/*` at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes -- `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes -- `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS segment transmuxing via FastStream) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes -- `modules/mediabunny/` |
| **HLS Library** | `modules/hls/hls.mjs` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter via FastStreamHLS2MP4Wrapper) |
| **DASH->MP4** | No dedicated module (DASH URLs extracted but processed through HLS pipeline) |
| **MP4Box** | Not included |
| **Reencoder** | Not included |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes -- `indexed-db.js` (VimeoDownloaderDB, fileStore) for segment caching |
| **Page Injection** | No separate inject.js -- content-enhanced.js runs in page context via `all_frames: true`, monitors Performance API resources |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad License API (`api.gumroad.com`), Vimeo Player Config (`player.vimeo.com/video/*/config`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline'; child-src 'self';` |
| **DNR Rules** | Dynamic -- sets Origin/Referer headers for cloudfront.net, relaxes CORS for vimeocdn.com and cloudfront.net |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | Video detection, format extraction (playerConfig, vimeo.config, scripts, JSON-LD, DOM), embed iframe probing, Performance API monitoring, overlay download button |
| Download Manager (inline) | `download-manager/inline-manager.js` | In-page download progress panel with cross-tab sync via chrome.storage |
| Download Manager (modular) | `download-manager/download-manager.js` | Full modular download manager with state, UI, auto-remove |
| Download Manager Config | `download-manager/download-manager-config.js` | Configuration and presets for download manager |
| Download Manager State | `download-manager/download-manager-state.js` | State management for downloads |
| Download Manager UI | `download-manager/download-manager-ui.js` | UI rendering for download panel |
| Download Task Registry | `download-manager/download-task-registry.js` | Queue management, active/queued/cancelled tracking, chrome download bookkeeping |
| Integration Helper | `download-manager/integration-helper.js` | Integration utilities |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, Vimeo API/config extraction, DNR rule management, queue processing |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, video info card, password input, multiple video selection, embed detection |
| Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | HLS segment transmuxing via FastStream wrapper |
| Auth | `auth.js` + `auth/` directory | OTP login, entitlement checks, trial management (auth-api.js, auth-config.js, auth-storage.js, auth-telemetry.js, auth-token.js) |
| Auth UI | `auth-ui.js` | OTP auth UI wiring for popup |
| Logger | `logger.js` | Structured logging with level gating, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, Gumroad/GH license IDs |
| Trial Banner | `trial-banner.js` | Free trial remaining badge in popup |
| IndexedDB | `indexed-db.js` | Key-value store for segment caching |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://player.vimeo.com/*`, `https://*.vhx.tv/*`, `https://embed.vhx.tv/*` |
| **Embed Detection** | `<all_urls>` content script detects embedded Vimeo iframes on any page |
| **Video ID Patterns** | `/video/(\d+)` from player.vimeo.com URLs, numeric path segments from vimeo.com URLs |
| **Title Sources** | `playerConfig.video.title`, `vimeo.config.video.title`, JSON-LD `name`, `document.title`, `meta[property="og:title"]` |
| **Thumbnail Sources** | `playerConfig.video.thumbnail_url`, `playerConfig.request.thumb_preview.url`, JSON-LD `thumbnailUrl`, `meta[property="og:image"]` |
| **Duration Sources** | `playerConfig.video.duration`, ISO 8601 PT duration parsing, JSON-LD `duration` |
| **Extra Metadata** | Owner (from `playerConfig.video.owner.name`), description, embed URL, thumb preview sprite data |
| **Format Sources** | A) `playerConfig.request.files` (HLS CDNs, progressive array, DASH CDNs), B) `window.vimeo.config`, C) Inline script parsing (`window.playerConfig = {...}`), D) Bootstrap data / embedded config objects, E) Vimeo Player Config API (`/video/*/config`), F) JSON-LD, G) DOM heuristics |
| **HLS CDN Selection** | `chooseFromCdns()` -- prefers `default_cdn`, falls back to first CDN with `.url` or `.avc_url` |
| **Progressive Format Mapping** | URL, quality, width, height, mime, fps, profile per entry |
| **Performance Resource Monitoring** | PerformanceObserver on `resource` entries, URL tap via `__VD_PERF_URLS` bucket |
| **Iframe Embed Probing** | Creates hidden player.vimeo.com iframes, sends postMessage play/getVideoId commands |
| **Password-Protected Videos** | Popup includes password input section for protected Vimeo videos |
| **Multiple Video Selection** | Popup supports selecting from multiple detected videos on a page |

### Format Object Structure

```json
{
  "url": "string",
  "quality": "string | null",
  "width": "number | null",
  "height": "number | null",
  "mime": "string | null",
  "fps": "number | null",
  "profile": "string | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `FastStreamHLS2MP4Wrapper` (wraps `HLS2MP4` from `modules/hls2mp4/hls2mp4.mjs`) |
| **Batch Size** | `Math.min(10, totalSegments)` |
| **Fallback SW Fetch Retries** | 4 |
| **Fallback Backoff Base** | 800ms |
| **Origin Header (DNR)** | `https://player.vimeo.com` |
| **Referer Header (DNR)** | `https://player.vimeo.com/` |
| **Format Preference** | TS format forced by default (`FORCE_TS_FORMAT: true`) |

### Player Overlay Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.player`, `.player.js-player`, `.player-container`, `.player_container`, `.vh-player-area`, `[class*='js-player_container_']`, `.js-player`, `.vp-video-wrapper`, `.vp-player-ui-container`, `.vp-video`, `video` |
| **Button Text** | "Download" |
| **Button ID Prefix** | `vimeo-inline-download-btn` |
| **Button Position** | Absolute, top-right (top:10px, right:10px) |
| **Visibility Gate** | Only visible if `isActivated = true` (checked via `chrome.storage.local`) |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates, MutationObserver for new containers |
| **Embed Detection** | Finds local iframes matching `player.vimeo.com`, `embed.vhx.tv`, `vimeo.com/event/`, `vimeo.com/showcase/` |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (translateX animation, top:20px, right:20px) |
| **Panel ID** | `vimeo-download-manager` |
| **Card Width** | 380px (340px max on small screens) |
| **Max Height** | `min(innerHeight-80, 500)px` (scrollable) |
| **Z-Index** | 2147483647 |
| **Border** | `2px solid #15d5ff` |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif |
| **Auto-Remove Delay** | 2500ms after completion |
| **Max Concurrent Downloads** | 3 |
| **Features** | Cancel All, Clear completed, Collapse/expand, per-download progress, speed display, cancel per item, cross-tab sync via chrome.storage, queued state display, awaiting Save As state |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | Not configured |
| **Title** | N/A |
| **Contexts** | N/A |
| **URL Patterns** | N/A |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (15.1 KB), `styles/popup-enhanced.css` (12.6 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) |
| **Sections** | Header, Help text display, Boot splash, Activation section (OTP), Embed detected notice, Video selection (multiple videos), Password section, Status display, Get Playlist button, Video info card (thumbnail, title, owner, resolution, description), Quality selector, Download button, Progress bar with cancel, Error display, Update notice, Footer |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` with esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes -- `serpapps/vimeo-video-downloader` |
| **Has Worktree?** | Yes -- `.worktrees/vimeo-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `vimeo-downloader.zip` | <!-- TODO --> |
| Chrome | `vimeo-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `vimeo-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `vimeo-downloader-brave.zip` | <!-- TODO --> |
| Edge | `vimeo-downloader-edge.zip` | <!-- TODO --> |
| Opera | `vimeo-downloader-opera.zip` | <!-- TODO --> |
| Whale | `vimeo-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `vimeo-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `vimeo-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `vimeo-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Gumroad Product ID** | `1oUX5E-ZrqmNqj1CoYXr-A==` |
| **GH License ID** | `sbH51axmKWcJTqFGZCO2` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNAFiumGP1XB` |
| **Stripe Product Name** | Vimeo Video Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Vimeo Video Downloader] | USD 9.00/month [Subscription - Vimeo Downloader] |
| **Stripe One-Time Price** | USD 17.00/one_time | USD 8.00/one_time [vimeo-video-downloader-setup-fee-8] |
| **Stripe Price IDs** | `price_1SdS70DP7AOTRcvmE9x9q923`, `price_1SpcnVDP7AOTRcvmF6LWW6KI`, `price_1SpdxeDP7AOTRcvmGxtvDRoq`, `price_1SpdxeDP7AOTRcvmomvdZgjx` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Logger Prefix** | `VIMEO` |

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
| `brandAccent` | `#15d5ff` | Primary action/CTA (cyan/sky blue) |
| `brandAccentHover` | `#13b1d5` | Hover state (darker cyan) |
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
| HLS Parser | `modules/hls/hls.mjs` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing (hls2mp4.mjs, simple-converter.mjs, MP4Generator.mjs, transmuxer.mjs) |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.5 KB) |
| EventEmitter | `modules/eventemitter/` | Event dispatch |

### DNR (Declarative Net Request) Rules

| Rule ID | Action | Condition |
|---|---|---|
| 21020 | Set Origin to `https://player.vimeo.com`, Referer to `https://player.vimeo.com/` | Requests to `cloudfront.net` (xmlhttprequest, media, other) |
| 21021 | Set CORS headers (`access-control-allow-origin: *`, `access-control-expose-headers: *`, `timing-allow-origin: *`) | Responses from `vimeocdn.com` (xmlhttprequest, media, other) |
| 21022 | Set CORS headers (`access-control-allow-origin: *`, `access-control-expose-headers: *`, `timing-allow-origin: *`) | Responses from `cloudfront.net` (xmlhttprequest, media, other) |

### Testing Configuration

| Setting | Value |
|---|---|
| **FORCE_TS_FORMAT** | `true` (forces `sf=ts` -- original TS segment format) |
| **FORCE_FMP4_FORMAT** | `false` (fMP4 support available but not default) |
| **SKIP_SLOW_DOM_EXTRACTION** | `true` (skips expensive DOM snapshot fallback) |
| **DISABLE_VIMEO_API** | `true` (prefers HTML/config/perf-scan over Vimeo API) |
| **Offscreen Idle Timeout** | 60,000ms (1 minute) |
| **Complete Linger** | 2,500ms |
