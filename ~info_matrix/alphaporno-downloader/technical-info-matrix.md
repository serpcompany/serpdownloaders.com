# Technical Info Matrix — AlphaPorno Downloader

## Extension: `alphaporno-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP AlphaPorno Downloader |
| **Slug / ID** | `alphaporno-downloader` |
| **Gecko ID** | `alphaporno-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | alphaporno.com (regex: `/^https?:\/\/(www\.)?alphaporno\.com\//`) |
| **Description** | Download AlphaPorno videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/alphaporno-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T16:59:43.815Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`alphaporno-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/alpha-porno-downloader` |
| **Product Page** | https://serp.ly/alpha-porno-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming download) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — auto-parsed from URL patterns (360p, 480p, 720p, 1080p). Format: "720p - MP4" or "Unknown - HLS" |
| **Auth Required?** | OTP (email verification via auth.serp.co) + License key (Gumroad / GoHighLevel) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` injected into `#fluid_video_wrapper_bravoplayer` |
| **Context Menu** | Yes — right-click download option |
| **Auto-Save** | Yes — saves to `Downloads/AlphaPorno/` folder, no save-as dialog |
| **Video Detection** | Automatic — scans script variables, `<video>`/`<source>` tags, og:video meta tags |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `declarativeNetRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.alphaporno.com/*`, `https://*.alphaporno.com/*`, `https://*.ahcdn.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `alphaporno.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` (codec library, minified dist bundles) |
| **HLS Library** | `modules/hls.mjs` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/` (MP4Generator, transmuxer) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (317 KB — ISOBMFF manipulation) |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` (web-accessible, injected into page context) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), GoHighLevel license worker |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` (extension pages) |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### DNR (Declarative Net Request) Rules

| Rule ID | Target | Action |
|---|---|---|
| 1001 | `ahcdn.com/*` | Set Referer to `alphaporno.com`, Allow CORS |
| 1002 | `alphaporno.com/get_file/` | Set Referer to `alphaporno.com`, Allow CORS |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, URL extraction, HLS parsing, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, DNR, message routing |
| Popup | `popup.html` + `popup.js` | User-facing UI (400px wide), quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context script for cross-origin access |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Page Match** | `/^https?:\/\/(www\.)?alphaporno\.com\//` |
| **Video ID** | From URL slug, meta tags (`video:id`, `identifier`), or script variables |
| **Title** | `og:title`, `meta[name="description"]`, `<h1>` elements |
| **Thumbnail** | `og:image`, `meta[itemprop="thumbnailUrl"]` |
| **Duration** | ISO 8601 (`PT#H#M#S`) + integer seconds |
| **URL Sources** | Script variables, `<video>` tags, `<source>` tags, `og:video` meta |
| **URL Regex** | `/(video_url\|videoUrl\|file\|file_url\|fileUrl\|src\|url)\s*[:=]\s*["']([^"']+(?:\.mp4\|\.m3u8)[^"']*)["']/gi` |
| **Filtered URLs** | Rejects: `timelines.php`, `sprite`, `vtt=`, `thumbnail`, `thumb`, `preview` |
| **Quality Parse** | Regex: `/_(\d{3,4})p\.\|\/(\d{3,4})p(?:\/\|[?#]\|$)/` |

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Backoff Strategy** | Exponential (500, 1000, 2000ms) + random jitter |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (unlimited) |
| **Referer Fallback** | `https://alphaporno.com/` |
| **Output Type** | `video/mp4` |

### MP4 Download Mechanism

| Aspect | Details |
|---|---|
| **Method** | Offscreen document with ReadableStream + Blob API |
| **Request Headers** | Referer, User-Agent, Accept (`video/*` prioritized), Origin |
| **Referrer Policy** | `no-referrer-when-downgrade` |
| **Progress** | Per-byte updates sent to content script |
| **Download Folder** | `AlphaPorno/` |
| **Save As Dialog** | Disabled (auto-save) |

### Message Handlers

| Action | Purpose |
|---|---|
| `getVideoInfo` | Fetch video metadata from content script |
| `getVideoCandidates` | Scan page for all video URLs |
| `downloadVideo` | Initiate download |
| `getVideoFormats` | Parse quality options |
| `mp4Progress` / `mp4Complete` / `mp4Error` | MP4 download lifecycle |
| `hlsProgress` / `hlsComplete` / `hlsError` | HLS download lifecycle |
| `PROCESS_HLS_SEGMENTS` | Offscreen: download HLS segments |
| `PROCESS_MP4_DOWNLOAD` | Offscreen: stream MP4 download |
| `CANCEL_HLS_PROCESSING` | Abort HLS (AbortController) |
| `CANCEL_MP4_DOWNLOAD` | Abort MP4 (AbortController) |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Build Size (Standard ZIP)** | 1.21 MB |
| **Build Size (Chrome)** | 1.13 MB |
| **Build Size (Firefox XPI)** | 1.13 MB |
| **Build Size (Firefox ZIP)** | 1.13 MB |
| **Build Size (Chrome Store Sanitized)** | 1.13 MB |
| **Watermarked?** | Yes (hardened build pipeline) |
| **GitHub Release?** | Yes — `serpapps/alpha-porno-downloader` |
| **Has Worktree?** | Yes — `.worktrees/alphaporno-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `alphaporno-downloader.zip` | 1.21 MB |
| Chrome | `alphaporno-downloader-chrome.zip` | 1.13 MB |
| Chrome Store Sanitized | `alphaporno-downloader-chrome-store-sanitized.zip` | 1.13 MB |
| Brave | `alphaporno-downloader-brave.zip` | 1.13 MB |
| Edge | `alphaporno-downloader-edge.zip` | 1.13 MB |
| Opera | `alphaporno-downloader-opera.zip` | 1.13 MB |
| Whale | `alphaporno-downloader-whale.zip` | 1.13 MB |
| Yandex | `alphaporno-downloader-yandex.zip` | 1.13 MB |
| Firefox ZIP | `alphaporno-downloader-firefox.zip` | 1.13 MB |
| Firefox XPI | `alphaporno-downloader-firefox-unpacked.xpi` | 1.13 MB |

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
| **GH License ID** | `XmQbFfafEcr3XJTKFFwd` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadN0hCPtjjwG7` |
| **Stripe Product Name** | Alpha Porno Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [alpha-porno-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6fDP7AOTRcvmfxMHMZ2L`, `price_1SymsoDP7AOTRcvmXXxlsyc2` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` (most verbose) |
| **Mirror to Background** | Yes |
| **Telemetry** | Auth errors sent to `auth.serp.co/telemetry/auth` |

### Icons

| Icon | Size | File Size |
|---|---|---|
| Default 16px | 16x16 | 348 B |
| Default 32px | 32x32 | 572 B |
| Default 48px | 48x48 | 845 B |
| Default 128px | 128x128 | 2.3 KB |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#c41c00` | Primary action/CTA (crimson red) |
| `brandAccentHover` | `#a31500` | Hover state (darker red) |
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

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right corner (slides in from right) |
| **Background** | Dark theme (`#1b1b1b` border, `#2a2a2a` content) |
| **Accent Border** | 2px solid `#c41c00` |
| **Header Gradient** | 135deg from `#c41c00` to `#a31500` |
| **Progress Bar** | Gradient fill: `#c41c00` to `#a31500` |
| **Max Height** | 80vh (scrollable) |
| **Card Width** | 380px |
| **Auto-Hide** | 3 seconds after completion |
| **Minimize/Restore** | Toggle button |

### Popup UI

| Property | Value |
|---|---|
| **Container Width** | 400px |
| **Min Height** | 200px |
| **Padding** | 16px |
| **Video Thumbnail** | Displayed with duration badge |
| **Quality Selector** | Dropdown (e.g. "720p - MP4") |
| **Download Button** | Primary CTA with SVG icon |
| **Progress Display** | Indeterminate spinner → Progress bar (0-100%) |
| **Error Display** | Red error message + Refresh button |
| **Trial Banner** | "N downloads left" + Upgrade link |
| **Help System** | Quick help banner (6 sec auto-hide) + Help icon |
| **Boot Splash Timeout** | 2.5 seconds (forced hide) |
| **Auth Init Wait** | 5 seconds max |

### Modules Included

| Module | File | Size | Purpose |
|---|---|---|---|
| HLS Parser | `hls.mjs` | ~407 KB | M3U8 playlist parsing |
| HLS→MP4 | `hls2mp4/` | Multiple files | HLS segment transmuxing |
| DASH→MP4 | `dash2mp4/` | Multiple files | DASH stream conversion |
| MediaBunny | `mediabunny/` | Minified bundles | Audio/video codec handling |
| MP4Box | `mp4box.mjs` | 317 KB | ISOBMFF manipulation |
| FSBlob | `FSBlob.mjs` | ~4 KB | Virtual filesystem blob ops |
| EventEmitter | `eventemitter.mjs` | ~3.5 KB | Event dispatch |
| Localize | `Localize.mjs` | — | i18n support |

### Key Differences from 123Movies Downloader

| Aspect | 123Movies | AlphaPorno |
|---|---|---|
| **Host Permissions** | Broad (`https://*/*`, `http://*/*`) | Scoped (`alphaporno.com`, `ahcdn.com`) |
| **Content Script Scope** | All URLs, all frames | AlphaPorno only, `document_idle` |
| **Service Worker** | `background.js` (non-module) | `background-enhanced.js` (ES module) |
| **Content Script Stack** | 3 files (config, logger, content) | 5 files (+ download-manager, player-button) |
| **In-Page Player Button** | No | Yes (`player-button.js`) |
| **Context Menu** | No | Yes |
| **Download Folder** | Default | `AlphaPorno/` subfolder |
| **DNR Rules** | None | 2 rules (ahcdn.com CORS, get_file referer) |
| **Modules** | HLS only | Full suite (HLS, DASH, MediaBunny, MP4Box) |
| **Build Size** | ~300 KB | ~1.1 MB |
| **License Integration** | None (empty Gumroad/GH IDs) | Gumroad (`test-key`) + GH License (`XmQbFfafEcr3XJTKFFwd`) |
| **Brand Color** | Green (`#8dca5e`) | Crimson red (`#c41c00`) |
