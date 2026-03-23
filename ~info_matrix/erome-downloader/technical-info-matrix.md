# Technical Info Matrix — EroMe Downloader

## Extension: `erome-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Erome Downloader |
| **Slug / ID** | `erome-downloader` |
| **Gecko ID** | `erome-downloader@serpapps.com` |
| **Category** | Video & Image Downloader (Adult) |
| **Target Site(s)** | erome.com and subdomains |
| **Description** | Download Erome videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/erome-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:08:48.443Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`erome-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/erome-downloader` |
| **Product Page** | https://serp.ly/erome-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) + Direct Image Download |
| **Quality Selection** | Yes — parsed from HTML5 `<video>`/`<source>` tags, inline script regex, global window data objects, inject.js XHR/fetch monitor |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No (but detects all media items in an album page) |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `.media-group` containers, `.video`, `.video-player`, `.player`, `.video-js`, `video.vjs-tech`, `video#html5_api`, `video[id^="player-"]`) |
| **Image Download?** | Yes — detects and downloads images from album pages (`.album-photo img`, `.album img`, `.gallery img`, `.post-content img`, `.viewer img`, `.media img[data-full]`) |
| **Context Menu** | Yes — "Download Erome Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/Erome/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" |
| **Video Detection** | Automatic — HTML5 video elements, inline script regex, global window objects (`eromePlayer`, `eromeConfig`, `__EROME_INITIAL_STATE__`, `__NUXT__`), inject.js XHR/fetch monitor |
| **Image Detection** | Automatic — `data-src`, `data-full`, `data-original`, `data-download` attributes on `<img>` elements within album containers |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `declarativeNetRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://erome.com/*`, `https://www.erome.com/*`, `https://*.erome.com/*`, `https://*.sacdnssedge.com/*`, `https://store.externulls.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `erome.com` and `www.erome.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (311 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `EROME_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **DeclarativeNetRequest** | Rule ID 4701 — sets `Referer: https://www.erome.com/` on requests matching `erome.com` (types: xmlhttprequest, media, other) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, format extraction from HTML5 video/source, inline script scanning, global object inspection, album media enumeration |
| Player Button | `player-button.js` | In-page download buttons on video players and image containers with quality popover for videos |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, notifications, image downloads, DNR rules |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor, extracts media URLs, scans playervars/mediaDefinitions |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://erome.com/*`, `https://www.erome.com/*` |
| **Video ID Patterns** | `/a/([A-Za-z0-9_-]+)`, `/album/([A-Za-z0-9_-]+)`, `/video/([A-Za-z0-9_-]+)`, `/videos/([A-Za-z0-9_-]+)`, `/v/([A-Za-z0-9_-]+)`, `embed.erome.com.*?id=([A-Za-z0-9_-]+)` |
| **Title Sources** | `h1[class*="title"]`, `.video-title`, `.album-title`, `h1`, `meta[property="og:title"]`, `meta[name="twitter:title"]`, `document.title` (cleaned) |
| **Thumbnail Sources** | `og:image`, `twitter:image`, `video[poster]` |
| **Duration Sources** | `meta[property="video:duration"]`, `meta[itemprop="duration"]`, ISO 8601 parsing |
| **Video Element Selectors** | `.video video`, `.video-player video`, `.player video`, `video.vjs-tech`, `video#html5_api`, `video[id^="player-"]`, `video` |
| **Format Sources** | A) HTML5 `<video>`/`<source>` elements, B) Inline script regex for mp4/m3u8 URLs, C) Global window objects (`eromePlayer`, `eromeConfig`, `__EROME_INITIAL_STATE__`, `__NUXT__`, `__INITIAL_STATE__`), D) inject.js XHR/fetch interception |
| **Script URL Regex** | `/https?:\/\/[^"'\s]+?\.(?:mp4\|m3u8)(?:[^"'\s]*)/gi` |
| **XHR/Fetch Monitor** | Intercepts requests matching `erome`, `externulls`, or `video` in URL |
| **Inject Message Type** | `EROME_PAGE_DATA` |

### Image Detection & Extraction

| Feature | Implementation |
|---|---|
| **Album Container** | `.media-group` — scans for both video and image content per group |
| **Image Selectors** | `.album-photo img`, `.album img`, `.gallery img`, `.post-content img`, `.viewer img`, `.media img[data-full]` |
| **Image URL Candidates** | `data-src`, `data-full`, `data-original`, `data-download` attributes, then `img.src` as fallback |
| **Image Filename** | Page title + image alt text or index suffix, preserving original file extension |
| **Download Path** | `Erome/{filename}.{ext}` (same folder as videos) |
| **Thumbnail Filter** | Skips elements with `thumb` in class names; skips `.album-infos` containers |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4 | webm",
  "format_type": "hls | mp4 | webm",
  "quality": "string",
  "url": "string",
  "protocol": "m3u8 | https",
  "height": "number | null",
  "label": "string | undefined",
  "source": "video-element | video-source | video-attr | video-data-sources | inline-script | window-data | dom"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` |
| **Master Playlist** | Auto-detects master vs media playlists; selects highest resolution variant |
| **Segment Parsing** | Handles `#EXT-X-STREAM-INF` (master) and `#EXTINF:` (media) playlists |
| **Referer** | `https://www.erome.com/` (set via DeclarativeNetRequest) |
| **Offscreen Fallback** | Content-script HLS fallback if offscreen document unavailable |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.media-group` (primary), `.player`, `.video-player`, `.video-wrapper`, `.video-js`, `.video`, `figure`, `article` |
| **Video Button Text** | "Download" with down-arrow icon |
| **Image Button Text** | "Download Image" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **MutationObserver** | Yes — auto-attaches buttons when new media groups are added to DOM |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `erome-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10040 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 8px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 4-5 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-erome-video` |
| **Title** | "Download Erome Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://erome.com/*`, `https://www.erome.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (14.7 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `popup-ui-overrides.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Boot splash, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/erome-downloader` |
| **Has Worktree?** | Yes — `.worktrees/erome-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `erome-downloader.zip` | 1.21 MB |
| Chrome | `erome-downloader-chrome.zip` | 1.12 MB |
| Chrome Store Sanitized | `erome-downloader-chrome-store-sanitized.zip` | 1.12 MB |
| Brave | `erome-downloader-brave.zip` | 1.12 MB |
| Edge | `erome-downloader-edge.zip` | 1.12 MB |
| Opera | `erome-downloader-opera.zip` | 1.12 MB |
| Whale | `erome-downloader-whale.zip` | 1.12 MB |
| Yandex | `erome-downloader-yandex.zip` | 1.12 MB |
| Firefox ZIP | `erome-downloader-firefox.zip` | 1.13 MB |
| Firefox XPI | `erome-downloader-firefox-unpacked.xpi` | 1.13 MB |

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
| **GH License ID** | `Z3TKUAarTyDYdesn9knw` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadN8tuks5WclX` |
| **Stripe Product Name** | Erome Downloader |
| **Stripe Monthly Price** | USD 9.00/month [erome-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6lDP7AOTRcvm2uSqP6Ek`, `price_1SymstDP7AOTRcvmj36uKy9o` |

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
| `brandAccent` | `#ec567c` | Primary action/CTA (pink/rose) |
| `brandAccentHover` | `#d64a73` | Hover state (darker rose) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (311 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.2 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.3 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
