# Technical Info Matrix — M3U8 Downloader

## Extension: `m3u8-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for M3U8 |
| **Slug / ID** | `m3u8-downloader` |
| **Gecko ID** | `m3u8-downloader@serpapps.com` |
| **Category** | Video Downloader (Generic / Protocol-Level) |
| **Target Site(s)** | Any website — captures HLS (M3U8) and direct media streams from all HTTP/HTTPS pages |
| **Description** | Download videos from web sites or just collect them in your video list without downloading them. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/m3u8-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:25:55.629Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`m3u8-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/m3u8-downloader` |
| **Product Page** | https://serp.ly/m3u8-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Network interception (webRequest.onHeadersReceived) + HLS segment fetch/transmux in content script + offscreen HLS-to-MP4 pipeline |
| **Quality Selection** | Yes — auto-detects available streams by MIME type and extension from network traffic; popup quality selector with height-based labels |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — modular in-page download manager (`download-manager/`) with config, state, UI, and integration helper |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No — generic downloader does not inject player buttons |
| **Context Menu** | No — not implemented for generic downloader |
| **Auto-Save** | Yes — saves to browser Downloads folder |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — network interception via `webRequest.onHeadersReceived` monitors all `xmlhttprequest` and `media` responses for media MIME types and file extensions (m3u8, mp4, mov, m4v, webm, mpg, mp3, aac, m4s, ts, flv) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `webRequest`, `webNavigation`, `downloads`, `tabs`, `storage`, `offscreen`, `scripting`, `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `http://*/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `content.js` — injected on `https://*/*` and `http://*/*` at `document_start`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background.js` (non-module) |
| **Offscreen Document?** | Yes — `offscreen-hls.html` + `offscreen-hls.js` (HLS segment transmuxing via HLS2MP4 module) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/hls2mp4.mjs` (HLS2MP4) |
| **DASH→MP4** | Not included |
| **MP4Box** | Not included |
| **Reencoder** | Not included |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` for HLS segment caching during download |
| **Page Injection** | `page-bridge.js` — injected into MAIN world; proxies fetch requests through page context to retain cookies/auth |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | Not explicitly set in manifest |
| **Sandbox CSP** | Not explicitly set in manifest |
| **DNR Rules** | Dynamic — `declarativeNetRequest` rules generated at runtime to align Referer/Origin headers and relax CORS for HLS stream origins (offset at rule ID 50000) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | HLS manifest parsing, segment fetching with IndexedDB caching, media playlist resolution, content-side HLS download pipeline, page bridge communication |
| Service Worker | `background.js` | Network interception (webRequest), media detection by MIME/extension, HLS context tracking, download orchestration, offscreen management, auth gating, DNR rule management |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow, download progress tracking |
| Offscreen | `offscreen-hls.html` + `offscreen-hls.js` | HLS segment transmuxing via HLS2MP4 module, segment buffer coercion |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (5 files) | Modular in-page download progress panel with config, state management, UI rendering, and integration helper |
| Logger | `logger.js` | Structured logging with background mirroring |
| Site Config | `site-config.js` | Brand colors, auth endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Page Bridge | `page-bridge.js` | Page-context fetch proxy — injects into MAIN world to make requests with page cookies/session |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://*/*`, `http://*/*` (all sites) |
| **Detection Method** | `chrome.webRequest.onHeadersReceived` listener on `xmlhttprequest` and `media` request types |
| **Detected Extensions** | `m3u8`, `mp4`, `mov`, `m4v`, `webm`, `mpg`, `mp3`, `aac`, `m4s`, `ts`, `flv` |
| **MIME Detection** | Checks `Content-Type` response header for media type matches |
| **Minimum File Size** | 10 KB (ignores payloads under 10,240 bytes, except m3u8 and m4s streams) |
| **Forbidden Hostnames** | `youtube.com`, `tiktok.com`, `instagram.com`, `vk.com`, `dailymotion.com` |
| **Icon Highlight** | Sets highlight icon on tab when media is detected |
| **Title Sources** | `meta[property="og:title"]`, `meta[name="twitter:title"]`, `document.title`, LD+JSON `VideoObject.name` |
| **Thumbnail Sources** | `og:image`, `og:image:secure_url`, `twitter:image`, LD+JSON `VideoObject.thumbnailUrl`, largest `<img>` element |
| **Duration Sources** | `meta[property="video:duration"]`, `meta[itemprop="duration"]`, LD+JSON `VideoObject.duration` (ISO 8601) |
| **Generic Metadata** | Owner/uploader from LD+JSON `author.name` / `publisher.name`, width/height from `og:video:width` / `og:video:height` |

### HLS Processing Pipeline

| Parameter | Value |
|---|---|
| **Content-Side Pipeline** | Full HLS download in content script: manifest resolution → segment fetch → IndexedDB caching → hydration → batched transfer to offscreen for transmux |
| **Manifest Resolution** | Recursive: resolves master playlists to best-bandwidth variant, then parses media playlist for segments |
| **Best Variant Selection** | Highest bandwidth from `#EXT-X-STREAM-INF` entries |
| **Encrypted Streams** | Rejected — throws error if `#EXT-X-KEY` tag detected |
| **Segment Fetch Concurrency** | 2 parallel workers |
| **Segment Retry Count** | 6 attempts (content script), 3 attempts (background) |
| **Retry Backoff** | Exponential: 300ms * 2^attempt |
| **Fetch Timeout** | 15 seconds per request (AbortController) |
| **Bridge Fetch Timeout** | 60 seconds per page-bridge request |
| **IndexedDB Prefix** | `m3u8_segment_` + clientId or unique timestamp |
| **Batch Transfer Size** | 256 KB max per message, 40 segments max per batch |
| **Offscreen Transmuxer** | `HLS2MP4` from `modules/hls2mp4/hls2mp4.mjs` |
| **Keepalive Ports** | `VDP_HLS_KEEPALIVE` and `VDP_HLS_OFFSCREEN_KEEPALIVE` — prevent service worker suspension during transfers |
| **Progress Phases** | `init` → `manifest` → `fetch` → `verify` → `hydrate` → `transmux` → `complete` |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Architecture** | Modular — 5 separate files: `download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-manager.js`, `integration-helper.js` |
| **Position** | Configurable (`left` / `right` / `top` / `bottom`), default `right` |
| **Theme** | `dark` (default), `light`, `auto` |
| **Max Visible Downloads** | 5 (scrollable) |
| **Auto-Hide After Complete** | 8,000ms (8 seconds) |
| **Z-Index** | 2147483647 (max) |
| **Features** | Per-download progress bars, speed display, cancel buttons, cancel-all, clear-completed, cross-tab sync, collapse/expand |
| **CSS Prefix** | `dm` |
| **Linger After Complete** | 2,000ms |
| **Max Completed to Keep** | 3 |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (105 B), `styles/popup-enhanced.css` (10.1 KB) |
| **Additional Stylesheets** | `styles/base.css`, `styles/download.css`, `styles/quality.css`, `styles/video-card.css` |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` → `popup.js` (module) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Activation section, Loading spinner ("Detecting streams..."), Error state, Video info card (thumbnail, title, duration), Quality selector, Download button, Progress bar |

### Network Interception

| Feature | Implementation |
|---|---|
| **webRequest Listener** | `chrome.webRequest.onHeadersReceived` on `<all_urls>` for `xmlhttprequest` and `media` types |
| **onBeforeSendHeaders** | Monitors HLS manifest requests (`.m3u8`) — logs diagnostics and registers HLS context (Referer, Origin, tab, frame) |
| **HLS Context Tracking** | `HLS_CONTEXT_BY_ORIGIN` map — stores pageUrl, tabId, lastReferer, frameId per stream origin |
| **DNR CORS Rules** | Dynamically injects `declarativeNetRequest` rules to modify Referer/Origin headers for cross-origin HLS segment fetches |
| **DNR Rule Offset** | Rule IDs start at 50000 |
| **Vimeo Range Fix** | Strips `&range=` parameter from MP4 URLs containing it |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (custom) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/m3u8-downloader` |
| **Has Worktree?** | Yes — `.worktrees/m3u8-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `m3u8-downloader.zip` | 0.29 MB |
| Chrome | `m3u8-downloader-chrome.zip` | 0.28 MB |
| Chrome Store Sanitized | `m3u8-downloader-chrome-store-sanitized.zip` | 0.28 MB |
| Brave | `m3u8-downloader-brave.zip` | 0.28 MB |
| Edge | `m3u8-downloader-edge.zip` | 0.28 MB |
| Opera | `m3u8-downloader-opera.zip` | 0.28 MB |
| Whale | `m3u8-downloader-whale.zip` | 0.28 MB |
| Yandex | `m3u8-downloader-yandex.zip` | 0.28 MB |
| Firefox ZIP | `m3u8-downloader-firefox.zip` | 0.31 MB |
| Firefox XPI | `m3u8-downloader-firefox-unpacked.xpi` | 0.29 MB |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | <!-- TODO --> |
| **Site API Changed?** | N/A — generic protocol-level downloader, not site-specific |
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
| **Stripe Product ID** | `prod_TadNVdHcfAlMNB` |
| **Stripe Product Name** | M3u8 Downloader |
| **Stripe Monthly Price** | USD 9.00/month [m3u8-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6qDP7AOTRcvmUER2kNTE`, `price_1T6w12DP7AOTRcvmRuKMNEat` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |
| **Console Relay** | Yes — popup installs console relay (`installConsoleRelay`) forwarding console calls to background via `TELEMETRY_LOG` messages |
| **Network Relay** | Yes — popup installs network relay (`installNetworkRelay`) forwarding fetch responses to background |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 32px | 32x32 | `icons/icon32.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 64px | 64x64 | `icons/icon64.png` |
| Default 96px | 96x96 | `icons/icon96.png` |
| Default 128px | 128x128 | `icons/icon128.png` |
| Highlight 16px | 16x16 | `icons/icon-highlight16.png` |
| Highlight 32px | 32x32 | `icons/icon-highlight32.png` |
| Highlight 48px | 48x48 | `icons/icon-highlight48.png` |
| Highlight 64px | 64x64 | `icons/icon-highlight64.png` |
| Highlight 96px | 96x96 | `icons/icon-highlight96.png` |
| Highlight 128px | 128x128 | `icons/icon-highlight128.png` |

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
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (HLS2MP4) |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
