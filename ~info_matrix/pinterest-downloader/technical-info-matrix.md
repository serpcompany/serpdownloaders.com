# Technical Info Matrix — Pinterest Downloader

## Extension: `pinterest-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Pinterest |
| **Slug / ID** | `pinterest-downloader` |
| **Gecko ID** | `pinterest-downloader@serpapps.com` |
| **Category** | Media Downloader (Mainstream) |
| **Target Site(s)** | pinterest.com and subdomains, pinimg.com CDN |
| **Description** | Download Pinterest videos, images, and post text from visible posts. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/pinterest-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:28:36.100Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`pinterest-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/pinterest-downloader` |
| **Product Page** | https://serp.ly/pinterest-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4/image download + HLS stitching via offscreen FastStream (fMP4 segment merge) |
| **Quality Selection** | Yes — best progressive MP4 selected automatically from PinResource API video_list, DOM `<video>`, inline script data, and thumbnail-derived URLs |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — modular download manager (`download-manager/`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all visible pins on the current page |
| **In-Page Player Button?** | No — uses overlay buttons injected near Pinterest's Save button on each pin |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Downloads/Pinterest Downloader/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Multi-source: DOM `<video>` elements, inline script data (playable_url keys), PinResource API, pinimg.com thumbnail-to-video derivation, feed permalink resolution |
| **Image Detection** | DOM `<img>` elements on pinimg.com with minimum 180x180 size, sorted by area |
| **Text Extraction** | Post text from visible pins, saved as `.txt` files |
| **Asset Types** | Videos, Images, Text posts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `offscreen`, `scripting`, `cookies`, `declarativeNetRequest` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://pinterest.com/*`, `https://www.pinterest.com/*`, `https://*.pinterest.com/*`, `https://*.pinimg.com/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `content-enhanced-modular.js` — injected on `pinterest.com` at `document_idle` |
| **Content CSS** | `styles/overlay-buttons.css` (2.3 KB) — injected alongside content scripts |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (HLS fMP4 segment merge) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/` |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — HLS segment caching (`indexed-db.js`) |
| **Page Injection** | None — no `inject.js`; content script operates directly on DOM and inline script data |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Pinterest PinResource API (`/resource/PinResource/get/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **DNR Rules** | Yes — 3 dynamic rules (IDs 42001-42003) setting Origin/Referer headers for `pinimg.com` and `pinterest.com` requests |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced-modular.js` (2326 lines) | Asset detection — videos from DOM/inline/PinResource/thumbnails, images from DOM, text from posts; overlay button injection |
| Service Worker | `background-enhanced.js` (1512 lines, module) | Download orchestration, auth gating, HLS merge via offscreen, DNR header rules, PinResource fallback, blob fallback |
| Popup | `popup.html` + `popup-enhanced.js` | Asset browser UI with tabs (Videos/Images/Text), counts, bulk download |
| Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | HLS fMP4 segment merge (video + audio tracks) |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (6 files) | Configurable download progress panel with cross-tab sync |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| IndexedDB | `indexed-db.js` | Key-value segment storage for HLS processing |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://pinterest.com/*`, `https://www.pinterest.com/*`, `https://*.pinterest.com/*` |
| **Pin ID Pattern** | `/pin/(?:[\w-]+--)?(\d{5,})` extracted from URL pathname |
| **Title Sources** | `document.title`, author from `h2`/`h3`/`h4` in post root |
| **Thumbnail Sources** | `<video>` poster attribute, largest `<img>` in post root by area (aspect-ratio scored) |
| **Duration Sources** | Duration badge in root (matches `\d{1,2}:\d{2}` pattern in span/div text) |
| **Post Root Selectors** | `div[role='listitem']`, `article`, `[role='article']`, `[data-pagelet*='FeedUnit']`, `div[aria-posinset]` |
| **Video Signal Detection** | `<video>` element, `img[src*='/videos/thumbnails/']`, thumbnail-derived URLs, duration badge, `[aria-label*='video' i]`, `[aria-label*='play' i]`, `[data-test-id*='video' i]` |
| **Format Sources** | A) DOM `<video>`/`<source>` elements, B) Inline script keys (playable_url_quality_hd, playable_url, browser_native_hd_url, video_url, etc.), C) PinResource API (`/resource/PinResource/get/`), D) Thumbnail-to-video URL derivation (pinimg.com paths) |
| **Inline Script Keys** | `playable_url_quality_hd`, `playable_url`, `playable_url_dash`, `browser_native_hd_url`, `browser_native_sd_url`, `progressive_url`, `hls_playlist_url`, `dash_manifest_url`, `video_versions`, `video_url` |
| **Script URL Regex** | `/https?:\\\/\\\/[^"'\s<>]+?\.(?:mp4)[^"'\s<>]*/gi` |
| **CDN Detection** | `pinimg.com` and `pinterest.com` hosts via `FB_MEDIA_HOST_RE` |
| **PinResource API** | GET `/resource/PinResource/get/?data=...` with `field_set_key: "unauth_react_main_pin"` — extracts `videos.video_list` and `story_pin_data.pages[].blocks[].video.video_list` |
| **Thumbnail Derivation** | Converts pinimg.com `/videos/thumbnails/originals/` → `/videos/mc/720p/` with `.jpg` → `.mp4` extension swap |

### Video Candidate Scoring

| Key | Score |
|---|---|
| `playable_url_quality_hd` | 180 |
| `browser_native_hd_url` | 170 |
| `video_versions` | 165 |
| `video_url` | 160 |
| `playable_url` | 155 |
| `browser_native_sd_url` | 150 |
| `progressive_url` | 140 |
| `dom_video` | 70 |
| `regex_media_url` | 35 |
| `playable_url_dash` | 20 |
| `hls_playlist_url` | -140 |
| `dash_manifest_url` | -170 |
| MP4 extension bonus | +90 |
| pinimg.com host bonus | +35 |
| pinterest.com host bonus | +10 |
| Manifest-like penalty | -180 |

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Method** | FastStream offscreen merge (fMP4 segments) |
| **Segment Concurrency** | 8 parallel downloads (`mapLimit`) |
| **Merge Timeout** | 300,000ms (5 minutes) |
| **Offscreen Creation Timeout** | 30,000ms (30 seconds) |
| **Merge Message Type** | `MERGE_SEPARATE_AV_FASTSTREAM` |
| **Response Message Type** | `MERGE_SEGMENTS_RESPONSE` |
| **Stream Format** | `fmp4` |
| **Segment Storage** | IndexedDB with `pinterest_hls_<uuid>` key prefix |
| **Audio Track** | Separate audio playlist resolved from EXT-X-MEDIA groups |
| **Variant Selection** | Best (first) stream after sorting by resolution area then bandwidth |
| **Referer** | `https://www.pinterest.com/` |
| **Origin** | `https://www.pinterest.com` |

### Overlay Button Config

| Setting | Value |
|---|---|
| **Anchor Target** | Pinterest "Save" button — inserted as sibling before Save in its parent container |
| **Fallback Position** | Absolute top-right (8px, 8px) of post root; hidden until hover when no Save button found |
| **CSS File** | `styles/overlay-buttons.css` (2.3 KB) |
| **Z-Index** | `2147483647` |
| **Margin** | `margin-right: 8px` (inline mode) |
| **Display** | `flex` (inline mode), `none` (fallback mode — shown on hover) |
| **Visibility Gate** | Only visible if `isActivated = true` |

### Download Manager

| Setting | Value |
|---|---|
| **Architecture** | Modular — 6 files in `download-manager/` directory |
| **Position** | Configurable (`left`, `right`, `top`, `bottom`) — default `right` |
| **Theme** | `dark` (default), `light`, or `auto` |
| **Z-Index** | 2147483647 |
| **Auto-Hide** | 8 seconds after completion |
| **Max Visible Downloads** | 5 (scrollable beyond) |
| **Cross-Tab Sync** | Yes |
| **Features** | Cancel all, clear completed, per-download progress, compact mode, animation toggle |

### DNR Header Rules

| Rule ID | Purpose |
|---|---|
| 42001 | Set Origin + Referer for pinimg.com and pinterest.com (by requestDomains, media/XHR/main_frame/other) |
| 42002 | Set Origin + Referer for pinimg.com (by urlFilter, media/XHR/main_frame/other) |
| 42003 | Set Origin + Referer for pinimg.com and pinterest.com (by requestDomains, XHR/media/other) |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (7.9 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup-enhanced.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header (SERP Labs / Pinterest Downloader), Rescan button, Trial banner, Activation section, Stats grid (Videos/Images/Text Posts), Tab bar (Videos/Images/Text), "Download Visible" button, Asset list, Status footer |
| **Popup Title** | Video Downloader for Pinterest |
| **Stats Cards** | Video count, Image count, Text Post count |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/pinterest-downloader` |
| **Has Worktree?** | Yes — `.worktrees/pinterest-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `pinterest-downloader.zip` | 564 KB |
| Chrome | `pinterest-downloader-chrome.zip` | 576 KB |
| Chrome Store Sanitized | `pinterest-downloader-chrome-store-sanitized.zip` | 576 KB |
| Brave | `pinterest-downloader-brave.zip` | 576 KB |
| Edge | `pinterest-downloader-edge.zip` | 576 KB |
| Opera | `pinterest-downloader-opera.zip` | 576 KB |
| Whale | `pinterest-downloader-whale.zip` | 576 KB |
| Yandex | `pinterest-downloader-yandex.zip` | 576 KB |
| Firefox ZIP | `pinterest-downloader-firefox.zip` | 596 KB |
| Firefox XPI | `pinterest-downloader-firefox-unpacked.xpi` | 580 KB |

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
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TxrzM71bJXaFTC` |
| **Stripe Product Name** | Pinterest Downloader |
| **Stripe Monthly Price** | USD 9.00/month [pinterest-downloader-9-mo] |
| **Stripe One-Time Price** | None |
| **Stripe Price IDs** | `price_1SzwFeDP7AOTRcvm0U8Purst` |

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
| `brandAccent` | `#E60023` | Primary action/CTA (Pinterest red) |
| `brandAccentHover` | `#BD001D` | Hover state (darker red) |
| `bgDark` | `#1A0B0E` | Main dark background |
| `bgDarker` | `#261015` | Secondary dark background |
| `borderDark` | `#5E2B35` | Dark borders |
| `inputBorder` | `#7A3B47` | Input field borders |
| `textPrimary` | `#FFF8F8` | Main text |
| `textMuted` | `#E3C0C6` | Secondary text |
| `textSubtle` | `#F2DADD` | Subtle accent text |
| `success` | `#1FBF75` | Success state |
| `error` | `#EB5757` | Error state |
| `info` | `#E60023` | Info state (matches brand accent) |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e9ecef` | Light mode borders |
| `lightMutedText` | `#6c757d` | Light mode muted text |
| `lightPanelBg` | `#f8f9fa` | Light mode panel background |
| `lightMutedText2` | `#95a5a6` | Light mode secondary muted |
| `darkTextStrong` | `#2B1318` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube client/signature/SABR/UMP utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
