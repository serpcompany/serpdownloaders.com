# Technical Info Matrix — CamSoda Downloader

## Extension: `camsoda-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP CamSoda Downloader |
| **Slug / ID** | `camsoda-downloader` |
| **Gecko ID** | `camsoda-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / Live Cam) |
| **Target Site(s)** | camsoda.com and subdomains |
| **Description** | Download CamSoda live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/camsoda-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:01:16.463Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`camsoda-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/camsoda-video-downloader` |
| **Product Page** | https://serp.ly/camsoda-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (LL-HLS segment recording) + HLS VOD Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master manifest EXT-X-STREAM-INF variants (resolution, bandwidth, frame rate) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — LL-HLS live capture with segment recording, elapsed time tracking, Start/Stop UI |
| **Live Capture Method** | `PROCESS_HLS_LIVE_CAPTURE` offscreen message, continuous LL-HLS segment fetching with `_HLS_msn`/`_HLS_part` hints |
| **VOD Support?** | Yes — `/{model}/videos/{videoId}` URL pattern, Videos API lookup |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download CamSoda Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to Downloads folder, no save-as dialog |
| **Desktop Notifications** | Yes |
| **Video Detection** | CamSoda React Chat API via inject.js, edge_servers + stream_name + token extraction, HLS master manifest probing across multiple CDN hosts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://camsoda.com/*`, `https://www.camsoda.com/*`, `https://*.camsoda.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `camsoda.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture recording) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — CamSoda React Chat API call, edge server / stream name / token extraction, HLS URL construction; posts `CAMSODA_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), CamSoda React Chat API (`www.camsoda.com/api/v1/chat/react/{slug}`), CamSoda Front API (`camsoda.com/api/front/v2/models/username/{slug}/cam`), CamSoda Videos API (`camsoda.com/api/front/v2/users/{id}/videos`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, metadata extraction, page type detection (live vs VOD), download progress routing |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, HLS master manifest parsing, CamSoda API integration, Mouflon decryption, auth gating, offscreen management, context menu |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture status, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live capture recording |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture elapsed time |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context CamSoda React Chat API call, edge server / stream name / token extraction, HLS URL construction |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://camsoda.com/*`, `https://www.camsoda.com/*`, `https://*.camsoda.com/*` |
| **Page Type Detection** | URL path matching: `/{model}/videos/{id}` = VOD, all other model pages = live |
| **Model ID Sources** | inject.js CamSoda React Chat API response, `videoInfo.modelId`, `videoInfo.modelNumericId`, `videoInfo.roomSlug`, `videoInfo.streamName`, API `userId` |
| **Title Sources** | `stream.username`, model `displayName`, `meta[property="og:title"]`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]`, video entry `coverUrl` (VOD), `og:image` |
| **Stream Host Sources** | CamSoda React Chat API `stream.edge_servers[0]`, API `cam.hlsStreamHost`, API `cam.streamHost`, inject.js discovered HLS hosts, config fallback domains |
| **Stream Name Sources** | CamSoda React Chat API `stream.stream_name`, API `cam.streamName`, API `cam.stream_name`, API `cam.streamId` |
| **HLS Master URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **HLS Best-Only URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}.m3u8` |
| **CamSoda Live HLS URL Pattern** | `https://{edge_server}/{stream_name}_v1/index.ll.m3u8?filter=tracks:v4v3v2v1a1a2&multitrack=true&token={token}` |
| **Default CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Inject Message Type** | `CAMSODA_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_CAMSODA_DATA` |

### Mouflon DRM

| Feature | Implementation |
|---|---|
| **Description** | Mouflon HLS manifest obfuscation system that encrypts segment filenames (shared infrastructure with Stripchat) |
| **Detection Tag** | `#EXT-X-MOUFLON` |
| **PSCH Tag** | `#EXT-X-MOUFLON:PSCH:{version}:{pkey}` |
| **FILE Tag** | `#EXT-X-MOUFLON:FILE:{encoded}` |
| **URI Tag** | `#EXT-X-MOUFLON:URI:{uri}` |
| **Key Derivation** | Fetch site config -> get MMP external source origin + version -> download main.js -> extract Doppio bundle filename -> find decode key for pkey in Doppio bundle |
| **Decryption Method** | XOR cipher: base64-decode filename, SHA-256 hash the decode key, XOR each byte |
| **Fallback Keys** | `Ook7quaiNgiyuhai` -> `EQueeGh2kaewa3ch` |
| **Config Cache TTL** | 300,000ms (5 minutes) |
| **Key Cache Type** | In-memory Map, keyed by pkey value, permanent during session |
| **Manifest Rewrite** | Decoded filenames replace Forbidden or media.mp4 placeholders in manifest lines |

### Format Object Structure

```json
{
  "url": "string (variant playlist URL)",
  "requestUrl": "string (URL with extraParams applied)",
  "masterUrl": "string (master manifest URL)",
  "quality": "string (e.g. '1080p (HLS)', '720p @ 60fps (HLS)', 'Auto (HLS)')",
  "format": "hls | mp4",
  "ext": "m3u8 | mp4",
  "height": "number | null",
  "bandwidth": "number | null",
  "fps": "number | null",
  "type": "hls | mp4",
  "extraParams": {
    "psch": "string | undefined (Mouflon version)",
    "pkey": "string | undefined (Mouflon public key)",
    "playlistType": "lowLatency (for live streams only)"
  }
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` |
| **Playlist Parse Timeout** | 12,000ms (12 seconds) |
| **LL-HLS Support** | Yes — EXT-X-PART segments, `_HLS_msn`/`_HLS_part` hints, PRELOAD-HINT skipped |
| **Byte-Range Support** | Yes |
| **Live Playlist Type** | `lowLatency` |
| **Forbidden Fallback** | Tries best-only master URL (`{streamId}.m3u8` instead of `{streamId}_auto.m3u8`) |
| **Web Fallback** | If playlist text is Forbidden, retries with `playlistType=web` |
| **Segment Deduplication** | URL + byte-range key deduplication via Set |
| **Credential Mode** | CamSoda domains: `include`; CDN domains (doppiocdn, stripcdn, sc-cdn.net, strpst.com): `include`; Others: `omit` |
| **Fetch Fallback** | Background fetch -> offscreen fetch (page-like headers/UA) |
| **Referer** | `https://camsoda.com/` |
| **Origin** | `https://camsoda.com` |

### Live Capture Specs

| Parameter | Value |
|---|---|
| **Message Type** | `PROCESS_HLS_LIVE_CAPTURE` |
| **Stop Message** | `STOP_HLS_LIVE_CAPTURE` |
| **Cancel Message** | `CANCEL_HLS_PROCESSING` |
| **Progress Tracking** | `capturedSegments`, `elapsedSeconds`, `isLiveCapture` flag |
| **UI Indicators** | `capture-hint` in popup, `live-capture-status` in popup, elapsed time in download manager |
| **Variant Params Forwarded** | Mouflon `psch`/`pkey`, `playlistType=lowLatency` |
| **Live Poll Interval** | 1,400ms |
| **Idle Limit (with data)** | 35 ticks |
| **Idle Limit (no data)** | 12 ticks |
| **Max Playlist Errors** | 8 |
| **First Batch Limit** | 8 segments |
| **Tick Tail Limit** | 4 segments |

### VOD Specs

| Parameter | Value |
|---|---|
| **URL Pattern** | `/{model}/videos/{videoId}` |
| **Video Lookup API** | `GET /api/front/v2/users/{userId}/videos` |
| **Format Sources** | `entry.videoUrl` (HLS m3u8 or direct MP4), `entry.trailerUrl` (fallback trailer MP4) |
| **Quality Labels** | Source (MP4), Auto (HLS), resolution variants, Trailer (MP4) |
| **Access Gate** | Some videos require purchase/fan-club; throws descriptive error |
| **Meta Cache TTL** | 15,000ms |
| **Videos Cache TTL** | 15,000ms |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Button Class** | `.sc-download-button` |
| **Quality Popover** | Yes — format list with quality and type labels |
| **Quality Popover Class** | `.sc-quality-popover` |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **CSS** | `styles/player-button.css` |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `CAMSODA-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable inner: 400px) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | Downloads auto-close when complete (3s fade) |
| **Features** | Minimize/close buttons, per-download progress bars, live capture elapsed time, cancel buttons |
| **CSS** | `styles/download-manager.css` |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-camsoda-video` |
| **Title** | "Download CamSoda Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `camsoda.com/*`, `*.camsoda.com/*`, `m.camsoda.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.7 KB), `styles/popup-enhanced.css` (18.2 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Quick help banner, Header, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, duration, VR badge), Quality selector, Capture hint, Live capture status, Download button, Progress bar |

### CDN Infrastructure

| Domain | Purpose |
|---|---|
| `doppiocdn.com` | Primary HLS edge CDN |
| `doppiocdn.net` | Secondary HLS edge CDN |
| `stripcdnm.com` | Shared media CDN |
| `stripcdnmd.com` | Shared media CDN (alternate) |
| `stripcdntmp.com` | Shared temporary/transient CDN |
| `sc-cdn.net` | Shared static CDN |
| CamSoda `edge_servers` (from React Chat API) | Per-room edge delivery nodes for LL-HLS |

### Caching Strategy

| Cache | TTL | Purpose |
|---|---|---|
| `CAMSODAMetaCache` | 15,000ms | Stream metadata per model slug |
| `CAMSODAVideosCache` | 15,000ms | Videos list per user ID |
| `CAMSODAConfigCache` | 300,000ms (5 min) | Site static config (Mouflon origins) |
| `mouflonKeyCache` | Permanent (in-memory) | Mouflon decode keys per pkey |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (uses sharp for icons, archiver for zipping) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/camsoda-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/camsoda-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `camsoda-downloader.zip` | 1.24 MB |
| Chrome | `camsoda-downloader-chrome.zip` | 1.15 MB |
| Chrome Store Sanitized | `camsoda-downloader-chrome-store-sanitized.zip` | 1.15 MB |
| Brave | `camsoda-downloader-brave.zip` | 1.15 MB |
| Edge | `camsoda-downloader-edge.zip` | 1.15 MB |
| Opera | `camsoda-downloader-opera.zip` | 1.15 MB |
| Whale | `camsoda-downloader-whale.zip` | 1.15 MB |
| Yandex | `camsoda-downloader-yandex.zip` | 1.15 MB |
| Firefox ZIP | `camsoda-downloader-firefox.zip` | 1.16 MB |
| Firefox XPI | `camsoda-downloader-firefox-unpacked.xpi` | 1.15 MB |

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
| **Stripe Product ID** | `prod_U5nhvhWVJd1haw` |
| **Stripe Product Name** | Camsoda Downloader |
| **Stripe Monthly Price** | USD 9.00/month [camsoda-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c67DP7AOTRcvmZjFLlAfW` |

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
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
