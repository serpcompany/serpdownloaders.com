# Technical Info Matrix — Flirt4Free Downloader

## Extension: `flirt4free-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Flirt4Free Downloader |
| **Slug / ID** | `flirt4free-downloader` |
| **Gecko ID** | `flirt4free-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / Live Cam) |
| **Target Site(s)** | flirt4free.com and subdomains |
| **Description** | Download Flirt4Free live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/flirt4free-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | <!-- dynamic via build.js --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`flirt4free-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/flirt4free-video-downloader` |
| **Product Page** | https://serp.ly/flirt4free-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming for VOD) |
| **Quality Selection** | Yes — parsed from HLS master manifest BANDWIDTH/RESOLUTION, VOD gallery API |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — HLS live capture with start/stop controls, LL-HLS support |
| **VR Support?** | Yes — detects VR camera settings (stereoPacking, frameFormat, horizontalAngle), VR filename suffix, VR badge in popup |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download Flirt4Free Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/FLIRT4FREE/` folder, no save-as dialog |
| **Desktop Notifications** | No (permissions declared but not used in current code) |
| **Video Detection** | Inject.js page-context monitor + Flirt4Free API (stream URLs, room login, video gallery) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://flirt4free.com/*`, `https://www.flirt4free.com/*`, `https://*.flirt4free.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `flirt4free.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — page-context monitor, collects HLS URLs from global state, Performance API, script tags; calls Flirt4Free API for stream URLs |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Flirt4Free Stream API (`flirt4free.com/ws/chat/get-stream-urls.php`), Flirt4Free Room API (`flirt4free.com/ws/rooms/chat-room-interface.php`), Flirt4Free Videos API (`flirt4free.com/api/front/v2/users/*/videos`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, stream info extraction, page data relay, download progress forwarding |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, HLS master manifest parsing, Flirt4Free API integration, offscreen management, context menu |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, VR badge, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live HLS capture |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment counter |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context HLS URL collector, Flirt4Free API calls for stream/room/video data |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations (header text, error normalization) |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://flirt4free.com/*`, `https://www.flirt4free.com/*`, `https://*.flirt4free.com/*` |
| **Page Type Detection** | Live stream (default) vs VOD (`/videos/` URL pattern or `pageType: 'vod'`) |
| **Model ID Sources** | `inject.js` API call (model_seo_name → model_id regex), `modelNumericId`, `modelId`, `roomSlug`, `streamName`, `potentialNumericIds` |
| **VOD URL Pattern** | `/([^/]+)/videos/(\d+)(?:/\|$)` |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | `og:image` meta tag, VOD API `coverUrl` |
| **Duration Sources** | VOD API `duration` field |
| **Stream URL Sources** | A) Flirt4Free get-stream-urls API (`/ws/chat/get-stream-urls.php`), B) inject.js global state objects, C) Performance API resource entries, D) Script tag regex, E) CDN host + model ID master URL construction |
| **Master URL Construction** | `https://edge-hls.{cdnHost}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **CDN Hosts (Default)** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Mouflon Decoding** | Yes — detects `#EXT-X-MOUFLON:PSCH:` in master manifest, applies psch/pkey params |
| **Inject Message Type** | `FLIRT4FREE_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_FLIRT4FREE_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "requestUrl": "string (with extra params applied)",
  "masterUrl": "string",
  "quality": "string (e.g. '1080p (HLS)', 'Source (MP4)', 'Trailer (MP4)', 'Auto (HLS)')",
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
| **Live Idle Limit (with data)** | 35 polls |
| **Live Idle Limit (no data)** | 12 polls |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 segments |
| **Live Tick Tail Limit** | 4 segments |
| **LL-HLS Support** | Yes — `playlistType=lowLatency` param for live streams |
| **Referer** | `https://flirt4free.com/` |
| **Origin** | `https://flirt4free.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format list from `getVideoFormats`, sorted by height/bandwidth descending |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `FLIRT4FREE-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counter with elapsed time |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-flirt4free-video` |
| **Title** | "Download Flirt4Free Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `flirt4free.com/*`, `*.flirt4free.com/*`, `m.flirt4free.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css`, `styles/popup-enhanced.css` |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `popup-ui-overrides.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (with VR badge), Quality selector, Live capture hint/status, Download button (Download Video / Start / Stop), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (custom build script with sharp + archiver) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/flirt4free-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/flirt4free-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `flirt4free-downloader.zip` | <!-- TODO --> |
| Chrome | `flirt4free-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `flirt4free-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Firefox ZIP | `flirt4free-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `flirt4free-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_U5nh4nvxrOUESd` |
| **Stripe Product Name** | Flirt4Free Downloader |
| **Stripe Monthly Price** | USD 9.00/month [flirt4free-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6ADP7AOTRcvm5fMsxOiw` |

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
| `brandAccentHover` | `#e63d5d` | Hover state (darker coral) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
