# Technical Info Matrix — Streamate Downloader

## Extension: `streamate-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Streamate Downloader |
| **Slug / ID** | `streamate-downloader` |
| **Gecko ID** | `streamate-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult) |
| **Target Site(s)** | streamate.com and subdomains |
| **Description** | Download Streamate live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/streamate-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:32:08.668Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`streamate-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/streamate-video-downloader` |
| **Product Page** | https://serp.ly/streamate-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) |
| **Quality Selection** | Yes — parsed from Streamate manifest API, HLS master playlist variant streams |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — real-time HLS live capture with start/stop controls, segment polling, graceful stop |
| **VR Support?** | Yes — detects VR camera settings (stereoPacking, frameFormat, horizontalAngle), appends VR metadata to filename |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download Streamate Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/STREAMATE/` folder, no save-as dialog |
| **Desktop Notifications** | Yes (permission declared, notification support in background) |
| **Video Detection** | Automatic — Streamate manifest API (`manifest-server.naiadsystems.com`), inject.js page-context monitor, HLS host candidate probing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://streamate.com/*`, `https://www.streamate.com/*`, `https://manifest-server.naiadsystems.com/*`, `https://*.streamate.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `streamate.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors page state, Streamate manifest API, Performance API entries, posts `STREAMATE_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Streamate Manifest Server (`manifest-server.naiadsystems.com`), Streamate Front API (`streamate.com/api/front/v2/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Stream detection, model info extraction, page data relay |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, Streamate API, HLS parsing, Mouflon key decryption |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + live capture processing |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment counter |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context state collector, Streamate manifest API caller, HLS URL discovery |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://streamate.com/*`, `https://www.streamate.com/*`, `https://*.streamate.com/*` |
| **Model ID Sources** | `modelId`, `modelNumericId`, `roomSlug`, `modelUsername` from page data + API (`/api/front/v2/models/username/{slug}/cam`) |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | `og:image` meta tag |
| **Page Type Detection** | `live` (default) or `vod` (URL pattern: `/{model}/videos/{id}`) |
| **Format Sources** | A) Streamate Manifest Server (`manifest-server.naiadsystems.com/live/s:{model}.json`), B) Streamate Front API (`/api/front/v2/models/username/{slug}/cam`), C) HLS master playlist probing across CDN hosts, D) inject.js page state collection |
| **CDN Host Detection** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net`, `strpst.com` |
| **Media Request Patterns** | `.m3u8`, `manifest-server.naiadsystems.com`, HLS master/variant playlists |
| **Inject Message Type** | `STREAMATE_PAGE_DATA` |
| **Mouflon Key Decryption** | Yes — fallback key lookup for encrypted Mouflon URIs in HLS playlists |

### Format Object Structure

```json
{
  "type": "hls | mp4",
  "quality": "string (e.g. '1080p')",
  "url": "string",
  "format": "string (e.g. 'HLS')",
  "height": "number | null",
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
| **Referer** | `https://streamate.com/` |
| **Credential Mode** | `include` for streamate.com, doppiocdn.*, stripcdn*, sc-cdn.net, strpst.com; `omit` for others |

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
| **Panel ID** | `STREAMATE-download-manager` |
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
| **Menu ID** | `download-streamate-video` |
| **Title** | "Download Streamate Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `streamate.com/*`, `*.streamate.com/*`, `m.streamate.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `popup-ui-overrides.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (with VR badge, live badge), Quality selector, Capture hint, Live capture status, Download button (Start/Stop for live), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/streamate-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/streamate-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `streamate-downloader.zip` | 1.24 MB |
| Chrome | `streamate-downloader-chrome.zip` | 1.15 MB |
| Chrome Store Sanitized | `streamate-downloader-chrome-store-sanitized.zip` | 1.15 MB |
| Brave | `streamate-downloader-brave.zip` | 1.15 MB |
| Edge | `streamate-downloader-edge.zip` | 1.15 MB |
| Opera | `streamate-downloader-opera.zip` | 1.15 MB |
| Whale | `streamate-downloader-whale.zip` | 1.15 MB |
| Yandex | `streamate-downloader-yandex.zip` | 1.15 MB |
| Firefox ZIP | `streamate-downloader-firefox.zip` | 1.16 MB |
| Firefox XPI | `streamate-downloader-firefox-unpacked.xpi` | 1.15 MB |

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
| **Stripe Product ID** | `prod_U5nhzdXK1bdcNI` |
| **Stripe Product Name** | Streamate Downloader |
| **Stripe Monthly Price** | USD 9.00/month [streamate-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6DDP7AOTRcvmOuBXdkh6` |

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
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
