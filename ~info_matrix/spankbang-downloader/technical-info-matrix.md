# Technical Info Matrix — SpankBang Downloader

## Extension: `spankbang-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for SpankBang |
| **Slug / ID** | `spankbang-downloader` |
| **Gecko ID** | `spankbang-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | spankbang.com and subdomains (including m.spankbang.com) |
| **Description** | Download SpankBang videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/spankbang-downloader` |
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
| **Store-Sanitized Build?** | Yes (`spankbang-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/spankbang-video-downloader` |
| **Product Page** | https://serp.ly/spankbang-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from stream_url_* page variables and SpankBang API (`/api/videos/stream`) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player_wrapper_outer`, `#video_container`, `#main_video_player`, `.player`) |
| **Context Menu** | Yes — "Download SpankBang Video" on page and video contexts |
| **Auto-Save** | Yes — saves to Downloads folder as MP4, no save-as dialog |
| **Desktop Notifications** | Yes — "SpankBang Download Complete" |
| **Video Detection** | Automatic — inject.js script-tag parsing for stream_url_* variables, SpankBang API via data-streamkey, XHR/fetch monitoring, window.initials fallback |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://spankbang.com/*`, `https://*.spankbang.com/*`, `https://m.spankbang.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `spankbang.com` at `document_idle` |
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
| **Page Injection** | `inject.js` — parses script tags for stream_url_* variables, monitors XMLHttpRequest + fetch(), posts `SPANKBANG_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), SpankBang API (`spankbang.com/api/videos/stream`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, metadata extraction (title, ID, thumbnail, streamData), message handling for download progress |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, SpankBang format extraction |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context script-tag parsing for stream_url_* variables, XHR/fetch monitor, window.initials detection |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://spankbang.com/*`, `https://*.spankbang.com/*`, `https://m.spankbang.com/*` |
| **Video ID Patterns** | `/([a-z0-9]+)/(?:video\|play\|embed)` — extracted from URL path |
| **Title Sources** | `h1[title]` attribute, `document.title` (stripped of " - SpankBang" suffix) |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Duration Sources** | Not extracted in content script |
| **Extra Metadata** | `uploader`, `uploader_id`, `views`, `description` fields (populated if available) |
| **Format Sources** | A) stream_url_* page variables (script-tag regex in inject.js), B) SpankBang API via data-streamkey POST to `/api/videos/stream`, C) window.initials legacy fallback, D) xplayerSettings legacy fallback |
| **Stream URL Regex** | `/stream_url_([^\s=]+)\s*=\s*(["'])((?:(?!\2).)+)\2/g` — captures format ID and URL from page scripts |
| **Format Type Detection** | URL-based: `.m3u8` = HLS, `.mpd` = DASH, otherwise MP4 |
| **Media Request Patterns** | URLs containing `spankbang`, `media`, or `video` (XHR/fetch intercept triggers re-extraction) |
| **Inject Message Type** | `SPANKBANG_PAGE_DATA` |

### Format Object Structure

```json
{
  "url": "string",
  "quality": "string (e.g. '1080p (MP4)' or '720p (HLS)')",
  "format": "mp4 | hls",
  "ext": "mp4 | hls",
  "height": "number | null",
  "id": "string (e.g. 'stream-240p')",
  "type": "mp4 | hls"
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
| **Referer** | `https://spankbang.com/` |
| **M3U8 Parsing** | Recursive — selects highest bandwidth variant from master playlist, then extracts segment URLs |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player_wrapper_outer`, `#video_container`, `#main_video_player` (closest div), `.player` |
| **Button Class** | `sb-download-button` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — `sb-quality-popover` class, format sorting by height (desc) |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **CSS** | `styles/player-button.css` (injected via link tag, ID `sb-player-button-css`) |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `spankbang-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-spankbang-video` |
| **Title** | "Download SpankBang Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://spankbang.com/*`, `https://*.spankbang.com/*`, `https://m.spankbang.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/spankbang-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/spankbang-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `spankbang-downloader.zip` | <!-- TODO --> |
| Chrome | `spankbang-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `spankbang-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `spankbang-downloader-brave.zip` | <!-- TODO --> |
| Edge | `spankbang-downloader-edge.zip` | <!-- TODO --> |
| Opera | `spankbang-downloader-opera.zip` | <!-- TODO --> |
| Whale | `spankbang-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `spankbang-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `spankbang-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `spankbang-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `5XEK0lEfOvfcrUCB42LX` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadN7H1LOqXnXr` |
| **Stripe Product Name** | SpankBang Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [spankbang-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6wDP7AOTRcvmDlTobsJZ`, `price_1Symt5DP7AOTRcvmBpriHS80` |

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
| `brandAccent` | `#c0392b` | Primary action/CTA (dark red) |
| `brandAccentHover` | `#a83226` | Hover state (darker red) |
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
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |
