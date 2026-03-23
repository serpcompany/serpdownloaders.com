# Technical Info Matrix — DreamCamVR Downloader

## Extension: `dreamcam-vr-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP DreamCamVR Downloader |
| **Slug / ID** | `dreamcam-vr-downloader` |
| **Gecko ID** | `dreamcam-vr-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / VR / Live) |
| **Target Site(s)** | dreamcamtrue.com, dreamcam.com and subdomains |
| **Description** | Download DreamCamVR live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/dreamcam-vr-downloader` |
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
| **Store-Sanitized Build?** | Yes (`dreamcam-vr-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/dreamcam-vr-video-downloader` |
| **Product Page** | https://serp.ly/dreamcam-vr-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + HLS Live Capture (LL-HLS continuous recording) + Direct MP4 (offscreen streaming for VOD) |
| **Quality Selection** | Yes — parsed from HLS master manifest BANDWIDTH/RESOLUTION/FRAME-RATE |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) with live capture support |
| **Live Stream Support?** | Yes — LL-HLS live capture with start/stop, segment counting, elapsed timer |
| **VR Support?** | Yes — VR camera settings (stereoPacking, frameFormat, horizontalAngle), VR badge in popup, VR suffix in filename |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download DreamCamVR Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to Downloads folder, no save-as dialog |
| **Desktop Notifications** | Yes — "DreamCamVR Download Complete" |
| **Video Detection** | Inject.js page-context DreamCam broadcast API adapter + background API meta fetch + HLS master manifest discovery across multiple CDN hosts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://dreamcamtrue.com/*`, `https://www.dreamcamtrue.com/*`, `https://dreamcam.com/*`, `https://www.dreamcam.com/*`, `https://bss.dreamcamtrue.com/*`, `https://*.dreamcamtrue.com/*`, `https://*.dreamcam.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on dreamcamtrue.com / dreamcam.com at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + HLS live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — page-context DreamCam broadcast API adapter, HLS URL discovery, state polling (8s interval) |
| **External APIs Called** | DreamCam Broadcast API (`bss.dreamcamtrue.com`), DreamCam Front API (`dreamcamtrue.com/api/front/v2/`), DreamCam Videos API, SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream info extraction via inject.js messages, download progress forwarding, active download restoration |
| Player Button | `player-button.js` | In-page download button with quality popover on video player |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, DreamCam API integration, HLS manifest parsing, auth gating, offscreen management, context menu, VR metadata, Mouflon decryption |
| Popup | `popup.html` + `popup.js` | UI, quality selector, live capture start/stop, VR badge, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming + HLS segment transmuxing + HLS live capture |
| Auth | `auth.js` + `auth/auth-config.js` + `auth/auth-api.js` + `auth/auth-storage.js` + `auth/auth-token.js` + `auth/auth-telemetry.js` | OTP login, entitlement checks, trial management |
| Auth UI | `auth-ui.js` | Popup sign-in/activation UI |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture support |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context DreamCam broadcast API adapter, HLS URL discovery, state polling |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations, error message normalization |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://dreamcamtrue.com/*`, `https://*.dreamcamtrue.com/*`, `https://dreamcam.com/*`, `https://*.dreamcam.com/*` |
| **Site APIs** | Broadcast API: `bss.dreamcamtrue.com/api/clients/v1/broadcasts/models/{username}`, Front Meta API: `dreamcamtrue.com/api/front/v2/models/username/{username}/cam`, Videos API: `dreamcamtrue.com/api/front/v2/users/{userId}/videos` |
| **Video ID Patterns** | `/([^/]+)/videos/(\d+)(?:/\|$)` (VOD pages) |
| **Title Sources** | inject.js displayName/modelName, `document.title`, `meta[property="og:title"]` |
| **Thumbnail Sources** | inject.js thumbnail, `meta[property="og:image"]`, VOD coverUrl from API |
| **Duration Sources** | VOD entry.duration from API |
| **Extra Metadata** | Viewer count, isLive, isPrivate, isVr, vrCameraSettings (stereoPacking, frameFormat, horizontalAngle), broadcastSettings |
| **Format Sources** | A) HLS master manifest from CDN edge hosts, B) DreamCam broadcast API stream URLs, C) inject.js page-context HLS URL collection, D) VOD videoUrl/trailerUrl from videos API |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Master URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}_auto.m3u8` |
| **Best-Only URL Pattern** | `https://edge-hls.{host}/hls/{streamId}/master/{streamId}.m3u8` |
| **Mouflon Decryption** | Yes — `#EXT-X-MOUFLON:PSCH:{version}:{pkey}` tag, fallback key `Ook7quaiNgiyuhai:EQueeGh2kaewa3ch` |
| **Inject Message Type** | `DREAMCAM_VR_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_DREAMCAM_VR_DATA` |
| **Inject Polling** | 8s interval + MutationObserver (75ms debounce) + visibility change + history pushState/replaceState |

### Format Object Structure

```json
{
  "url": "string",
  "requestUrl": "string (with query params)",
  "masterUrl": "string",
  "quality": "string (e.g. '1080p @ 30fps (HLS)')",
  "format": "hls | mp4",
  "ext": "m3u8 | mp4",
  "height": "number | null",
  "bandwidth": "number | null",
  "fps": "number | null",
  "type": "hls | mp4",
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
| **Live Idle Limit (With Data)** | 35 |
| **Live Idle Limit (No Data)** | 12 |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 |
| **LL-HLS Support** | Yes |
| **Referer** | `https://dreamcamtrue.com/` |
| **Origin** | `https://dreamcamtrue.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with arrow icon |
| **Quality Popover** | Yes — format list from background getVideoFormats |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `DREAMCAMVR-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counting, elapsed time display |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-dreamcam-vr-video` |
| **Title** | "Download DreamCamVR Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `dreamcamtrue.com/*` and subdomains, `m.dreamcamtrue.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Quick help banner, Header, Activation section, Loading spinner, Error state, Video info card (thumbnail, title, VR badge, duration/LIVE badge), Quality selector with VR suffix, Capture hint, Live capture status, Download/Start/Stop button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/dreamcam-vr-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/dreamcam-vr-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `dreamcam-vr-downloader.zip` | <!-- TODO --> |
| Chrome | `dreamcam-vr-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `dreamcam-vr-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `dreamcam-vr-downloader-brave.zip` | <!-- TODO --> |
| Edge | `dreamcam-vr-downloader-edge.zip` | <!-- TODO --> |
| Opera | `dreamcam-vr-downloader-opera.zip` | <!-- TODO --> |
| Whale | `dreamcam-vr-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `dreamcam-vr-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `dreamcam-vr-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `dreamcam-vr-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_U5nh2InBvEiaze` |
| **Stripe Product Name** | Dreamcam VR Downloader |
| **Stripe Monthly Price** | USD 9.00/month [dreamcam-vr-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c69DP7AOTRcvmmHoOxHG1` |

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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
