# Technical Info Matrix — ThisVid Downloader

## Extension: `thisvid-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP ThisVid Downloader |
| **Slug / ID** | `thisvid-downloader` |
| **Gecko ID** | `thisvid-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | thisvid.com and subdomains |
| **Description** | Download ThisVid videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/thisvid-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-03T03:34:00.000Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`thisvid-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/thisvid-downloader` |
| **Product Page** | https://serp.ly/thisvid-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from flashvars (video_url, video_alt_url, video_alt_url2), injected HLS URLs, `<video>`/`<source>` tags, XHR/fetch intercepted m3u8 URLs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#kt_player`, `.kt-player`, `#videoplayer-v3`, `#mediaplayer_wrapper`, `#player`, `.mainPlayerDiv`, `.video-holder`, `.video-container`) |
| **Context Menu** | Yes — "Download ThisVid Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/ThisVid/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "ThisVid Download Complete" |
| **Video Detection** | Automatic — flashvars (window.flashvars / flashvars_*), inject.js XHR/fetch m3u8 monitor, HTML5 video, DOM metadata |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://thisvid.com/*`, `https://*.thisvid.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `thisvid.com` at `document_idle` |
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
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch(), captures flashvars and HLS URLs, posts `THISVID_PAGE_DATA` / `PORNHUB_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, flashvars extraction, HLS URL collection, M3U8 parsing, segment downloading, metadata scraping |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, M3U8 parsing, context menu, notifications |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context flashvars capture, XHR/fetch m3u8 monitor |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| Bootstrap | `bootstrap.js` | WXT bootstrap entrypoint (no-op) |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://thisvid.com/*`, `https://*.thisvid.com/*` |
| **Video ID Patterns** | `/videos/([^/]+)` from URL pathname |
| **Title Sources** | `flashvars.video_title`, `meta[property="og:title"]`, `h1`, `document.title` |
| **Thumbnail Sources** | `og:image`, `flashvars.preview_url`, `flashvars.preview_url1`, `flashvars.preview_url2` |
| **Duration Sources** | DOM label "Duration:" adjacent text, parsed as HH:MM:SS or MM:SS |
| **Extra Metadata** | Tags (`flashvars.video_tags`), Categories (`flashvars.video_categories`) |
| **Format Sources** | A) flashvars video_url/video_alt_url/video_alt_url2, B) inject.js HLS URL intercepts, C) M3U8 master+media playlist parsing, D) mediaDefinitions (if present) |
| **Script URL Regex** | N/A — uses inject.js XHR/fetch interception for `.m3u8` URLs |
| **CDN Detection** | N/A |
| **Media Request Patterns** | `.m3u8` (via inject.js XHR/fetch intercept) |
| **Inject Message Type** | `THISVID_PAGE_DATA` (also accepts `PORNHUB_PAGE_DATA`) |

### Format Object Structure

```json
{
  "format_id": "string",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "string | null",
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
| **Referer** | `https://thisvid.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://thisvid.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#kt_player`, `.kt-player`, `#videoplayer-v3`, `#mediaplayer_wrapper`, `#player`, `.mainPlayerDiv`, `.video-holder`, `.video-container`, nearest video container |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `thisvid-download-manager` |
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
| **Menu ID** | `download-thisvid-video` |
| **Title** | "Download ThisVid Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `thisvid.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.8 KB), `styles/popup-enhanced.css` (15.3 KB) |
| **Script Load Order** | `site-config.js` → `auth.js` (module) → `popup.js` (module) → `auth-ui.js` → `trial-banner.js` → `popup-ui-overrides.js` → `update-notifier.js` |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/thisvid-downloader` |
| **Has Worktree?** | Yes — `.worktrees/thisvid-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `thisvid-downloader.zip` | ~1.24 MB |
| Chrome | `thisvid-downloader-chrome.zip` | ~1.16 MB |
| Chrome Store Sanitized | `thisvid-downloader-chrome-store-sanitized.zip` | ~1.16 MB |
| Brave | `thisvid-downloader-brave.zip` | ~1.16 MB |
| Edge | `thisvid-downloader-edge.zip` | ~1.16 MB |
| Opera | `thisvid-downloader-opera.zip` | ~1.16 MB |
| Whale | `thisvid-downloader-whale.zip` | ~1.16 MB |
| Yandex | `thisvid-downloader-yandex.zip` | ~1.16 MB |
| Firefox ZIP | `thisvid-downloader-firefox.zip` | ~1.17 MB |
| Firefox XPI | `thisvid-downloader-firefox-unpacked.xpi` | ~1.16 MB |

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
| **Stripe Product ID** | `prod_TfxYEfwVzoU97G` |
| **Stripe Product Name** | ThisVid Downloader |
| **Stripe Monthly Price** | USD 9.00/month [thisvid-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdfDP7AOTRcvmhWf9YnSK`, `price_1Symt6DP7AOTRcvmekMmsbQa` |

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
