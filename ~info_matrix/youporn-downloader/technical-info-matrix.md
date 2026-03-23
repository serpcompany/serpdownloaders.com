# Technical Info Matrix — YouPorn Downloader

## Extension: `youporn-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for YouPorn |
| **Slug / ID** | `youporn-downloader` |
| **Gecko ID** | `youporn-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | youporn.com and www.youporn.com |
| **Description** | Download YouPorn videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/youporn-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:38:59.031Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`youporn-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/youporn-video-downloader` |
| **Product Page** | https://serp.ly/youporn-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from mediaDefinitions (nested JSON fetch for mp4/hls lists), inline script regex, URL quality patterns |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#videoWrapper`, nearest `<video>` parent) |
| **Context Menu** | Yes — "Download YouPorn Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/YouPorn/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" / "Download Failed" |
| **Video Detection** | Automatic — mediaDefinitions (page-embedded JSON + nested API fetch), inline script MP4 regex, inject.js XHR/fetch monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://youporn.com/*`, `https://www.youporn.com/*`, `https://store.externulls.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `youporn.com` / `www.youporn.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `YOUPORN_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Externulls CDN (`store.externulls.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, mediaDefinitions parsing, nested JSON fetch for format lists, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs and page data |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://youporn.com/*`, `https://www.youporn.com/*` |
| **Video ID Patterns** | `/watch/(\d+)` from URL, `(?:youporn\.com(?:\.br)?\/\|embed\.youporn\.com\/\?.*?\bid=)(\d+)` in inject.js |
| **Title Sources** | `h1[class*="title"]`, `.video-title`, `h1`, `meta[property="og:title"]`, `document.title` (stripped of " - YouPorn...") |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `meta[property="video:duration"]` |
| **Extra Metadata** | Page title, description (`meta[name="description"]`), embedded JSON from scripts |
| **Format Sources** | A) mediaDefinitions (page-embedded JSON array, fetched nested for mp4/hls lists), B) Inline script MP4 URL regex, C) inject.js page-context data |
| **Script URL Regex** | `/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi` |
| **CDN Detection** | Externulls CDN (`store.externulls.com`), XHR/fetch monitor for youporn/externulls/video URLs |
| **Media Request Patterns** | `mediaDefinitions`, `.m3u8`, `.mp4`, `youporn`, `externulls`, `video` |
| **Inject Message Type** | `YOUPORN_PAGE_DATA` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "string (e.g. '720p (MP4)')",
  "url": "string",
  "protocol": "m3u8 | https",
  "filesize": null,
  "tbr": "number | null",
  "width": null,
  "height": "number | null"
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
| **Referer** | `https://www.youporn.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://www.youporn.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#videoWrapper`, nearest `<video>` parent element |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `youporn-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10040 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 8px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-youporn-video` |
| **Title** | "Download YouPorn Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `youporn.com/*`, `www.youporn.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (7.6 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` (via head) → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (Node.js script, PowerShell Compress-Archive) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/youporn-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/youporn-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `youporn-downloader.zip` | 1.19 MB |
| Chrome | `youporn-downloader-chrome.zip` | 1.11 MB |
| Chrome Store Sanitized | `youporn-downloader-chrome-store-sanitized.zip` | 1.11 MB |
| Brave | `youporn-downloader-brave.zip` | 1.11 MB |
| Edge | `youporn-downloader-edge.zip` | 1.11 MB |
| Opera | `youporn-downloader-opera.zip` | 1.11 MB |
| Whale | `youporn-downloader-whale.zip` | 1.11 MB |
| Yandex | `youporn-downloader-yandex.zip` | 1.11 MB |
| Firefox ZIP | `youporn-downloader-firefox.zip` | 1.12 MB |
| Firefox XPI | `youporn-downloader-firefox-unpacked.xpi` | 1.11 MB |

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
| **GH License ID** | `54YOUnxc4dv2eOlqHWTu` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadN9ejAjTtjkz` |
| **Stripe Product Name** | Youporn Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [youporn-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS76DP7AOTRcvm1khia8JP`, `price_1SymtGDP7AOTRcvmEqJRufVH` |

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
| `brandAccent` | `#ec567c` | Primary action/CTA (pink) |
| `brandAccentHover` | `#d64a73` | Hover state (darker pink) |
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
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.4 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
