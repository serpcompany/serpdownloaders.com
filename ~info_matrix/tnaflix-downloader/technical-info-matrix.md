# Technical Info Matrix — TNAFlix Downloader

## Extension: `tnaflix-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for TNAFlix |
| **Slug / ID** | `tnaflix-downloader` |
| **Gecko ID** | `tnaflix-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | tnaflix.com and www.tnaflix.com |
| **Description** | Download TNAFlix videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/tnaflix-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- TODO: set from build-info.json --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`tnaflix-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/tnaflix-video-downloader` |
| **Product Page** | https://serp.ly/tnaflix-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (content-script blob streaming) + HLS Stitching (offscreen segment concatenation) + Chrome downloads API fallback |
| **Quality Selection** | Yes — parsed from config XML, EMPFlix API, HTML5 video/source tags, script regex, data attributes |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#video-player-container`, `#player`, `.player`, `#videoBox`, `.video-player`, `.video-container`) |
| **Context Menu** | Yes — "Download TNAFlix Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/TNAFlix/` folder, no save-as dialog (direct MP4); save-as dialog for HLS |
| **Desktop Notifications** | Yes — "Download Complete" / "Download Failed" |
| **Video Detection** | Automatic — config XML (flashvars/hidden inputs), EMPFlix-style API, HTML5 video/source, script regex, data attributes, JSON-LD, inject.js XHR/fetch monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://tnaflix.com/*`, `https://www.tnaflix.com/*`, `https://store.externulls.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `tnaflix.com` and `www.tnaflix.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS segment concatenation) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | No (segment caching done in-memory in offscreen) |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `TNAFLIX_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), TNAFlix API (`www.tnaflix.com/ajax/video-player/`), ExterNulls CDN (`store.externulls.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, TNAFlixExtractor (yt-dlp port), config XML parsing, EMPFlix API, format extraction, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, HLS parsing, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS segment downloading + concatenation |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs, global variable probing |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://tnaflix.com/*`, `https://www.tnaflix.com/*` |
| **Video ID Patterns** | `/[^/]+/([^/]+)/video(\d+)` (category/display_id/videoID), `(?:tnaflix\.com(?:\.br)?\/\|embed\.tnaflix\.com\/\?.*?\bid=)(\d+)` |
| **Title Sources** | `div.watchVideoTitle`, `meta[property="og:title"]`, `meta[name="title"]`, `<title>`, JSON-LD `VideoObject.name` |
| **Thumbnail Sources** | `imageurl=`, `poster:`, `og:image`, JSON-LD `VideoObject.thumbnailUrl` |
| **Duration Sources** | `duration:` in scripts, `meta[property="video:duration"]`, JSON-LD `VideoObject.duration` |
| **Extra Metadata** | Description (`og:description`, JSON-LD), Uploader (`div.submitByLink`), Display ID from URL |
| **Format Sources** | A) Config XML (flashvars.config, hidden input vkey/nkey), B) EMPFlix-style AJAX API, C) HTML5 `<video>`/`<source>`, D) Script regex for mp4/m3u8 URLs, E) Data attributes (`data-video-url`, `data-src`, `data-file`), F) JSON objects in scripts |
| **Config XML URL Pattern** | `flashvars.config = escape("...")`, `<input name="config" value="...">`, TNAFlix CDN `https://cdn-fck.tnaflix.com/tnaflix/{vkey}.fid` |
| **EMPFlix API** | `https://www.tnaflix.com/ajax/video-player/{videoId}` |
| **Media Request Patterns** | `tnaflix`, `externulls`, `video`, `.m3u8`, `.mp4` |
| **Inject Message Type** | `TNAFLIX_PAGE_DATA` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "mp4 | m3u8 | flv",
  "format_type": "mp4 | hls | flv",
  "quality": "string | null",
  "url": "string",
  "protocol": "http | m3u8 | m3u8_native",
  "filesize": null,
  "tbr": null,
  "width": null,
  "height": "number | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | Custom offscreen segment concatenation (not SimpleHLS2MP4Converter) |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | `https://www.tnaflix.com/` |
| **User-Agent** | `navigator.userAgent` (browser default) |
| **Origin** | `https://www.tnaflix.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#video-player-container`, `#player`, `.player`, `#videoBox`, `.video-player`, `.video-container`, nearest positioned ancestor with min 300x200 |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `tnaflix-download-manager` |
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
| **Menu ID** | `download-tnaflix-video` |
| **Title** | "Download TNAFlix Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `tnaflix.com/*` and `www.tnaflix.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (12.5 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (custom Node script, PowerShell zip) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/tnaflix-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/tnaflix-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `tnaflix-downloader.zip` | <!-- TODO --> |
| Chrome | `tnaflix-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `tnaflix-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `tnaflix-downloader-brave.zip` | <!-- TODO --> |
| Edge | `tnaflix-downloader-edge.zip` | <!-- TODO --> |
| Opera | `tnaflix-downloader-opera.zip` | <!-- TODO --> |
| Whale | `tnaflix-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `tnaflix-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `tnaflix-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `tnaflix-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `tDaa6CLf8BqD7e0WR2fa` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadN9kmKRL9Cl6` |
| **Stripe Product Name** | TNAFlix Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [tnaflix-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6zDP7AOTRcvmpg9wZSdY`, `price_1Symt7DP7AOTRcvmWcK1t7xa` |

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
| `brandAccent` | `#0b84d2` | Primary action/CTA (blue) |
| `brandAccentHover` | `#0086d8` | Hover state (slightly lighter blue) |
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
| YouTube | `modules/youtube/` | YouTube extraction helpers |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |
