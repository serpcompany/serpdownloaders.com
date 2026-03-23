# Technical Info Matrix — Whop Downloader

## Extension: `whop-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Whop Downloader |
| **Slug / ID** | `whop-downloader` |
| **Gecko ID** | `whop-downloader@serpapps.com` |
| **Category** | Content Downloader (SaaS/Creator Platform) |
| **Target Site(s)** | whop.com and subdomains |
| **Description** | Download Whop videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/whop-downloader` |
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
| **Store-Sanitized Build?** | Yes (`whop-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/whop-video-downloader` |
| **Product Page** | https://serp.ly/whop-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct download (chrome.downloads) + HLS Stitching (m3u8 segment to MP4 transmux via offscreen) |
| **Quality Selection** | No — downloads best available quality automatically |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/inline-manager.js`) with cross-tab sync |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all detected assets of the active tab (videos, images, or text) |
| **In-Page Overlay Buttons?** | Yes — overlay download buttons on video containers and library cards (`content-enhanced.js`) |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves directly, no save-as dialog |
| **Desktop Notifications** | No |
| **Asset Detection** | Multi-type: Videos (HTML5 video, Mux players, og:video), Images, Text posts — all from visible DOM including shadow DOM |
| **Concurrent Downloads** | 3 max concurrent (download task registry queue) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://whop.com/*`, `https://*.whop.com/*`, `https://assets.whop.com/*`, `https://api.gumroad.com/*`, `https://stream.mux.com/*`, `https://image.mux.com/*`, `https://*.mux.com/*` |
| **Content Scripts (Set 1)** | `site-config.js` -> `logger.js` -> `download-manager/inline-manager.js` — injected on `whop.com` at `document_idle`, `all_frames: false` |
| **Content Scripts (Set 2)** | `site-config.js` -> `logger.js` -> `content-enhanced.js` — injected on `whop.com` at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS transmux via FastStream/MediaBunny) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (WhoppDownloaderDB / fileStore) for segment caching |
| **Page Injection** | None — no separate inject.js; content-enhanced.js handles in-page detection directly |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad License API (`api.gumroad.com`), Mux Streaming (`stream.mux.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | Video/image/text detection, Mux player extraction, overlay buttons, library card buttons, shadow DOM traversal |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, download task registry/queue, Whop embed finder |
| Popup (Enhanced) | `popup.html` + `popup-enhanced.js` | Asset dashboard with tabs (Videos/Images/Text), rescan, bulk download |
| Popup (Legacy) | `popup.js` | Legacy single-video popup with quality selector |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS transmux (FastStream/MediaBunny) |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/inline-manager.js` | In-page download progress panel with cross-tab sync |
| Download Manager Config | `download-manager/download-manager-config.js` | UI, behavior, integration, and style configuration |
| Download Task Registry | `download-manager/download-task-registry.js` | Concurrent download queue (max 3), abort controllers, Chrome download ID mapping |
| Logger | `logger.js` | Structured logging (WhoppLogger), bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup title and error message normalization |
| IndexedDB | `indexed-db.js` | Key-value storage for segment caching |
| Auth Config | `auth/auth-config.js` | Auth base URL, entitlement name, storage prefix |
| Auth API | `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume |
| Auth Storage | `auth/auth-storage.js` | Device ID, stored auth persistence |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging |
| Auth Token | `auth/auth-token.js` | Entitlement validation |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://whop.com/*`, `https://*.whop.com/*` |
| **Asset Types** | Videos, Images, Text posts |
| **Video Sources** | HTML5 `<video>` elements (src, currentSrc, `<source>`), Mux players (`<mux-player>`, `<mux-video>`), `og:video` meta tags |
| **Image Sources** | All visible `<img>` elements on the page |
| **Text Sources** | Visible text post content from Whop feed/lesson pages |
| **Mux Detection** | `<mux-player>` and `<mux-video>` elements, playback-id extraction, `stream.mux.com` HLS URLs |
| **Shadow DOM Support** | Yes — deep query traversal (`deepQueryAll`) for shadow roots |
| **CDN Detection** | Hosts matching `whop`, `whopp`, `mux.com`, `stream.mux` |
| **Media Extension Detection** | `.mp4`, `.m4v`, `.mov`, `.webm`, `.mpg`, `.mpeg`, `.m3u8`, `.mpd` |
| **Title Sources** | `<mux-player>` title attribute, page title, og:title |
| **Thumbnail Sources** | Video poster attribute, `img[alt="product image"]` srcset/src |
| **Overlay Button Containers** | `.video-container`, `[data-testid="video-container"]`, `.whopp-video-container`, `.whopp-player-container`, `[data-whopp-player]`, `.player-wrapper` |
| **Library Card Selectors** | `article[data-videoid]`, `[data-whopp-video-card]` |
| **Background Embed Finder** | `findWhoppEmbed()` — probes active tab for embedded video via scripting API |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from translateX(100%) to translateX(0)) |
| **Panel ID** | `whopp-download-manager` |
| **Card Width** | 380px (responsive, min 340px on small viewports) |
| **Max Height** | `min(innerHeight - 80, 500)px` |
| **Z-Index** | 2147483647 (max safe) |
| **Border** | `2px solid #625df5` |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif |
| **Auto-Remove** | Completed entries removed after 2500ms delay |
| **Features** | Collapse/expand, per-download progress bars with percentage and speed, cancel (STOP) buttons, remove buttons, cancel all, clear completed, cross-tab sync via chrome.storage, queue snapshot polling |

### Popup UI (Enhanced)

| Property | Value |
|---|---|
| **Popup Width** | 480px |
| **Popup Min Height** | 560px |
| **Stylesheets** | `styles/popup-enhanced.css` (9.0 KB), `styles/styles.css` (17.7 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Boot splash, Header (SERP Labs / Whopp Downloader / subtitle), Trial banner, Activation section, Stats grid (Videos/Images/Text counts), Tabs (Videos/Images/Text), Download Visible button, Asset list, Status footer |
| **Tabs** | Videos, Images, Text — each renders asset cards with download buttons |
| **Asset Cards** | Thumbnail/preview, title, subline (quality/source), body text, Download button, Open post link |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/whop-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/whop-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `whop-downloader.zip` | <!-- TODO --> |
| Chrome | `whop-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `whop-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `whop-downloader-brave.zip` | <!-- TODO --> |
| Edge | `whop-downloader-edge.zip` | <!-- TODO --> |
| Opera | `whop-downloader-opera.zip` | <!-- TODO --> |
| Whale | `whop-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `whop-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `whop-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `whop-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Gumroad Product ID** | `OHxjL9F6j-RfWU-DNCNGOg==` |
| **GH License ID** | `DASgFDBPAGrFKaLMatnf` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNyzhiDsmtJC` |
| **Stripe Product Name** | Whop Video Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Whop Video Downloader] | USD 9.00/month [whop-video-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time | USD 8.00/one_time [whop-video-downloader-setup-fee-8] |
| **Stripe Price IDs** | `price_1SdS71DP7AOTRcvmRHPIpT8y`, `price_1SpcnVDP7AOTRcvmSvsW56MG`, `price_1SpdxeDP7AOTRcvmpCrdzRlJ`, `price_1SpdxfDP7AOTRcvmDL1luIZA` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Logger Name** | `WhoppLogger` (prefix: `WHOPP`) |

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
| `brandAccent` | `#FA4C1D` | Primary action/CTA (Whop orange-red) |
| `brandAccentHover` | `#e9542b` | Hover state (darker orange-red) |
| `bgDark` | `#1b1b1b` | Main dark background |
| `bgDarker` | `#2a2a2a` | Secondary dark background |
| `borderDark` | `#333333` | Dark borders |
| `inputBorder` | `#555555` | Input field borders |
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

### Download Manager Accent Colors

| Token | Hex | Usage |
|---|---|---|
| Panel accent | `#625df5` | Download manager border and progress bar (inline-manager.js) |
| Overlay accent | `#7c5cff` | Content-enhanced.js fallback accent |

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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |

### Download Task Registry

| Setting | Value |
|---|---|
| **Max Concurrent** | 3 |
| **Queue Processing** | Automatic — `processDownloadQueue()` called after each registration and completion |
| **Abort Support** | Yes — `AbortController` per task, mapped to Chrome download IDs |
| **Cancellation** | Per-download and cancel-all via `cancelDownload()` / `cancelAllDownloads` |
| **State Persistence** | `chrome.storage.local` key `downloadManagerGlobalState` |
| **Stale Entry Pruning** | Active entries: 2h, terminal entries: 12h |
| **Complete Linger** | 2500ms before storage removal |
