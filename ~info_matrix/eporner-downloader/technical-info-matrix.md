# Technical Info Matrix — EPorner Downloader

## Extension: `eporner-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Eporner |
| **Slug / ID** | `eporner-downloader` |
| **Gecko ID** | `eporner-downloader@serpapps.com` |
| **Category** | Video Downloader (Adult) |
| **Target Site(s)** | eporner.com and subdomains |
| **Description** | Download Eporner videos |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/eporner-downloader` |
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
| **Store-Sanitized Build?** | Yes (`eporner-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/eporner-downloader` |
| **Product Page** | https://serp.ly/eporner-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Quality Selection** | Yes — parsed from EPorner API (`/xhr/video/`), HTML5 `<video>`/`<source>` tags, script regex, inject.js page-context extraction |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#EPvideo_html5_api`, `video.vjs-tech`, generic `<video>`) |
| **Context Menu** | Yes — "Download Eporner Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/Eporner/` folder, no save-as dialog |
| **Desktop Notifications** | Yes — "Eporner Download Complete" |
| **Video Detection** | Automatic — EPorner API (hash-based XHR), HTML5 video, inject.js page-context extraction, script regex, global variable monitoring |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://eporner.com/*`, `https://www.eporner.com/*`, `https://*.eporner.com/*`, `http://www.eporner.com/*`, `https://store.externulls.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `eporner.com` at `document_idle` |
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
| **Page Injection** | `inject.js` — monitors page-context globals (`window.eporner`, `window.videoData`, `window.playerConfig`), extracts embedded JSON, HLS patterns, mediaDefinitions; posts `EPORNER_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), EPorner Video API (`www.eporner.com/xhr/video/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video detection, EPorner API fetch (hash-based), format extraction, metadata scraping |
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
| Inject | `inject.js` | Page-context global variable extraction, embedded JSON/HLS pattern scanning |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://eporner.com/*`, `https://www.eporner.com/*` |
| **Video ID Patterns** | `/(?:video-\|embed\/\|hd-porn\/)([\w\-]+)/` |
| **Title Sources** | `meta[property="og:title"]`, `document.title` (stripped of "- EPORNER..." suffix) |
| **Thumbnail Sources** | `og:image`, EPorner API (`file.thumb`, `fc_facts[].thumb`) |
| **Duration Sources** | `meta[name="duration"]`, `meta[property="og:video:duration"]`, `meta[property="video:duration"]`, `meta[itemprop="duration"]` (ISO 8601 PT#H#M#S) |
| **Extra Metadata** | EPorner API response: `fc_facts`, `sources`, `file` object |
| **Format Sources** | A) EPorner API `/xhr/video/{id}?hash={hash}` (primary), B) HTML5 `<video>`/`<source>`, C) inject.js embedded JSON + HLS patterns, D) Script regex for mp4/m3u8 URLs |
| **EPorner API Hash** | Hex-to-base36 conversion of 32-char hash extracted from page HTML via `hash\s*[:=]\s*["']([\da-f]{32})` |
| **EPorner API URL** | `https://www.eporner.com/xhr/video/{videoId}?hash={hash}&device=generic&domain=www.eporner.com&fallback=false` |
| **Inject Message Type** | `EPORNER_PAGE_DATA` |
| **Page Globals Monitored** | `window.eporner`, `window.videoData`, `window.playerConfig`, `window.__INITIAL_DATA__`, `window.__NEXT_DATA__`, `window.xplayerSettings` |

### Format Object Structure

```json
{
  "format_id": "string (e.g. '720p')",
  "ext": "m3u8 | mp4",
  "format_type": "hls | mp4",
  "quality": "number | null",
  "url": "string",
  "protocol": "m3u8_native | https",
  "filesize": null,
  "tbr": "number | null",
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
| **Referer** | `https://www.eporner.com/` |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |
| **Origin** | `https://www.eporner.com` |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#EPvideo_html5_api`, `video.vjs-tech`, generic `<video>`, nearest positioned ancestor |
| **URL Gate** | Only on URLs matching `https://www.eporner.com/video` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `eporner-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 2147483647 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-eporner-video` |
| **Title** | "Download Eporner Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `eporner.com/*` and `www.eporner.com/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css`, `styles/popup-enhanced.css` (9.5 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/eporner-downloader` |
| **Has Worktree?** | Yes — `.worktrees/eporner-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `eporner-downloader.zip` | <!-- TODO --> |
| Chrome | `eporner-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `eporner-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `eporner-downloader-brave.zip` | <!-- TODO --> |
| Edge | `eporner-downloader-edge.zip` | <!-- TODO --> |
| Opera | `eporner-downloader-opera.zip` | <!-- TODO --> |
| Whale | `eporner-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `eporner-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `eporner-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `eporner-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **GH License ID** | `bz1UEWqMZQ5hu0WHvxas` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNxuR2lCIPAg` |
| **Stripe Product Name** | Eporner Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [eporner-video-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6kDP7AOTRcvmCBBlPeHL`, `price_1SymssDP7AOTRcvmnnm4BeKh` |

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
| `brandAccent` | `#ae0000` | Primary action/CTA (dark red) |
| `brandAccentHover` | `#c51a1a` | Hover state (brighter red) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (318 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |
