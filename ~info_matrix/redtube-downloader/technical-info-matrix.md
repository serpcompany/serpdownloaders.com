# Technical Info Matrix — RedTube Downloader

## Extension: `redtube-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for RedTube |
| **Slug / ID** | `redtube-downloader` |
| **Gecko ID** | `redtube-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | redtube.com and subdomains (Pornhub network) |
| **Description** | Download RedTube videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/redtube-downloader` |
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
| **Store-Sanitized Build?** | Yes (`redtube-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/redtube-video-downloader` |
| **Product Page** | https://serp.ly/redtube-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from sources object, mediaDefinitions, `<source>` fallback, nested media definitions, M3U8 master playlists |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `div[id^="playerDiv_"].rt_player`, `.mgp_container`, `#player`, `.videoPlayer`, `.mainPlayerDiv`) |
| **Context Menu** | Yes — "Download RedTube Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/RedTube/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "RedTube Download Complete" |
| **Video Detection** | Automatic — RedTubeExtractor class: sources object, mediaDefinitions, `<source>` tags, nested media definitions, M3U8 playlists, inject.js page-context extraction |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://redtube.com/*`, `https://www.redtube.com/*`, `https://*.redtube.com/*`, `https://embed.redtube.com/*`, `https://*.rdtcdn.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `redtube.com` and `www.redtube.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — runs in page context, extracts video ID from URL, scans embedded JSON-LD/script data, reads `window.redtube`, `window.videoData`, `window.playerConfig`, `window.__INITIAL_DATA__` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection via RedTubeExtractor class, format extraction (sources, mediaDefinitions, nested media, M3U8), metadata scraping (title, thumbnail, duration, views) |
| Player Button | `player-button.js` | In-page download button on video player with quality popover (targets MGP player container) |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, HLS/MP4 progress forwarding |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context video ID extraction, embedded JSON scanning, global variable reading |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://redtube.com/*`, `https://www.redtube.com/*` |
| **Video ID Patterns** | `(?:redtube\.com(?:\.br)?\/\|embed\.redtube\.com\/\?.*?\bid=)(\d+)` — supports redtube.com, redtube.com.br, embed.redtube.com |
| **Title Sources** | JSON-LD `name`, `h1.video_title_text`, `h1.videoTitle`, `h1.video_title`, script regex for `videoTitle`/`title`, `meta[property="og:title"]`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | `meta[property="og:video:duration"]`, `videoDuration` script regex, `meta[property="og:duration"]`, `span.duration` element |
| **Extra Metadata** | Views (multiple DOM patterns: `.video_view_count`, VIEWS table), description from `meta[name="description"]` |
| **Format Sources** | A) `sources` object (script regex), B) `mediaDefinition` array (with nested fetch), C) `<source src="..." type="video/mp4">` fallback, D) M3U8 master playlist parsing |
| **Video Error Detection** | `video-deleted-info`, "This video has been removed", `private_video_text`, "This video is private" |
| **Inject Page Data** | `window.__redtubePageData` — videoId, meta, apiThumbnail from inject.js |
| **Inject Global Variables** | `window.redtube`, `window.videoData`, `window.playerConfig`, `window.__INITIAL_DATA__`, `window.__NEXT_DATA__`, `window.xplayerSettings` |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8 | https",
  "filesize": null,
  "tbr": null,
  "width": "number | null",
  "height": "number | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | `https://www.redtube.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://www.redtube.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `div[id^="playerDiv_"].rt_player`, `.mgp_container`, `#player`, `.videoPlayer`, `.mainPlayerDiv`, nearest `video.mgp_videoElement` ancestor |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **CSS** | `styles/player-button.css` (1.6 KB) |
| **Data Attribute** | `data-rt-dl-attached="1"` on container when button is placed |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `redtube-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-redtube-video` |
| **Title** | "Download RedTube Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://redtube.com/*`, `https://www.redtube.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.0 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/redtube-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/redtube-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `redtube-downloader.zip` | <!-- TODO --> |
| Chrome | `redtube-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `redtube-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `redtube-downloader-brave.zip` | <!-- TODO --> |
| Edge | `redtube-downloader-edge.zip` | <!-- TODO --> |
| Opera | `redtube-downloader-opera.zip` | <!-- TODO --> |
| Whale | `redtube-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `redtube-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `redtube-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `redtube-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `X3JHZWTnPEu6Ryir8ORr` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNANaZQkCosa` |
| **Stripe Product Name** | Redtube Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [redtube-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6tDP7AOTRcvmwXwzvGsa`, `price_1Symt4DP7AOTRcvmP4xTHSDu` |

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
| `brandAccent` | `#a01620` | Primary action/CTA (deep red) |
| `brandAccentHover` | `#b31f2a` | Hover state (brighter red) |
| `bgDark` | `#1b1b1b` | Main dark background |
| `bgDarker` | `#333` | Secondary dark background |
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
| `accentAlt1` | `#4f0005` | Dark accent variant |
| `accentAlt1Hover` | `#6a0a11` | Dark accent hover |
| `accentAlt2` | `#7f0a0a` | Medium accent variant |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube compatibility module |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
