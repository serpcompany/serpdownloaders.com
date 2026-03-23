# Technical Info Matrix — DreamCam Downloader

## Extension: `dreamcam-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP DreamCam Downloader |
| **Slug / ID** | `dreamcam-downloader` |
| **Gecko ID** | `dreamcam-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult / Cam) |
| **Target Site(s)** | dreamcamtrue.com and subdomains |
| **Description** | Download DreamCam live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/dreamcam-downloader` |
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
| **Store-Sanitized Build?** | Yes (`dreamcam-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/dreamcam-video-downloader` |
| **Product Page** | https://serp.ly/dreamcam-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) + Live Capture (LL-HLS continuous recording) |
| **Quality Selection** | Yes — parsed from HLS master manifest EXT-X-STREAM-INF variants (resolution, bandwidth, frame rate) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — continuous LL-HLS live capture with start/stop controls |
| **VR Support?** | Yes — VR camera settings detection, stereo packing, frame format, horizontal angle metadata in filenames |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download DreamCam Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/DREAMCAM/` folder, no save-as dialog |
| **Desktop Notifications** | Declared in manifest (`notifications` permission) but no active usage in code |
| **Video Detection** | Automatic — inject.js API calls to `bss.dreamcamtrue.com`, page state globals, Performance API, script regex, MutationObserver |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://dreamcamtrue.com/*`, `https://www.dreamcamtrue.com/*`, `https://bss.dreamcamtrue.com/*`, `https://*.dreamcamtrue.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `dreamcamtrue.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS transmux + MP4 streaming + live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — DreamCam API adapter, collects HLS master URLs, monitors page state globals, Performance API, script regex |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), DreamCam API (`bss.dreamcamtrue.com/api/clients/v1/broadcasts/models/`), DreamCam Frontend API (`dreamcamtrue.com/api/front/v2/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, page data extraction, download progress relay |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, HLS master parsing, Mouflon URI decoding, CDN host resolution, context menu, VR metadata merging, VOD format extraction |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow, live capture start/stop |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS segment transmuxing + MP4 streaming + live capture recording |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture support |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context DreamCam API adapter, HLS URL collection, model data extraction |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://dreamcamtrue.com/*`, `https://www.dreamcamtrue.com/*`, `https://*.dreamcamtrue.com/*` |
| **Stream ID Sources** | `modelNumericId`, `modelId`, `id`, `roomSlug`, `streamName`, `potentialNumericIds[]`, API `streamName`, API `userId` |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | Inject data `thumbnail`, `meta[property="og:image"]` |
| **Duration Sources** | VOD API `duration` field |
| **Extra Metadata** | `viewerCount`, `isLive`, `isPrivate`, `isVr`, `vrCameraSettings` (stereoPacking, frameFormat, horizontalAngle), `broadcastSettings`, `statusMessage` |
| **Format Sources** | A) DreamCam broadcast API (`bss.dreamcamtrue.com`), B) DreamCam frontend API (`/api/front/v2/`), C) Inject.js page state globals, D) Performance API resource entries, E) Script regex for m3u8 URLs |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Master URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **Best-Only URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}.m3u8` |
| **Mouflon Decoding** | Yes — `#EXT-X-MOUFLON:PSCH` tag detection, HMAC-SHA256 URI rewriting, fallback key cache |
| **VOD Detection** | URL pattern `/{roomSlug}/videos/{videoId}` or explicit `pageType: 'vod'` |
| **VOD Sources** | User videos API (`/api/front/v2/users/{userId}/videos`) — `videoUrl`, `trailerUrl`, `coverUrl` |
| **Inject Message Type** | `DREAMCAM_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_DREAMCAM_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "requestUrl": "string (with query params)",
  "masterUrl": "string",
  "quality": "string (e.g. '720p (HLS)', 'Auto (HLS)', 'Source (MP4)', 'Trailer (MP4)')",
  "format": "hls | mp4",
  "ext": "m3u8 | mp4",
  "type": "hls | mp4",
  "height": "number | null",
  "bandwidth": "number | null",
  "fps": "number | null",
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
| **LL-HLS Support** | Yes — EXT-X-PART segments, PRELOAD-HINT skip, byte-range parsing |
| **Referer** | `https://dreamcamtrue.com/` |
| **Origin** | `https://dreamcamtrue.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with arrow icon |
| **Quality Popover** | Yes — format list from `getVideoFormats`, quality label + format type |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `DREAMCAM-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counter + elapsed timer |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-dreamcam-video` |
| **Title** | "Download DreamCam Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://dreamcamtrue.com/*`, `https://*.dreamcamtrue.com/*`, `https://m.dreamcamtrue.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.7 KB), `styles/popup-enhanced.css` (18.2 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, VR badge, live badge, duration), Quality selector, Capture hint, Live capture status, Download button (Start/Stop for live, Download Video for VOD), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (canonical legacy build script) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/dreamcam-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/dreamcam-downloader/` |

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
| **Stripe Product ID** | `prod_U5nhFLZ4zInCU5` |
| **Stripe Product Name** | Dreamcam Downloader |
| **Stripe Monthly Price** | USD 9.00/month [dreamcam-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c68DP7AOTRcvmbOWpwXBn` |

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
| Default 32px | 32x32 | `icons/icon32.png` |
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
