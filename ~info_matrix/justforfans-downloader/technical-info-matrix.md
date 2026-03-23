# Technical Info Matrix — JustForFans Downloader

## Extension: `justforfans-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP JustForFans Downloader |
| **Slug / ID** | `justforfans-downloader` |
| **Gecko ID** | `justforfans-downloader@serpapps.com` |
| **Category** | Media Downloader (Creator/Subscription Platform) |
| **Target Site(s)** | justfor.fans and subdomains |
| **Description** | Download JustForFans videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/justforfans-downloader` |
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
| **Store-Sanitized Build?** | Yes (`justforfans-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/justforfans-downloader` |
| **Product Page** | https://serp.ly/justforfans-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) + DASH (encrypted/DRM streams via offscreen decryptor) |
| **Content Types** | Videos, Images (including gallery/carousel), Text Posts |
| **Quality Selection** | Yes — parsed from mediaDefinitions, `<video>`/`<source>` tags, Performance API CDN entries, inject.js XHR/fetch intercepts |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all visible assets on the current page |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `.jffPostClass.video[id^='post']` feed containers) |
| **Context Menu** | Yes — "Download JustForFans Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/JustForFans/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" |
| **Asset Detection** | Automatic — post feed scanning, `<video>`/`<source>` tags, Performance API resource entries, inject.js XHR/fetch monitor, gallery/carousel expansion |
| **Image/Gallery Support** | Yes — extracts images from feed posts, expands gallery/carousel posts for full image sets |
| **Text Post Extraction** | Yes — extracts post text content alongside media assets |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://api.xvid.com/*`, `https://autograph.xvid.com/*`, `https://justfor.fans/*`, `https://*.justfor.fans/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `download-manager.js` -> `content.js` -> `player-button.js` — injected on `justfor.fans` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + DASH decryption) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **DASH Module** | `modules/dash/` (mpd-parser, fragment-downloader, decryptor, mp4-remuxer, dash-downloader) |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `PORNHUB_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Autograph CDN (`autograph.xvid.com`), XVID API (`api.xvid.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Post feed scanning, video/image/text extraction, format detection, gallery expansion, DASH runtime context |
| Player Button | `player-button.js` | Per-post download button on JustForFans feed items with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, image/video/DASH download routing |
| Popup | `popup.html` + `popup-enhanced.js` | Asset browser UI with Videos/Images/Text tabs, stats grid, bulk download |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + DASH decryption |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs, records DASH manifests |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| Popup Legacy | `popup.js` | Legacy popup logic (45 KB) |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://justfor.fans/*`, `https://*.justfor.fans/*` |
| **Video ID Patterns** | `/videos/(\d+)(?:/\|$)`, `/watch/(\d+)(?:/\|$)`, `/post/(\d+)(?:/\|$)`, `[?&](?:video_id\|videoId\|id\|v)=([a-zA-Z0-9]+)`, `viewkey=([a-zA-Z0-9]+)` |
| **Title Sources** | `h1.title`, `[data-video-title]`, `meta[property="og:title"]` |
| **Thumbnail Sources** | `og:image`, `og:image:secure_url`, `twitter:image`, largest `<img>` |
| **Duration Sources** | `<video>` element, `flashvars.video_duration`, ISO 8601, `meta[property="video:duration"]` |
| **Extra Metadata** | Views (`.count`), Likes (`.votesUp`), Dislikes (`.votesDown`), Tags (`.tagsWrapper a`), Categories (`.categoriesWrapper a`) |
| **Format Sources** | A) flashvars_* mediaDefinitions, B) HTML5 `<video>`/`<source>`, C) Performance API CDN/media entries (autograph.xvid.com, file_id, streaming=true), D) inject.js XHR/fetch intercepts, E) DASH manifests |
| **Media URL Patterns** | `autograph.xvid.com/downloads`, `/downloads/` + `file_id=`, `streaming=true`, `.m3u8`, `.mp4`, `.mpd`, `/playlists/dash.mpd`, `media=hls` |
| **CDN Detection** | Performance entries matching `autograph.xvid.com`, `/downloads/` with `file_id=` params |
| **Inject Message Type** | `PORNHUB_PAGE_DATA` (shared pattern) |

### Post Feed Asset Extraction

| Feature | Implementation |
|---|---|
| **Post Selector** | `.jffPostClass[id^='post']` (filtered by regex `/^post\d{5,}$/i`, excludes `.eHidden`, excludes `postFiller*`) |
| **Video Extraction** | `extractVideosFromPost()` — finds `<video>`, `<source>`, Autograph CDN links per post |
| **DASH Extraction** | `extractDashFromPost()` — matches MPD manifests to posts via runtime context |
| **Image Extraction** | `extractImagesFromPost()` — finds post images |
| **Gallery Expansion** | `extractGalleryImagesFromPost()` — async gallery/carousel image expansion for multi-image posts |
| **Text Extraction** | `extractPostText()` — captures post text content |
| **Standalone Videos** | `extractStandaloneVideos()` — finds playlist tray/modal videos outside post cards |
| **Post Permalink** | Constructed as `{origin}/post/{postId}` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4 | mpd",
  "format_type": "hls | mp4 | dash",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8 | https | dash",
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
| **Referer** | `https://justfor.fans/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://justfor.fans` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.jffPostClass.video[id^='post']` (per-post feed containers) |
| **Button Selector** | `.ph-download-button[data-ph-owned='1']` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **MutationObserver** | Yes — auto-attaches buttons to new post containers as feed loads |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `justforfans-download-manager` |
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
| **Menu ID** | `download-justforfans-video` |
| **Title** | "Download JustForFans Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `justfor.fans/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (9.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Boot splash, Header (SERP Labs kicker + subtitle), Help disclosure, Rescan button, Trial banner, Activation section, Stats grid (Videos/Images/Text Posts counts), Tab bar (Videos/Images/Text), Download Visible button, Asset list, Status footer |
| **Asset Tabs** | Videos, Images, Text |
| **Bulk Action** | "Download Visible" button downloads all visible assets |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/justforfans-downloader` |
| **Has Worktree?** | Yes — `.worktrees/justforfans-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `justforfans-downloader.zip` | <!-- TODO --> |
| Chrome | `justforfans-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `justforfans-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `justforfans-downloader-brave.zip` | <!-- TODO --> |
| Edge | `justforfans-downloader-edge.zip` | <!-- TODO --> |
| Opera | `justforfans-downloader-opera.zip` | <!-- TODO --> |
| Whale | `justforfans-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `justforfans-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `justforfans-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `justforfans-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_TfxY3kW5FIAIza` |
| **Stripe Product Name** | Justforfans Downloader |
| **Stripe Monthly Price** | USD 9.00/month [justforfans-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdYDP7AOTRcvmeLXnv6oF`, `price_1SymswDP7AOTRcvmuURgjSpT` |

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
| DASH | `modules/dash/` | MPD parsing, fragment downloading, DRM decryption, MP4 remuxing |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube client/SABR/signature utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| EventEmitter (dir) | `modules/eventemitter/` | EventEmitter module directory |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |
