# Technical Info Matrix — XLoveCam Downloader

## Extension: `xlovecam-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP XLoveCam Downloader |
| **Slug / ID** | `xlovecam-downloader` |
| **Gecko ID** | `xlovecam-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult) |
| **Target Site(s)** | xlovecam.com and subdomains |
| **Description** | Download XLoveCam live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/xlovecam-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:37:29.005Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`xlovecam-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/xlovecam-video-downloader` |
| **Product Page** | https://serp.ly/xlovecam-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (real-time segment recording with fMP4 transmux) + HLS VOD Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from XLoveCam API (performer room / videos endpoint), HLS master manifest variants (BANDWIDTH, RESOLUTION, FRAME-RATE) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) with live capture segment tracking |
| **Live Stream Support?** | Yes — HLS live capture with LL-HLS, graceful stop, fMP4 segment stitching |
| **VR Support?** | Yes — VR camera settings detection (stereoPacking, frameFormat, horizontalAngle), VR filename suffix, VR badge in popup |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download XLoveCam Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/XLOVECAM/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — inject.js page-context adapter: XLoveCam API (onlineList + getPerformerRoom), HLS playlist discovery, Performance API, DOM script regex |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://xlovecam.com/*`, `https://www.xlovecam.com/*`, `https://*.xlovecam.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `xlovecam.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture fMP4 stitching) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (318 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — XLoveCam adapter: API calls (onlineList, getPerformerRoom), HLS discovery, posts `XLOVECAM_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), XLoveCam Performer API, XLoveCam Room API, XLoveCam Stream Meta API, XLoveCam Videos API |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **Mouflon Support** | Yes — URI decoding for obfuscated HLS manifest segment URIs with fallback keys |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video info extraction, message routing, inject.js loader, page data polling (8s interval) |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, XLoveCam API, HLS manifest parsing, Mouflon URI decoding, VR metadata |
| Popup | `popup.html` + `popup.js` | UI, quality selector, live capture start/stop, auth flow, VR badge |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming + HLS transmux + live capture fMP4 stitching |
| Auth | `auth.js` + `auth/*.js` | OTP login, entitlement checks, trial management |
| Auth UI | `auth-ui.js` | Popup authentication UI rendering |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment tracking |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, theme variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XLoveCam adapter: API calls, HLS discovery, XLOVECAM_PAGE_DATA publisher |
| Popup UI Overrides | `popup-ui-overrides.js` | Header/title customizations, error message normalization |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://xlovecam.com/*`, `https://www.xlovecam.com/*`, `https://*.xlovecam.com/*` |
| **Video ID Patterns** | URL path segments (last non-generic segment as model username/room slug) |
| **Title Sources** | inject.js displayName/modelName/modelUsername, `document.title` |
| **Thumbnail Sources** | inject.js thumbnail, `meta[property="og:image"]` |
| **Duration Sources** | XLoveCam Videos API (`entry.duration`) |
| **Extra Metadata** | viewerCount, isLive, isPrivate, isVr, vrCameraSettings (stereoPacking, frameFormat, horizontalAngle), broadcastSettings |
| **Format Sources** | A) XLoveCam API hlsPlaylistFree (live streams), B) XLoveCam Videos API videoUrl/trailerUrl (VOD), C) HLS master manifest parsing, D) inject.js hlsMasterUrls (global state, Performance API, DOM scripts) |
| **Script URL Regex** | `/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/ig` |
| **CDN Detection** | Performance API resource entries matching `.m3u8` |
| **Media Request Patterns** | `.m3u8`, `.mp4`, `hlsPlaylistFree`, `/api/front/v2/models/`, `/performerAction/getPerformerRoom` |
| **Inject Message Type** | `XLOVECAM_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_XLOVECAM_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "requestUrl": "string (with query params) | undefined",
  "masterUrl": "string | undefined",
  "quality": "string (e.g. '720p (HLS)', 'Auto (HLS)', 'Source (MP4)', 'Trailer (MP4)')",
  "format": "hls | mp4",
  "ext": "m3u8 | mp4",
  "type": "hls | mp4",
  "height": "number | undefined",
  "bandwidth": "number | undefined",
  "fps": "number | undefined",
  "extraParams": "object | null (psch, pkey, playlistType for LL-HLS)"
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
| **Referer** | `https://xlovecam.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://xlovecam.com` |
| **Credential Mode** | `include` for xlovecam.com and CDN hosts (doppiocdn, stripcdn, sc-cdn, strpst) |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format list with quality label and format type |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `XLOVECAM-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment count and elapsed time |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-xlovecam-video` |
| **Title** | "Download XLoveCam Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://xlovecam.com/*`, `https://*.xlovecam.com/*`, `https://m.xlovecam.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Quick help banner, Header, Activation section, Loading spinner, Error state, Video info card (thumbnail + VR badge), Quality selector (with live capture hint), Live capture status, Download button (Start/Stop for live, Download Video for VOD), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/xlovecam-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/xlovecam-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `xlovecam-downloader.zip` | 1.18 MB |
| Chrome | `xlovecam-downloader-chrome.zip` | 1.10 MB |
| Chrome Store Sanitized | `xlovecam-downloader-chrome-store-sanitized.zip` | 1.10 MB |
| Brave | `xlovecam-downloader-brave.zip` | 1.10 MB |
| Edge | `xlovecam-downloader-edge.zip` | 1.10 MB |
| Opera | `xlovecam-downloader-opera.zip` | 1.10 MB |
| Whale | `xlovecam-downloader-whale.zip` | 1.10 MB |
| Yandex | `xlovecam-downloader-yandex.zip` | 1.10 MB |
| Firefox ZIP | `xlovecam-downloader-firefox.zip` | 1.11 MB |
| Firefox XPI | `xlovecam-downloader-firefox-unpacked.xpi` | 1.10 MB |

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
| **Stripe Product ID** | `prod_U5nhyBl8PpvaSv` |
| **Stripe Product Name** | XLoveCam Downloader |
| **Stripe Monthly Price** | USD 9.00/month [xlovecam-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6GDP7AOTRcvmAXYR7H9d` |

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
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (318 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
