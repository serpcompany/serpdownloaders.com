# Technical Info Matrix — XHamster Downloader

## Extension: `xhamster-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for XHamster |
| **Slug / ID** | `xhamster-downloader` |
| **Gecko ID** | `xhamster-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | xhamster.com, xhamster.one, xhamster.desi, xhms.pro, xhamster2.com, xhamster11.com, xhamster20.com, xhamster26.com, xhamster20.desi, xhday.com, xhvid.com, and subdomains |
| **Description** | Download XHamster videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/xhamster-downloader` |
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
| **Store-Sanitized Build?** | Yes (`xhamster-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/xhamster-video-downloader` |
| **Product Page** | https://serp.ly/xhamster-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment concatenation) + In-page blob download |
| **Quality Selection** | Yes — parsed from window.initials videoModel sources, xplayerSettings sources (HLS + standard), HTML5 `<video>`/`<source>` tags, noscript elements, script regex |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `.player-container video`, `.xplayer video`, `video`) |
| **Context Menu** | Yes — "Download XHamster Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/XHamster/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" / "Download Started" |
| **Video Detection** | Automatic — window.initials, xplayerSettings, HTML5 video elements, noscript parsing, script regex, inject.js XHR/fetch monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `declarativeNetRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://xhamster.com/*`, `https://*.xhamster.com/*`, `https://xhamster.one/*`, `https://*.xhamster.one/*`, `https://xhamster.desi/*`, `https://*.xhamster.desi/*`, `https://xhms.pro/*`, `https://*.xhms.pro/*`, `https://xhamster2.com/*`, `https://xhamster11.com/*`, `https://xhamster20.com/*`, `https://xhamster26.com/*`, `https://xhamster20.desi/*`, `https://xhday.com/*`, `https://*.xhday.com/*`, `https://xhvid.com/*`, `https://*.xhvid.com/*`, `https://*.xhcdn.com/*`, `*://*.sacdnssedge.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on all xhamster domains at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (importScripts, not ES module) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS segment processing) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `XHAMSTER_PAGE_DATA` messages, monitors `window.initials` changes |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), License Worker (`ghl-check-license-worker-v2.farleythecoder.workers.dev`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **DNR Rules** | 4 rules — allow + CORS header injection for `xhcdn.com` and `sacdnssedge.com` CDNs |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, format extraction, initials parsing, metadata scraping, in-page blob download |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (importScripts) | Download orchestration, auth gating, offscreen management, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment processing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Auth Modules | `auth/auth-config.js`, `auth/auth-api.js`, `auth/auth-storage.js`, `auth/auth-telemetry.js`, `auth/auth-token.js` | Modular auth system components |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts window.initials and xplayerSettings |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://xhamster.com/*`, `https://*.xhamster.com/*`, `https://xhamster.one/*`, `https://*.xhamster.one/*`, `https://xhamster.desi/*`, `https://*.xhamster.desi/*`, `https://xhms.pro/*`, `https://*.xhms.pro/*`, `https://xhamster2.com/*`, `https://xhamster11.com/*`, `https://xhamster20.com/*`, `https://xhamster26.com/*`, `https://xhamster20.desi/*`, `https://xhday.com/*`, `https://*.xhday.com/*`, `https://xhvid.com/*`, `https://*.xhvid.com/*` |
| **Video ID Patterns** | `/videos/([^/]+)-([A-Za-z0-9]+)(?:[?#]\|$)` (display_id + id), `/movies/([A-Za-z0-9]+)/([^/]*)\.html` (id + display_id) |
| **Title Sources** | `h1`, `.entity-info-title h1`, `meta[property="og:title"]`, `window.initials.videoModel.title` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `<video>` element duration, `window.initials.videoModel.duration` |
| **Extra Metadata** | Views (regex from page text), Likes (`.thumb-up .thumb-rating`), Dislikes (`.thumb-down .thumb-rating`), Tags (`.categories-container a`, `.video-tag a`), Categories (`.entity-info-categories a`), Uploader (`.entity-info-user-name a`, `.video-author-name a`, `span[itemprop="author"] a`) |
| **Format Sources** | A) HTML5 `<video>`/`<source>` elements with xhcdn.com URLs, B) `<noscript>` parsed video elements, C) `window.initials.videoModel.sources`, D) `window.initials.xplayerSettings.sources` (HLS + standard), E) inject.js page data |
| **URL Decipher** | Hex/base64 XOR/ROT13 deciphering for obfuscated format URLs (following yt-dlp logic) |
| **CDN Detection** | `xhcdn.com`, `sacdnssedge.com` |
| **Media Request Patterns** | XHR/fetch intercepting for URLs containing `xhamster`, `media`, `video` |
| **Inject Message Type** | `XHAMSTER_PAGE_DATA` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format": "hls | mp4",
  "quality": "string (e.g. '720p')",
  "url": "string",
  "height": "number | null",
  "width": "number | null",
  "qualityScore": "number",
  "bandwidth": "number | null",
  "protocol": "m3u8_native | null",
  "http_headers": "{ Referer: string } | null",
  "source": "string | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | Custom segment concatenation (offscreen.js) + `SimpleHLS2MP4Converter` (modules) |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | Media playlist URL (dynamic per download) |
| **User-Agent** | Browser default |
| **Origin** | Page origin (dynamic) |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.player-container video`, `.xplayer video`, `video` (parent element) |
| **Button Text** | "Download" with down arrow icon |
| **Button Color** | `#d9232e` (XHamster red) |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **SPA Support** | Yes — URL change polling at 1s interval |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `xhamster-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable, list limited to 400px) |
| **Z-Index** | 2147483647 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, HLS segment tracking, XH badge icon |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-xhamster-video` |
| **Title** | "Download XHamster Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `xhamster.com/*`, `xhamster.one/*`, `xhamster.desi/*`, `xhms.pro/*`, `xhday.com/*`, `xhvid.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.0 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/xhamster-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/xhamster-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `xhamster-downloader.zip` | <!-- TODO --> |
| Chrome | `xhamster-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `xhamster-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `xhamster-downloader-brave.zip` | <!-- TODO --> |
| Edge | `xhamster-downloader-edge.zip` | <!-- TODO --> |
| Opera | `xhamster-downloader-opera.zip` | <!-- TODO --> |
| Whale | `xhamster-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `xhamster-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `xhamster-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `xhamster-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `SHuoOImRjis1gfXKSZLb` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNaFoVVgvpim` |
| **Stripe Product Name** | Xhamster Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [xhamster-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS73DP7AOTRcvmCQ4N0uCy`, `price_1SymtBDP7AOTRcvm84KCMyz3` |

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
| `brandAccent` | `#e34449` | Primary action/CTA (XHamster red) |
| `brandAccentHover` | `#c63a3f` | Hover state (darker red) |
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

### DNR Rules

| Rule ID | Priority | Action | CDN Target | Resource Types |
|---|---|---|---|---|
| 1 | 1 | Allow | `xhcdn.com` | All |
| 2 | 1 | Allow | `sacdnssedge.com` | All |
| 3 | 2 | Modify CORS headers | `xhcdn.com` | `xmlhttprequest`, `media` |
| 4 | 2 | Modify CORS headers | `sacdnssedge.com` | `xmlhttprequest`, `media` |

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
| YouTube | `modules/youtube/` | YouTube utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| EventEmitter Dir | `modules/eventemitter/` | Event dispatch module directory |
| Localize | `modules/Localize.mjs` | i18n support |
