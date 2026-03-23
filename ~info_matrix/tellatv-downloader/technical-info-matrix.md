# Technical Info Matrix — TellaTV Downloader

## Extension: `tellatv-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP TellaTV Downloader |
| **Slug / ID** | `tellatv-downloader` |
| **Gecko ID** | `tellatv-downloader@serpapps.com` |
| **Category** | Video Downloader (Professional / Screen Recording) |
| **Target Site(s)** | tella.tv and subdomains |
| **Description** | Download videos from Tella.tv |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/tellatv-downloader` |
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
| **Store-Sanitized Build?** | Yes (`tellatv-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/tellatv-downloader` |
| **Product Page** | https://serp.ly/tellatv-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (signed m3u8 manifest from `prod-stream.tella.tv` -> segment download -> MP4 transmux) |
| **Quality Selection** | Yes — parsed from HLS manifest renditions |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Overlay Button?** | Yes — `tella-detector.js` injects a "Download" overlay button on detected `<video>` / player elements |
| **Context Menu** | No |
| **Auto-Save** | No — uses `saveAs: true` (save-as dialog) |
| **Desktop Notifications** | Yes — "Download completed" notifications |
| **Video Detection** | Automatic — signed HLS manifests from `prod-stream.tella.tv`, Performance API resource entries, iframe embed detection, HTML regex scan |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.tella.tv/*`, `https://*.tella.tv/*`, `https://prod-stream.tella.tv/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on `tella.tv` at `document_idle` |
| **Content Script CSS** | `styles/overlay-buttons.css` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS segment transmuxing via `SimpleHLS2MP4Converter`) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | None — uses modular detectors via dynamic `import()` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Tella streaming CDN (`prod-stream.tella.tv`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Modular video detection coordinator, download control events, dynamic detector loading |
| Video Detector | `detectors/video-detector.js` | Tella-only detection coordinator — delegates to `tella-detector.js` |
| Tella Detector | `detectors/tella-detector.js` | Detects signed HLS manifests, iframe embeds, story URLs; builds overlay download buttons |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, download state persistence |
| Tella Handler | `handlers/tella-handler.js` | Tella-specific download logic: manifest resolution, signed URL refresh, expiry management, story-based warmup |
| Skool Handler | `handlers/skool-handler.js` | Base handler providing HLS segment download pipeline (inherited by TellaHandler) |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, video info card, quality selector, auth flow |
| Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | FastStream-based HLS segment transmuxing to MP4 |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/*.js` | In-page download progress panel (config, state, UI, task registry, integration helper) |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.tella.tv/*`, `https://*.tella.tv/*` |
| **Domain Detection** | `/(^|\.)tella\.tv$/i` regex on `window.location.hostname` |
| **Manifest URL Pattern** | `https://prod-stream.tella.tv/media/manifest.m3u8` and `https://prod-stream.tella.tv/media/rendition.m3u8` |
| **Signed URL Parameters** | `Policy`, `Signature`, `Key-Pair-Id`, `Expires`, `story_id`, `media_type` |
| **Story ID Sources** | URL `story_id` query parameter, URL path `/video/{storyId}`, manifest URL parameters |
| **Title Sources** | `h1`, `[role="dialog"] main h2`, `dialog main h2`, `meta[property="og:title"]`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]`, `<video poster>` |
| **Duration Sources** | `<video>` element `.duration` property |
| **Manifest Sources** | A) Performance API resource timing entries, B) HTML regex scan for `prod-stream.tella.tv` URLs, C) `<iframe>` src/data-src attributes, D) Frame scan across all frames |
| **Embed Detection** | `https://(?:www\.)?tella\.tv/video/[^/?#]+(?:/embed)?` pattern in iframes, HTML, and current URL |
| **Manifest Ranking** | `/manifest.m3u8` (+50) > `/rendition.m3u8` (+30); video media_type (+15); audio media_type (-25); signed params (+20); freshness bonus (up to +40); near-expiry penalty (-200) |
| **Manifest Expiry Check** | Parses `Expires` parameter or decodes AWS CloudFront `Policy` base64 for `AWS:EpochTime`, 30-second skew |

### Tella-Specific Download Pipeline

| Feature | Implementation |
|---|---|
| **Handler Class** | `TellaHandler extends SkoolHandler` |
| **Manifest Resolution** | Multi-pass: 1) stored `detectedVideo`, 2) top-frame query, 3) all-frames scan, 4) warmup + playback refresh, 5) page HTML fetch, 6) detached background tab view |
| **Warmup Playback** | Programmatic play button click + `video.play()` on muted videos, 1.6s wait, then pause |
| **Play Button Selectors** | `button[aria-label*='Play']`, `button[title*='Play']`, `[data-testid*='play']`, `.vjs-big-play-button`, `.plyr__control--overlaid`, `.mejs__overlay-button`, `.play-button` |
| **Manifest Refresh** | Opens background tab to `tella.tv/video/{storyId}/view`, waits for load, re-scans for fresh manifests |
| **403 Retry** | On HTTP 403 or proxy fetch failure, performs one warmup retry with fresh manifest acquisition |
| **Story View Fallback** | `acquireFreshManifestFromStoryView()` — creates detached tab, waits for complete, merges refreshed info |
| **Segment Download** | Delegates to `SkoolHandler.downloadSegmentsDirect()` — direct segment fetch or proxy-based fallback |
| **Max Concurrent Downloads** | 3 (via `DownloadTaskRegistry`) |

### Overlay Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `media-theme`, `hls-video`, `[class*='player']`, `[data-testid*='player']`, closest `<video>` parent |
| **Button Text** | "Download" |
| **Button Color** | `#1f55c6` (blue), hover `#2a6ef5` |
| **Button Position** | Absolute, top-right (8px offset) |
| **Z-Index** | 2147483647 |
| **Attachment** | Appended to shadow root or host element, with `data-skool-dl-btn` and `data-platform="tella"` attributes |
| **MutationObserver** | Watches for new `<video>` and `<iframe[src*='tella.tv']>` insertions to auto-attach buttons |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Right side (configurable) |
| **Theme** | Dark |
| **Max Visible Downloads** | 5 (scrollable) |
| **Auto-Hide After Complete** | 8000ms |
| **Z-Index** | 2147483647 |
| **Cross-Tab Sync** | Yes |
| **Linger After Complete** | 2000ms |
| **Features** | Cancel/cancel-all, clear completed, collapse, per-download progress, speed display |

### Popup UI

| Property | Value |
|---|---|
| **Title** | Video Downloader for TellaTV |
| **Stylesheets** | `styles/styles.css` (9.9 KB), `styles/popup-enhanced.css` (14.4 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header with help button, Quick tips banner, Activation section (email + license key), Boot splash/loading, Trial banner, Video info card (thumbnail, title, owner, quality), Password section (hidden), Quality selector, Download button with SVG icon, Error state, URL copy section with yt-dlp commands |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/tellatv-downloader` |
| **Has Worktree?** | Yes — `.worktrees/tellatv-downloader/` |

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
| **GH License ID** | `7cuJJyrNGcAreLmXPA8E` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_U56DtcrP8a9q2a` |
| **Stripe Product Name** | TellaTV Downloader |
| **Stripe Monthly Price** | USD 9.00/month [tellatv-downloader-monthly-9] |
| **Stripe One-Time Price** | None |
| **Stripe Price IDs** | `price_1T6w0kDP7AOTRcvm549Saa2i` |

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
| `brandAccent` | `#506CF0` | Primary action/CTA (indigo blue) |
| `brandAccentHover` | `#162DAD` | Hover state (darker indigo) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |

### Web Accessible Resources

| Resource Group | Files | Match Pattern |
|---|---|---|
| Download Manager & Detectors | `download-manager/integration-helper.js`, `download-manager/download-manager.js`, `download-manager/download-manager-config.js`, `download-manager/download-manager-state.js`, `download-manager/download-manager-ui.js`, `detectors/video-detector.js`, `detectors/tella-detector.js` | `https://www.tella.tv/*`, `https://*.tella.tv/*` |
| Offscreen & IndexedDB | `offscreen-faststream.html`, `offscreen-faststream-legacy.js`, `indexed-db.js` | `*://*/*` |
