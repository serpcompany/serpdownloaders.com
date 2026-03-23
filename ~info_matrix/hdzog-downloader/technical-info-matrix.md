# Technical Info Matrix — HDZog Downloader

## Extension: `hdzog-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for HDZog |
| **Slug / ID** | `hdzog-downloader` |
| **Gecko ID** | `hdzog-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | hdzog.com and subdomains |
| **Description** | Download HDZog videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/hdzog-downloader` |
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
| **Store-Sanitized Build?** | Yes (`hdzog-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/hdzog-downloader` |
| **Product Page** | https://serp.ly/hdzog-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from flashvars mediaDefinitions, `<video>`/`<source>` tags, inject.js player sources |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player`, `.mainPlayerDiv`) |
| **Context Menu** | Yes — "Download HDZog Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/HDZog/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "HDZog Download Complete" |
| **Video Detection** | Automatic — flashvars, HTML5 video, inject.js player/playlist extraction, XHR/fetch monitoring |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://hdzog.com/*`, `https://*.hdzog.com/*`, `https://*.ahcdn.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `hdzog.com` at `document_idle` |
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
| **IndexedDB** | Yes — segment caching (`modules/network/IndexedDBManager.mjs`) |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `PORNHUB_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, format extraction, flashvars parsing, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs |
| Bootstrap | `bootstrap.js` | Extension bootstrap/initialization |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://hdzog.com/*`, `https://*.hdzog.com/*` |
| **Video ID Patterns** | `/videos/(\d+)(?:/\|$)`, `/watch/(\d+)(?:/\|$)`, `[?&](?:video_id\|videoId\|id\|v)=([a-zA-Z0-9]+)`, `viewkey=([a-zA-Z0-9]+)` |
| **Title Sources** | `h1.title`, `[data-video-title]`, `meta[property="og:title"]`, `h1`, `document.title` |
| **Thumbnail Sources** | `og:image`, `og:image:secure_url`, `twitter:image`, `<video>` poster, inject.js `playerImage` |
| **Duration Sources** | `<video>` element, `flashvars.video_duration`, `flashvars.videoDuration` |
| **Extra Metadata** | Views (`.count`), Likes (`.votesUp`), Dislikes (`.votesDown`), Tags (`.tagsWrapper a`), Categories (`.categoriesWrapper a`), Uploader (`.usernameBadgesWrapper a`, `.video-detailed-info a.bolded`, `.username`) |
| **Format Sources** | A) flashvars_* mediaDefinitions, B) HTML5 `<video>`/`<source>`, C) inject.js player sources (pl3748, ktk_player, jwplayer, dynamic pl\d+ keys), D) inject.js HLS pattern scanning |
| **CDN Detection** | Trusted hosts: `hdzog.com`, `*.hdzog.com`, `*.ahcdn.com`; trusted paths: `/get_file/`, `/api/videofile.php`, `/contents/videos` |
| **Media Request Patterns** | `/video/get_media`, `mediaDefinitions`, `.m3u8`, `.mp4` |
| **Inject Message Type** | `PORNHUB_PAGE_DATA` (shared pattern from Pornhub-style sites) |
| **Blocked Source Patterns** | `g2fame`, `fhgte`, `clickadilla`, `xlivrdr`, `magsrv`, `onclck`, `juicyads`, `tsyndicate`, `stripchat`, `candyai`, `rtbadserv`, `video_preview` |

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
  "width": null,
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
| **Referer** | `https://hdzog.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://hdzog.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player`, `.mainPlayerDiv` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `hdzog-download-manager` |
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
| **Menu ID** | `download-hdzog-video` |
| **Title** | "Download HDZog Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `hdzog.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.8 KB), `styles/popup-enhanced.css` (8.5 KB) |
| **Script Load Order** | `auth.js` (module) → `popup.js` (module) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `site-config.js` → `update-notifier.js` (defer) |
| **Sections** | Header, Activation section, Loading spinner, Error state, Video info card (thumbnail + title + duration), Quality selector, Download button |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/hdzog-downloader` |
| **Has Worktree?** | Yes — `.worktrees/hdzog-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `hdzog-downloader.zip` | <!-- TODO --> |
| Chrome | `hdzog-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `hdzog-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `hdzog-downloader-brave.zip` | <!-- TODO --> |
| Edge | `hdzog-downloader-edge.zip` | <!-- TODO --> |
| Opera | `hdzog-downloader-opera.zip` | <!-- TODO --> |
| Whale | `hdzog-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `hdzog-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `hdzog-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `hdzog-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_TfxYgun9jqWlyf` |
| **Stripe Product Name** | HDZog Downloader |
| **Stripe Monthly Price** | USD 9.00/month [hdzog-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdWDP7AOTRcvmvQQcRY7k`, `price_1SymsuDP7AOTRcvmOJN2AcsT` |

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
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | IndexedDB segment caching |
| Utils | `modules/utils/` | General utilities (URL, string, video, audio, env, etc.) |
| YouTube | `modules/youtube/` | YouTube client/signature handling |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
