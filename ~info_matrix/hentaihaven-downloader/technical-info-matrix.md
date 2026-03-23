# Technical Info Matrix — HentaiHaven Downloader

## Extension: `hentaihaven-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP HentaiHaven DL |
| **Slug / ID** | `hentaihaven-downloader` |
| **Gecko ID** | `hentaihaven-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult / Anime) |
| **Target Site(s)** | hentaihaven.xxx and subdomains |
| **Description** | Download HentaiHaven videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/hentaihaven-downloader` |
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
| **Store-Sanitized Build?** | Yes (`hentaihaven-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/hentaihaven-downloader` |
| **Product Page** | https://serp.ly/hentaihaven-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from flashvars mediaDefinitions, `<video>`/`<source>` tags, script regex, Performance API resource entries, player iframe m3u8 URLs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player`, `.mainPlayerDiv`, `.player_logic_item`, `.player-logic-master`, `.chapter-video-frame`, player-logic iframe parent) |
| **Context Menu** | Yes — "Download HentaiHaven Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/HentaiHaven/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Download Complete" |
| **Video Detection** | Automatic — flashvars, HTML5 video, script regex, Performance API resource entries, player iframe m3u8 collection |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://hentaihaven.xxx/*`, `https://*.hentaihaven.xxx/*`, `https://*.octopusmanifest.org/*`, `https://*.anpustream.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `hentaihaven.xxx` at `document_idle` |
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
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), posts `PORNHUB_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, format extraction, flashvars parsing, metadata scraping, player iframe m3u8 collection |
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
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://hentaihaven.xxx/*`, `https://*.hentaihaven.xxx/*` |
| **Video ID Patterns** | `/watch/([^/]+)/episode-(\d+)/?`, `/watch/([^/]+)/?`, `viewkey=([a-zA-Z0-9]+)`, fallback path segment join |
| **Title Sources** | `h1`, `h1.title`, `[data-video-title]`, `meta[property="og:title"]` |
| **Thumbnail Sources** | `og:image` |
| **Duration Sources** | `<video>` element, `flashvars.video_duration`, `flashvars.videoDuration` |
| **Extra Metadata** | Views (`.count`), Likes (`.votesUp`), Dislikes (`.votesDown`), Tags (`.tagsWrapper a`, `.entry-tags a`, `.single-tags a`, `.tags a`), Categories (`.categoriesWrapper a`, `.entry-category a`, `.genre-list a`) |
| **Format Sources** | A) flashvars_* mediaDefinitions, B) HTML5 `<video>`/`<source>`, C) Script regex for mp4/m3u8 URLs, D) Performance API resource entries from player iframe, E) Player iframe m3u8 URL collection (VP9 + AAC variant expansion) |
| **Script URL Regex** | `/https?:\\?\\/\\?\\/[^"'\\\s]+?\\.(?:m3u8\|mp4)(?:\\?[^"'\\\s]*)?/gi` |
| **Player Iframe Detection** | `iframe[src*="/wp-content/plugins/player-logic/player.php"]`, `iframe[src*="player-logic/player.php"]` |
| **M3U8 Variant Expansion** | VP9 quality variants (`vp9_*p/video.m3u8`) expanded to `playlist_vp9.m3u8` and `playlist.m3u8`; audio AAC variants also expanded |
| **Media Request Patterns** | `/video/get_media`, `mediaDefinitions`, `.m3u8`, `.mp4` |
| **Inject Message Type** | `PORNHUB_PAGE_DATA` (shared pattern from Pornhub-style sites) |

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
| **Referer** | `https://hentaihaven.xxx/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://hentaihaven.xxx` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player`, `.mainPlayerDiv`, `.player_logic_item`, `.player-logic-master`, `.chapter-video-frame`, player-logic iframe parent |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `hentaihaven-download-manager` |
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
| **Menu ID** | `download-hentaihaven-video` |
| **Title** | "Download HentaiHaven Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `hentaihaven.xxx/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.8 KB), `styles/popup-enhanced.css` (15.8 KB) |
| **Script Load Order** | `site-config.js` → `auth.js` (module) → `popup.js` (module) → `auth-ui.js` → `trial-banner.js` → `popup-ui-overrides.js` → `update-notifier.js` |
| **Sections** | Header, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/hentaihaven-downloader` |
| **Has Worktree?** | Yes — `.worktrees/hentaihaven-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `hentaihaven-downloader.zip` | <!-- TODO --> |
| Chrome | `hentaihaven-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `hentaihaven-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `hentaihaven-downloader-brave.zip` | <!-- TODO --> |
| Edge | `hentaihaven-downloader-edge.zip` | <!-- TODO --> |
| Opera | `hentaihaven-downloader-opera.zip` | <!-- TODO --> |
| Whale | `hentaihaven-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `hentaihaven-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `hentaihaven-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `hentaihaven-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_TfxY3zIXUeBi79` |
| **Stripe Product Name** | HentaiHaven Downloader |
| **Stripe Monthly Price** | USD 9.00/month [hentaihaven-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdXDP7AOTRcvm2gatgSXD`, `price_1SymsvDP7AOTRcvmCOIRYygN` |

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
| `brandAccent` | `#b10b17` | Primary action/CTA (deep red) |
| `brandAccentHover` | `#8e0812` | Hover state (darker red) |
| `bgDark` | `#0f0f10` | Main dark background |
| `bgDarker` | `#1a1a1c` | Secondary dark background |
| `borderDark` | `#2f2f33` | Dark borders |
| `inputBorder` | `#4a4a50` | Input field borders |
| `textPrimary` | `#ffffff` | Main text |
| `textMuted` | `#a6a6ad` | Secondary text |
| `textSubtle` | `#d0d0d6` | Subtle accent text |
| `success` | `#50b86a` | Success state |
| `error` | `#f25f5c` | Error state |
| `info` | `#f59e0b` | Info state (amber) |
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
| YouTube | `modules/youtube/` | YouTube client/signature/UMP utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
