# Technical Info Matrix — RedGifs Downloader

## Extension: `redgifs-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP RedGifs Downloader |
| **Slug / ID** | `redgifs-downloader` |
| **Gecko ID** | `redgifs-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | redgifs.com and subdomains |
| **Description** | Download RedGifs videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/redgifs-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-03T04:39:39.507Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | No |
| **GitHub Releases Repo** | `serpapps/redgifs-downloader` |
| **Product Page** | https://serp.ly/redgifs-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes — parsed from RedGifs API (`/v2/gifs/{id}`), `<video>`/`<source>` tags, og:video meta, inject.js XHR/fetch interception |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player`, `.mainPlayerDiv`, `.GifPreview_isActive`, `.GifPreview_isVideo`, `.GifPreview`, `[data-feed-item-id]`) |
| **Context Menu** | Yes — "Download RedGifs Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/RedGifs/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" |
| **Video Detection** | Automatic — RedGifs API v2, og:video meta tags, HTML5 video element, inject.js fetch/XHR monitor, feed item scanning |
| **Side Panel** | Yes — `popup.html` via `chrome.sidePanel` API |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `sidePanel` |
| **Host Permissions** | `https://api.github.com/*`, `https://api.redgifs.com/*`, `https://redgifs.com/*`, `https://*.redgifs.com/*`, `https://auth.serp.co/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `redgifs.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `REDGIFS_PAGE_DATA` messages for RedGifs API responses |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), RedGifs API v2 (`api.redgifs.com`) |
| **RedGifs API Auth** | Temporary bearer token via `POST /v2/auth/temporary`, cached 55 minutes |
| **RedGifs API Endpoints** | `/v2/auth/temporary` (token), `/v2/gifs/{id}` (video metadata + formats) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, RedGifs ID extraction, metadata scraping, feed item scanning, format extraction |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, RedGifs API token management, auth gating, offscreen management, context menu, notifications, side panel |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI — video/image/text tabs, quality selector, auth flow, stats grid |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor for RedGifs API, extracts gif data via `REDGIFS_PAGE_DATA` messages |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://redgifs.com/*`, `https://*.redgifs.com/*` |
| **Video ID Patterns** | `/(?:watch\|ifr)/([^/?#]+)` from URL pathname, `data-feed-item-id` attribute, media URL filename extraction |
| **ID Validation** | `isLikelyRedgifsId()`: 8-48 lowercase alphanumeric chars, not all digits, not starting with "feedmodule" |
| **Title Sources** | Feed card text (`collectTextFromCard`), `meta[property="og:title"]`, `document.title` (filtered for generic titles) |
| **Thumbnail Sources** | `og:image`, `twitter:image`, `<video>` poster attribute |
| **Duration Sources** | `meta[property="og:video:duration"]`, ISO 8601 PT format parsing |
| **Extra Metadata** | Tags from `meta[name="keywords"]`, JSON-LD structured data |
| **Format Sources** | A) RedGifs API v2 `/v2/gifs/{id}` (primary), B) HTML5 `<video>` element source, C) og:video meta tags, D) inject.js intercepted API responses |
| **Feed Scanning** | Scans `.GifPreview_isActive`, `.tileItem`, `.GifPreview`, `[data-feed-item-id]` elements for feed pages |
| **Inject Message Type** | `REDGIFS_PAGE_DATA` (RedGifs-specific) |
| **Inject Capture Filter** | Only captures `api.redgifs.com/v2/gifs/{id}` responses (no sub-paths) |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8 | https",
  "filesize": null,
  "tbr": null,
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
| **Referer** | `https://www.redgifs.com/` |
| **Origin** | `https://www.redgifs.com` |

### RedGifs API Integration

| Parameter | Value |
|---|---|
| **Token Endpoint** | `https://api.redgifs.com/v2/auth/temporary` |
| **Token Method** | GET or POST (fallback) |
| **Token Cache Duration** | 55 minutes |
| **GIF Data Endpoint** | `https://api.redgifs.com/v2/gifs/{id}` |
| **Auth Header** | `Authorization: Bearer {token}` |
| **Custom Header** | `x-customheader: {referer}` |
| **Meta Cache TTL** | 20 minutes |
| **Meta Cache Max Entries** | 800 |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player`, `.mainPlayerDiv`, `.GifPreview_isActive`, `.GifPreview_isVideo`, `.GifPreview`, `[data-feed-item-id]` (largest visible) |
| **Button Text** | "Download" with arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `redgifs-download-manager` |
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
| **Menu ID** | `download-redgifs-video` |
| **Title** | "Download RedGifs Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `redgifs.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (9.4 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Tabs** | Videos, Images, Text |
| **Stats Grid** | Video count, Image count, Text count |
| **Sections** | Header (SERP Labs kicker, subtitle), Trial banner, Activation section, Stats grid, Tab bar, Download Visible button, Asset list, Status footer |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser.mjs` |
| **Watermarked?** | No |
| **GitHub Release?** | Yes — `serpapps/redgifs-downloader` |
| **Has Worktree?** | Yes — `.worktrees/redgifs-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `redgifs-downloader.zip` | 1.22 MB |
| Chrome | `redgifs-downloader-chrome.zip` | 1.22 MB |
| Brave | `redgifs-downloader-brave.zip` | 1.22 MB |
| Edge | `redgifs-downloader-edge.zip` | 1.22 MB |
| Opera | `redgifs-downloader-opera.zip` | 1.22 MB |
| Whale | `redgifs-downloader-whale.zip` | 1.22 MB |
| Yandex | `redgifs-downloader-yandex.zip` | 1.22 MB |
| Firefox ZIP | `redgifs-downloader-firefox.zip` | 1.22 MB |
| Firefox XPI | `redgifs-downloader-firefox-unpacked.xpi` | 1.22 MB |

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
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | Not configured (empty) |
| **License Check Worker** | Not configured (empty) |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TfNbgaF3qp9UuG` |
| **Stripe Product Name** | RedGifs Downloader |
| **Stripe Monthly Price** | USD 9.00/month [redgifs-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time [redgifs-downloader] |
| **Stripe Price IDs** | `price_1Si2qPDP7AOTRcvmOrnM9ipn`, `price_1Symt3DP7AOTRcvmS3uTsXBs` |

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
| `brandAccent` | `#0ea5e9` | Primary action/CTA (sky blue) |
| `brandAccentHover` | `#0b73b9` | Hover state (darker blue) |
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
| YouTube | `modules/youtube/` | YouTube client utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
