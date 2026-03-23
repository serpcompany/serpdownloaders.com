# Technical Info Matrix — Thinkific Downloader

## Extension: `thinkific-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Thinkific |
| **Slug / ID** | `thinkific-downloader` |
| **Gecko ID** | `thinkific-downloader@serpapps.com` |
| **Category** | Video Downloader (Education / Course Platform) |
| **Target Site(s)** | thinkific.com and subdomains (*.thinkific.com custom school domains) |
| **Description** | Detect and download Thinkific videos with SERP auth and download manager. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/thinkific-downloader` |
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
| **Store-Sanitized Build?** | Yes (`thinkific-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/thinkific-downloader` |
| **Product Page** | https://serp.ly/thinkific-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment transmux via offscreen) |
| **Quality Selection** | Yes — parsed from Wistia embed JSON API assets (master HLS, delivery HLS, MP4 originals) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (embedded in `content-scripts/content.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — embedded in `content-scripts/content.js` (targets Wistia player containers, `[data-wistia-id]`, `[data-wistia-hashed-id]`, `video` elements) |
| **Context Menu** | Yes — "Download Thinkific Video" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/thinkific/` folder, no save-as dialog |
| **Desktop Notifications** | No (permission declared but not used in background scripts) |
| **Video Detection** | Automatic — Wistia embed data attributes, `_wq` global, `wistia_async` classes, Wistia JSON API, HTML5 video, meta tags, LD+JSON VideoObject |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen`, `webRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.thinkific.com/*`, `https://thinkific.com/*`, `https://*.thinkific.com/*`, `https://cdn.thinkific.com/*`, `https://*.wistia.com/*`, `https://*.wistia.net/*`, `https://fast.wistia.com/*`, `https://fast.wistia.net/*`, `https://embedwistia-a.akamaihd.net/*`, `https://*.akamaihd.net/*`, `https://*.cloudfront.net/*` |
| **Content Scripts** | `content-scripts/content.js` — injected on `*.thinkific.com`, `thinkific.com`, `www.thinkific.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background.js` (non-module) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | Bundled in `offscreen.js` |
| **HLS Transmuxer** | Bundled in `offscreen.js` (HLS segment transmux to MP4) |
| **DASH to MP4** | No |
| **MP4Box** | No |
| **Reencoder** | No |
| **Network Utils** | Bundled in `offscreen.js` |
| **IndexedDB** | Yes — segment caching (in offscreen.js) |
| **Page Injection** | No standalone `inject.js` — detection logic bundled in `content-scripts/content.js` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Wistia Embed API (`fast.wistia.com/embed/medias/*.json`, `fast.wistia.net/embed/medias/*.json`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **Web Request API** | Yes — `webRequest` permission, `onHeadersReceived` listener for CDN header interception |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-scripts/content.js` | Video detection (Wistia embeds, data attributes, _wq global), metadata scraping, in-page download button, download manager panel |
| Service Worker | `background.js` | Download orchestration, auth gating, offscreen management, context menu, Wistia API fetching |
| Background Enhanced | `background-enhanced.js` | Enhanced background with Wistia JSON API calls, format extraction, HLS/MP4 routing |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing |
| Auth | `auth.js` + `auth/auth-config.js` + `auth/auth-api.js` + `auth/auth-storage.js` + `auth/auth-token.js` + `auth/auth-telemetry.js` | OTP login, entitlement checks, trial management |
| Auth UI | `auth-ui.js` | Popup OTP auth UI wiring and normalization |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Bootstrap | `bootstrap.js` | WXT bootstrap entrypoint (no-op) |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://*.thinkific.com/*`, `https://thinkific.com/*`, `https://www.thinkific.com/*` |
| **Video ID Detection** | Wistia hashed ID via `[data-wistia-hashed-id]`, `[data-wistia-id]` attributes, `_wq` global, `wistia_async` class names |
| **Title Sources** | LD+JSON `VideoObject.name`, `meta[property="og:title"]`, `meta[name="twitter:title"]`, `document.title` |
| **Thumbnail Sources** | LD+JSON `VideoObject.thumbnailUrl`, `og:image`, `twitter:image`, `og:image:secure_url` |
| **Duration Sources** | LD+JSON `VideoObject.duration`, `meta[property="video:duration"]`, ISO 8601 parsing |
| **Extra Metadata** | Description (`og:description`), dimensions (`og:video:width`, `og:video:height`), author/publisher from LD+JSON |
| **Format Sources** | A) Wistia Embed JSON API (`fast.wistia.com/embed/medias/{id}.json`) assets array, B) HTML5 `<video>` element, C) Content script Wistia ID extraction |
| **Wistia API URLs** | `https://fast.wistia.com/embed/medias/{id}.json`, `https://fast.wistia.net/embed/medias/{id}.json` |
| **CDN Detection** | `wistia.com`, `wistia.net`, `akamaihd.net`, `cloudfront.net` patterns via `webRequest.onHeadersReceived` |
| **Media Request Patterns** | `fast.wistia.com/embed/medias/*`, `fast.wistia.net/embed/medias/*`, `.m3u8`, `.mp4` |

### Format Object Structure

```json
{
  "format_id": "string (e.g., 'master (HLS)', 'delivery (HLS)')",
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
| **Converter** | Bundled HLS transmuxer (offscreen.js) |
| **Max Segment Retries** | 3 |
| **Backoff Base** | 500ms |
| **Backoff Strategy** | Linear |
| **Stall Timeout** | 30,000ms (30 seconds) |
| **Absolute Timeout** | None (disabled) |
| **Referer** | Thinkific school domain |
| **Origin** | Thinkific school domain |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-wistia-id]`, `[data-wistia-hashed-id]`, `video` element, nearest video container |
| **Button Class** | `.ph-download-button` |
| **Button Text** | "Download" with down-arrow icon |
| **Quality Popover** | Yes — `.ph-quality-popover` with format sorting by height (desc), MP4 before HLS |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |
| **Z-Index** | 10020 |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `serp-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-thinkific-video` |
| **Title** | "Download Thinkific Video" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `*.thinkific.com/*` and subdomains |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-DGzZ2Wge.css` (13.8 KB) |
| **Script Load Order** | `auth.js` (module) → `popup.js` (module) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `site-config.js` → `update-notifier.js` (defer) |
| **Sections** | Header, Activation section, Loading spinner, Error state, Video info card, Quality selector, Download button, Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser.mjs` / `build.js` (local) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/thinkific-downloader` |
| **Has Worktree?** | Yes — `.worktrees/thinkific-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `thinkific-downloader.zip` | <!-- TODO --> |
| Chrome | `thinkific-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `thinkific-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `thinkific-downloader-brave.zip` | <!-- TODO --> |
| Edge | `thinkific-downloader-edge.zip` | <!-- TODO --> |
| Opera | `thinkific-downloader-opera.zip` | <!-- TODO --> |
| Whale | `thinkific-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `thinkific-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `thinkific-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `thinkific-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_U56DUjfODaLd3K` |
| **Stripe Product Name** | Thinkific Downloader |
| **Stripe Monthly Price** | USD 9.00/month [thinkific-downloader-monthly-9] |
| **Stripe One-Time Price** | None |
| **Stripe Price IDs** | `price_1T6w0xDP7AOTRcvmoJZCXMAa` |

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
| Auth Config | `auth/auth-config.js` | Auth endpoint and entitlement configuration |
| Auth API | `auth/auth-api.js` | OTP send/verify, token exchange, entitlement check, trial status/consume |
| Auth Storage | `auth/auth-storage.js` | Device ID generation, stored auth retrieval |
| Auth Token | `auth/auth-token.js` | JWT parsing, entitlement matching |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging and telemetry dump |
| EventEmitter | Bundled in `offscreen.js` | Event dispatch |
