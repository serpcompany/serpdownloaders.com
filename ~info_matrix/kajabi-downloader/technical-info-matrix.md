# Technical Info Matrix — Kajabi Downloader

## Extension: `kajabi-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Kajabi DL |
| **Slug / ID** | `kajabi-downloader` |
| **Gecko ID** | `kajabi-downloader@serpapps.com` |
| **Category** | Video Downloader (Education / Online Courses) |
| **Target Site(s)** | kajabi.com, *.kajabi.com, *.mykajabi.com (plus embedded Loom, Vimeo, YouTube, Wistia) |
| **Description** | Download videos from Kajabi. Supports downloading Loom, YouTube, Vimeo, Wistia embeds where available. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/kajabi-downloader` |
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
| **Store-Sanitized Build?** | Yes (`kajabi-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/kajabi-video-downloader` |
| **Product Page** | https://serp.ly/kajabi-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Multi-platform: Vimeo (API config extraction + HLS/MP4), Loom (GraphQL API + CDN), YouTube (client-side extraction + SABR), Wistia (direct MP4 via Chrome downloads), offscreen HLS-to-MP4 transmux |
| **Quality Selection** | Yes — per-platform format parsing (Vimeo config_url, YouTube itags, Loom CDN, Wistia assets) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (modular: `download-manager/`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No (detection via popup and content script only) |
| **Context Menu** | No |
| **Auto-Save** | Platform-dependent (Wistia uses save-as dialog; others use streaming download) |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — modular multi-platform detector system (`detectors/video-detector.js` coordinator) detecting Loom, Vimeo, YouTube, Wistia embeds on Kajabi pages |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://*.b-cdn.net/*`, `https://*.kajabi.com/*`, `https://kajabi.com/*`, `https://*.mykajabi.com/*`, `https://*.kax16.com/*`, `https://*.kxcdn.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on Kajabi, Loom, Vimeo, YouTube, Wistia domains at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS-to-MP4 transmuxing via FastStream / SimpleHLS2MP4Converter) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Client** | `modules/youtube/` (client.js, signature.js, sabr.js, media-assembler.js, ump.js, utils.js, constants.js) |
| **IndexedDB** | Yes — `indexed-db.js` (segment caching, offscreen state) |
| **Page Injection** | None (no inject.js — uses modular detector imports via ES modules) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`), Vimeo API (`vimeo.com`, `player.vimeo.com`), Loom GraphQL API (`loom.com`), YouTube innertube |
| **Update Check** | GitHub releases (`serpapps/kajabi-video-downloader`), 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detection coordinator, download control events, modular detector loading |
| Video Detector Coordinator | `detectors/video-detector.js` | Imports and orchestrates all platform-specific detectors in priority order |
| Loom Detector | `detectors/loom-detector.js` | Detects Loom embeds via iframes, data attributes, video elements, direct links, script tags |
| Vimeo Detector | `detectors/vimeo-detector.js` | Detects Vimeo embeds via playerConfig, iframes, data attributes; extracts page info on Vimeo domain |
| YouTube Detector | `detectors/youtube-detector.js` | Detects YouTube embeds via iframes and links; extracts page info on YouTube domain |
| Wistia Detector | `detectors/wistia-detector.js` | Detects Wistia embeds via iframes, source elements, data attributes (`data-wistia-id`, `wistia_async_*`), script content |
| Skool Detector | `detectors/skool-detector-working.js` | Skool native video detection (excluded on Kajabi via blocked domain guard) |
| Circle Detector | `detectors/circle-detector.js` | Circle native video detection with heuristic white-label support (`media-theme`, `hls-video` elements) |
| Loom Handler | `handlers/loom-handler.js` | GraphQL API extraction (GetVideoSSR), CDN URL resolution, password-protected video support |
| Vimeo Handler | `handlers/vimeo-handler.js` | Vimeo API config extraction, JWT auth, cookie-based authentication check, thumbnail selection, fMP4 format support |
| YouTube Handler | `handlers/youtube-handler.js` | Client-side extraction via SimpleYouTubeClient, signature decryption, SABR download manager, format selection (AV combined preferred) |
| Wistia Handler | `handlers/wistia-handler.js` | Direct MP4 download via Chrome downloads API with save-as dialog, progress tracking, HTTPS enforcement |
| Skool Handler | `handlers/skool-handler.js` | Skool video download handling |
| Circle Handler | `handlers/circle-handler.js` | Circle video download handling |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, handler routing, offscreen management, auth gating, concurrent download queue (max 3), download state persistence |
| Download Task Registry | `download-manager/download-task-registry.js` | Concurrent download tracking with configurable max (3 concurrent) |
| Download Manager | `download-manager/download-manager.js` | In-page download progress panel coordinator |
| Download Manager Config | `download-manager/download-manager-config.js` | Configurable UI/behavior/integration/style settings |
| Download Manager State | `download-manager/download-manager-state.js` | Cross-tab download state synchronization via chrome.storage |
| Download Manager UI | `download-manager/download-manager-ui.js` | DOM manipulation, panel creation, styling |
| Integration Helper | `download-manager/integration-helper.js` | Download manager integration bridge |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI: video detection display, quality selector, platform indicator, download trigger, auth flow, yt-dlp command copy |
| Auth | `auth.js` + `auth-ui.js` + `auth/` (auth-api.js, auth-config.js, auth-storage.js, auth-telemetry.js, auth-token.js) | OTP login, entitlement checks, trial management, token management |
| Logger | `logger.js` | Structured logging with background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, auth config, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Multi-Platform Detection System

| Platform | Detector File | Detection Methods | Handler File | Download Method |
|---|---|---|---|---|
| **Loom** | `loom-detector.js` | Iframe embeds (`loom.com/embed`, `loom.com/share`), video elements, data attributes, direct links, script content | `loom-handler.js` | GraphQL API (GetVideoSSR) -> CDN URL |
| **Vimeo** | `vimeo-detector.js` | `window.playerConfig`, iframe embeds (`player.vimeo.com`), data attributes | `vimeo-handler.js` | Vimeo API config_url -> HLS/MP4 streams |
| **YouTube** | `youtube-detector.js` | Iframe embeds (`youtube.com/embed`, `youtube-nocookie.com`), links (`youtube.com/watch`, `youtu.be/`) | `youtube-handler.js` | Innertube client -> signature decryption -> SABR/direct download |
| **Wistia** | `wistia-detector.js` | Iframe embeds, source elements, data attributes (`data-wistia-id`, `wistia_async_*`), script content | `wistia-handler.js` | Direct MP4 download via Chrome downloads API |
| **Skool** | `skool-detector-working.js` | Native video detection (blocked on Kajabi domain) | `skool-handler.js` | N/A for Kajabi extension |
| **Circle** | `circle-detector.js` | Native video, heuristic white-label detection (`media-theme`, `hls-video`) | `circle-handler.js` | HLS/MP4 streams |

### Content Script Injection

| Field | Value |
|---|---|
| **Matched Domains** | `kajabi.com/*`, `*.kajabi.com/*`, `*.mykajabi.com/*`, `www.loom.com/*`, `*.loom.com/*`, `vimeo.com/*`, `*.vimeo.com/*`, `www.youtube.com/*`, `*.youtube.com/*`, `youtu.be/*`, `wistia.com/*`, `*.wistia.com/*`, `wistia.net/*`, `*.wistia.net/*` |
| **Excluded Domains** | `www.skool.com/*`, `*.skool.com/*`, `stream.video.skool.com/*`, `*.video.skool.com/*`, `circle.so/*`, `*.circle.so/*`, `circle.com/*`, `*.circle.com/*` |
| **All Frames** | Yes |
| **Run At** | `document_idle` |
| **Hard Guard** | JavaScript hostname check — disables on Skool and Circle domains even if injected |

### Blocked Domain Guard (Background)

| Field | Value |
|---|---|
| **Blocked Patterns** | `/(^|\.)skool\.com$/i`, `/(^|\.)video\.skool\.com$/i`, `/(^|\.)circle\.so$/i`, `/(^|\.)circle\.com$/i` |
| **Function** | `isBlockedUrl()` — prevents runtime behavior on Skool/Circle in Kajabi extension |

### Concurrent Download System

| Parameter | Value |
|---|---|
| **Max Concurrent Downloads** | 3 |
| **Registry** | `DownloadTaskRegistry` |
| **State Persistence** | `chrome.storage.local` (key: `downloadManagerGlobalState`) |
| **Stale Entry Pruning** | Automatic on service worker startup (500ms delay) |
| **Linger After Complete** | 2,000ms |
| **Offscreen Idle Timeout** | 25,000ms (auto-teardown) |

### Offscreen Document

| Field | Value |
|---|---|
| **HTML** | `offscreen-faststream.html` |
| **Script** | `offscreen-faststream-legacy.js` |
| **Purpose** | FastStream HLS-to-MP4 converter (SimpleHLS2MP4Converter) |
| **Reason** | `WORKERS` |
| **Creation Timeout** | 30,000ms |
| **Ready Signal** | `FASTSTREAM_OFFSCREEN_READY` message |
| **Error Signal** | `OFFSCREEN_ERROR` message |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Configurable (default: right) |
| **Panel ID** | `skool-download-manager` |
| **Theme** | Dark (default) |
| **Max Visible Downloads** | 5 (before scrolling) |
| **Auto-Hide After Complete** | 8,000ms |
| **Z-Index** | 2147483647 |
| **Font** | system-ui, -apple-system, sans-serif |
| **Cross-Tab Sync** | Yes (via chrome.storage) |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, cancel all, clear completed |

### Popup UI

| Property | Value |
|---|---|
| **Title** | Video Downloader for Kajabi |
| **Stylesheets** | `styles/styles.css` (9.7 KB), `styles/popup-enhanced.css` (14.8 KB) |
| **Script Load Order** | `site-config.js` -> `auth.js` (module) -> `popup-enhanced.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `popup-ui-overrides.js` -> `update-notifier.js` |
| **Sections** | Header, Quick help banner, Activation section (email + license key), Boot splash, Main content, Password section, Status, Video info card, Quality selector, YouTube URL section (yt-dlp copy), Progress bar, Cancel button |
| **Platform Detection** | Displays detected platform (Loom, Vimeo, YouTube, Wistia, Skool, or Kajabi) |
| **yt-dlp Support** | YouTube URL copy section with Mac/Windows yt-dlp command buttons |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (archiver + javascript-obfuscator + sharp) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/kajabi-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/kajabi-downloader/` |

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
| **Gumroad Product ID** | `DZSfWhkbzpWRm8Rbtt5qMg==` |
| **GH License ID** | `Nn6W5th0meZDeTlw3zt4` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNMPkSPBcSky` |
| **Stripe Product Name** | Kajabi Video Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Kajabi Video Downloader] | USD 9.00/month [kajabi-video-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time | USD 8.00/one_time [kajabi-video-downloader-setup-fee-8] |
| **Stripe Price IDs** | `price_1SdS6oDP7AOTRcvm8lIDw4o9`, `price_1SpdxgDP7AOTRcvmM1OVhFWg`, `price_1SpdxgDP7AOTRcvmuH2ZGsCb`, `price_1SpedSDP7AOTRcvmdyoBhcXg` |

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
| `brandAccent` | `#FA402B` | Primary action/CTA (Kajabi red) |
| `brandAccentHover` | `#EE5F65` | Hover state (lighter red) |
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
| YouTube | `modules/youtube/` | YouTube client, signature decryption, SABR downloads, media assembly |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
