# Technical Info Matrix — Mindvalley Downloader

## Extension: `mindvalley-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Mindvalley |
| **Slug / ID** | `mindvalley-downloader` |
| **Gecko ID** | `mindvalley-downloader@serpapps.com` |
| **Category** | Video Downloader (Education / Personal Growth) |
| **Target Site(s)** | mindvalley.com and subdomains |
| **Description** | Download videos from Mindvalley. Supports downloading HLS (.m3u8) streams plus loom, youtube, vimeo, wistia embeds. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/mindvalley-downloader` |
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
| **Store-Sanitized Build?** | Yes (`mindvalley-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/mindvalley-video-downloader` |
| **Product Page** | https://serp.ly/mindvalley-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master playlist variants, embedded player APIs (Vimeo, YouTube, Loom, Wistia) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No — popup-driven downloads (overlay stub only) |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Downloads/Mindvalley/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — Performance Resource Timing API (main.m3u8), DOM `<video>`/`<source>` scanning, fetch/XHR interception, PerformanceObserver, main-world tracker injection |
| **Multi-Platform Detection** | Yes — Mindvalley native HLS, Vimeo embeds, YouTube embeds, Loom embeds, Wistia embeds, SproutVideo embeds |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `webRequest`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://mindvalley.com/*`, `https://*.mindvalley.com/*`, `https://otfp.mindvalley.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on `mindvalley.com` (all_frames: true) + embedded player domains (all_frames: false) at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen-faststream-legacy.js` (FastStream offscreen processing) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Module** | `modules/youtube/` |
| **IndexedDB** | Yes — segment caching (`indexed-db.js`) |
| **Page Injection** | `detectors/mindvalley/mindvalley-mainworld-tracker.js` — injected into page main-world to intercept fetch/XHR/PerformanceObserver for m3u8 URL capture, posts `serp-mindvalley-tracker` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Vimeo API, YouTube API, Loom API |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |
| **DNR Rules** | Yes — declarativeNetRequest rules for YouTube (googlevideo.com origin/referer), YouTube site calls, YouTube internal API |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Modular video detection bootstrap, loads detectors/messaging/observers dynamically |
| Content Loaders | `content/content-loaders.js` | Dynamic module loader for detectors, telemetry, auth, HLS, Vimeo bridge, download manager |
| Content Detection | `content/content-detection.js` | Detector facade — unified API for all platform detectors |
| Content Messaging | `content/content-messaging.js` | Chrome runtime message handler for content script |
| Content Observer | `content/content-observer.js` | MutationObserver/polling for automatic video detection |
| Content Thumbnail | `content/content-thumbnail.js` | Thumbnail extraction from content script context |
| Video Detector Coordinator | `detectors/video-detector.js` | Coordinates all platform-specific detectors with unified interface |
| Mindvalley Detector | `detectors/mindvalley-detector.js` + `detectors/mindvalley/mindvalley-native.js` | HLS main.m3u8 detection via Performance API, DOM video scanning |
| Mindvalley Utils | `detectors/mindvalley/mindvalley-utils.js` | M3u8 URL normalization, PerformanceObserver, fetch/XHR patching, caching |
| Mindvalley Main-World Tracker | `detectors/mindvalley/mindvalley-mainworld-tracker.js` | Page-context script for fetch/XHR/PerformanceObserver interception |
| Mindvalley Overlay | `detectors/mindvalley/mindvalley-overlay.js` | Stub overlay (no-op, popup-driven downloads) |
| Loom Detector | `detectors/loom-detector.js` + `detectors/loom/` | Loom embed detection |
| Vimeo Detector | `detectors/vimeo-detector.js` + `detectors/vimeo/` | Vimeo embed/page detection |
| YouTube Detector | `detectors/youtube-detector.js` | YouTube embed detection |
| Wistia Detector | `detectors/wistia-detector.js` | Wistia embed detection |
| SproutVideo Detector | `detectors/sprout-detector.js` + `detectors/skool/` | SproutVideo embed detection |
| Loom Handler | `handlers/loom/` | Loom API, HLS/DASH download, segment processing |
| Vimeo Handler | `handlers/vimeo/` | Vimeo auth, DNR, HLS, extraction, frame utils, page parsing |
| YouTube Handler | `handlers/youtube/` | YouTube core, download, find |
| Wistia Handler | `handlers/wistia/` | Wistia core, download, find |
| Service Worker | `background-enhanced.js` (module) | Imports site-config, auth, starts background app |
| Background App | `background/app.js` | Download orchestration, auth gating, offscreen management, telemetry, download queue |
| Background Modules | `background/*.js` (30 files) | Automation config, network candidates, content messaging, download state, offscreen manager, progress reporter, download queue, side panel, DNR rules, handler factory, message router, etc. |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen-faststream-legacy.js` | FastStream offscreen document for streaming downloads |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (14 files) | In-page download progress panel with config, state, UI, events, history, speed, storage |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Bootstrap | `bootstrap.js` | WXT bootstrap entrypoint (no-op) |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://mindvalley.com/*`, `https://*.mindvalley.com/*` |
| **Embedded Player Matches** | `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*` |
| **Mindvalley Detection Strategy** | 1) DOM: scan `<video>` elements for `<source src="*.m3u8">`, prioritize by visible area + playing state. 2) Performance API: `getEntriesByType("resource")` for `main.m3u8` URLs. 3) Main-world tracker: intercept fetch/XHR/PerformanceObserver in page context. 4) PostMessage bridge: `serp-mindvalley-tracker` messages from main-world to content script. |
| **M3U8 URL Patterns** | `main.m3u8` on `otfp.mindvalley.com`, `assets.mindvalley.com`, CDN hosts. Variant playlists (`h264_*p_*-video.m3u8`) normalized to `main.m3u8`. |
| **Asset ID Pattern** | `/assets\/([0-9a-f-]{36})/i` (UUID from asset URLs) |
| **Title Sources** | `h1` element text, `document.title` fallback, "Mindvalley Video" default |
| **Thumbnail Sources** | `<video>` poster attribute, `.vjs-poster` background-image, `img[src*="assets.mindvalley.com"]`, `og:image` meta tag |
| **Container Selectors** | `.video-js`, `.mv-video-item-container`, `.mv-universal-player-container`, `.mv-universal-player` |
| **Playing State Detection** | `vjs-user-active` class (+10M score), `vjs-playing` class (+5M score) on `.video-js` container |
| **Subtitle Exclusion** | URLs matching `/(\.webvtt\.m3u8|\.vtt\.m3u8|subtitle|captions)/i` are excluded |
| **CDN Hosts** | `otfp.mindvalley.com` (preferred, tokenized), `assets.mindvalley.com`, generic CDN hosts on Mindvalley pages |
| **Platform Priority** | Mindvalley native > Loom embed > Vimeo embed > YouTube embed > Wistia embed > SproutVideo embed |
| **Generic Fallback** | On non-Mindvalley domains only — `detectGenericVideoSources()` for `<video>`/`<source>` elements |

### Format Object Structure

```json
{
  "id": "string (mindvalley-{hash})",
  "playbackId": "string",
  "title": "string",
  "url": "string (m3u8 URL)",
  "m3u8Url": "string",
  "platform": "Mindvalley",
  "source": "performance_main_m3u8",
  "pageUrl": "string",
  "pageTitle": "string",
  "thumbnail": "string | null",
  "duration": null,
  "format_type": "hls",
  "ext": "m3u8",
  "selectedFormat": {
    "url": "string (m3u8 URL)",
    "ext": "m3u8",
    "format_type": "hls",
    "format_id": "auto"
  }
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | `https://mindvalley.com/` |
| **Origin** | `https://mindvalley.com` |
| **OTFP Host** | `otfp.mindvalley.com` (tokenized manifest URLs) |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Right (configurable: left, right, top, bottom) |
| **Theme** | Dark (configurable: light, dark, auto) |
| **Z-Index** | 2147483647 |
| **Border Radius** | 8px |
| **Font** | system-ui, -apple-system, sans-serif |
| **Auto-Hide** | 8 seconds after completion |
| **Max Visible Downloads** | 5 (scrollable) |
| **Max Completed to Keep** | 3 |
| **Cross-Tab Sync** | Yes |
| **Features** | Cancel all, clear completed, per-download progress bars, speed display, linger after complete (2s) |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (131 B), `styles/popup-enhanced.css` (10 KB) |
| **Script Load Order** | `auth.js` (module) -> `popup.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `site-config.js` -> `update-notifier.js` |
| **Sections** | Header, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, duration), Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (canonical legacy build script) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/mindvalley-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/mindvalley-downloader/` |
| **Dependencies** | `archiver` (^7.0.1), `sharp` (^0.34.4) |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `mindvalley-downloader.zip` | <!-- TODO --> |
| Chrome | `mindvalley-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `mindvalley-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `mindvalley-downloader-brave.zip` | <!-- TODO --> |
| Edge | `mindvalley-downloader-edge.zip` | <!-- TODO --> |
| Opera | `mindvalley-downloader-opera.zip` | <!-- TODO --> |
| Whale | `mindvalley-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `mindvalley-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `mindvalley-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `mindvalley-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **License Check Worker** | Not configured (empty) |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TuO0RD8aDs9x9h`, `prod_TxZnsgyfL6rdY4` |
| **Stripe Product Name** | Mindvalley Downloader |
| **Stripe Monthly Price** | USD 17.00/month | USD 9.00/month [mindvalley-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 97.00/one_time [mindvalley-downloader-97-once] |
| **Stripe Price IDs** | `price_1SwZEWDP7AOTRcvmElb0LghS`, `price_1Szee8DP7AOTRcvmxfmuY3TP`, `price_1T6w15DP7AOTRcvm16ECHbjH` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |
| **Telemetry Buffer** | Yes — storage key `telemetry:mindvalley-downloader`, limit 500 entries |
| **Service Worker Relays** | Console relay + Network relay |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#0ea5e9` | Primary action/CTA (sky blue) |
| `brandAccentHover` | `#0b73b9` | Hover state (darker blue) |
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
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube-specific utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |

### Supported Embedded Platforms

| Platform | Detector | Handler | Detection Method |
|---|---|---|---|
| Mindvalley (native) | `mindvalley-detector.js` + `mindvalley/` | Background app (HLS) | Performance API main.m3u8, DOM video/source, fetch/XHR intercept |
| Vimeo | `vimeo-detector.js` + `vimeo/` | `handlers/vimeo/` (12 files) | iframe embed detection, oEmbed, page parser, HLS extraction |
| YouTube | `youtube-detector.js` | `handlers/youtube/` (3 files) | iframe/embed detection, YouTube API |
| Loom | `loom-detector.js` + `loom/` | `handlers/loom/` (8 files) | iframe embed detection, Loom API, HLS/DASH processing |
| Wistia | `wistia-detector.js` | `handlers/wistia/` (3 files) | iframe/embed detection, Wistia API |
| SproutVideo | `sprout-detector.js` + `skool/` | Background sprout module | iframe embed detection |

### DNR Rules (Declarative Net Request)

| Rule ID | Domain | Headers Modified | Purpose |
|---|---|---|---|
| 10001 | `googlevideo.com` | origin, referer -> youtube.com | YouTube media requests |
| 10002 | `www.youtube.com` | origin, referer, x-origin -> youtube.com | YouTube site calls |
| 10003 | `youtubei.googleapis.com` | origin, referer, x-origin -> youtube.com | YouTube internal API |
