# Technical Info Matrix — Skool Downloader

## Extension: `skool-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Skool Downloader |
| **Slug / ID** | `skool-downloader` |
| **Gecko ID** | `skool-downloader@serpapps.com` |
| **Category** | Video Downloader (Education / Community) |
| **Target Site(s)** | skool.com, loom.com, vimeo.com, youtube.com, wistia.com, wistia.net |
| **Description** | Download videos from Skool.com classrooms, community posts, about pages, and more. Supports downloading loom, youtube, vimeo, wistia |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.3 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/skool-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- generated at build time --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`skool-downloader-chrome-sanitized/`) |
| **GitHub Releases Repo** | `serpapps/skool-downloader` |
| **Product Page** | https://serp.ly/skool-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Multi-platform: HLS stitching (m3u8 segment to MP4 transmux via offscreen), Vimeo FMP4/progressive, Loom GraphQL + CDN, YouTube client extraction + SABR, Wistia embed config, Skool native (Mux HLS / Next.js page props) |
| **Quality Selection** | Yes -- per-platform quality extraction from Vimeo config, YouTube formats, Loom transcodes, Wistia assets, Skool/Mux renditions |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes -- in-page download manager (`download-manager/download-manager.js`) with state, UI, config, and task registry modules |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No (uses popup and download manager panel) |
| **Context Menu** | No |
| **Auto-Save** | Yes -- saves as MP4, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic multi-platform: Skool page props (Next.js __NEXT_DATA__), Mux player elements, Loom iframes/elements, Vimeo playerConfig/iframes, YouTube iframes/links, Wistia embeds/data attributes |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://www.skool.com/*`, `https://*.skool.com/*`, `https://stream.video.skool.com/*`, `https://*.video.skool.com/*`, `https://*.b-cdn.net/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` -- injected on skool.com, loom.com, vimeo.com, youtube.com, wistia.com, wistia.net at `document_idle` |
| **Background Service Worker?** | Yes -- `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes -- `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS transmux with fMP4 support) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes -- `modules/mediabunny/` |
| **HLS Library** | `modules/hls/hls.mjs` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/dash2mp4.mjs` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Client** | `modules/youtube/` (client.js, constants.js, media-assembler.js, sabr.js, signature.js, ump.js, utils.js) |
| **IndexedDB** | Yes -- segment caching (`indexed-db.js`) |
| **Page Injection** | None (modular detector architecture via ES module imports) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`), Loom GraphQL, Vimeo API, Wistia oEmbed/media API |
| **Update Check** | GitHub releases (`serpapps/skool-downloader`), 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detection, download manager integration, control event handling |
| Video Detector Coordinator | `detectors/video-detector.js` | Coordinates all platform-specific detectors, unified detection interface |
| Skool Detector | `detectors/skool-detector.js`, `detectors/skool-detector-working.js` | Skool native video detection: Next.js page props, Mux player, blob sources, course structure |
| Loom Detector | `detectors/loom-detector.js` | Loom iframe embeds, video elements, data attributes, direct links, script tags |
| Vimeo Detector | `detectors/vimeo-detector.js` | Vimeo playerConfig, iframe embeds, data attributes, direct page visits |
| YouTube Detector | `detectors/youtube-detector.js` | YouTube iframes, direct links, script content, page visits |
| Wistia Detector | `detectors/wistia-detector.js` | Wistia iframes, source elements, data attributes, Wistia-specific elements |
| Skool Handler | `handlers/skool-handler.js` | Skool download orchestration, authenticated M3U8 extraction, MP4 output |
| Loom Handler | `handlers/loom-handler.js` | Loom GraphQL API (GetVideoSSR), CDN URL extraction, download |
| Vimeo Handler | `handlers/vimeo-handler.js` | Vimeo API config extraction, FMP4/progressive download, JWT auth |
| Wistia Handler | `handlers/wistia-handler.js` | Wistia embed config/oEmbed extraction, asset download |
| YouTube Handler | `handlers/youtube-handler.js` | YouTube client extraction, signature decryption, SABR download |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, handler dispatch, auth gating, offscreen management, queue system, DNR rules |
| Download Task Registry | `download-manager/download-task-registry.js` | Concurrent download queue (max 3 concurrent) |
| Download Manager | `download-manager/download-manager.js` | In-page download progress panel orchestrator |
| Download Manager UI | `download-manager/download-manager-ui.js` | Panel rendering, progress bars, minimize/close |
| Download Manager State | `download-manager/download-manager-state.js` | Download state tracking, stats |
| Download Manager Config | `download-manager/download-manager-config.js` | Configuration and presets |
| Integration Helper | `download-manager/integration-helper.js` | Content script to download manager bridge |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, auth flow, platform display |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management (auth-api.js, auth-config.js, auth-storage.js, auth-telemetry.js, auth-token.js) |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Multi-Platform Video Detection

| Platform | Detector | Detection Methods | Handler |
|---|---|---|---|
| **Skool** | `skool-detector.js`, `skool-detector-working.js` | Next.js `__NEXT_DATA__` page props, Mux player elements, `<video>` with blob sources, course structure data, videoStream/videoLink fields | `SkoolHandler` |
| **Loom** | `loom-detector.js` | Iframes (`loom.com/embed`, `loom.com/share`), video elements with `data-loom-video-id`, Loom classes/IDs, direct links, script tags | `LoomHandler` |
| **Vimeo** | `vimeo-detector.js` | `window.playerConfig`, iframe embeds, data attributes, direct Vimeo page visits, embed info extraction | `VimeoHandler` |
| **YouTube** | `youtube-detector.js` | Iframe embeds, `/watch?v=`, `/embed/`, `/shorts/`, `youtu.be/`, nocookie embeds, script content | `YouTubeHandler` |
| **Wistia** | `wistia-detector.js` | Direct Wistia URLs (`medias/`, `embed/`), iframe embeds, source elements, data attributes, Wistia-specific elements | `WistiaHandler` |

### Skool-Specific Detection

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.skool.com/*`, `https://*.skool.com/*` |
| **Skool Page Props** | Parses `__NEXT_DATA__` (Next.js SSR data) from window object, `<script id="__NEXT_DATA__">` tag, and any script containing `videoStream`/`videoLink` patterns |
| **Mux Player** | Detects `<mux-player>` elements with playback IDs |
| **Wistia Deferral** | Auto-defers to Wistia detector when `.wistia_embed`, `[class*="wistia_async_"]`, or Wistia iframes/sources are detected on Skool pages |
| **Loom Priority** | Checks for `video[id*="Loom"]`, `video[data-loom-video-id]` elements first (highest priority) |
| **Native Video** | Detects `<video>` elements with blob: sources on Skool domain |
| **Course Data** | Extracts course structure and module data from page props |

### Format Object Structure

```json
{
  "platform": "Skool | Loom | Vimeo | YouTube | Wistia",
  "id": "string",
  "title": "string",
  "url": "string",
  "thumbnail": "string | null",
  "duration": "number | null",
  "formats": [
    {
      "quality": "number | string",
      "url": "string",
      "ext": "mp4 | m3u8",
      "format_type": "hls | mp4 | progressive",
      "height": "number | null",
      "width": "number | null"
    }
  ]
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` (via offscreen-faststream-legacy.js) |
| **Offscreen File** | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` |
| **Batch Size** | `Math.min(10, totalSegments)` |
| **Module Loading** | Dynamic import of `modules/hls2mp4/simple-converter.mjs` |
| **fMP4 Support** | Yes (Enhanced FastStream offscreen) |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Architecture** | Modular: `DownloadManager` + `DownloadManagerState` + `DownloadManagerUI` + `DownloadManagerConfig` |
| **Max Concurrent Downloads** | 3 |
| **Task Registry** | `DownloadTaskRegistry` with queue system |
| **Features** | Per-download progress bars, speed display, cancel, cancel-all, clear completed, minimize/close, auto-expand on new download |
| **State Persistence** | `chrome.storage.local` with `downloadManagerGlobalState` key |
| **Pruning** | Auto-prunes stale entries on service worker startup (500ms delay) |
| **Linger Time** | 2000ms for completed downloads |

### Popup UI

| Property | Value |
|---|---|
| **Title** | Video Downloader for Skool |
| **Stylesheets** | `styles/styles.css` (9.7 KB), `styles/popup-enhanced.css` (14.8 KB) |
| **Script Load Order** | `site-config.js` -> `auth.js` (module) -> `popup-enhanced.js` (module) -> `auth-ui.js` -> `trial-banner.js` -> `popup-ui-overrides.js` -> `update-notifier.js` |
| **Sections** | Header, Quick help banner, Activation section, Boot splash/loading, Error state, Video info card, Quality selector, YouTube URL section (copy/yt-dlp buttons), Download button, Progress bar, Password section |
| **Detected Platforms** | Loom, Vimeo, YouTube, Wistia, Skool |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (canonical build script, Node.js) |
| **Build Log Level** | `error` (overridden from `debug` via `$SERP_BUILD_LOG_LEVEL`) |
| **GitHub Release?** | Yes -- `serpapps/skool-downloader` |
| **Has Worktree?** | Yes -- `.worktrees/skool-downloader/` |
| **Store-Sanitized Dir** | `skool-downloader-chrome-sanitized/` |

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
| **GH License ID** | `LOjynJKzgCrlGQNkYqxK` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNI3zQlXZr1L` |
| **Stripe Product Name** | Skool Video Downloader |
| **Stripe Monthly Price** | USD 27.00/month [Subscription - Skool Video Downloader] | USD 37.00/month [Subscription - Skool Video Downloader] |
| **Stripe One-Time Price** | USD 37.00/one_time | USD 47.00/one_time [skool-video-downloader $47] |
| **Stripe Price IDs** | `price_1SdS6vDP7AOTRcvmvWhwuCTl`, `price_1SeJdtDP7AOTRcvmPiHhIyIP`, `price_1SpfnLDP7AOTRcvmEOJoEPg4`, `price_1SphG8DP7AOTRcvmB5J0CgFu`, `price_1SpXDJDP7AOTRcvmdPeIbUeK` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |
| **Log Prefix** | `SKOOL-HANDLER` (handler), `SKOOL-OFFSCREEN` (offscreen) |
| **File Logging** | `skool-downloader/log.txt` |

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
| `brandAccent` | `#d3513e` | Primary action/CTA (warm red) |
| `brandAccentHover` | `#0693e3` | Hover state (bright blue) |
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
| HLS Parser | `modules/hls/hls.mjs` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/simple-converter.mjs` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| HLS MP4 Generator | `modules/hls2mp4/MP4Generator.mjs` | MP4 container generation |
| HLS Transmuxer | `modules/hls2mp4/transmuxer.mjs` | Transport stream transmuxing |
| HLS Mp4Sample | `modules/hls2mp4/Mp4Sample.mjs` | MP4 sample handling |
| HLS to MP4 Main | `modules/hls2mp4/hls2mp4.mjs` | HLS to MP4 main converter |
| DASH to MP4 | `modules/dash2mp4/dash2mp4.mjs` | DASH stream conversion |
| DASH MP4 Merger | `modules/dash2mp4/mp4merger.mjs` | DASH MP4 merging |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding (reencoder.mjs, reencoder-simple.mjs, resampler.mjs, resampler-worker.mjs, webm.mjs, demuxers.mjs, mp4-muxer.mjs, IndexedDBManager.mjs) |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities (AlertPolyfill, AudioUtils, BlobManager, CSSFilterUtils, EnvUtils, FastStreamArchiveUtils, InterfaceUtils, RequestUtils, StringUtils, SubtitleUtils, UpdateChecker, URLUtils, Utils, VideoUtils, WebUtils) |
| YouTube Client | `modules/youtube/client.js` | YouTube video info extraction |
| YouTube Signature | `modules/youtube/signature.js` | YouTube signature decryption |
| YouTube SABR | `modules/youtube/sabr.js` | SABR download manager |
| YouTube Media Assembler | `modules/youtube/media-assembler.js` | YouTube media assembly |
| YouTube UMP | `modules/youtube/ump.js` | YouTube UMP protocol |
| YouTube Utils | `modules/youtube/utils.js` | YouTube URL cleaning, filename sanitization |
| YouTube Constants | `modules/youtube/constants.js` | YouTube constants |
| MP4Box | `modules/mp4box.mjs` (319 KB) | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` (4.3 KB) | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` (3.5 KB) | Event dispatch |
| EventEmitter Dir | `modules/eventemitter/eventemitter.mjs` | Event dispatch (directory copy) |
| Localize | `modules/Localize.mjs` (1.2 KB) | i18n support |

### Web Accessible Resources

| Resources | Match Patterns |
|---|---|
| `download-manager/integration-helper.js`, `download-manager/download-manager.js`, `download-manager/download-manager-config.js`, `download-manager/download-manager-state.js`, `download-manager/download-manager-ui.js`, `detectors/video-detector.js`, `detectors/loom-detector.js`, `detectors/vimeo-detector.js`, `detectors/youtube-detector.js`, `detectors/wistia-detector.js`, `detectors/skool-detector.js`, `detectors/skool-detector-working.js` | skool.com, loom.com, vimeo.com, youtube.com, wistia.com, wistia.net |
| `offscreen-faststream.html`, `offscreen-faststream-legacy.js`, `indexed-db.js` | `*://*/*` |
