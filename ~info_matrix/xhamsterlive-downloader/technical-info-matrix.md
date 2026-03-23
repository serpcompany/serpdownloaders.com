# Technical Info Matrix — XHamsterLive Downloader

## Extension: `xhamsterlive-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP XHamsterLive Downloader |
| **Slug / ID** | `xhamsterlive-downloader` |
| **Gecko ID** | `xhamsterlive-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / Live Cam) |
| **Target Site(s)** | xhamsterlive.com and subdomains (including m.xhamsterlive.com) |
| **Description** | Download XHamsterLive live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/xhamsterlive-downloader` |
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
| **Store-Sanitized Build?** | Yes (`xhamsterlive-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/xhamsterlive-video-downloader` |
| **Product Page** | https://serp.ly/xhamsterlive-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (real-time LL-HLS segment recording to MP4) + HLS VOD Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master playlist variants and XHamsterLive API video entries |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) with live capture segment tracking |
| **Live Stream Support?** | Yes — real-time LL-HLS live capture with start/stop controls |
| **VR Support?** | Yes — VR camera settings (stereoPacking, frameFormat, horizontalAngle), VR badge in popup, VR filename suffix |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download XHamsterLive Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/XHamsterLive/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — `__PRELOADED_STATE__` extraction via inject.js, XHamsterLive API, HLS host discovery, Mouflon URI decoding |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://xhamsterlive.com/*`, `https://*.xhamsterlive.com/*`, `https://m.xhamsterlive.com/*`, `https://*.stripcdnm.com/*`, `https://*.stripcdnmd.com/*`, `https://*.stripcdntmp.com/*`, `https://*.sc-cdn.net/*`, `https://*.doppiocdn.com/*`, `https://*.doppiocdn.net/*`, `https://assets.striiiipst.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `xhamsterlive.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS live capture + HLS VOD transmux + MP4 streaming + fMP4 box parsing/rewriting) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — extracts `__PRELOADED_STATE__`, discovers HLS hosts, collects model/VR metadata, watches SPA navigation via MutationObserver + history patching |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), XHamsterLive API (`xhamsterlive.com/api/front/v2/models/`), XHamsterLive User Videos API (`xhamsterlive.com/api/front/v2/users/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Mouflon Decoding** | Yes — decodes obfuscated Mouflon stream URIs for CDN access with fallback key map |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, model/room metadata extraction, page data relay from inject.js |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, XHamsterLive API calls, HLS master parsing, Mouflon decoding, offscreen management, context menu, VR metadata handling |
| Popup | `popup.html` + `popup.js` | UI, quality selector, live capture start/stop, VR badge, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS live capture, HLS VOD transmux, MP4 streaming, fMP4 box parsing/rewriting |
| Auth | `auth.js` + `auth-ui.js` + `auth/*.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment tracking |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context `__PRELOADED_STATE__` extractor, HLS host collector, model metadata, VR settings, SPA navigation watcher |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations, header text, error message normalization |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://xhamsterlive.com/*`, `https://*.xhamsterlive.com/*`, `https://m.xhamsterlive.com/*` |
| **Page Type Detection** | VOD: `/([^/]+)/videos/(\d+)(?:/|$)`, Live: default model room page, VR: `vr.xhamsterlive.com` or `/cam/([^/]+)` |
| **Title Sources** | `displayName` from `__PRELOADED_STATE__`, `modelName`, `meta[property="og:title"]`, `document.title` (cleaned) |
| **Thumbnail Sources** | `model.avatarThumbUrl`, `model.avatarUrl`, `model.bigAvatar`, `viewCam.thumbUrl`, `viewCam.previewUrl`, `og:image`, `video`/`img[data-testid="model-cover"]` |
| **Duration Sources** | Not applicable for live streams; VOD duration from API response |
| **Extra Metadata** | Viewer count (`viewersCount`), isLive, isPrivate (`show.type`), isVr, VR camera settings (`stereoPacking`, `frameFormat`, `horizontalAngle`), model ID, numeric ID, stream name, HLS hosts, broadcast settings |
| **Format Sources** | A) XHamsterLive API `/api/front/v2/models/username/{slug}/cam`, B) HLS master playlist from CDN hosts, C) User Videos API `/api/front/v2/users/{id}/videos`, D) `__PRELOADED_STATE__` hlsHosts/hlsMasterUrls, E) Mouflon URI decoding |
| **CDN Detection** | Dynamic — collected from `__PRELOADED_STATE__` viewCam, model, config features, fallback domains |
| **Media Request Patterns** | `.m3u8`, `.mp4`, `/hls/{streamId}/master/{streamId}_auto.m3u8`, Mouflon-encoded URIs |
| **Inject Message Type** | `XHAMSTERLIVE_PAGE_DATA` |

### Format Object Structure

```json
{
  "quality": "string (e.g., '1080p', 'Auto (HLS)', 'Source (MP4)', 'Trailer (MP4)')",
  "format": "hls | mp4",
  "ext": "m3u8 | mp4",
  "type": "hls | mp4",
  "url": "string",
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
| **Live Idle Limit (with data)** | 35 |
| **Live Idle Limit (no data)** | 12 |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 |
| **Live Tick Tail Limit** | 4 |
| **Referer** | `https://xhamsterlive.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://xhamsterlive.com` |
| **Credential Mode** | `include` (for xhamsterlive.com, doppiocdn, stripcdn, sc-cdn.net domains) |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format list from background `getVideoFormats` |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `xhamsterlive-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counter, elapsed timer, graceful stop |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-xhamsterlive-video` |
| **Title** | "Download XHamsterLive Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `xhamsterlive.com/*`, `*.xhamsterlive.com/*`, `m.xhamsterlive.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, VR badge, duration/LIVE badge), Quality selector (with VR label suffix), Capture hint (live), Live capture status, Download/Start/Stop button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/xhamsterlive-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/xhamsterlive-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `xhamsterlive-downloader.zip` | <!-- TODO --> |
| Chrome | `xhamsterlive-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `xhamsterlive-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `xhamsterlive-downloader-brave.zip` | <!-- TODO --> |
| Edge | `xhamsterlive-downloader-edge.zip` | <!-- TODO --> |
| Opera | `xhamsterlive-downloader-opera.zip` | <!-- TODO --> |
| Whale | `xhamsterlive-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `xhamsterlive-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `xhamsterlive-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `xhamsterlive-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_U5nhDQr6Hm2Y3S` |
| **Stripe Product Name** | XHamsterLive Downloader |
| **Stripe Monthly Price** | USD 9.00/month [xhamsterlive-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6FDP7AOTRcvmtQBLPAjX` |

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
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |
