# Technical Info Matrix — GoKollab Downloader

## Extension: `gokollab-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP GoKollab DL |
| **Slug / ID** | `gokollab-downloader` |
| **Gecko ID** | Not configured (no `browser_specific_settings` in manifest) |
| **Category** | Video / Media Downloader (Education & Collaboration Platforms) |
| **Target Site(s)** | GoKollab / GoHighLevel client portals (clientclub.net, gokollab.com, and custom domains using the HighLevel client-portal framework) |
| **Description** | Download videos from GoKollab. Supports downloading Loom, YouTube, Vimeo, Wistia embeds where available. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/gokollab-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- populated by build.js --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | No (single standard build) |
| **GitHub Releases Repo** | `serpapps/gokollab-downloader` |
| **Product Page** | https://serp.ly/gokollab-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4/WebM download + HLS stitching (offscreen FastStream) + platform-specific API extraction (Loom, Vimeo, YouTube, Wistia) |
| **Quality Selection** | Yes — per-platform quality extraction from Loom, Vimeo, YouTube, Wistia, and GoHighLevel native video |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) modular system |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button in popup downloads all detected assets on the page |
| **In-Page Player Button?** | No (no `player-button.js`) |
| **Context Menu** | No (no `contextMenus` permission) |
| **Auto-Save** | Yes — saves via `chrome.downloads.download()` with `conflictAction: "uniquify"`, `saveAs: false` |
| **Desktop Notifications** | No (no `notifications` permission) |
| **Video Detection** | Multi-platform: Loom, Vimeo, YouTube, Wistia, GoHighLevel native, Circle HLS, linked video URLs; gated by HighLevel platform markers |
| **Image/GIF Detection** | Yes — scans page for images and GIFs |
| **Text Extraction** | Yes — extracts text content from page for download as .txt |
| **Platform Gating** | Content script only activates on verified GoKollab/HighLevel pages (meta `x-cp-build-version`, id `clientportal-siteCustomHeader`, assets from `clientclub.net`) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://*.b-cdn.net/*`, `https://*.kajabi.com/*`, `https://kajabi.com/*`, `https://*.mykajabi.com/*`, `https://*.kax16.com/*`, `https://*.kxcdn.com/*`, `https://content.apisystem.tech/*`, `https://highleveltechie.com/*`, `https://*.highleveltechie.com/*`, `https://clientclub.net/*`, `https://*.clientclub.net/*`, `https://gokollab.com/*`, `https://*.gokollab.com/*`, `*://*/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` -- injected on `*://*/*` at `document_idle`, `all_frames: true` |
| **Content Script Exclude Matches** | `https://www.skool.com/*`, `https://*.skool.com/*`, `https://stream.video.skool.com/*`, `https://*.video.skool.com/*`, `https://kajabi.com/*`, `https://*.kajabi.com/*`, `https://*.mykajabi.com/*`, `https://*.kax16.com/*`, `https://*.kxcdn.com/*`, `https://circle.so/*`, `https://*.circle.so/*`, `https://circle.com/*`, `https://*.circle.com/*` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS/FastStream processing) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **YouTube Module** | `modules/youtube/` (client.js, constants.js, media-assembler.js, sabr.js, signature.js, ump.js, utils.js) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching (`indexed-db.js`) |
| **Page Injection** | No dedicated `inject.js` — platform gating runs inline in `content-enhanced-modular.js` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`), Loom CDN (`loomcdn.com`), Vimeo Player API (`player.vimeo.com`), YouTube (`googlevideo.com`, `googleapis.com`), Wistia (`fast.wistia.net`, `fast.wistia.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **DNR Rules** | Yes — dynamic `declarativeNetRequest` rules for googlevideo headers, YouTubei headers, Skool video hosts, BunnyCDN (`b-cdn.net`), apisystem.tech (GHL content) |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Platform gating, multi-platform video detection orchestration, overlay management, asset scanning |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, DNR rules, handler dispatch, asset download |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI with asset tabs (Videos, Images/GIFs, Text), quality selection, bulk download |
| Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | HLS/FastStream media processing |
| Auth | `auth.js` + `auth-ui.js` + `auth/` (auth-api.js, auth-config.js, auth-storage.js, auth-telemetry.js, auth-token.js) | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (download-manager.js, download-manager-config.js, download-manager-state.js, download-manager-ui.js, download-task-registry.js, integration-helper.js) | In-page download progress panel |
| Video Detector Coordinator | `detectors/video-detector.js` | Unified detection interface across all platform detectors |
| Loom Detector | `detectors/loom-detector.js` | Loom iframe/embed/link detection, thumbnail extraction |
| Vimeo Detector | `detectors/vimeo-detector.js` | Vimeo playerConfig, iframe, data-attribute detection |
| YouTube Detector | `detectors/youtube-detector.js` | YouTube iframe/embed/link detection, video ID extraction |
| Wistia Detector | `detectors/wistia-detector.js` | Wistia iframe, embed, source element detection |
| GoHighLevel Detector | `detectors/gohighlevel-detector.js` | GoHighLevel native video (Plyr player, HLS m3u8 via Performance API) |
| Circle Detector | `detectors/circle-detector.js` | Circle HLS video with shadow DOM traversal |
| Loom Handler | `handlers/loom-handler.js` | Loom download orchestration |
| Vimeo Handler | `handlers/vimeo-handler.js` | Vimeo download orchestration |
| YouTube Handler | `handlers/youtube-handler.js` | YouTube download orchestration |
| Wistia Handler | `handlers/wistia-handler.js` | Wistia download orchestration |
| GoHighLevel Handler | `handlers/gohighlevel-handler.js` | GoHighLevel download orchestration |
| Circle Handler | `handlers/circle-handler.js` | Circle download orchestration |
| Skool Handler | `handlers/skool-handler.js` | Skool download orchestration (blocked via exclude_matches) |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup header/status customizations |
| Bootstrap | `bootstrap.js` | Extension bootstrap |
| Log | `log.js` | Lightweight log helper for detectors |

### Video Detection & Platform Gating

| Feature | Implementation |
|---|---|
| **Content Script Match** | `*://*/*` (all URLs) with `all_frames: true` |
| **Exclude Matches** | Skool, Kajabi, Circle domains excluded at manifest level |
| **Platform Gating** | Content script checks for GoKollab/HighLevel markers before activating: `meta[name="x-cp-build-version"]`, `#clientportal-siteCustomHeader`, `script[src*="clientclub.net"]`, `link[href*="clientclub.net"]` |
| **Gating Message** | `GATING_DIAGNOSTIC` sent to background with host, decision, reason |
| **Background Tab Check** | `isGoKollabActiveTab()` — checks `activeGoKollabTabs` set, hostname allowlist (clientclub.net, mykajabi.com, gohighlevel.com), DOM marker inspection via `chrome.scripting.executeScript` |
| **Blocked Hosts (Runtime)** | `skool.com`, `video.skool.com`, `circle.so`, `circle.com` |
| **Overlay Cleanup** | `removeGoKollabOverlays()` — removes `[data-clientclub-overlay]` elements, periodic interval (1500ms), MutationObserver fallback |

### Supported Video Platforms

| Platform | Detector | Detection Method |
|---|---|---|
| Loom | `loom-detector.js` | Iframe `src*="loom.com/embed"` or `loom.com/share`, video ID regex `(?:embed\|share)/([a-f0-9]{32})`, thumbnail from script tags |
| Vimeo | `vimeo-detector.js` | `window.playerConfig`, iframe `src*="vimeo.com"`, data attributes, player API |
| YouTube | `youtube-detector.js` | Iframe `src*="youtube.com/embed"`, `youtube-nocookie.com/embed`, `youtu.be`, video ID patterns |
| Wistia | `wistia-detector.js` | Iframe `src*="wistia"`, embed/medias URL patterns, `wmediaid` parameter |
| GoHighLevel | `gohighlevel-detector.js` | `.video-player-container`, Plyr wrapper, native `<video>`, HLS m3u8 from Performance API entries |
| Circle | `circle-detector.js` | `media-theme`, `hls-video` elements, shadow DOM traversal |
| Linked Videos | `video-detector.js` | `<a href>` matching Loom/Vimeo/YouTube/Wistia/m3u8/mp4 URL patterns |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Panel ID** | `skool-download-manager` |
| **Position** | Fixed top-right (`top: 20px; right: 20px`) |
| **Card Width** | 380px (responsive: `Math.min(window.innerWidth - 40, 340)` on small screens) |
| **Max Height** | `Math.min(window.innerHeight - 80, 500)px` |
| **Z-Index** | 2147483647 |
| **Background** | `#1b1b1b` |
| **Border** | `2px solid #007acc` |
| **Border Radius** | 8px |
| **Font** | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif` |
| **Auto-Hide** | 8 seconds after completion (`autoHideAfterComplete: 8000`) |
| **Linger After Complete** | 2 seconds (`lingerAfterCompleteMs: 2000`) |
| **Max Concurrent Downloads** | 3 |
| **Features** | Collapse/close, per-download progress, speed display, cancel, cancel all, clear completed, cross-tab sync |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (14.4 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Boot splash, Header (SERP Labs kicker + "GoKollab Downloader"), Trial banner, Activation section, Stats grid (Videos / Images-GIFs / Text), Tab buttons (Videos / Images-GIFs / Text), "Download Visible" button, Asset list, Status footer |
| **Tabs** | `videos`, `images`, `texts` |
| **Popup Title** | "SERP GoKollab DL" |
| **Page Title** | "Video Downloader for GoKollab" |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (Node.js script, PowerShell `Compress-Archive`) |
| **Build Log Level** | `error` (patched from `debug` during build via `SERP_BUILD_LOG_LEVEL`) |
| **Watermarked?** | No |
| **GitHub Release?** | Yes — `serpapps/gokollab-downloader` |
| **Has Worktree?** | Yes — `.worktrees/gokollab-downloader/` |
| **Output Directory** | `release/` |
| **Output File** | `gokollab-downloader.zip` |

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
| **Stripe Product ID** | `prod_TadNizz3EowTtF` |
| **Stripe Product Name** | Gokollab Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Gokollab Downloader] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6nDP7AOTRcvmjvQU4RIn`, `price_1SrVARDP7AOTRcvmo7th7sk6` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |

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
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube client, SABR, signature, UMP, media assembler |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |

### Offscreen Processing

| Parameter | Value |
|---|---|
| **Offscreen HTML** | `offscreen-faststream.html` |
| **Offscreen JS** | `offscreen-faststream-legacy.js` + `indexed-db.js` |
| **Idle Timeout** | 25,000ms (just under SW idle window) |
| **Ready Signal** | `FASTSTREAM_OFFSCREEN_READY` message type |
| **Error Signal** | `OFFSCREEN_ERROR` message type |
| **Purpose** | HLS/FastStream media processing and segment stitching |
