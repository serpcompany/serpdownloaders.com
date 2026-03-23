# Technical Info Matrix — Beeg Downloader

## Extension: `beeg-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Beeg Downloader |
| **Slug / ID** | `beeg-downloader` |
| **Gecko ID** | `beeg-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | beeg.com and subdomains |
| **Description** | Download Beeg videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/beeg-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T16:59:44.195Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`beeg-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/beeg-video-downloader` |
| **Product Page** | https://serp.ly/beeg-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from Beeg API v6 + externulls API, `<video>`/`<source>` tags, script regex, Performance API CDN entries |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `video.x-player__video`) |
| **Context Menu** | Yes — "Download Beeg Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/Beeg/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Beeg Download Complete" |
| **Video Detection** | Automatic — Beeg API v6 + externulls API, URL pattern extraction, meta tags, inject.js page-context monitor |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://beeg.com/*`, `https://www.beeg.com/*`, `https://*.beeg.com/*`, `https://store.externulls.com/*`, `https://video.beeg.com/*`, `https://video.externulls.com/*`, `https://thumbs.externulls.com/*`, `https://previews.externulls.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `beeg.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (318 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — runs in page context, extracts video ID from URL and page variables, posts `BEEG_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Beeg API v6 (`store.externulls.com`), externulls video/thumbs/previews |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, Beeg API extraction, metadata scraping, format parsing |
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
| Inject | `inject.js` | Page-context video ID extraction, script/meta scanning |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://beeg.com/*`, `https://www.beeg.com/*`, `https://*.beeg.com/*` |
| **Video ID Patterns** | `/video/(\d+)(?:/\|$)`, `/watch/(\d+)(?:/\|$)`, `/\D*(\d{5,})(?:/\|$)`, `(?:-\|/)\s*(\d{5,})(?:/\|$)`, URL pattern `https://beeg.com/-\d+` |
| **Title Sources** | `meta[property="og:title"]`, `meta[name="twitter:title"]`, `document.title` (stripped `\| Beeg` suffix) |
| **Thumbnail Sources** | `og:image`, `og:image:secure_url`, `twitter:image`, externulls thumbs matching video ID, largest `<img>` |
| **Duration Sources** | `meta[property="video:duration"]`, `meta[itemprop="duration"]` (ISO 8601), inline script JSON (`durationSeconds`, `duration`, `length_seconds`), `.x-player__video-duration`, `time[datetime^="PT"]` |
| **Extra Metadata** | Video ID variants (original, noLeadingZeros, shortened), alternative IDs from `window.vid`/`window.videoId`/`window.video_id`/`window.beegVideoId`/`window.currentVideoId` |
| **Format Sources** | A) Beeg API v6 via `fetchBeegAPI`, B) externulls API (`store.externulls.com`), C) HTML5 `<video>`/`<source>`, D) Script regex for mp4/m3u8 URLs, E) Performance API CDN entries |
| **Script URL Regex** | `/https?:\\?\\/\\?\\/[^"'\\\s]+?\\.(?:m3u8\|mp4)(?:\\?[^"'\\\s]*)?/gi` |
| **CDN Detection** | Performance entries matching externulls and beeg CDN hosts |
| **Media Request Patterns** | `.m3u8`, `.mp4`, `store.externulls.com`, `video.beeg.com`, `video.externulls.com` |
| **Inject Message Type** | `BEEG_PAGE_DATA` |

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
| **Referer** | `https://beeg.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://beeg.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `video.x-player__video` (Beeg-specific player class), nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **URL Gate** | Only operates on URLs containing `https://beeg.com/-` |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `beeg-download-manager` |
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
| **Menu ID** | `download-beeg-video` |
| **Title** | "Download Beeg Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://beeg.com/*`, `https://www.beeg.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (8.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Boot splash/loading, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/beeg-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/beeg-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `beeg-downloader.zip` | 1.16 MB |
| Chrome | `beeg-downloader-chrome.zip` | 1.08 MB |
| Chrome Store Sanitized | `beeg-downloader-chrome-store-sanitized.zip` | 1.08 MB |
| Brave | `beeg-downloader-brave.zip` | 1.08 MB |
| Edge | `beeg-downloader-edge.zip` | 1.08 MB |
| Opera | `beeg-downloader-opera.zip` | 1.08 MB |
| Whale | `beeg-downloader-whale.zip` | 1.08 MB |
| Yandex | `beeg-downloader-yandex.zip` | 1.08 MB |
| Firefox ZIP | `beeg-downloader-firefox.zip` | 1.09 MB |
| Firefox XPI | `beeg-downloader-firefox-unpacked.xpi` | 1.08 MB |

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
| **GH License ID** | `3eSXNXysdzfMa46UTytR` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNxoLWa9AnQV` |
| **Stripe Product Name** | Beeg Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [beeg-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6gDP7AOTRcvmfBQFutsR`, `price_1SymsqDP7AOTRcvm7ikj29I7` |

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
| `brandAccent` | `#a10fa3` | Primary action/CTA (purple) |
| `brandAccentHover` | `#ab27adff` | Hover state (lighter purple) |
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
| `accentAlt1` | `#a10fa3` | Alternate accent 1 (purple) |
| `accentAlt1Hover` | `#ab27adff` | Alternate accent 1 hover |
| `accentAlt2` | `#10097f` | Alternate accent 2 (dark blue) |

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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (318 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
