# Technical Info Matrix — Loom Downloader

## Extension: `loom-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Loom |
| **Slug / ID** | `loom-downloader` |
| **Gecko ID** | `loom-downloader@serpapps.com` |
| **Category** | Video Downloader (Professional / Business) |
| **Target Site(s)** | loom.com and subdomains, loomcdn.com, CloudFront CDN |
| **Description** | Download Loom videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/loom-downloader` |
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
| **Store-Sanitized Build?** | Yes (`loom-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/loom-video-downloader` |
| **Product Page** | https://serp.ly/loom-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment-to-MP4 transmux) + DASH Stitching (MPD segment merge) |
| **Quality Selection** | Yes — parsed from HLS master manifest variant resolution and DASH adaptation set representations |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | Free trial downloads after sign-in (server-managed via auth.serp.co) |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/inline-manager.js`) with cross-tab sync |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Overlay Button?** | Yes — overlay download button on video containers and embed iframes |
| **Library Card Button?** | Yes — download button on Loom library cards/thumbnails |
| **Context Menu** | No |
| **Auto-Save** | No — uses `saveAs: true` (save-as dialog presented to user) |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — Loom share URLs, embed iframes, video elements with `data-loom-video-id`, Loom links, script tag references |
| **Password-Protected Videos** | Yes — prompts for password, passes to GraphQL and URL APIs |
| **Embed Detection** | Yes — detects Loom embeds on any website via `<all_urls>` content scripts |
| **Multiple Video Selection** | Yes — popup shows video selection when multiple Loom embeds are detected |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `webNavigation` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://*.cloudfront.net/*`, `https://api.gumroad.com/*` |
| **Content Scripts** | Two injection groups: (1) `site-config.js` + `logger.js` + `download-manager/inline-manager.js` on `<all_urls>` at `document_idle`, `all_frames: false`; (2) `site-config.js` + `logger.js` + `content-enhanced.js` on `<all_urls>` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS segment transmuxing + DASH segment merging) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS-to-MP4 Transmuxer** | `modules/hls2mp4/` |
| **DASH-to-MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (318 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching (`indexed-db.js`) |
| **Page Injection** | None — video detection handled by content script and background GraphQL/API calls |
| **External APIs Called** | Loom GraphQL API (`www.loom.com/graphql`), Loom URL APIs (`www.loom.com/api/campaigns/sessions/{id}/raw-url`, `transcoded-url`), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | Loom video detection, embed discovery, overlay/card button injection, cross-tab download state sync |
| Inline Download Manager | `download-manager/inline-manager.js` | In-page download progress panel with state, UI, and cross-tab sync |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, GraphQL/URL API calls, HLS/DASH processing, offscreen management, download queue |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, video info card, quality selector, password entry, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS segment transmuxing + DASH segment merging |
| Auth | `auth.js` + `auth-ui.js` + `auth/` modules | OTP login, entitlement checks, trial management |
| Download Manager Config | `download-manager/download-manager-config.js` | Configuration for in-page download manager styles and behavior |
| Download Manager State | `download-manager/download-manager-state.js` | State management for download entries |
| Download Manager UI | `download-manager/download-manager-ui.js` | UI rendering for download manager panel |
| Download Task Registry | `download-manager/download-task-registry.js` | Centralized queue and registry for concurrent downloads |
| Integration Helper | `download-manager/integration-helper.js` | Bridge between download manager and extension messaging |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `<all_urls>` (detects Loom videos and embeds on any website) |
| **Video ID Patterns** | `loom.com/share/([a-f0-9]{32})`, `loom.com/embed/([a-f0-9]{32})`, `video[data-loom-video-id]` attribute (32-char hex IDs) |
| **Title Sources** | `document.title` (with ` - Loom` suffix stripped), `iframe.title`, `iframe[aria-label]`, `video[title]`, `video[aria-label]`, `link.textContent`, GraphQL `metadata.name` |
| **Metadata Sources** | GraphQL API: `owner.display_name`, `video_properties.width`, `video_properties.height`, `video_properties.duration`, `description`, `is_protected`, `needs_password`, `download_enabled`, `privacy`, `createdAt` |
| **Thumbnail Sources** | Popup video info card (thumbnail from Loom page or placeholder) |
| **Duration Sources** | GraphQL `video_properties.duration`, HLS manifest parsing (post-download) |
| **Embed Detection Sources** | A) `iframe[src*="loom.com/embed/"]` (highest priority), B) `video[data-loom-video-id]`, C) `video[id*="Loom"]` / `video[class*="loom"]`, D) `a[href*="loom.com/share/"]` links, E) Script tag content matching `loom.com/(embed|share)/([a-f0-9]{32})` |
| **Download URL Sources** | Loom URL API `raw-url` endpoint (primary), `transcoded-url` endpoint (fallback) |

### Loom API Integration

| API | Endpoint | Purpose |
|---|---|---|
| **GraphQL API** | `POST https://www.loom.com/graphql` | Video metadata extraction (`GetVideoSSR` query) — title, owner, dimensions, duration, password check |
| **Raw URL API** | `POST https://www.loom.com/api/campaigns/sessions/{videoId}/raw-url` | Retrieves raw download URL (HLS/DASH/MP4) |
| **Transcoded URL API** | `POST https://www.loom.com/api/campaigns/sessions/{videoId}/transcoded-url` | Retrieves transcoded download URL (fallback) |

#### GraphQL Headers

| Header | Value |
|---|---|
| `x-loom-request-source` | `loom_web_{APOLLO_GRAPHQL_VERSION}` |
| `apollographql-client-name` | `web` |
| `apollographql-client-version` | `743c46d` |
| `Referer` | `https://www.loom.com/` |
| `Origin` | `https://www.loom.com` |
| `User-Agent` | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36` |

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Manifest Handling** | Master M3U8 parsed for variant streams, audio/video playlists resolved separately |
| **Split URL Fix** | `-split.m3u8` URLs automatically converted to `.m3u8` |
| **Segment Download** | Memory-optimized with incremental processing and IndexedDB caching |
| **Separate A/V** | Yes — audio and video segments downloaded and merged independently |

### DASH Processing Specs

| Parameter | Value |
|---|---|
| **Manifest Parsing** | Regex-based XML parser for MPD manifests |
| **Representation Selection** | Highest bandwidth video representation, first audio representation |
| **Segment Extraction** | SegmentTemplate with SegmentTimeline support (`$Number$` substitution) |
| **Segment Download** | Memory-optimized with incremental processing |
| **Merge** | Offscreen document handles `MERGE_DASH_SEGMENTS` processing |

### Download Queue System

| Setting | Value |
|---|---|
| **Max Concurrent Downloads** | 3 |
| **Queue System** | `DownloadTaskRegistry` with centralized queue/registry |
| **Cancellation** | Per-download cancellation via `AbortController`, cancel-all support |
| **State Persistence** | `chrome.storage.local` with `downloadManagerGlobalState` key |
| **Stale Entry Cleanup** | Automatic pruning of stale entries |
| **Complete Linger** | 2,500ms before auto-removal of completed entries |

### Overlay Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.video-container`, `[data-testid='video-container']`, `.loom-video-container`, `.loom-player-container`, `.loomVideoPlayer`, `[data-loom-player]`, `iframe[src*='loom.com/embed/']` parent containers |
| **Button Text** | "Download" |
| **Button Title** | "Download this Loom video" |
| **Position** | Absolute, top: 12px, right: 12px |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Library Card Button Config

| Setting | Value |
|---|---|
| **Button Class** | `loom-download-card-button` |
| **Shape** | Circular (40x40px, border-radius: 9999px) |
| **Position** | Absolute, bottom: 12px, right: 12px |
| **Icon** | SVG download arrow (18x18px) |
| **Z-Index** | 2147483646 |
| **URL Resolution** | `data-videoid` attribute, `data-share-url`, `video[data-loom-video-id]`, video `src` regex |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (transform slide-in animation) |
| **Panel ID** | `loom-download-manager` |
| **Card Width** | 380px (responsive: min(innerWidth-40, 340) on small screens) |
| **Max Height** | min(innerHeight-80, 500)px (scrollable) |
| **Z-Index** | 2147483647 |
| **Border** | 2px solid #625df5 |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif |
| **Auto-Remove** | 2,500ms after completion |
| **Features** | Collapse/close buttons, per-download progress bars, speed display, cancel individual, cancel all, clear completed, cross-tab state sync |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (18.1 KB), `styles/popup-enhanced.css` (14.9 KB) |
| **Script Load Order** | `site-config.js` + `logger.js` (in head) -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Help text display, Header, Boot splash, Activation section (email + license key), Video selection (multiple embeds), Embed detected notice, Password section, Status, Video info card (thumbnail, title, owner, quality, duration, description), Quality selector, Download button, Progress bar with cancel, Error state |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/loom-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/loom-downloader/` |

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
| **Pricing Model** | Freemium (free trial downloads after sign-in, then paid license) |
| **Gumroad Product ID** | `OHxjL9F6j-RfWU-DNCNGOg==` |
| **GH License ID** | `ZfdcQd6QzSQwXQ7QI4ko` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNiuFMNjbBoM` |
| **Stripe Product Name** | Loom Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [loom-video-downloader $9/mo 2026-02-09] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6pDP7AOTRcvmC4iRmMQV`, `price_1SyyoYDP7AOTRcvm5DzNEthp` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Global Log Level Variable** | `LOOM_LOG_LEVEL` |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#625df5` | Primary action/CTA (Loom purple) |
| `brandAccentHover` | `#5144d8` | Hover state (darker purple) |
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

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS-to-MP4 | `modules/hls2mp4/` | HLS segment transmuxing |
| DASH-to-MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (318 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.5 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.6 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
