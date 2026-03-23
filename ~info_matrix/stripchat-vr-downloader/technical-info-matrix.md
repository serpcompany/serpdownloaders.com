# Technical Info Matrix — StripchatVR Downloader

## Extension: `stripchat-vr-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP StripchatVR Downloader |
| **Slug / ID** | `stripchat-vr-downloader` |
| **Gecko ID** | `stripchat-vr-downloader@serpapps.com` |
| **Category** | Live Stream / VR Downloader (Adult) |
| **Target Site(s)** | vr.stripchat.com, stripchat.com, and subdomains |
| **Description** | Download StripchatVR live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/stripchat-vr-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:33:10.095Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`stripchat-vr-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/stripchat-vr-video-downloader` |
| **Product Page** | https://serp.ly/stripchat-vr-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (real-time segment recording) + HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master manifests, Stripchat API metadata, VR camera settings |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — real-time HLS live capture with start/stop controls |
| **VR Support?** | Yes — VR camera settings (stereoPacking, frameFormat, horizontalAngle), VR filename suffixes, VR badge in UI |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download StripchatVR Stream" on page and video contexts |
| **Auto-Save** | Yes — saves as MP4, no save-as dialog |
| **Desktop Notifications** | No (not implemented in background-enhanced.js) |
| **Video Detection** | Automatic — Stripchat API, __PRELOADED_STATE__, Performance API, script regex, inject.js XHR/fetch monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://vr.stripchat.com/*`, `https://stripchat.com/*`, `https://www.stripchat.com/*`, `https://assets.striiiipst.com/*`, `https://*.stripchat.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `vr.stripchat.com`, `stripchat.com`, `www.stripchat.com`, `*.stripchat.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors `__PRELOADED_STATE__`, Performance API, script regex for m3u8 URLs, Stripchat API calls; posts `STRIPCHAT_VR_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), Stripchat Front API (`vr.stripchat.com/api/front/v2/models/username/*/cam`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, VR metadata extraction, page data relay |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, Stripchat API, Mouflon key decoding, VR metadata merging |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, VR badge, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live capture recording |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment counting |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context state extractor — `__PRELOADED_STATE__`, Performance API, Stripchat front API, HLS URL discovery |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://vr.stripchat.com/*`, `https://stripchat.com/*`, `https://www.stripchat.com/*`, `https://*.stripchat.com/*` |
| **Page Type Detection** | URL path analysis: `/videos?/` = VOD, else = live |
| **Model ID Sources** | `__PRELOADED_STATE__` (viewCam.model.id, viewCam.modelId), Stripchat Front API (`/api/front/v2/models/username/*/cam`) |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **VR Detection** | `isVr` flag, `vrCameraSettings` (stereoPacking, frameFormat, horizontalAngle), `broadcastSettings.vrCameraSettings` |
| **Format Sources** | A) Stripchat Front API stream metadata, B) `__PRELOADED_STATE__` HLS hosts/URLs, C) Performance API resource entries, D) Script regex for m3u8 URLs |
| **Script URL Regex** | `/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/ig` |
| **CDN Detection** | Default hosts: `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **HLS Master URL Pattern** | `https://edge-hls.{host}/hls/{modelId}_vr/master/{modelId}_vr.m3u8`, `https://edge-hls.{host}/hls/{modelId}/master/{modelId}_auto.m3u8` |
| **Mouflon Key Decoding** | Fallback URI decoding for CDN-encoded stream URLs |
| **Inject Message Type** | `STRIPCHAT_VR_PAGE_DATA` |

### Format Object Structure

```json
{
  "quality": "string (e.g. '1080p', '720p')",
  "format": "string (e.g. 'hls')",
  "type": "hls | mp4",
  "url": "string",
  "requestUrl": "string | null",
  "extraParams": "object | null",
  "height": "number | null",
  "width": "number | null",
  "bandwidth": "number | null"
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
| **Live Idle Limit (with data)** | 35 cycles |
| **Live Idle Limit (no data)** | 12 cycles |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 segments |
| **Live Tick Tail Limit** | 4 segments |
| **Referer** | `https://vr.stripchat.com/` |
| **Credential Mode** | `include` for stripchat.com, doppiocdn, stripcdn, sc-cdn.net, strpst.com domains; `omit` otherwise |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container (`.video-container`, `.player-container`, `.video-wrapper`) |
| **Button Text** | "Download" with arrow icon |
| **Button Class** | `.sc-download-button` |
| **Quality Popover** | Yes — format list with quality and format type |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `STRIPCHATVR-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counting with elapsed time |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-stripchat-vr-video` |
| **Title** | "Download StripchatVR Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://vr.stripchat.com/*`, `https://*.vr.stripchat.com/*`, `https://m.vr.stripchat.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (with VR badge), Quality selector, Live capture hint, Live capture status, Download button (Start/Stop for live), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/stripchat-vr-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/stripchat-vr-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `stripchat-vr-downloader.zip` | 1.24 MB |
| Chrome | `stripchat-vr-downloader-chrome.zip` | 1.15 MB |
| Chrome Store Sanitized | `stripchat-vr-downloader-chrome-store-sanitized.zip` | 1.15 MB |
| Brave | `stripchat-vr-downloader-brave.zip` | 1.15 MB |
| Edge | `stripchat-vr-downloader-edge.zip` | 1.15 MB |
| Opera | `stripchat-vr-downloader-opera.zip` | 1.15 MB |
| Whale | `stripchat-vr-downloader-whale.zip` | 1.15 MB |
| Yandex | `stripchat-vr-downloader-yandex.zip` | 1.15 MB |
| Firefox ZIP | `stripchat-vr-downloader-firefox.zip` | 1.16 MB |
| Firefox XPI | `stripchat-vr-downloader-firefox-unpacked.xpi` | 1.15 MB |

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
| **Gumroad Product ID** | `test-key` (placeholder) |
| **GH License ID** | `xTBDv7Igej2iWM7JjbSb` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_U5nhUIqHzJrssH` |
| **Stripe Product Name** | Stripchat VR Downloader |
| **Stripe Monthly Price** | USD 9.00/month [stripchat-vr-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6EDP7AOTRcvmrHpk8GTT` |

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
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
