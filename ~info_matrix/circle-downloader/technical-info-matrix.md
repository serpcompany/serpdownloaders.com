# Technical Info Matrix — Circle Downloader

## Extension: `circle-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Circle Downloader |
| **Slug / ID** | `circle-downloader` |
| **Gecko ID** | `circle-downloader@serpapps.com` |
| **Category** | Video Downloader (Multi-Platform / Course / Community) |
| **Target Site(s)** | Circle.so, Tella.tv, Loom.com, Vimeo.com, YouTube.com, Wistia.com, and more |
| **Description** | Download videos from Circle and Tella. Supports Loom, YouTube, Vimeo, Wistia, and more |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/circle-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:04:01.956Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`circle-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/circle-downloader` |
| **Product Page** | https://serp.ly/circle-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment to MP4 transmux) + DASH (dash2mp4) |
| **Quality Selection** | Yes — per-platform detector extracts available qualities from embedded players and APIs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) with integration helper, config, state, and UI modules |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Overlay Buttons?** | Yes — `styles/overlay-buttons.css` for in-page download triggers on detected videos |
| **Context Menu** | Yes — "Download Circle Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/Circle Downloader/` folder, no save-as dialog |
| **Desktop Notifications** | Yes |
| **Video Detection** | Automatic — modular detector system with 8 platform-specific detectors |
| **Platform Count** | 7+ platforms supported (Circle.so, Tella.tv, Loom.com, YouTube.com, Vimeo.com, Wistia.com, Skool.com) |
| **YouTube URL Copy** | Yes — popup includes YouTube URL display with yt-dlp copy commands for Mac and Windows |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions (count)** | 33 explicit entries + `<all_urls>` (34 total) |
| **Host Permissions (list)** | `https://auth.serp.co/*`, `https://vimeo.com/*`, `https://*.vimeo.com/*`, `https://*.vimeocdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*`, `https://player.vimeo.com/*`, `https://www.loom.com/*`, `https://*.loom.com/*`, `https://*.loomcdn.com/*`, `https://www.youtube.com/*`, `https://*.youtube.com/*`, `https://youtu.be/*`, `https://*.googlevideo.com/*`, `https://*.googleapis.com/*`, `https://wistia.com/*`, `https://*.wistia.com/*`, `https://wistia.net/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://*.b-cdn.net/*`, `https://circle.so/*`, `https://*.circle.so/*`, `https://circle.com/*`, `https://*.circle.com/*`, `https://cdn-media.circle.so/*`, `https://assets-v2.circle.so/*`, `https://www.tella.tv/*`, `https://*.tella.tv/*`, `https://prod-stream.tella.tv/*`, `<all_urls>` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content-enhanced-modular.js` — two injection rules: one for Circle.so/Circle.com domains, one for `<all_urls>` (with Skool/Kajabi exclusions) |
| **Content Script Injection** | `all_frames: true`, `run_at: document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen-faststream.html` + `offscreen-faststream-legacy.js` |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (311 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **YouTube Module** | `modules/youtube/` (client.js, constants.js, media-assembler.js, sabr.js, signature.js, ump.js, utils.js) |
| **IndexedDB** | Yes — `indexed-db.js` for segment caching and download state |
| **Shadow DOM** | Yes — Shadow DOM traversal for Circle.so embedded players |
| **Blocked Hosts** | Skool.com, Kajabi.com (hard-guarded in both content script and background) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), Gumroad License API (`api.gumroad.com`), GitHub Releases API (`api.github.com`) |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` (Cloudflare Worker) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |
| **Concurrent Downloads** | Max 3 concurrent downloads (DownloadTaskRegistry) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` | Unified multi-platform video detector, modular detector imports, platform heuristic guards |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, handler dispatch, auth gating, offscreen management, context menu, download task registry |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, YouTube URL display with yt-dlp copy, auth flow |
| Offscreen | `offscreen.html` + `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` + `auth/` (auth-api.js, auth-config.js, auth-storage.js, auth-telemetry.js, auth-token.js) | OTP login, entitlement checks, trial management, token storage |
| Download Manager | `download-manager/` (download-manager.js, download-manager-config.js, download-manager-state.js, download-manager-ui.js, download-task-registry.js, integration-helper.js) | In-page download progress panel, concurrent download tracking |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, auth config |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Handlers (Background — Platform-Specific Download Logic)

| Handler | File | Platform |
|---|---|---|
| Circle Handler | `handlers/circle-handler.js` | Circle.so / Circle.com |
| Tella Handler | `handlers/tella-handler.js` | Tella.tv |
| Loom Handler | `handlers/loom-handler.js` | Loom.com |
| YouTube Handler | `handlers/youtube-handler.js` | YouTube.com |
| Vimeo Handler | `handlers/vimeo-handler.js` | Vimeo.com |
| Wistia Handler | `handlers/wistia-handler.js` | Wistia.com |
| Skool Handler | `handlers/skool-handler.js` | Skool.com (blocked — reserved) |

### Detectors (Content Script — Platform-Specific Video Detection)

| Detector | File | Platform |
|---|---|---|
| Circle Detector | `detectors/circle-detector.js` | Circle.so / Circle.com |
| Tella Detector | `detectors/tella-detector.js` | Tella.tv |
| Loom Detector | `detectors/loom-detector.js` | Loom.com |
| YouTube Detector | `detectors/youtube-detector.js` | YouTube.com |
| Vimeo Detector | `detectors/vimeo-detector.js` | Vimeo.com |
| Wistia Detector | `detectors/wistia-detector.js` | Wistia.com |
| Skool Detector | `detectors/skool-detector.js` | Skool.com (blocked — reserved) |
| Skool Detector (Working) | `detectors/skool-detector-working.js` | Skool.com alternative (blocked — reserved) |
| Video Detector | `detectors/video-detector.js` | Generic video element detection |

### Content Script Platform Guard

| Feature | Implementation |
|---|---|
| **Circle Detection** | Hostname regex: `/(^|\.)circle\.so$/i`, `/(^|\.)circle\.com$/i` |
| **Tella Detection** | Hostname regex: `/(^|\.)tella\.tv$/i` |
| **Asset Heuristic** | `document.querySelector('script[src*="circle.so"], link[href*="circle.so"], script[src*="tella.tv"], link[href*="tella.tv"]')` |
| **Window Heuristic** | `window.CDN_HOST` containing `circle.so` or `window.ANALYTICS_TRACKER_URL` containing `circle` |
| **Blocked Hosts** | `/(^|\.)skool\.com$/i`, `/(^|\.)video\.skool\.com$/i`, `/^kajabi\.com$/i`, `/(^|\.)kajabi\.com$/i` |
| **Exit Behavior** | Throws `__CIRCLE_EXIT__` or `__EXT_DISABLED_SITE__` to halt content script |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Module Architecture** | Modular — config, state, UI, integration helper, task registry |
| **Max Concurrent** | 3 |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel, cancel-all, clear completed |
| **Control Events** | `skoolDownloader:cancelDownload`, `skoolDownloader:clearCompleted`, `skoolDownloader:cancelAll` |
| **State Persistence** | `chrome.storage` with mutation queue and terminal locks |
| **Idle Timer** | 25,000ms offscreen idle timeout |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-circle-video` |
| **Title** | "Download Circle Video" |
| **Contexts** | `["page", "video"]` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (9.9 KB), `styles/popup-enhanced.css` (13.2 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` (in body) -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Help text display, Boot splash, Trial banner, Activation section, Video info card (thumbnail, title, owner, resolution, description), YouTube URL section (with yt-dlp Mac/Windows copy), Quality selector, Download button, Progress bar with cancel, Error display |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/circle-downloader` |
| **Has Worktree?** | Yes — `.worktrees/circle-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `circle-downloader.zip` | 1.36 MB |
| Chrome | `circle-downloader-chrome.zip` | 1.31 MB |
| Chrome Store Sanitized | `circle-downloader-chrome-store-sanitized.zip` | 1.29 MB |
| Brave | `circle-downloader-brave.zip` | 1.31 MB |
| Edge | `circle-downloader-edge.zip` | 1.31 MB |
| Opera | `circle-downloader-opera.zip` | 1.31 MB |
| Whale | `circle-downloader-whale.zip` | 1.31 MB |
| Yandex | `circle-downloader-yandex.zip` | 1.31 MB |
| Firefox ZIP | `circle-downloader-firefox.zip` | 1.38 MB |
| Firefox XPI | `circle-downloader-firefox-unpacked.xpi` | 1.30 MB |

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
| **Stripe Product ID** | `prod_TadNq8ygZxYxun` |
| **Stripe Product Name** | Circle Downloader |
| **Stripe Monthly Price** | USD 17.00/month [Subscription - Circle Downloader] | USD 9.00/month [circle-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time | USD 8.00/one_time [circle-downloader-setup-fee-8] |
| **Stripe Price IDs** | `price_1SdS6hDP7AOTRcvmVNye8iZQ`, `price_1SpdxfDP7AOTRcvmeayubtI8`, `price_1SpdxfDP7AOTRcvmukERiLaT`, `price_1SpedSDP7AOTRcvmplWfXnla` |

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
| `brandAccent` | `#506CF0` | Primary action/CTA (blue) |
| `brandAccentHover` | `#162DAD` | Hover state (darker blue) |
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
| YouTube | `modules/youtube/` | YouTube SABR/UMP client, signature decryption, media assembly |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (311 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.2 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.3 KB) |
| Localize | `modules/Localize.mjs` | i18n support (1.2 KB) |
