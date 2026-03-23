# Technical Info Matrix — YouTube Downloader

## Extension: `youtube-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for YouTube |
| **Slug / ID** | `youtube-downloader` |
| **Gecko ID** | `youtube-downloader@serpapps.com` |
| **Category** | Video Downloader |
| **Target Site(s)** | youtube.com, youtu.be, and subdomains; embedded YouTube iframes/links on any site |
| **Description** | Download YouTube videos with advanced quality selection, queue management, and built-in licensing support. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/youtube-downloader` |
| **Last Updated** | 2026-03-06 |
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
| **Store-Sanitized Build?** | Yes (`youtube-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/youtube-downloader` |
| **Product Page** | https://serp.ly/youtube-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Progressive MP4 (range-fetch via background), HLS Stitching (m3u8 segment merge), SABR/UMP streaming pipeline, Separate A/V mux (offscreen FastStream) |
| **Quality Selection** | Yes — parsed from YouTube InnerTube API streamingData (formats + adaptiveFormats), multiple client extraction (WEB, WEB_EMBEDDED, Android, iOS, MWEB, TV_EMBEDDED) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — modular in-page download manager (`download-manager/`) with cross-tab sync |
| **Live Stream Support?** | HLS manifest extraction (live streams with HLS manifests) |
| **VR Support?** | No |
| **Bulk Download?** | No (queue up to 3 concurrent downloads) |
| **In-Page Player Button?** | Yes — injected into `#player-container`, `#movie_player`, `.html5-video-player`, `ytd-player` on youtube.com |
| **Embed Detection?** | Yes — `content-embed-injector.js` + `detectors/youtube-detector.js` for YouTube iframes/links on third-party sites |
| **Context Menu** | No |
| **Auto-Save** | No — uses `saveAs: true` (browser save-as dialog) |
| **Desktop Notifications** | No (completion notification logged to console) |
| **Video Detection** | Automatic — YouTube InnerTube API extraction, watch page `ytInitialPlayerResponse`, iframe embed scanning, link scanning, script tag scanning, MutationObserver for SPA navigation |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://*.ytimg.com/*`, `https://*.googleusercontent.com/*`, `https://api.gumroad.com/*`, `https://ghl-check-license-worker-v2.farleythecoder.workers.dev/*`, `http://*/*`, `https://*/*` |
| **Content Scripts (YouTube)** | `site-config.js` -> `logger.js` -> `content-youtube.js` — injected on `youtube.com`, `*.youtube.com`, `m.youtube.com`, `youtu.be` at `document_idle` |
| **Content Scripts (Embeds)** | `content-embed-injector.js` — injected on all URLs except YouTube domains at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen-faststream-legacy.js` (HLS/fMP4 segment merging, A/V muxing) |
| **Offscreen FastStream?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (same file, dual HTML entry) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Client Module** | `modules/youtube/` (client.js, signature.js, sabr.js, ump.js, media-assembler.js, utils.js, constants.js) |
| **IndexedDB** | Yes — `YouTubeDownloaderDB` / `fileStore` for segment caching during A/V mux |
| **Page Injection** | None — no inject.js; video detection via InnerTube API from background and content script detectors |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), YouTube InnerTube API (`www.youtube.com/youtubei/v1/player`), YouTube oEmbed API, Gumroad License API (`api.gumroad.com`), License Check Worker (`ghl-check-license-worker-v2.farleythecoder.workers.dev`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |
| **DNR Rules** | None configured |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script (YouTube) | `content-youtube.js` | In-player download button injection, video detection via detectors, download manager UI, SPA navigation monitoring |
| Content Script (Embeds) | `content-embed-injector.js` | Lightweight injector for YouTube embeds/links on third-party pages |
| YouTube Detector | `detectors/youtube-detector.js` | Extracts YouTube video ID from iframes, links, scripts; attaches download buttons on non-YouTube pages |
| Video Detector | `detectors/video-detector.js` | Coordinator module wrapping youtube-detector; provides detectVideo/detectAllVideos API |
| YouTube Handler | `handlers/youtube-handler.js` | YouTube download orchestration: progressive fetch, HLS fallback, SABR/UMP pipeline, A/V mux |
| Service Worker | `background-enhanced.js` (module) | Download queue management, auth gating, offscreen management, message routing, persistent download state |
| Download Task Registry | `download-manager/download-task-registry.js` | Background-side queue state, active task tracking, chrome.downloads bookkeeping |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, yt-dlp command copy, auth flow |
| Offscreen (FastStream) | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | HLS/fMP4 segment merging, separate A/V muxing |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (6 files) | Modular in-page download manager with state, UI, config, cross-tab sync |
| Logger | `logger.js` | Structured logging with `YTDL` prefix, level control, console patching |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks, update banner |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| YouTube Client | `modules/youtube/client.js` | InnerTube API extraction, multi-client format discovery, signature decryption |
| YouTube Signature | `modules/youtube/signature.js` | YouTube cipher/n-parameter decryption |
| SABR Download | `modules/youtube/sabr.js` | Server ABR streaming pipeline (UMP protocol) |
| UMP Parser | `modules/youtube/ump.js` | Universal Media Protocol parser |
| Media Assembler | `modules/youtube/media-assembler.js` | Assembles raw SABR segments into playable media files |
| YouTube Utils | `modules/youtube/utils.js` | Video ID extraction, filename sanitization, URL cleaning |
| YouTube Constants | `modules/youtube/constants.js` | InnerTube client configs, API endpoints, user agents |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://m.youtube.com/*`, `https://youtu.be/*` |
| **Video ID Patterns** | `youtube.com/watch?v=([a-zA-Z0-9_-]{11})`, `youtu.be/([a-zA-Z0-9_-]{11})`, `youtube.com/embed/([a-zA-Z0-9_-]{11})`, `youtube.com/shorts/([a-zA-Z0-9_-]{11})`, `m.youtube.com/watch?v=([a-zA-Z0-9_-]{11})`, `youtube-nocookie.com/embed/([a-zA-Z0-9_-]{11})` |
| **Title Sources** | `document.title` (minus " - YouTube"), InnerTube `videoDetails.title`, oEmbed API `title` |
| **Thumbnail Sources** | `https://img.youtube.com/vi/{id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/{id}/maxresdefault.jpg`, oEmbed thumbnail |
| **Duration Sources** | InnerTube `videoDetails.lengthSeconds`, `streamingData` |
| **Extra Metadata** | Author/Channel (oEmbed `author_name`, `videoDetails.author`), Width, Height, View Count |
| **Format Sources** | A) Watch page `ytInitialPlayerResponse.streamingData`, B) InnerTube `/youtubei/v1/player` API (WEB, WEB_EMBEDDED, Android, iOS, MWEB, TV_EMBEDDED clients), C) HLS manifest URL, D) SABR streaming URL |
| **Embed Detection** | iframe `src*="youtube.com/embed"`, `youtube-nocookie.com/embed`, `youtu.be`; links `href*="youtube.com/watch"`, `youtu.be/`; script tag content scanning |
| **InnerTube Clients** | WEB, WEB_EMBEDDED_PLAYER, ANDROID, IOS, MWEB, TVHTML5_SIMPLY_EMBEDDED_PLAYER |

### Format Object Structure

```json
{
  "itag": "number",
  "url": "string",
  "mimeType": "string (e.g., video/mp4; codecs=\"avc1.42001E, mp4a.40.2\")",
  "container": "mp4 | webm | m4a | 3gp",
  "qualityLabel": "string (e.g., 1080p, 720p, 360p)",
  "width": "number | null",
  "height": "number | null",
  "fps": "number | null",
  "bitrate": "number | null",
  "hasVideo": "boolean",
  "hasAudio": "boolean",
  "contentLength": "number | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | Custom HLS handler in `youtube-handler.js` + `SimpleHLS2MP4Converter` for offscreen |
| **Concurrent Segment Downloads** | 6 |
| **Max Segment Retries** | 3 |
| **N-Parameter Transformation** | Yes — `YouTubeSignatureDecryptor.decryptNParam()` applied to each segment URL |
| **Offscreen Merge Timeout** | 300,000ms (5 minutes) |
| **Stream Formats** | `hls_fmp4` (fMP4 segments with EXT-X-MAP) or `hls_ts` (MPEG-TS segments) |
| **Origin Header** | `https://www.youtube.com` |
| **Referer Header** | `https://www.youtube.com/` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player-container`, `#movie_player`, `.html5-video-player`, `ytd-player` |
| **Button ID** | `__ytdl_download_btn` |
| **Button Class** | `ytdl-serp-download-button` |
| **Button Text** | "Download" with down arrow emoji |
| **Button Position** | Absolute top: 12px, right: 12px inside player container |
| **On Click** | Caches video info via background extraction, then opens extension popup |
| **SPA Aware** | Yes — re-injects on video change (checks `?v=` param every 4 seconds), MutationObserver fallback |
| **Toast Notifications** | In-page toast (`#__ytdl_download_toast`) for status messages |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from translateX(100%) to translateX(0)) |
| **Panel ID** | `ytdl-download-manager` |
| **Card Width** | 380px (responsive: Math.min(innerWidth-40, 340) on small screens) |
| **Max Height** | Math.min(innerHeight-80, 500)px |
| **Z-Index** | 2147483647 |
| **Border** | 2px solid #007acc |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif |
| **Auto-Hide** | 8 seconds after completion (configurable) |
| **Linger After Complete** | 2 seconds before card removal |
| **Cross-Tab Sync** | Yes — via `chrome.storage.local` with `downloadManagerGlobalState` key |
| **Max Concurrent Downloads** | 3 |
| **Features** | Collapse/expand, cancel individual, cancel all, clear completed, per-download progress, speed display, cross-tab state sync |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | N/A |
| **Title** | N/A |
| **Contexts** | N/A |
| **URL Patterns** | N/A |

> No context menu is configured for this extension.

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (9.5 KB), `styles/popup-enhanced.css` (10.0 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Quick help tips, Activation section, Loading spinner (boot splash), Video info card (thumbnail, title, owner, resolution), YouTube URL section (copy URL, yt-dlp Mac/Windows commands), Quality selector, Download button, Progress bar with cancel, Error state |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (Node.js, uses archiver + javascript-obfuscator + sharp) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/youtube-downloader` |
| **Has Worktree?** | Yes — `.worktrees/youtube-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `youtube-downloader.zip` | <!-- TODO --> |
| Chrome | `youtube-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `youtube-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `youtube-downloader-brave.zip` | <!-- TODO --> |
| Edge | `youtube-downloader-edge.zip` | <!-- TODO --> |
| Opera | `youtube-downloader-opera.zip` | <!-- TODO --> |
| Whale | `youtube-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `youtube-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `youtube-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `youtube-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `xKtOmYPdZ6shNVfwk9uQ` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNJWWsw2CE3X` |
| **Stripe Product Name** | Youtube Downloader |
| **Stripe Monthly Price** | USD 9.00/month [youtube-downloader-9-mo] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS77DP7AOTRcvmEt8SQRBN`, `price_1SzJLQDP7AOTRcvmyVBPcu3Q` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Prefix** | `YTDL` |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |

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
| `brandAccent` | `#ff0000` | Primary action/CTA (YouTube red) |
| `brandAccentHover` | `#cc0000` | Hover state (darker red) |
| `bgDark` | `#181818` | Main dark background |
| `bgDarker` | `#0f0f0f` | Secondary dark background |
| `borderDark` | `#303030` | Dark borders |
| `inputBorder` | `#3d3d3d` | Input field borders |
| `textPrimary` | `#ffffff` | Main text |
| `textMuted` | `#b3b3b3` | Secondary text |
| `textSubtle` | `#e0e0e0` | Subtle accent text |
| `success` | `#4caf50` | Success state |
| `error` | `#ff5722` | Error state |
| `info` | `#1e88e5` | Info state |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e9ecef` | Light mode borders |
| `lightMutedText` | `#6c757d` | Light mode muted text |
| `lightPanelBg` | `#f8f9fa` | Light mode panel background |
| `lightMutedText2` | `#95a5a6` | Light mode secondary muted |
| `darkTextStrong` | `#1f1f1f` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| YouTube Client | `modules/youtube/client.js` | InnerTube API extraction, multi-client streaming data |
| YouTube Signature | `modules/youtube/signature.js` | Cipher/n-parameter decryption for stream URLs |
| YouTube SABR | `modules/youtube/sabr.js` | Server ABR streaming download pipeline |
| YouTube UMP | `modules/youtube/ump.js` | Universal Media Protocol parser |
| YouTube Media Assembler | `modules/youtube/media-assembler.js` | Assembles SABR segments into playable files |
| YouTube Utils | `modules/youtube/utils.js` | Video ID extraction, filename sanitization |
| YouTube Constants | `modules/youtube/constants.js` | InnerTube client configs, API endpoints, user agents |
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |
| AlertPolyfill | `utils/AlertPolyfill.mjs` | Alert dialog polyfill |
| Download Manager | `download-manager/` (6 files) | Modular download UI, state, config, task registry, integration helper |
