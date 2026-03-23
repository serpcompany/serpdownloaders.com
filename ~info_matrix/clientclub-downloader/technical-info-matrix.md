# Technical Info Matrix — ClientClub Downloader

## Extension: `clientclub-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP ClientClub Downloader |
| **Slug / ID** | `clientclub-downloader` |
| **Gecko ID** | `clientclub-downloader@serpapps.com` |
| **Category** | Video Downloader (Multi-Platform / Client Portal) |
| **Target Site(s)** | GoHighLevel client portals, Tella.tv, Loom.com, Vimeo.com, YouTube.com, Wistia.com, and other ClientClub-powered sites |
| **Description** | Download videos from ClientClub. Supports downloading Loom, YouTube, Vimeo, Wistia embeds where available. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/clientclub-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:04:23.853Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`clientclub-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/clientclub-downloader` |
| **Product Page** | https://serp.ly/clientclub-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Multi-handler: Loom, Vimeo, YouTube, Wistia, GoHighLevel, Circle — each with dedicated handler + detector. Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) |
| **Quality Selection** | Yes — per-handler quality extraction from embedded player APIs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) with modular config, state, UI, and task registry |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No — uses download manager overlay and popup |
| **Context Menu** | Yes — "Download ClientClub Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/ClientClub Downloader/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "ClientClub Download Complete" |
| **Video Detection** | Automatic — multi-platform detector pattern: Loom, Vimeo, YouTube, Wistia, GoHighLevel, Circle detectors scan iframes and embeds |
| **ClientClub Detection** | Heuristic gating: `meta[name="x-cp-build-version"]`, `#clientportal-siteCustomHeader`, `script[src*="clientclub.net"]`, `link[href*="clientclub.net"]` |
| **Blocked Domains** | Skool (`*.skool.com`), Circle (`*.circle.so`, `*.circle.com`), YouTube (`*.youtube.com`, `youtu.be`), Kajabi (`*.kajabi.com`, `*.mykajabi.com`) — these have their own dedicated extensions |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://*.b-cdn.net/*`, `https://*.kajabi.com/*`, `https://kajabi.com/*`, `https://*.mykajabi.com/*`, `https://*.kax16.com/*`, `https://*.kxcdn.com/*`, `https://content.apisystem.tech/*`, `https://highleveltechie.com/*`, `https://*.highleveltechie.com/*`, `*://*/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on `*://*/*` (with exclude_matches for blocked domains) at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Module** | `modules/youtube/` |
| **IndexedDB** | Yes — segment caching (`indexed-db.js`) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`), GoHighLevel license check worker (`ghl-check-license-worker-v2.farleythecoder.workers.dev`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detector with ClientClub/HighLevel gating |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, handler routing, auth gating, offscreen management, context menu |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, auth flow, video password support |
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

### ClientClub Detection & Gating

| Feature | Implementation |
|---|---|
| **Site Match** | `*://*/*` (all URLs, with exclude_matches for blocked domains) |
| **Gating Logic** | Content script checks for ClientClub markers before activating; exits silently on non-ClientClub pages |
| **Meta Tag** | `document.querySelector('meta[name="x-cp-build-version"]')` |
| **Element ID** | `document.getElementById('clientportal-siteCustomHeader')` |
| **Asset Check** | `document.querySelector('script[src*="clientclub.net"], link[href*="clientclub.net"]')` |
| **Hostname Allowlist** | `*.clientclub.net`, `*.mykajabi.com`, `*.gohighlevel.com` |
| **Background Tab Tracking** | `activeClientClubTabs` Set tracks tabs that passed the gating check |
| **Background Validation** | `isClientClubActiveTab()` — re-checks via `chrome.scripting.executeScript` for DOM markers |
| **Overlay Cleanup** | Aggressively removes `[data-clientclub-overlay]` elements on non-ClientClub pages |
| **Fail-Safe** | On gating error, defaults to disabled (overlays removed, listeners no-op) |

### Multi-Platform Video Detection

| Platform | Detector | Handler | Detection Method |
|---|---|---|---|
| Loom | `detectors/loom-detector.js` | `handlers/loom-handler.js` | Loom embed iframe detection |
| Vimeo | `detectors/vimeo-detector.js` | `handlers/vimeo-handler.js` | Vimeo player iframe and API |
| YouTube | `detectors/youtube-detector.js` | `handlers/youtube-handler.js` | YouTube embed detection |
| Wistia | `detectors/wistia-detector.js` | `handlers/wistia-handler.js` | Wistia player embed detection |
| GoHighLevel | `detectors/gohighlevel-detector.js` | `handlers/gohighlevel-handler.js` | GoHighLevel/ClientClub native video |
| Circle | `detectors/circle-detector.js` | `handlers/circle-handler.js` | Circle.so embed detection |
| Generic Video | `detectors/video-detector.js` | — | HTML5 `<video>` element scanning |

### Blocked Domain Patterns

| Pattern | Reason |
|---|---|
| `/(^|\.)skool\.com$/i` | Has dedicated Skool Downloader extension |
| `/(^|\.)video\.skool\.com$/i` | Skool video subdomain |
| `/(^|\.)circle\.so$/i` | Has dedicated Circle Downloader extension |
| `/(^|\.)circle\.com$/i` | Circle alternate domain |
| `https://www.youtube.com/*` | Has dedicated YouTube Downloader extension |
| `https://*.youtube.com/*` | YouTube subdomains |
| `https://youtu.be/*` | YouTube short links |
| `https://kajabi.com/*` | Kajabi domains excluded from content script |
| `https://*.kajabi.com/*` | Kajabi subdomains |
| `https://*.mykajabi.com/*` | Kajabi custom domains |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Architecture** | Modular — `download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-task-registry.js`, `integration-helper.js` |
| **Max Concurrent Downloads** | 3 |
| **Panel ID** | `clientclub-download-manager` |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel, concurrent download queue |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-clientclub-video` |
| **Title** | "Download ClientClub Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | All URLs (gated by ClientClub detection) |

### Popup UI

| Property | Value |
|---|---|
| **Title** | Video Downloader for ClientClub |
| **Stylesheets** | `styles/styles.css` (9.7 KB), `styles/popup-enhanced.css` (11.0 KB) |
| **Script Load Order** | `site-config.js` -> `auth.js` (module) -> `popup-enhanced.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `popup-ui-overrides.js` -> `update-notifier.js` |
| **Sections** | Header with help button, Quick tips banner, Activation section, Boot splash/loading, Video info card, Password section, Quality selector, Download button, Progress bar |
| **Quick Tips** | "Open a ClientClub lesson or page with a video, press play on the video and then open this popup." |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/clientclub-downloader` |
| **Has Worktree?** | Yes — `clientclub-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `clientclub-downloader.zip` | 1.36 MB |
| Chrome | `clientclub-downloader-chrome.zip` | 1.29 MB |
| Chrome Store Sanitized | `clientclub-downloader-chrome-store-sanitized.zip` | 1.27 MB |
| Brave | `clientclub-downloader-brave.zip` | 1.29 MB |
| Edge | `clientclub-downloader-edge.zip` | 1.29 MB |
| Opera | `clientclub-downloader-opera.zip` | 1.29 MB |
| Whale | `clientclub-downloader-whale.zip` | 1.29 MB |
| Yandex | `clientclub-downloader-yandex.zip` | 1.29 MB |
| Firefox ZIP | `clientclub-downloader-firefox.zip` | 1.35 MB |
| Firefox XPI | `clientclub-downloader-firefox-unpacked.xpi` | 1.28 MB |

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
| **GH License ID** | `JDgGQZJ2U0Grs6br5XRn` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNlOW6v3RoQQ` |
| **Stripe Product Name** | Clientclub Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Clientclub Downloader] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6iDP7AOTRcvmOpHS4e4P`, `price_1SrVAQDP7AOTRcvmiWtH6pyJ` |

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
| `brandAccent` | `#0E55ED` | Primary action/CTA (blue) |
| `brandAccentHover` | `#205bd8ff` | Hover state (darker blue) |
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
