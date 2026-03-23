# Technical Info Matrix — TokyoMotion Downloader

## Extension: `tokyomotion-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP TokyoMotion Downloader |
| **Slug / ID** | `tokyomotion-downloader` |
| **Gecko ID** | `tokyomotion-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | tokyomotion.net and subdomains |
| **Description** | Download TokyoMotion videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/tokyomotion-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T16:59:43.958Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`tokyomotion-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/tokyomotion-downloader` |
| **Product Page** | https://serp.ly/tokyomotion-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming + browser-managed via DNR Referer injection + helper-tab same-origin fetch) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes — parsed from flashvars mediaDefinitions, `<video>`/`<source>` tags, script regex, Performance API CDN entries |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#video_player`, `#flash`, `#fluid_video_wrapper_vjsplayer`, `.fluid_video_wrapper`, `.video-container`, `#player`, `.mainPlayerDiv`) |
| **Context Menu** | Yes — "Download TokyoMotion Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/TokyoMotion/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "TokyoMotion Download Complete" |
| **Video Detection** | Automatic — flashvars, HTML5 video, script regex, Performance API resource entries, inject.js XHR/fetch monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://tokyomotion.net/*`, `https://*.tokyomotion.net/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `tokyomotion.net` at `document_idle` |
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
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `TOKYOMOTION_PAGE_DATA` messages |
| **Declarative Net Request** | Yes — dynamic DNR rule (ID 932001) sets Referer header on `tokyomotion.net` requests for MP4 downloads |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, format extraction, flashvars parsing, metadata scraping, TokyoMotion-specific MP4 URL resolution |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, DNR header rule management, helper-tab MP4 downloads |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Auth Modules | `auth/auth-config.js`, `auth/auth-api.js`, `auth/auth-storage.js`, `auth/auth-telemetry.js`, `auth/auth-token.js` | Modular auth configuration, API calls, token handling, telemetry |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs via `TOKYOMOTION_PAGE_DATA` |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://tokyomotion.net/*`, `https://*.tokyomotion.net/*` |
| **Video ID Patterns** | `/video/(\d+)` from URL path, `og:url` meta fallback |
| **Title Sources** | `h1.title`, `h3.page-title`, `.title h3`, `[data-video-title]`, `meta[property="og:title"]` |
| **Thumbnail Sources** | `og:image`, `<video>` poster attribute |
| **Duration Sources** | `<video>` element duration, `flashvars.video_duration`, `flashvars.videoDuration` |
| **Extra Metadata** | Views (`.count`, `.video-data`, `.video-meta`, `.small.text-muted`), Likes (`.votesUp`), Dislikes (`.votesDown`), Tags (`.tagsWrapper a`, `a[href*='/search?search_query=']`, `a[href*='/tags/']`), Categories (`.categoriesWrapper a`, `a[href*='/categories/']`), Uploader (`a[href^='/user/']`, `.usernameBadgesWrapper a`, `.video-detailed-info a.bolded`, `.username`) |
| **Format Sources** | A) flashvars_* mediaDefinitions, B) HTML5 `<video>`/`<source>`, C) Performance API resource entries (`/vsrc/`, `/iphone/`, `.m3u8`, `.mp4`), D) inject.js XHR/fetch monitor (directVideoUrls) |
| **Script URL Regex** | `/https?:\\?\\/\\?\\/[^"'\\\s]+?\\.(?:m3u8\|mp4)(?:\\?[^"'\\\s]*)?/gi` |
| **CDN Detection** | Performance entries matching `tokyomotion.net` hostname, `/vsrc/`, `/iphone/` paths |
| **Media Request Patterns** | `/video/get_media`, `/vsrc/`, `/iphone/`, `mediaDefinitions`, `.m3u8`, `.mp4` |
| **Inject Message Type** | `TOKYOMOTION_PAGE_DATA` (also responds to `REQUEST_PORNHUB_DATA` for compatibility) |

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
| **Referer** | `https://tokyomotion.net/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36` |
| **Origin** | `https://tokyomotion.net` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#video_player`, `#flash`, `#fluid_video_wrapper_vjsplayer`, `.fluid_video_wrapper`, `.video-container`, `#player`, `.mainPlayerDiv`, nearest video container |
| **Button Text** | "Download" with arrow-down icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `tokyomotion-download-manager` |
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
| **Menu ID** | `download-tokyomotion-video` |
| **Title** | "Download TokyoMotion Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `tokyomotion.net/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.8 KB), `styles/popup-enhanced.css` (15.3 KB) |
| **Script Load Order** | `site-config.js` -> `auth.js` (module) -> `popup.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `popup-ui-overrides.js` -> `update-notifier.js` |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/tokyomotion-downloader` |
| **Has Worktree?** | Yes — `.worktrees/tokyomotion-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `tokyomotion-downloader.zip` | ~1.24 MB |
| Chrome | `tokyomotion-downloader-chrome.zip` | ~1.16 MB |
| Chrome Store Sanitized | `tokyomotion-downloader-chrome-store-sanitized.zip` | ~1.16 MB |
| Brave | `tokyomotion-downloader-brave.zip` | ~1.16 MB |
| Edge | `tokyomotion-downloader-edge.zip` | ~1.16 MB |
| Opera | `tokyomotion-downloader-opera.zip` | ~1.16 MB |
| Whale | `tokyomotion-downloader-whale.zip` | ~1.16 MB |
| Yandex | `tokyomotion-downloader-yandex.zip` | ~1.16 MB |
| Firefox ZIP | `tokyomotion-downloader-firefox.zip` | ~1.17 MB |
| Firefox XPI | `tokyomotion-downloader-firefox-unpacked.xpi` | ~1.16 MB |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | TokyoMotion MP4 endpoints commonly reject extension fetches (403); browser-managed download with DNR Referer injection used as primary strategy |
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
| **Stripe Product ID** | `prod_TfxYbVipClKshC` |
| **Stripe Product Name** | TokyoMotion Downloader |
| **Stripe Monthly Price** | USD 9.00/month [tokyomotion-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdhDP7AOTRcvmQcfZ6fAO`, `price_1Symt8DP7AOTRcvmLPt03ozu` |

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
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` (319 KB) | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` (4.3 KB) | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` (3.5 KB) | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |

### TokyoMotion-Specific Download Strategies

| Strategy | Description |
|---|---|
| **DNR Referer Injection** | Dynamic declarativeNetRequest rule (ID 932001) injects valid `Referer: https://www.tokyomotion.net/` header on video download requests to bypass 403 rejections |
| **Helper-Tab Download** | Creates an inactive background tab on `tokyomotion.net`, navigates via script to the MP4 URL so the download carries a valid first-party Referer |
| **Browser-Managed Fallback** | When offscreen fetch fails (403/CORS), falls back to `chrome.downloads.download()` with DNR header rule applied |
| **Content-Script Same-Origin Fetch** | Content script performs same-origin fetch on `tokyomotion.net` pages for MP4 URLs, creating blob URLs for download |
