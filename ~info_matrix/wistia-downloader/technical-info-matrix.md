# Technical Info Matrix — Wistia Downloader

## Extension: `wistia-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Wistia |
| **Slug / ID** | `wistia-downloader` |
| **Gecko ID** | `wistia-downloader@serpapps.com` |
| **Category** | Video Downloader (Business / Education) |
| **Target Site(s)** | wistia.com, wistia.net, and any site embedding Wistia players |
| **Description** | Download Wistia videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/wistia-downloader` |
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
| **Store-Sanitized Build?** | Yes (`wistia-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/wistia-video-downloader` |
| **Product Page** | https://serp.ly/wistia-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (chrome.downloads API with Save As) + HLS Stitching (m3u8 segment to MP4 transmux via offscreen) |
| **Quality Selection** | Yes — parsed from Wistia embed config `media.assets`, sorted by quality flag then height (desc) then bitrate (desc) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/inline-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No (but supports playlist and channel browsing with per-video download) |
| **In-Page Player Button?** | No |
| **Context Menu** | No |
| **Auto-Save** | No — uses Save As dialog (`saveAs: true`) |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — JSON-LD VideoObject, Wistia async embeds, data attributes, script tags, iframes, source elements, video elements, `window._wq`, element IDs/classes |
| **Playlist Support** | Yes — Wistia playlists parsed from `/playlists/` API |
| **Channel Support** | Yes — Wistia channels parsed from `/channel/` API with series/section/episode traversal |
| **Embed Detection** | Yes — detects embedded Wistia players on any third-party site (`<all_urls>` matching) |
| **Password-Protected Videos** | Detection only (throws error if password-protected) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*.wistia.com/*`, `https://*.wistia.net/*`, `https://fast.wistia.net/*`, `https://fast.wistia.com/*`, `https://embed-ssl.wistia.com/*`, `https://embedwistia-a.akamaihd.net/*`, `https://*.cloudfront.net/*` |
| **Content Scripts (Set 1)** | `site-config.js` -> `logger.js` -> `download-manager/inline-manager.js` — injected on `<all_urls>` at `document_start` |
| **Content Scripts (Set 2)** | `site-config.js` -> `logger.js` -> `content-enhanced.js` — injected on `https://*.wistia.com/*`, `https://*.wistia.net/*`, `https://*/*` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS M3U8 to MP4 transmux + segment merge) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS to MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH to MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (DB: `LoomDownloaderDB`, store: `fileStore`) for segment caching |
| **Page Injection** | None (no `inject.js`) |
| **External APIs Called** | Wistia Embed API (`fast.wistia.net/embed/medias|playlists|channel/<id>.json`), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | Wistia video ID detection (9 methods), embed config extraction, metadata scraping, JSON-LD VideoObject parsing, JSONP fallback |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, Wistia API fetching, embed config parsing, auth gating, offscreen management, download manager state |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, playlist/channel browsing, auth flow, progress tracking |
| Popup (Legacy) | `popup.js` | Legacy popup script (Loom-derived, superseded by `popup-enhanced.js`) |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS M3U8 playlist parsing, segment downloading, MP4 transmuxing via SimpleHLS2MP4Converter |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Auth Config | `auth/auth-config.js` | Auth endpoint and entitlement configuration |
| Auth API | `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume |
| Auth Storage | `auth/auth-storage.js` | Device ID, stored auth session management |
| Auth Token | `auth/auth-token.js` | Entitlement resolution and validation |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging |
| Download Manager | `download-manager/inline-manager.js` | In-page download progress panel (injected on all URLs) |
| Logger | `logger.js` | Structured logging with level hierarchy, console patching |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks, in-popup update banner |
| Trial Banner | `trial-banner.js` | Free trial remaining badge in popup |
| IndexedDB | `indexed-db.js` | Key-value store for segment data during HLS processing |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `<all_urls>` (detects Wistia embeds on any website) |
| **Video ID Pattern** | 10-character alphanumeric hash: `/[a-z0-9]{10}/` |
| **Detection Method 0** | Direct Wistia URL: `wistia.(?:net\|com)/(?:embed/)?(?:iframe\|medias\|playlists\|channel)/([a-z0-9]{10})` |
| **Detection Method 1** | URL parameters: `wmediaid`, `wvideo`, `wvideoid` |
| **Detection Method 2** | DOM async embeds: `[class*="wistia_async_"]` |
| **Detection Method 3** | Data attributes: `[data-wistia-id]`, `[data-wistia-video-id]` |
| **Detection Method 4** | Script tags: `Wistia.embed()` calls, `wmediaid`/`wvideo` patterns |
| **Detection Method 5** | Wistia iframes: `iframe[src*="wistia"]` |
| **Detection Method 6** | Source elements: `source[src*="wistia"]`, `source[src*="fast.wistia"]` |
| **Detection Method 7** | Video elements and nested sources |
| **Detection Method 8** | Wistia queue: `window._wq` array |
| **Detection Method 9** | Element IDs/classes: `[id*="wistia_"]`, `[class*="wistia_"]` |
| **JSON-LD Detection** | `script[type="application/ld+json"]` with `@type: VideoObject` and Wistia embed URL |
| **Title Sources** | Wistia embed config `media.name`, JSON-LD `name`/`headline`, `video[aria-label]`, `meta[property="og:title"]`, `meta[name="twitter:title"]`, `h1`, `<title>` |
| **Thumbnail Sources** | Wistia embed config `assets[type="still"]`, JSON-LD `thumbnailUrl`, `og:image`, `twitter:image`, `.wistia_embed img`, `video[poster]` |
| **Duration Sources** | Wistia embed config `media.duration`, JSON-LD ISO 8601 duration, `<video>` element |
| **Description Sources** | Wistia embed config `media.seoDescription`, `og:description`, `twitter:description`, `meta[name="description"]` |
| **Format Sources** | Wistia embed API (`fast.wistia.net/embed/medias/<id>.json`), content script JSONP fallback |
| **Embed Config Fallback** | Content script fetch with credentials + JSONP script injection when CORS blocks |
| **Content Type Detection** | URL-based: `/playlists/` = playlist, `/channel/` = channel, default = video |
| **Wistia API Endpoints** | `https://fast.wistia.net/embed/medias/<id>.json`, `https://fast.wistia.net/embed/playlists/<id>.json`, `https://fast.wistia.net/embed/channel/<id>.json` |

### Format Object Structure

```json
{
  "format_id": "string (e.g., 'original', 'mp4_h264_1920x1080')",
  "url": "string",
  "ext": "mp4 | m3u8 | ts",
  "width": "number | null",
  "height": "number | null",
  "filesize": "number | null",
  "tbr": "number | null (bitrate)",
  "vcodec": "string | null",
  "acodec": "string | null (for audio-only)",
  "quality": "1 (original) | 0 (standard)",
  "protocol": "m3u8_native (for HLS) | undefined (for direct)",
  "format_note": "HLS | TS segments | undefined"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` (via offscreen document) |
| **M3U8 Parser** | Built-in `parseM3U8()` in `offscreen.js` |
| **Segment Concurrency** | 6 parallel workers |
| **Variant Selection** | Highest bandwidth first (descending sort) |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Offscreen Justification** | "Merge HLS playlists into MP4 for Wistia downloads" |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from translateX(100%) to translateX(0)) |
| **Panel ID** | `wistia-download-manager` |
| **Card Width** | 380px (340px on small screens <500px) |
| **Max Height** | min(window height - 80px, 500px) |
| **Z-Index** | 2147483647 (max) |
| **Border** | 2px solid brandAccent (#1f74f2) |
| **Border Radius** | 8px |
| **Font** | -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif |
| **Auto-Hide** | When all downloads complete and list is empty |
| **Features** | Collapse/clear buttons, cancel all, per-download progress bars, speed display, cancel/remove per item, auto-remove completed (2.5s) |
| **Cross-Tab Sync** | Yes — via `chrome.storage.local` key `downloadManagerGlobalState` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (13.5 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Help text display, Boot splash, Activation section (OTP), Embed detected notice, Password section, Status, Video info card (thumbnail, title, owner, resolution, description), Quality selector, Download button, Progress bar with cancel, Error state |
| **Playlist UI** | Scrollable list with thumbnails, per-video download buttons, duration display |
| **Channel UI** | Same as playlist — series/section/episode traversal with per-video downloads |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/wistia-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/wistia-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `wistia-downloader.zip` | <!-- TODO --> |
| Chrome | `wistia-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `wistia-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `wistia-downloader-brave.zip` | <!-- TODO --> |
| Edge | `wistia-downloader-edge.zip` | <!-- TODO --> |
| Opera | `wistia-downloader-opera.zip` | <!-- TODO --> |
| Whale | `wistia-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `wistia-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `wistia-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `wistia-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Gumroad Product ID** | `Xa65Kxun0T_oCFFSWuxhAg==` |
| **GH License ID** | `JbTLhxyE3I0he968VmHA` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNWaWlr7efPw` |
| **Stripe Product Name** | Wistia Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [wistia-video-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS72DP7AOTRcvm9E8lsXex`, `price_1T6w1BDP7AOTRcvmnBpk4bTx` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Logger Singleton** | `globalThis.WistiaLogger` / `globalThis.__WISTIA_LOGGER_SINGLETON__` |
| **Console Patching** | Yes — replaces `console.log/info/warn/error/debug/trace` with structured logger |

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
| `brandAccent` | `#1f74f2` | Primary action/CTA (Wistia blue) |
| `brandAccentHover` | `#1660d4` | Hover state (darker blue) |
| `bgDark` | `#0e1424` | Main dark background |
| `bgDarker` | `#090f1b` | Secondary dark background |
| `borderDark` | `#1c2a40` | Dark borders |
| `inputBorder` | `#223556` | Input field borders |
| `textPrimary` | `#f1f5ff` | Main text |
| `textMuted` | `#9ab3db` | Secondary text |
| `textSubtle` | `#c5d4f1` | Subtle accent text |
| `success` | `#32d19d` | Success state |
| `error` | `#ff5c5c` | Error state |
| `info` | `#4da3ff` | Info state |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e1e8f5` | Light mode borders |
| `lightMutedText` | `#5d6d8c` | Light mode muted text |
| `lightPanelBg` | `#f0f4ff` | Light mode panel background |
| `lightMutedText2` | `#7a8bb0` | Light mode secondary muted |
| `darkTextStrong` | `#0b1529` | Dark strong text |

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
| YouTube | `modules/youtube/` | YouTube utilities (shared module) |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
