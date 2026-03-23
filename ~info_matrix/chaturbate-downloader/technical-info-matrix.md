# Technical Info Matrix — Chaturbate Downloader

## Extension: `chaturbate-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Chaturbate Downloader |
| **Slug / ID** | `chaturbate-downloader` |
| **Gecko ID** | `chaturbate-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / Live Cam) |
| **Target Site(s)** | chaturbate.com and subdomains |
| **Description** | Download Chaturbate live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/chaturbate-downloader` |
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
| **Store-Sanitized Build?** | Yes (`chaturbate-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/chaturbate-video-downloader` |
| **Product Page** | https://serp.ly/chaturbate-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (LL-HLS segment recording) + HLS VOD Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master manifest EXT-X-STREAM-INF variants (resolution, bandwidth, frame rate) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — continuous LL-HLS segment recording via `PROCESS_HLS_LIVE_CAPTURE` offscreen message |
| **VOD Support?** | Yes — `/{model}/videos/{videoId}` URL pattern |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download Chaturbate Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/CHATURBATE/` folder, no save-as dialog |
| **Desktop Notifications** | Yes |
| **Video Detection** | Chaturbate `get_edge_hls_url_ajax` API via inject.js, HLS master manifest probing across multiple CDN hosts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://chaturbate.com/*`, `https://www.chaturbate.com/*`, `https://*.chaturbate.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `chaturbate.com` at `document_idle` |
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
| **Page Injection** | `inject.js` — Chaturbate `get_edge_hls_url_ajax` API call, HLS host/URL collection, model metadata; posts `CHATURBATE_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Chaturbate Edge HLS AJAX (`chaturbate.com/get_edge_hls_url_ajax/`), Chaturbate Front API (`chaturbate.com/api/front/v2/models/username/{slug}/cam`), Chaturbate Videos API (`chaturbate.com/api/front/v2/users/{id}/videos`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, metadata extraction, page type detection (live vs VOD), download progress routing |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, HLS master manifest parsing, Chaturbate API integration, Mouflon decryption, auth gating, offscreen management, context menu |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture status, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live capture recording |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture elapsed time |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context Chaturbate `get_edge_hls_url_ajax` call, HLS host/URL collection, model metadata |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Page Type Detection** | URL path matching: `/{model}/videos/{id}` = VOD, all other model pages = live |
| **Site Match** | `https://chaturbate.com/*`, `https://www.chaturbate.com/*`, `https://*.chaturbate.com/*` |
| **Model ID Sources** | inject.js `api()` chaturbate adapter response, `get_edge_hls_url_ajax` response, URL path slug extraction, API userId |
| **Title Sources** | inject data `displayName`, inject data `modelName`, inject data `modelUsername`, `meta[property="og:title"]`, `document.title` |
| **Thumbnail Sources** | inject data `thumbnail`, `meta[property="og:image"]` |
| **Stream URL Sources** | `get_edge_hls_url_ajax` -> url field (with CMAF edge fallback), inject.js `collect()` from `__PRELOADED_STATE__`, `__INITIAL_STATE__`, `__NUXT__`, performance entries, inline scripts, API `cam.hlsStreamHost` + `streamName` -> master URL construction |
| **Chaturbate Edge HLS AJAX** | POST `https://chaturbate.com/get_edge_hls_url_ajax/` with `room_slug={username}&bandwidth=high`, `X-Requested-With: XMLHttpRequest`, CMAF fallback rewrites `playlist.m3u8` to `playlist_sfm4s.m3u8` |
| **HLS Master URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **HLS Best-Only URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}.m3u8` |
| **Default CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Inject Message Type** | `CHATURBATE_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_CHATURBATE_DATA` |

### Mouflon DRM

| Feature | Implementation |
|---|---|
| **Description** | HLS manifest obfuscation system that encrypts segment filenames (shared with Stripchat infrastructure) |
| **Detection Tag** | `#EXT-X-MOUFLON` |
| **PSCH Tag** | `#EXT-X-MOUFLON:PSCH:{version}:{pkey}` |
| **FILE Tag** | `#EXT-X-MOUFLON:FILE:{encoded}` |
| **URI Tag** | `#EXT-X-MOUFLON:URI:{uri}` |
| **Key Derivation** | Fetch config -> get MMP external source origin + version -> download main.js -> extract Doppio bundle filename -> find decode key for pkey in Doppio bundle |
| **Decryption Method** | XOR cipher: base64-decode filename, SHA-256 hash the decode key, XOR each byte |
| **Fallback Keys** | `Ook7quaiNgiyuhai` -> `EQueeGh2kaewa3ch` |
| **Key Cache** | In-memory Map, keyed by pkey value, permanent during session |
| **Manifest Rewrite** | Decoded filenames replace Forbidden or `media.mp4` placeholders in manifest lines |

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
| **LL-HLS Support** | Yes — EXT-X-PART segments, `_HLS_msn/_HLS_part` hints, PRELOAD-HINT skipped |
| **Byte-Range Support** | Yes |
| **Live Playlist Type** | `lowLatency` |
| **Forbidden Fallback** | Tries best-only master URL (`{streamId}.m3u8` instead of `{streamId}_auto.m3u8`) |
| **Web Fallback** | If playlist text is `Forbidden`, retries with `playlistType=web` |
| **Segment Deduplication** | URL + byte-range key deduplication via Set |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Credential Mode** | `include` for chaturbate.com domains and CDN domains (doppiocdn, stripcdn, sc-cdn.net, strpst.com); `omit` for others |
| **Fetch Fallback** | Background fetch -> offscreen fetch (page-like headers/UA) |
| **Referer** | `https://chaturbate.com/` |
| **Origin** | `https://chaturbate.com` |

### Live Capture Specs

| Parameter | Value |
|---|---|
| **Message Type** | `PROCESS_HLS_LIVE_CAPTURE` |
| **Stop Message** | `STOP_HLS_LIVE_CAPTURE` |
| **Cancel Message** | `CANCEL_HLS_PROCESSING` |
| **Progress Tracking** | `capturedSegments`, `elapsedSeconds`, `isLiveCapture` flag |
| **UI Indicators** | Capture hint in popup, live capture status in popup, elapsed time in download manager |
| **Variant Params Forwarded** | Mouflon `psch`/`pkey`, `playlistType=lowLatency` |
| **Live Poll Interval** | 1,400ms |
| **Idle Limit (with data)** | 35 cycles |
| **Idle Limit (no data)** | 12 cycles |
| **Max Playlist Errors** | 8 |
| **First Batch Limit** | 8 segments |
| **Tick Tail Limit** | 4 segments |

### VOD Specs

| Parameter | Value |
|---|---|
| **URL Pattern** | `/{model}/videos/{videoId}` |
| **Video Lookup API** | GET `/api/front/v2/users/{userId}/videos` |
| **Format Sources** | `entry.videoUrl` (HLS m3u8 or direct MP4), `entry.trailerUrl` (fallback trailer MP4) |
| **Quality Labels** | `Source (MP4)`, `Auto (HLS)`, resolution variants, `Trailer (MP4)` |
| **Access Gate** | Some videos require purchase/fan-club; throws descriptive error |
| **Meta Cache TTL** | 15,000ms |
| **Videos Cache TTL** | 15,000ms |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video parent container |
| **Button Text** | "Download" with down-arrow icon |
| **Button Class** | `.sc-download-button` |
| **Quality Popover** | Yes — format list with quality label and type badge |
| **Quality Popover Class** | `.sc-quality-popover` |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **CSS** | `styles/player-button.css` |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `CHATURBATE-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable inner container 400px) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | Downloads auto-close when complete |
| **Features** | Minimize/close buttons, per-download progress bars, live capture elapsed time, cancel buttons |
| **CSS** | `styles/download-manager.css` |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-chaturbate-video` |
| **Title** | "Download Chaturbate Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `chaturbate.com/*`, `*.chaturbate.com/*`, `m.chaturbate.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css`, `styles/popup-enhanced.css` |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Quick help banner, Header, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, duration), Quality selector, Capture hint, Live capture status, Download button, Progress bar |

### CDN Infrastructure

| Domain | Purpose |
|---|---|
| `doppiocdn.com` | Primary HLS edge CDN |
| `doppiocdn.net` | Secondary HLS edge CDN |
| `stripcdnm.com` | Media CDN |
| `stripcdnmd.com` | Media CDN (alternate) |
| `stripcdntmp.com` | Temporary/transient CDN |
| `sc-cdn.net` | Static CDN |
| `strpst.com` | Credential-include CDN domain |

### Caching Strategy

| Cache | TTL | Purpose |
|---|---|---|
| `CHATURBATEMetaCache` | 15,000ms | Stream metadata per model slug |
| `CHATURBATEVideosCache` | 15,000ms | Videos list per user ID |
| `CHATURBATEConfigCache` | 300,000ms (5 min) | Static config (Mouflon origins) |
| `mouflonKeyCache` | Permanent (in-memory) | Mouflon decode keys per pkey |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (uses sharp for icons, archiver for zipping) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/chaturbate-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/chaturbate-downloader/` |

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
| **Stripe Product ID** | `prod_U5nhviEa6IhmsC` |
| **Stripe Product Name** | Chaturbate Downloader |
| **Stripe Monthly Price** | USD 9.00/month [chaturbate-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c67DP7AOTRcvmojqGsD62` |

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
