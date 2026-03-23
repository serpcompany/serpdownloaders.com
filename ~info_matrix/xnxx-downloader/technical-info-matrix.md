# Technical Info Matrix — XNXX Downloader

## Extension: `xnxx-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for XNXX |
| **Slug / ID** | `xnxx-downloader` |
| **Gecko ID** | `xnxx-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | xnxx.com, video.xnxx.com, xnxx3.com, and xnxx-cdn.com subdomains |
| **Description** | Download XNXX videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/xnxx-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:38:07.852Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`xnxx-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/xnxx-video-downloader` |
| **Product Page** | https://serp.ly/xnxx-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes — parsed from XNXX script functions (setVideoUrlLow, setVideoUrlHigh, setVideoHLS), page metadata, and XHR/fetch monitoring |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#video-player`, `#video-player-bg`, `.video-js`, `.jwplayer`, `.player`) |
| **Context Menu** | Yes — "Download XNXX Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/XNXX/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" / "Download Failed" |
| **Video Detection** | Automatic — XNXX script functions (setVideoUrl/setVideoHLS), og:title/og:image/og:duration meta, XHR/fetch monitoring, window globals |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.xnxx.com/*`, `https://video.xnxx.com/*`, `https://www.xnxx3.com/*`, `https://*.xnxx-cdn.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `www.xnxx.com`, `video.xnxx.com`, `www.xnxx3.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `XNXX_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, XNXX script function extraction, metadata scraping, blob download with progress |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, HLS manifest parsing, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts XNXX video URLs and metadata from script tags |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.xnxx.com/*`, `https://video.xnxx.com/*`, `https://www.xnxx3.com/*` |
| **Video ID Patterns** | `/video-?([0-9a-z]+)/` (matches both `video-55awb78` and `video1135332` URL styles) |
| **Title Sources** | `meta[property="og:title"]`, `document.title` (with XNXX suffix stripped) |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `meta[property="og:duration"]`, `window.video_duration` |
| **Extra Metadata** | Views (`#nb-views-number`), Description (`meta[name="description"]`) |
| **Format Sources** | A) `setVideoUrlLow()` / `setVideoUrlHigh()` / `setVideoHLS()` script functions, B) Window globals (`video_title`, `video_duration`), C) `videoData` / `sources` / `mediaDefinitions` script objects, D) XHR/fetch monitoring for XNXX/media/video URLs |
| **Script URL Regex** | `setVideo(?:Url(Low|High)|HLS)\s*\(\s*(['"])((?:https?:)?\/\/.+?)\2` |
| **CDN Detection** | Host permissions for `*.xnxx-cdn.com` |
| **Media Request Patterns** | XHR/fetch URLs containing `xnxx`, `media`, or `video` |
| **Inject Message Type** | `XNXX_PAGE_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "quality": "string (low | high) | number",
  "format": "mp4 | hls",
  "height": "number | null",
  "width": "number | null",
  "format_id": "string (xnxx-low | xnxx-high | hls-720p | etc.)",
  "qualityScore": "number",
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
| **Referer** | `https://www.xnxx.com/` |
| **User-Agent** | `navigator.userAgent` (browser default) |
| **Origin** | `https://www.xnxx.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#video-player`, `#video-player-bg`, `.video-js`, `.jwplayer`, `.player`, nearest video parent element |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `xnxx-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-xnxx-video` |
| **Title** | "Download XNXX Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `www.xnxx.com/*`, `video.xnxx.com/*`, `www.xnxx3.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.7 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/xnxx-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/xnxx-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `xnxx-downloader.zip` | 1.22 MB |
| Chrome | `xnxx-downloader-chrome.zip` | 1.13 MB |
| Chrome Store Sanitized | `xnxx-downloader-chrome-store-sanitized.zip` | 1.13 MB |
| Brave | `xnxx-downloader-brave.zip` | 1.13 MB |
| Edge | `xnxx-downloader-edge.zip` | 1.13 MB |
| Opera | `xnxx-downloader-opera.zip` | 1.13 MB |
| Whale | `xnxx-downloader-whale.zip` | 1.13 MB |
| Yandex | `xnxx-downloader-yandex.zip` | 1.13 MB |
| Firefox ZIP | `xnxx-downloader-firefox.zip` | 1.14 MB |
| Firefox XPI | `xnxx-downloader-firefox-unpacked.xpi` | 1.13 MB |

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
| **GH License ID** | `GVgtSLhoV39lzCzPrR9i` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNAEXj3S7kZ4` |
| **Stripe Product Name** | XNXX Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [xnxx-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS74DP7AOTRcvmX1KAd6mn`, `price_1SymtCDP7AOTRcvmOMq4nyCs` |

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
| `brandAccent` | `#004be8` | Primary action/CTA (blue) |
| `brandAccentHover` | `#0a56ff` | Hover state (brighter blue) |
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
| YouTube | `modules/youtube/` | YouTube extraction utilities |
