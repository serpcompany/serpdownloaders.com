# Technical Info Matrix — XVideos Downloader

## Extension: `xvideos-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for XVideos |
| **Slug / ID** | `xvideos-downloader` |
| **Gecko ID** | `xvideos-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | xvideos.com, xvideos.es, xvideos2.com, and subdomains |
| **Description** | Download XVideos videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/xvideos-downloader` |
| **Last Updated** | 2026-03-05 |
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
| **Store-Sanitized Build?** | Yes (`xvideos-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/xvideos-video-downloader` |
| **Product Page** | https://serp.ly/xvideos-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes -- parsed from setVideo* script patterns (setVideoHLS, setVideoUrlLow, setVideoUrlHigh), HLS manifest qualities, flv_url patterns |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes -- in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes -- `player-button.js` (targets `#video-player-bg`, `#video-player`, `.video-player`, `#player`, `#html5video`, `#video-content`) |
| **Context Menu** | Yes -- "Download XVideos Video" on page and video contexts |
| **Auto-Save** | Yes -- saves to `Downloads/XVideos/` folder, no save-as dialog |
| **Desktop Notifications** | Yes -- "Download Complete" |
| **Video Detection** | Automatic -- setVideo* script patterns, flv_url, window globals, inject.js XHR/fetch monitor, HLS manifest parsing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.xvideos.com/*`, `https://*.xvideos.com/*`, `https://www.xvideos.es/*`, `https://xvideos2.com/*`, `https://flashservice.xvideos.com/*`, `https://static-hw.xvideos.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` -- injected on xvideos.com/xvideos.es/xvideos2.com at `document_idle` |
| **Background Service Worker?** | Yes -- `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes -- `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes -- `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes -- segment caching |
| **Page Injection** | `inject.js` -- monitors XMLHttpRequest + fetch(), posts `XVIDEOS_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | None configured |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, setVideo* pattern extraction, metadata scraping, inject.js bridge |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, HLS manifest parsing |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts setVideo* URLs and metadata |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.xvideos.com/*`, `https://*.xvideos.com/*`, `https://www.xvideos.es/*`, `https://xvideos2.com/*`, `https://flashservice.xvideos.com/*`, `https://static-hw.xvideos.com/*` |
| **Video ID Patterns** | `/video\.?([0-9a-z]+)/` |
| **Title Sources** | `meta[property="og:title"]`, `h1`, `document.title` (cleaned) |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `meta[property="og:duration"]`, `span.duration` |
| **Extra Metadata** | Description (`meta[name="description"]`) |
| **Format Sources** | A) setVideo* script patterns (setVideoHLS, setVideoUrlLow, setVideoUrlHigh), B) flv_url pattern, C) HLS manifest parsing, D) window globals (video_title, video_duration), E) mediaDefinitions fallback, F) sources object fallback |
| **Script URL Regex** | `/setVideo([^(]+)\((["\'])(http.+?)\2\)/g` (setVideo* pattern) |
| **CDN Detection** | N/A (uses setVideo* extraction instead) |
| **Media Request Patterns** | XHR/fetch to xvideos/media/video domains |
| **Inject Message Type** | `XVIDEOS_PAGE_DATA` |

### Format Object Structure

```json
{
  "format_id": "string (e.g. mp4-low, mp4-high, hls-720p)",
  "ext": "mp4 | m3u8",
  "format": "mp4 | hls | flv",
  "quality": "number | null",
  "url": "string",
  "height": "number | null",
  "width": "number | null",
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
| **Referer** | Request-specific (page URL) |
| **User-Agent** | `navigator.userAgent` (browser default) |
| **Origin** | N/A (not hardcoded) |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#video-player-bg`, `#video-player`, `.video-player`, `#player`, `#html5video`, `#video-content` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes -- format sorting by quality (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `xvideos-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10040 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 8px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 750ms after completion (item removal), 300ms after empty (panel hide) |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-xvideos-video` |
| **Title** | "Download XVideos Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `xvideos.com/*`, `xvideos.es/*`, `xvideos2.com/*`, `flashservice.xvideos.com/*`, `static-hw.xvideos.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (6.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes -- `serpapps/xvideos-video-downloader` |
| **Has Worktree?** | Yes -- `.worktrees/xvideos-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `xvideos-downloader.zip` | <!-- TODO --> |
| Chrome | `xvideos-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `xvideos-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `xvideos-downloader-brave.zip` | <!-- TODO --> |
| Edge | `xvideos-downloader-edge.zip` | <!-- TODO --> |
| Opera | `xvideos-downloader-opera.zip` | <!-- TODO --> |
| Whale | `xvideos-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `xvideos-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `xvideos-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `xvideos-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `NOD3b8ALZRNrCaRCVHSy` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNlH24sIip6b` |
| **Stripe Product Name** | XVideos Downloader |
| **Stripe Monthly Price** | USD 9.00/month [xvideos-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS75DP7AOTRcvmLHIUKuPb`, `price_1SymtDDP7AOTRcvmzXdSCh3O` |

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
| `brandAccent` | `#de2600` | Primary action/CTA (XVideos red) |
| `brandAccentHover` | `#c52000` | Hover state (darker red) |
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
| YouTube | `modules/youtube/` | YouTube extraction utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
