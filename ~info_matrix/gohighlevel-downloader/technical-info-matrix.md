# Technical Info Matrix — GoHighLevel Downloader

## Extension: `gohighlevel-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP GoHighLevel Downloader |
| **Slug / ID** | `gohighlevel-downloader` |
| **Gecko ID** | `gohighlevel-downloader@serpapps.com` |
| **Category** | Video Downloader (Multi-Platform / CRM Portal) |
| **Target Site(s)** | GoHighLevel client portals, HighLevel membership/course areas, Loom.com, Vimeo.com, YouTube.com, Wistia.com, and other GoHighLevel-powered sites |
| **Description** | Download videos from GoHighLevel. Supports downloading Loom, YouTube, Vimeo, Wistia embeds where available. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/gohighlevel-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:13:56.552Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`gohighlevel-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/gohighlevel-downloader` |
| **Product Page** | https://serp.ly/gohighlevel-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Multi-handler: Loom, Vimeo, YouTube, Wistia, GoHighLevel, Circle -- each with dedicated handler + detector. Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes -- per-handler quality extraction from embedded player APIs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes -- in-page download manager (`download-manager/`) with modular config, state, UI, and task registry |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No -- uses download manager overlay and popup |
| **Context Menu** | No |
| **Auto-Save** | No -- uses `saveAs: true` dialog for user-selected save location |
| **Desktop Notifications** | Yes -- "Download completed!" |
| **Video Detection** | Automatic -- multi-platform detector pattern: Loom, Vimeo, YouTube, Wistia, GoHighLevel, Circle detectors scan iframes and embeds |
| **GoHighLevel Detection** | Heuristic gating: `meta[name="x-cp-build-version"]`, `#clientportal-siteCustomHeader`, `script[src*="clientclub.net"]`, `link[href*="clientclub.net"]` |
| **Blocked Domains** | Skool (`*.skool.com`), Circle (`*.circle.so`, `*.circle.com`), YouTube (`*.youtube.com`, `youtu.be`), Kajabi (`*.kajabi.com`, `*.mykajabi.com`, `*.kax16.com`, `*.kxcdn.com`) -- these have their own dedicated extensions |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://*.b-cdn.net/*`, `https://*.kajabi.com/*`, `https://kajabi.com/*`, `https://*.mykajabi.com/*`, `https://*.kax16.com/*`, `https://*.kxcdn.com/*`, `https://content.apisystem.tech/*`, `https://highleveltechie.com/*`, `https://*.highleveltechie.com/*`, `https://clientclub.net/*`, `https://*.clientclub.net/*`, `https://gokollab.com/*`, `https://*.gokollab.com/*`, `*://*/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` -- injected on `*://*/*` (with exclude_matches for blocked domains) at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes -- `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes -- `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes -- `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Module** | `modules/youtube/` |
| **IndexedDB** | Yes -- segment caching (`indexed-db.js`) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detector with GoHighLevel/HighLevel gating |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, handler routing, auth gating, offscreen management |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth/` + `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (modular) | In-page download progress panel with config, state, UI, task registry, integration helper |
| Detectors | `detectors/` | Platform-specific video detection: `video-detector.js`, `loom-detector.js`, `vimeo-detector.js`, `youtube-detector.js`, `wistia-detector.js`, `gohighlevel-detector.js`, `circle-detector.js`, `skool-detector.js` |
| Handlers | `handlers/` | Platform-specific download handlers: `loom-handler.js`, `vimeo-handler.js`, `youtube-handler.js`, `wistia-handler.js`, `gohighlevel-handler.js`, `circle-handler.js`, `skool-handler.js` |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| Bootstrap | `bootstrap.js` | WXT bootstrap entrypoint (no-op) |

### GoHighLevel Detection & Gating

| Feature | Implementation |
|---|---|
| **Site Match** | `*://*/*` (all URLs, with exclude_matches for blocked domains) |
| **Gating Logic** | Content script checks for GoHighLevel/HighLevel markers before activating; exits silently on non-GoHighLevel pages |
| **Meta Tag** | `document.querySelector('meta[name="x-cp-build-version"]')` |
| **Element ID** | `document.getElementById('clientportal-siteCustomHeader')` |
| **Asset Check** | `document.querySelector('script[src*="clientclub.net"], link[href*="clientclub.net"]')` |
| **Hostname Allowlist** | `*.clientclub.net`, `*.mykajabi.com`, `*.gohighlevel.com` |
| **Hostname Regex (Detector)** | `/highlevel\|gohighlevel\|join\./i` |
| **Background Tab Tracking** | `activeGoHighLevelTabs` Set tracks tabs that passed the gating check |
| **Background Validation** | `isGoHighLevelActiveTab()` -- re-checks via `chrome.scripting.executeScript` for DOM markers |
| **Overlay Cleanup** | Aggressively removes `[data-clientclub-overlay]` elements on non-GoHighLevel pages |
| **Fail-Safe** | On gating error, defaults to disabled (overlays removed, listeners no-op) |
| **Diagnostic Message** | `GATING_DIAGNOSTIC` sent to background with host, meta, id, asset, decision, reason |

### Multi-Platform Video Detection

| Platform | Detector | Handler | Detection Method |
|---|---|---|---|
| Loom | `detectors/loom-detector.js` | `handlers/loom-handler.js` | Loom embed iframe detection |
| Vimeo | `detectors/vimeo-detector.js` | `handlers/vimeo-handler.js` | Vimeo player iframe and API |
| YouTube | `detectors/youtube-detector.js` | `handlers/youtube-handler.js` | YouTube embed detection |
| Wistia | `detectors/wistia-detector.js` | `handlers/wistia-handler.js` | Wistia player embed detection |
| GoHighLevel | `detectors/gohighlevel-detector.js` | `handlers/gohighlevel-handler.js` | GoHighLevel/HighLevel native video (Plyr/HLS), m3u8 discovery via performance entries |
| Circle | `detectors/circle-detector.js` | `handlers/circle-handler.js` | Circle.so embed detection |
| Generic Video | `detectors/video-detector.js` | -- | HTML5 `<video>` element scanning |

### GoHighLevel Native Video Handler

| Feature | Implementation |
|---|---|
| **Handler Class** | `GoHighLevelHandler` |
| **Video Container** | `.video-player-container .plyr__video-wrapper`, `.video-player-container` |
| **HLS Discovery** | `performance.getEntriesByType('resource')` scanned for `.m3u8` URLs |
| **Media URL Detection** | `currentSrc`, `src`, `<source>` elements, `data-src`, `data-hls`, `data-m3u8`, `data-video`, `data-url` attributes |
| **Audio Support** | Direct download for non-m3u8 URLs (MP3, etc.) |
| **Download Method** | HLS manifest fetch (background or tab proxy), segment stitching to MP4 |
| **Tab Proxy** | Falls back to tab-based proxy fetch when background fetch fails (CORS bypass) |

### Blocked Domain Patterns

| Pattern | Reason |
|---|---|
| `/(^\|\.)skool\.com$/i` | Has dedicated Skool Downloader extension |
| `/(^\|\.)video\.skool\.com$/i` | Skool video subdomain |
| `/(^\|\.)circle\.so$/i` | Has dedicated Circle Downloader extension |
| `/(^\|\.)circle\.com$/i` | Circle alternate domain |
| `https://www.youtube.com/*` | Has dedicated YouTube Downloader extension |
| `https://*.youtube.com/*` | YouTube subdomains |
| `https://youtu.be/*` | YouTube short links |
| `https://kajabi.com/*` | Has dedicated Kajabi Downloader extension |
| `https://*.kajabi.com/*` | Kajabi subdomains |
| `https://*.mykajabi.com/*` | Kajabi custom domains |
| `https://*.kax16.com/*` | Kajabi CDN |
| `https://*.kxcdn.com/*` | Kajabi CDN |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Architecture** | Modular -- `download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-task-registry.js`, `integration-helper.js` |
| **Max Concurrent Downloads** | 3 |
| **Panel ID** | `skool-download-manager` |
| **Z-Index** | 2147483647 |
| **Theme** | Dark |
| **Font** | system-ui, -apple-system, sans-serif |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel, concurrent download queue |

### Popup UI

| Property | Value |
|---|---|
| **Title** | Video Downloader for GoHighLevel |
| **Stylesheets** | `styles/styles.css` (9.5 KB), `styles/popup-enhanced.css` (14.4 KB) |
| **Script Load Order** | `auth.js` (module) -> `popup.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `site-config.js` -> `popup-ui-overrides.js` -> `update-notifier.js` |
| **Sections** | Header, Activation section, Loading spinner, Error display, Video info card with thumbnail, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes -- `serpapps/gohighlevel-downloader` |
| **Has Worktree?** | Yes -- `gohighlevel-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `gohighlevel-downloader.zip` | 1.35 MB |
| Chrome | `gohighlevel-downloader-chrome.zip` | 1.28 MB |
| Chrome Store Sanitized | `gohighlevel-downloader-chrome-store-sanitized.zip` | 1.27 MB |
| Brave | `gohighlevel-downloader-brave.zip` | 1.28 MB |
| Edge | `gohighlevel-downloader-edge.zip` | 1.28 MB |
| Opera | `gohighlevel-downloader-opera.zip` | 1.28 MB |
| Whale | `gohighlevel-downloader-whale.zip` | 1.28 MB |
| Yandex | `gohighlevel-downloader-yandex.zip` | 1.28 MB |
| Firefox ZIP | `gohighlevel-downloader-firefox.zip` | 1.34 MB |
| Firefox XPI | `gohighlevel-downloader-firefox-unpacked.xpi` | 1.28 MB |

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
| **Gumroad Product ID** | (not configured) |
| **GH License ID** | (not configured) |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNfxz8dTezYT` |
| **Stripe Product Name** | Gohighlevel Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Gohighlevel Downloader] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6mDP7AOTRcvm7bCMj3gV`, `price_1SrVASDP7AOTRcvmoAzTCG1I` |

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
| YouTube | `modules/youtube/` | YouTube-specific extraction |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
