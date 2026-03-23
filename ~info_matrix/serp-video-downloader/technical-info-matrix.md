# Technical Info Matrix — SERP Video Downloader

## Extension: `serp-video-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for SERP |
| **Slug / ID** | `serp-video-downloader` |
| **Gecko ID** | `serp-video-downloader@serpapps.com` |
| **Category** | Video Downloader (Universal) |
| **Target Site(s)** | All sites (`<all_urls>`) — universal multi-platform video capture |
| **Description** | Download videos across sites with support for MP4, HLS (m3u8), DASH (mpd), Vimeo, YouTube, Wistia, Loom, and more. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/serp-video-downloader` |
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
| **Store-Sanitized Build?** | Yes (`serp-video-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/serp-video-downloader` |
| **Product Page** | https://serp.ly/serp-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) + DASH (mpd) + FFmpeg offscreen processing + Platform-specific API extraction (YouTube, Vimeo, Loom, Wistia, Sprout, Skool) |
| **Quality Selection** | Yes — parsed from platform APIs, HTML5 `<video>`/`<source>` tags, HLS master playlists, DASH manifests, embedded player configs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (modular: `download-manager/`) with cross-tab sync |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No (universal tool — uses popup/download manager instead) |
| **Context Menu** | No (universal scope — uses popup UI) |
| **Auto-Save** | Yes — saves to Downloads folder, no save-as dialog |
| **Desktop Notifications** | Yes — download complete notifications |
| **Video Detection** | Automatic — modular multi-platform detectors (Loom, Vimeo, YouTube, Wistia, Sprout, Skool) + generic HTML5 video/source/m3u8/mpd/mp4 detection + network candidate tracking |
| **Multi-Video Candidates** | Yes — popup shows candidate selector when multiple videos detected on a single page |
| **Side Panel** | Yes — `sidePanel` permission, reuses `popup.html` as side panel |
| **Max Concurrent Downloads** | 3 |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `sidePanel`, `tabs`, `scripting`, `offscreen`, `cookies`, `webNavigation`, `declarativeNetRequestWithHostAccess`, `webRequest` |
| **Host Permissions** | `<all_urls>`, `https://auth.serp.co/*` |
| **Content Scripts (all_urls)** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on `<all_urls>` at `document_idle`, `all_frames: false` |
| **Content Scripts (Vimeo frames)** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — injected on `vimeo.com/*`, `*.vimeo.com/*`, `player.vimeo.com/*`, `*.vhx.tv/*`, `embed.vhx.tv/*` at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen-faststream-legacy.js` (FastStream offscreen) |
| **Offscreen FFmpeg?** | Yes — `offscreen-ffmpeg.js` (FFmpeg-based HLS playlist processing) |
| **Uses FFmpeg?** | Yes — `libs/ffmpeg/` (core WASM + JS ESM) for authenticated HLS playlists |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Module** | `modules/youtube/` |
| **IndexedDB** | Yes — segment caching (`indexed-db.js`) |
| **Page Injection** | None — uses dynamic module imports via `chrome-extension://` URLs |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), YouTube (`youtubei.googleapis.com`, `googlevideo.com`), Vimeo (`vimeo.com`, `player.vimeo.com`), Skool (`stream.video.skool.com`, `fastly.video.skool.com`), Beeg API (`beeg.com/api/v6`, `video.beeg.com/api/v6`, `store.externulls.com/facts`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self'; connect-src 'self' https://auth.serp.co;` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |
| **DNR Rules** | Yes — `declarativeNetRequest` dynamic rules for YouTube (`googlevideo.com`, `www.youtube.com`, `youtubei.googleapis.com`), Skool (`stream.video.skool.com`, `fastly.video.skool.com`, `video.skool.com`, `b-cdn.net`) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detection wrapper, modular detector imports, download manager bridge, telemetry relay |
| Video Detector Coordinator | `detectors/video-detector.js` | Coordinates all platform-specific detectors, generic HTML5/m3u8/mpd/mp4 source scanning |
| Loom Detector | `detectors/loom-detector.js`, `detectors/loom/` | Loom embed detection and extraction |
| Vimeo Detector | `detectors/vimeo-detector.js`, `detectors/vimeo/` | Vimeo embed/page detection, iframe extraction |
| YouTube Detector | `detectors/youtube-detector.js` | YouTube embed/page detection |
| Wistia Detector | `detectors/wistia-detector.js` | Wistia embed detection |
| Sprout Detector | `detectors/sprout-detector.js` | SproutVideo embed detection |
| Skool Detector | `detectors/skool-detector-working.js`, `detectors/skool/` | Skool native video detection |
| Service Worker | `background-enhanced.js` (module) -> `background/app.js` | Download orchestration, auth gating, offscreen management, side panel, DNR rules, telemetry |
| Background App | `background/app.js` | Main entry: wires up all background subsystems (queue, state, handlers, router, listeners) |
| Message Router | `background/message-router.js` | Centralized message routing with auth-gated action handlers |
| Candidate Handlers | `background/candidates.js` | Multi-video candidate merging, tab messaging, network+content candidate fusion |
| Network Candidate Tracker | `background/network-candidates.js` | Tracks media URLs from network requests |
| Download Queue | `background/download-queue.js` | Queued download management (max 3 concurrent) |
| Download Handlers | `background/download-handlers.js` | Download action handlers |
| Download State | `background/download-state.js` + `download-state-utils.js` | Download state store with pruning |
| Format Handlers | `background/format-handlers.js` | Format-specific download handling |
| Handler Factory | `background/handler-factory.js` | Platform-specific handler creation |
| HLS Playlist | `background/hls-playlist.js` | Authenticated HLS playlist building and variant parsing |
| Playlist JSON | `background/playlist-json.js` | JSON playlist format extraction (FMP4/segmented) |
| Provider Hints | `background/provider-hints.js` | Platform label inference from URLs |
| Vimeo Format Utils | `background/vimeo-format-utils.js` | Vimeo stream URL extraction |
| Sprout Handler | `background/sprout.js` | SproutVideo format extraction |
| Chrome Downloads | `background/chrome-downloads.js` | Chrome downloads API wrapper |
| DNR Rules | `background/dnr-rules.js` | Declarative net request rules for YouTube and Skool |
| Offscreen Manager | `background/offscreen-manager.js` | Offscreen document lifecycle management |
| Progress Reporter | `background/progress-reporter.js` | Download progress broadcasting |
| Side Panel | `background/side-panel.js` | Side panel registration |
| Thumbnail Proxy | `background/thumbnail-proxy.js` | Cross-origin thumbnail proxying |
| Loom Handler | `handlers/loom-handler.js`, `handlers/loom/` | Loom download handling |
| Vimeo Handler | `handlers/vimeo-handler.js`, `handlers/vimeo/` | Vimeo download handling |
| YouTube Handler | `handlers/youtube-handler.js`, `handlers/youtube/` | YouTube download handling |
| Wistia Handler | `handlers/wistia-handler.js`, `handlers/wistia/` | Wistia download handling |
| Skool Handler | `handlers/skool-handler.js`, `handlers/skool/` | Skool download handling |
| Popup | `popup.html` + `popup.js` | User-facing UI, multi-candidate selector, quality selector, auth flow, auto-download best |
| Offscreen (FastStream) | `offscreen.html` + `offscreen-faststream-legacy.js` | FastStream offscreen document for segment processing |
| Offscreen (FFmpeg) | `offscreen-ffmpeg.js` | FFmpeg WASM-based HLS playlist to MP4 conversion |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (13 files) | In-page download progress panel with history, speed display, cross-tab sync, configurable UI |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, entitlement aliases |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Content Messaging | `content/content-messaging.js` | Content script messaging utilities |
| Telemetry | `telemetry/` (browser/, extension/, shared/, index.js, logger.js) | Console relay, network relay, telemetry buffer |

### Supported Platforms & Detectors

| Platform | Detector | Handler | Domain Match |
|---|---|---|---|
| **YouTube** | `youtube-detector.js` | `handlers/youtube/` | youtube.com, youtu.be, googlevideo.com, youtubei.googleapis.com |
| **Vimeo** | `vimeo-detector.js`, `detectors/vimeo/` | `handlers/vimeo/` | vimeo.com, player.vimeo.com, *.vhx.tv, embed.vhx.tv |
| **Loom** | `loom-detector.js`, `detectors/loom/` | `handlers/loom/` | loom.com |
| **Wistia** | `wistia-detector.js` | `handlers/wistia/` | wistia.com, wistia.net, fast.wistia.net |
| **Sprout** | `sprout-detector.js` | `background/sprout.js` | sproutvideo.com, videos.sproutvideo.com |
| **Skool** | `skool-detector-working.js`, `detectors/skool/` | `handlers/skool/` | skool.com, stream.video.skool.com, fastly.video.skool.com |
| **Beeg** | Inline in `popup.js` (content harness) | Background fetch API | beeg.com, video.beeg.com, store.externulls.com |
| **Generic** | `video-detector.js` (`detectGenericVideoSources`) | Format handlers | Any site — HTML5 `<video>`, `<source>`, m3u8, mpd, mp4 URLs |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `<all_urls>` (universal) |
| **Generic Media Types** | m3u8 (HLS), mpd (DASH), mp4, webm, mov, mkv |
| **URL Classification** | `classifyMediaUrl()` — matches `.m3u8`, `.mpd`, `.mp4`, `.webm`, `.mov`, `.mkv`, MIME types `application/vnd.apple.mpegurl`, `application/x-mpegurl`, `application/dash+xml`, `video/*` |
| **DOM Scanning** | `<video>` elements (src, currentSrc), `<source>` elements, embedded iframes |
| **Platform Detection** | Domain-based routing to platform-specific detectors (Loom, Vimeo, YouTube, Wistia, Sprout, Skool) |
| **Network Candidates** | Background `webRequest` monitoring + content script Performance API entries |
| **Title Sources** | LD+JSON `VideoObject`, `og:title`, `twitter:title`, `document.title` |
| **Thumbnail Sources** | LD+JSON `thumbnailUrl`, `og:image`, `og:image:secure_url`, `twitter:image`, largest `<img>` |
| **Duration Sources** | LD+JSON `duration`, `video:duration`, `og:video:duration`, ISO 8601 parsing, `HH:MM:SS` parsing |
| **Extra Metadata** | `og:description`, `video:width`, `video:height`, `author`/`publisher` from LD+JSON |
| **Candidate Merging** | Platform-specific candidates merged with network candidates; platform labels preferred over "Generic" |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4 | mpd | webm | mov | mkv",
  "format_type": "hls | mp4 | dash | playlist_json",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8 | https | mpd",
  "filesize": null,
  "tbr": null,
  "width": "number | null",
  "height": "number | null",
  "hasVideo": "boolean",
  "hasAudio": "boolean",
  "platform": "string",
  "source": "string"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` (modules/hls2mp4) + FFmpeg WASM fallback (offscreen-ffmpeg.js) |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Authenticated HLS** | Yes — `buildAuthenticatedHlsPlaylist()` in background, FFmpeg offscreen for processing |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (20px from top, 20px from right) |
| **Panel Width** | 380px (responsive: min 340px on small screens) |
| **Max Height** | min(window.innerHeight - 80, 500)px (scrollable) |
| **Z-Index** | 2147483647 (max) |
| **Background** | #1b1b1b |
| **Border** | 2px solid #007acc |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif |
| **Auto-Hide** | 8 seconds after completion (configurable) |
| **Linger After Complete** | 2 seconds |
| **Max Completed to Keep** | 3 |
| **Cross-Tab Sync** | Yes |
| **Features** | Minimize/close, cancel all, clear completed, per-download progress bars, speed display, cancel individual, history, responsive layout |
| **Animation** | Slide-in from right with `cubic-bezier(0.4, 0, 0.2, 1)` transition |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (131 B), `styles/popup-enhanced.css` (10.3 KB) |
| **Script Load Order** | `auth.js` (module) -> `popup.js` (module) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `site-config.js` -> `update-notifier.js` (defer) |
| **Sections** | Header, Activation section (OTP auth), Loading spinner, Error state, Video info card (thumbnail + title + duration), Candidate selector (multi-video), Quality selector, Download button, Progress bar |
| **Auto-Download Best** | Yes — automatically starts download of best quality when single video detected |
| **Candidate Selector** | Shown when multiple videos detected; dropdown with platform + title + hostname labels |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/serp-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/serp-video-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `serp-video-downloader.zip` | <!-- TODO --> |
| Chrome | `serp-video-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `serp-video-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `serp-video-downloader-brave.zip` | <!-- TODO --> |
| Edge | `serp-video-downloader-edge.zip` | <!-- TODO --> |
| Opera | `serp-video-downloader-opera.zip` | <!-- TODO --> |
| Whale | `serp-video-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `serp-video-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `serp-video-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `serp-video-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Entitlement Aliases** | `serp-downloaders-bundle`, `serp-video-downloaders-bundle`, `123movies-downloader`, `circle-downloader`, `clientclub-downloader`, `dailymotion-downloader`, `kajabi-downloader`, `loom-downloader`, `m3u8-downloader`, `skool-downloader`, `sprout-downloader`, `thinkific-downloader`, `tiktok-downloader`, `vimeo-downloader`, `whop-downloader`, `wistia-downloader`, `youtube-downloader` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |
| **Telemetry Buffer** | Yes — `telemetry:serp-video` storage key, 500-event limit |
| **Console Relay** | Yes — browser console + service worker console relays |
| **Network Relay** | Yes — fetch relay for error/response tracking |

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
| YouTube | `modules/youtube/` | YouTube-specific extraction utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.4 KB) |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
| AlertPolyfill | `utils/AlertPolyfill.mjs` | Alert dialog polyfill |

### Web Accessible Resources

| Resource Group | Files | Match |
|---|---|---|
| Detectors & Download Manager | `log.js`, `download-manager/*.js`, `detectors/*.js`, `detectors/loom/*.js`, `detectors/vimeo/*.js`, `detectors/skool/*.js` | `<all_urls>` |
| Offscreen & IndexedDB | `offscreen-faststream.html`, `offscreen-faststream-legacy.js`, `indexed-db.js` | `<all_urls>` |
| Modules & Handlers (dynamic URL) | `modules/**/*`, `handlers/**/*`, `utils/**/*`, `telemetry/**/*`, `content/**/*` | `<all_urls>` |

### DNR Rules (Declarative Net Request)

| Rule ID | Target Domain | Headers Modified | Purpose |
|---|---|---|---|
| 10001 | `googlevideo.com` | origin, referer -> youtube.com | YouTube media segments |
| 10002 | `www.youtube.com` | origin, referer, x-origin -> youtube.com | YouTube site API calls |
| 10003 | `youtubei.googleapis.com` | origin, referer, x-origin -> youtube.com | YouTube internal API |
| 10011 | `stream.video.skool.com` | origin, referer -> skool.com | Skool HLS manifests |
| 10012 | `fastly.video.skool.com` | origin, referer -> skool.com | Skool TS/CMF segments |
| 10013 | `video.skool.com` | origin, referer -> skool.com | Skool generic video host |
| 10014 | `b-cdn.net` | origin, referer -> skool.com | BunnyCDN VOD (Skool) |
