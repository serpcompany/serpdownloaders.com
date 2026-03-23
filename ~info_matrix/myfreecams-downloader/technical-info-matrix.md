# Technical Info Matrix — MyFreeCams Downloader

## Extension: `myfreecams-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP MyFreeCams Downloader |
| **Slug / ID** | `myfreecams-downloader` |
| **Gecko ID** | `myfreecams-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult) |
| **Target Site(s)** | myfreecams.com and subdomains (www, share, previews) |
| **Description** | Download MyFreeCams live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/myfreecams-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:27:42.649Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`myfreecams-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/myfreecams-video-downloader` |
| **Product Page** | https://serp.ly/myfreecams-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Live Capture (continuous segment recording) + HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from HLS master manifest (BANDWIDTH, RESOLUTION, FRAME-RATE) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) with live capture segment tracking |
| **Live Stream Support?** | Yes — continuous HLS live capture with start/stop controls |
| **VR Support?** | Yes — VR metadata detection (stereoPacking, frameFormat, horizontalAngle), VR filename suffix, VR badge |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download MyFreeCams Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/MYFREECAMS/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — inject.js share.myfreecams.com scrape, HLS master manifest probing, Performance API, DOM/script analysis |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://myfreecams.com/*`, `https://www.myfreecams.com/*`, `https://share.myfreecams.com/*`, `https://previews.myfreecams.com/*`, `https://*.myfreecams.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `myfreecams.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + HLS live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (320 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — scrapes share.myfreecams.com, collects HLS URLs from DOM/scripts/Performance API, extracts model username, posts `MYFREECAMS_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), MyFreeCams Share API (`share.myfreecams.com`), MyFreeCams Previews CDN (`previews.myfreecams.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, model/stream info extraction, download progress forwarding, inject.js loader |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, HLS master manifest probing, format extraction, offscreen management, context menu, VR metadata handling, Mouflon key decoding |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + HLS live capture |
| Auth | `auth.js` + `auth-ui.js` + `auth/*.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment tracking |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context share.myfreecams.com API scrape, HLS URL collection, model username extraction |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup title/error normalization |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://myfreecams.com/*`, `https://www.myfreecams.com/*`, `https://share.myfreecams.com/*`, `https://*.myfreecams.com/*` |
| **Video ID Patterns** | `/([^/]+)/videos/(\d+)(?:/\|$)` (VOD pages) |
| **Title Sources** | inject.js `displayName`/`modelName`/`modelUsername`, `document.title` |
| **Thumbnail Sources** | `og:image`, inject.js `avatar`/`thumbnail` |
| **Duration Sources** | VOD API entry `duration` |
| **Extra Metadata** | viewerCount (inject.js), isLive (inject.js / API), isPrivate (inject.js), modelId (share.myfreecams.com `data-cam-preview-model-id-value`), serverId (share.myfreecams.com `data-cam-preview-server-id-value`) |
| **Format Sources** | A) HLS master manifest (edge-hls CDN), B) share.myfreecams.com preview card attributes, C) MyFreeCams stream API (`/api/front/v2/models/username/*/cam`), D) VOD videos API (`/api/front/v2/users/*/videos`) |
| **Script URL Regex** | `/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/ig` |
| **CDN Detection** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net`, `previews.myfreecams.com` |
| **Media Request Patterns** | `.m3u8`, `edge-hls.`, `doppiocdn`, `previews.myfreecams.com`, `/hls/`, `/master/` |
| **Inject Message Type** | `MYFREECAMS_PAGE_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "requestUrl": "string (with extra query params)",
  "masterUrl": "string",
  "quality": "string (e.g. '1080p (HLS)', 'Auto (HLS)', 'Trailer (MP4)')",
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
| **Live Idle Limit (with data)** | 35 |
| **Live Idle Limit (no data)** | 12 |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 |
| **Live Tick Tail Limit** | 4 |
| **Referer** | `https://myfreecams.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://myfreecams.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container, `.video-container`, `.player-container`, `.video-wrapper` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format list with quality labels and type badges |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `MYFREECAMS-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons, live capture segment counter, elapsed time display |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-myfreecams-video` |
| **Title** | "Download MyFreeCams Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `myfreecams.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (12 KB), `styles/popup-enhanced.css` (20 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Quick help banner, Header with help button, Activation section, Loading spinner, Error state, Video info card with thumbnail, VR badge, Duration badge (LIVE/time), Quality selector, Capture hint, Live capture status, Download/Start/Stop button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/myfreecams-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/myfreecams-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `myfreecams-downloader.zip` | 1.2 MB |
| Chrome | `myfreecams-downloader-chrome.zip` | 1.2 MB |
| Chrome Store Sanitized | `myfreecams-downloader-chrome-store-sanitized.zip` | 1.2 MB |
| Brave | `myfreecams-downloader-brave.zip` | 1.2 MB |
| Edge | `myfreecams-downloader-edge.zip` | 1.2 MB |
| Opera | `myfreecams-downloader-opera.zip` | 1.2 MB |
| Whale | `myfreecams-downloader-whale.zip` | 1.2 MB |
| Yandex | `myfreecams-downloader-yandex.zip` | 1.2 MB |
| Firefox ZIP | `myfreecams-downloader-firefox.zip` | 1.2 MB |
| Firefox XPI | `myfreecams-downloader-firefox-unpacked.xpi` | 1.1 MB |

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
| **Stripe Product ID** | `prod_U5nhgPXVBKqCnT` |
| **Stripe Product Name** | MyFreeCams Downloader |
| **Stripe Monthly Price** | USD 9.00/month [myfreecams-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6BDP7AOTRcvmLhdfJvGg` |

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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (320 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (8 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (4 KB) |
| Localize | `modules/Localize.mjs` | i18n support |

### MyFreeCams-Specific Features

| Feature | Implementation |
|---|---|
| **Live Capture** | Continuous HLS segment recording via `PROCESS_HLS_LIVE_CAPTURE`; start/stop controls in popup and download manager |
| **VOD Support** | Recorded video detection via `/([^/]+)/videos/(\d+)` URL pattern; resolves via `/api/front/v2/users/*/videos` API |
| **Share Page Scrape** | inject.js fetches `share.myfreecams.com/<username>`, parses `.campreview` card for `data-cam-preview-server-id-value` and `data-cam-preview-model-id-value` |
| **Mouflon Key Handling** | Background script decodes `#EXT-X-MOUFLON:PSCH` headers in HLS manifests; fallback key map (`Ook7quaiNgiyuhai` -> `EQueeGh2kaewa3ch`) |
| **CDN Host Probing** | Iterates `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` with `edge-hls.` prefix to build master manifest URLs |
| **Master URL Pattern** | `https://edge-hls.<host>/hls/<streamId>/master/<streamId>_auto.m3u8` |
| **LL-HLS Support** | Low-latency HLS with `playlistType=lowLatency` param for live streams |
| **VR Filename Suffix** | Appends `_<stereoPacking>_<frameFormat><angle>` to filename for VR content |
| **Stream Meta Cache** | 15-second TTL per slug; API config cache 5-minute TTL |
| **Credential Routing** | `include` credentials for myfreecams.com, doppiocdn, stripcdn, sc-cdn.net, strpst.com; `omit` for all others |
