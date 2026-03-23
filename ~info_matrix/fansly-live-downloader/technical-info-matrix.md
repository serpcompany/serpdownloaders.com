# Technical Info Matrix — FanslyLive Downloader

## Extension: `fansly-live-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP FanslyLive Downloader |
| **Slug / ID** | `fansly-live-downloader` |
| **Gecko ID** | `fansly-live-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult) |
| **Target Site(s)** | fansly.com and subdomains |
| **Description** | Download FanslyLive live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/fansly-live-downloader` |
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
| **Store-Sanitized Build?** | Yes (`fansly-live-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/fansly-live-video-downloader` |
| **Product Page** | https://serp.ly/fansly-live-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (real-time segment recording to MP4 transmux) + HLS VOD Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes -- parsed from HLS master playlists (variant bandwidth/resolution), Fansly API stream metadata, inject.js page data |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes -- in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes -- real-time HLS live capture with start/stop, segment counting, elapsed timer |
| **VR Support?** | Yes -- VR camera settings detection (stereo packing, frame format, horizontal angle), VR filename suffix, VR badge in popup |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes -- `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes -- "Download FanslyLive Stream" on page and video contexts |
| **Auto-Save** | Yes -- saves to `Downloads/FANSLYLIVE/` folder, no save-as dialog |
| **Desktop Notifications** | No (progress forwarded via in-page download manager) |
| **Video Detection** | Automatic -- Fansly API (`apiv3.fansly.com`), inject.js page-context monitor, HLS master playlist probing across multiple CDN hosts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://fansly.com/*`, `https://www.fansly.com/*`, `https://apiv3.fansly.com/*`, `https://*.fansly.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` -- injected on `fansly.com` at `document_idle` |
| **Background Service Worker?** | Yes -- `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes -- `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes -- `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | N/A (direct fetch in background/offscreen) |
| **IndexedDB** | Yes -- segment caching |
| **Page Injection** | `inject.js` -- monitors Fansly API, `__PRELOADED_STATE__`, Performance API, page scripts; posts `FANSLY_LIVE_PAGE_DATA` messages |
| **External APIs Called** | Fansly API (`apiv3.fansly.com`), Fansly Front API (`fansly.com/api/front/v2`), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video/stream detection, Fansly API data extraction, download progress forwarding |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, Fansly stream meta fetching, HLS playlist parsing, auth gating, offscreen management, context menu |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live capture recording |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment counting |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context Fansly API monitor, HLS URL discovery, model/stream data extraction |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://fansly.com/*`, `https://www.fansly.com/*`, `https://*.fansly.com/*` |
| **Page Type Detection** | `live` (default) or `vod` (when URL matches `/videos?/` pattern) |
| **Model ID Sources** | Fansly API account lookup (`apiv3.fansly.com/api/v1/account`), URL path segments, inject.js page data |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Stream Discovery** | Fansly API streaming channel endpoint (`apiv3.fansly.com/api/v1/streaming/channel/{id}`), `__PRELOADED_STATE__`, `__INITIAL_STATE__`, `__NUXT__`, `__NEXT_DATA__`, Performance API resource entries, script regex |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **HLS Master URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **Media Request Patterns** | `.m3u8`, Fansly API endpoints, CDN host entries |
| **Inject Message Type** | `FANSLY_LIVE_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_FANSLY_LIVE_DATA` |
| **VOD Detection** | URL pattern `/{username}/videos/{videoId}`, Fansly user videos API |

### Format Object Structure

```json
{
  "quality": "string (e.g. '1080p (HLS)', 'Auto (HLS)', 'Trailer (MP4)', 'Source (MP4)')",
  "url": "string",
  "type": "hls | mp4",
  "format": "string (e.g. 'HLS', 'MP4')",
  "height": "number | null",
  "bandwidth": "number | null",
  "fps": "number | null",
  "requestUrl": "string | null",
  "extraParams": "object | null"
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
| **Live Poll Interval** | 1,400ms |
| **Live Idle Limit (with data)** | 35 ticks |
| **Live Idle Limit (no data)** | 12 ticks |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 segments |
| **Live Tick Tail Limit** | 4 segments |
| **Referer** | `https://fansly.com/` |
| **Origin** | `https://fansly.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes -- format list with quality label and type badge |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `FANSLYLIVE-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment count + elapsed timer |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-fansly-live-video` |
| **Title** | "Download FanslyLive Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `fansly.com/*`, `*.fansly.com/*`, `m.fansly.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css`, `styles/popup-enhanced.css` |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (with VR badge, LIVE badge), Quality selector, Capture hint, Live capture status, Download button (Start/Stop for live, Download Video for VOD), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes -- `serpapps/fansly-live-video-downloader` |
| **Has Worktree?** | Yes -- `.worktrees/fansly-live-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `fansly-live-downloader.zip` | <!-- TODO --> |
| Chrome | `fansly-live-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `fansly-live-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `fansly-live-downloader-brave.zip` | <!-- TODO --> |
| Edge | `fansly-live-downloader-edge.zip` | <!-- TODO --> |
| Opera | `fansly-live-downloader-opera.zip` | <!-- TODO --> |
| Whale | `fansly-live-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `fansly-live-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `fansly-live-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `fansly-live-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `xTBDv7Igej2iWM7JjbSb` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_U5nhuPonaSjeD8` |
| **Stripe Product Name** | Fansly Live Downloader |
| **Stripe Monthly Price** | USD 9.00/month [fansly-live-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c69DP7AOTRcvmPETMXbVR` |

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
| `brandAccent` | `#ff4f70` | Primary action/CTA (coral pink) |
| `brandAccentHover` | `#e63d5d` | Hover state (darker pink) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
