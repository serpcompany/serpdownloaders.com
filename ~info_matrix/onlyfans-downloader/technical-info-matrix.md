# Technical Info Matrix — OnlyFans Downloader

## Extension: `onlyfans-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP OnlyFans Downloader |
| **Slug / ID** | `onlyfans-downloader` |
| **Gecko ID** | `onlyfans-downloader@serpapps.com` |
| **Category** | Video / Media Downloader (Creator Platform) |
| **Target Site(s)** | onlyfans.com and subdomains |
| **Description** | Download OnlyFans videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 1.0.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/onlyfans-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-02T00:26:18.453Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | No |
| **GitHub Releases Repo** | `serpapps/onlyfans-downloader` |
| **Product Page** | https://serp.ly/onlyfans-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (m3u8 segment→MP4 transmux) |
| **Media Types** | Videos, Images/GIFs, Text Posts |
| **Quality Selection** | Yes — parsed from `<video>`/`<source>` tags, URL quality patterns (e.g. `_720p.mp4`, `_source.mp4`) |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | Yes (entitlement-gated) |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) with 7-file modular architecture |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — bulk gallery scanner with auto-scroll, media type filtering (all/photo/video), per-creator folder organization |
| **Bulk Saver** | Yes — `bulk-saver.html` + `bulk-saver.js` (File System Access API, user picks folder, IndexedDB-backed) |
| **In-Page Download Overlay?** | Yes — per-media download buttons on images and videos with hover overlay |
| **Side Panel** | Yes — opens `popup.html` as Chrome Side Panel on action click |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `OnlyFans/Videos/` or `OnlyFans/{creator}/Videos/` subfolder |
| **Desktop Notifications** | No (comment stub only) |
| **Video Detection** | Automatic — HTML5 `<video>` elements, `<source>` tags, DOM observation via MutationObserver |
| **Image Detection** | DOM scan for `img[src*=".onlyfans.com"]`, `video source`, background-image styles, `data-src` attributes |
| **DRM Detection** | Yes — probes HLS/DASH manifests for encryption; blocks DRM-protected content with user-facing message |
| **OnlyFans API Signing** | Yes — `dynamicRules.json` with `app_token`, `static_param`, `checksum_indexes`, `checksum_constant` for API request signing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `cookies`, `sidePanel` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://onlyfans.com/*`, `https://*.onlyfans.com/*`, `https://cdn2.onlyfans.com/*` |
| **Content Scripts (all_urls)** | `site-config.js` → `logger.js` → `download-manager/inline-manager.js` — injected at `document_start` |
| **Content Scripts (OnlyFans)** | `site-config.js` → `logger.js` → `content-enhanced.js` — injected on `onlyfans.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + DRM decryption) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (319 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching + bulk saver settings |
| **Page Injection** | None (no `inject.js`) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), OnlyFans API (`onlyfans.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | Video/image/text detection, format extraction, media scanning, download overlays, bulk gallery download |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, OnlyFans API signing, DRM probing, bulk operations, creator cache |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI with tabs (Videos, Images/GIFs, Text, Bulk), stats grid, asset list, bulk tools |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + DRM decryption (HLS-AES128, DASH-CENC) |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (7 files) | Modular in-page download progress panel (config, state, UI, task registry, inline manager, integration helper) |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| Bulk Saver | `bulk-saver.html` + `bulk-saver.js` | File System Access API saver page for bulk writes to user-selected folder |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://onlyfans.com/*`, `https://*.onlyfans.com/*` |
| **Video Detection** | `document.querySelectorAll('video, video.vjs-tech')` filtered by OnlyFans domain in `src` |
| **Title Sources** | `meta[property="og:title"]`, `meta[name="twitter:title"]`, `<title>`, fallback "OnlyFans Video" |
| **Thumbnail Sources** | `video.poster`, `og:image`, `twitter:image` |
| **Duration Sources** | `<video>` element `duration` property |
| **Quality Patterns** | `_720p.mp4`, `_1080p.mp4` (regex `_([0-9]{3,4})p\.mp4`), `_source.mp4`, `_original.mp4` |
| **Format Sources** | A) HTML5 `<video>` `currentSrc`/`src`, B) `<source>` child elements with `label`/`size`/`data-res` attributes |
| **Media Scan Selectors** | `img[src*=".onlyfans.com"]`, `video source[src*="onlyfans.com"]`, `div[style*="background-image"]`, `[data-src*="onlyfans.com"]`, and more |
| **Skip Filters** | URLs matching `emoji|avatar|header|profile|thumb|icon|logo` are excluded from bulk scans |
| **Player Init** | `forceInitPlayer()` — scrolls to video wrappers, simulates clicks on play buttons to force stream loading |
| **Overlay Containers** | `.b-post__media__item-inner`, `.video-wrapper`, `.video-js`, `[data-component="PostMedia"]`, `[data-component="PostMediaVideo"]`, `[data-component="PostMediaImage"]`, PhotoSwipe (`.pswp__*`) |

### Format Object Structure

```json
{
  "url": "string",
  "ext": "mp4",
  "format_id": "720p | 1080p | source | original | mp4",
  "height": "number | null",
  "protocol": "http | m3u8_native"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Converter** | `SimpleHLS2MP4Converter` |
| **Offscreen Purpose** | "Merge HLS playlists into MP4 for OnlyFans downloads" |
| **DRM Decryption** | HLS-AES128 (`modules/of-drm/decrypt/hls-aes128.mjs`), DASH-CENC (`modules/of-drm/decrypt/dash-cenc.mjs`) |
| **Memory-Adaptive Batching** | Yes — `getOptimalBatchSize()` adjusts based on `performance.memory`, total segments |
| **Batch Size (>1000 segs)** | 3 |
| **Batch Size (>500 segs)** | 5 |
| **Batch Size (default)** | 8 |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Architecture** | Modular — 7-file split (`download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-task-registry.js`, `inline-manager.js`, `integration-helper.js`, `download-manager.js`) |
| **Position** | Right side |
| **Theme** | Dark |
| **Max Visible Downloads** | 5 |
| **Auto-Hide After Complete** | 0 (disabled) |
| **Auto-Remove on Complete** | Yes (2500ms delay) |
| **CSS Prefix** | `of` |
| **Message Namespace** | `of` |
| **Z-Index Base** | 2147483647 |
| **Cross-Tab Sync** | Yes |
| **Features** | Per-download progress bars, speed display, cancel buttons, collapse/expand, cross-tab synchronization |

### OnlyFans API Integration

| Field | Value |
|---|---|
| **API Base URL** | `https://onlyfans.com` |
| **Dynamic Rules File** | `dynamicRules.json` |
| **App Token** | `33d57ade8c02dbc5a333db99ff9ae26a` |
| **Static Param** | `BnTJR0JYEYxVWyntoVX10xIPp5YG8GrE` |
| **Checksum Format** | `51683:{}:{:x}:693aa5f9` |
| **Checksum Indexes** | 32-element array |
| **Checksum Constant** | 860 |
| **Cookie Access** | Yes — `cookies` permission for `onlyfans.com` |
| **Reserved Path Slugs** | `my`, `home`, `messenger`, `messages`, `settings`, `accounts`, `subscriptions`, `feed`, `stories`, `notifications`, `bookmarks`, `search`, `posts`, `chat`, `vault`, `discover`, `explore`, `login`, `signup`, etc. |
| **Creator Cache TTL** | 120,000ms (2 minutes) |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (14.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup-enhanced.js` → `auth-ui.js` → `trial-banner.js` → `popup-ui-overrides.js` → `update-notifier.js` |
| **Tabs** | Videos, Images/GIFs, Text, Bulk |
| **Stats Grid** | Video count, Image/GIF count, Text post count |
| **Sections** | Header (SERP Labs / OnlyFans Downloader), Trial banner, Activation section, Stats grid, Tab bar, Panel actions (Download Visible, Bulk Tools), Asset list, Status footer |
| **Rescan Button** | Yes — "Rescan" ghost button in header |

### Bulk Download System

| Feature | Details |
|---|---|
| **Scan Function** | `scanOnlyFansMedia(autoScroll)` — DOM scan + optional auto-scroll (up to 40 steps, 900px each) |
| **Media Types** | All, Photo, Video (radio picker) |
| **Gallery Detection** | `isOnlyFansGalleryPage()` — checks for `/media/` URL or gallery DOM elements |
| **Creator Slug Parsing** | Extracts from URL path, validates against reserved slugs, 2-64 char alphanumeric |
| **Folder Organization** | `OnlyFans/{creator}/Videos/` or `OnlyFans/Videos/` (no creator) |
| **Bulk Saver** | File System Access API — user picks destination folder, IndexedDB persists directory handle |
| **Concurrency** | 3 concurrent downloads |
| **Supported Extensions** | Videos: mp4, mov, m4v, webm, mkv, avi, m3u8, mpd. Images: jpg, jpeg, png, gif, webp, avif |
| **Extension Priority** | MP4 (80) > MOV (70) > M4V (68) > WebM (65) > MKV (62) > AVI (58) > M3U8 (35) > MPD (34) |

### In-Page Download Overlays

| Setting | Value |
|---|---|
| **Style ID** | `of-download-overlay-styles` |
| **Wrapper Class** | `of-dl-wrap` |
| **Button Class** | `of-dl-btn` |
| **Button Size** | 34x34px |
| **Button Style** | Rounded (8px radius), semi-transparent black background, white icon |
| **Hover Color** | `rgba(0, 175, 240, 0.25)` (OnlyFans blue tint) |
| **Z-Index** | 2147483643 |
| **Position** | Absolute top-right (8px offset) |
| **MutationObserver** | Yes — watches `document.documentElement` for new media elements |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/onlyfans-downloader` |
| **Has Worktree?** | Yes — `.worktrees/onlyfans-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `onlyfans-downloader.zip` | 1.74 MB |
| Chrome | `onlyfans-downloader-chrome.zip` | 1.74 MB |
| Brave | `onlyfans-downloader-brave.zip` | 1.74 MB |
| Edge | `onlyfans-downloader-edge.zip` | 1.74 MB |
| Opera | `onlyfans-downloader-opera.zip` | 1.74 MB |
| Whale | `onlyfans-downloader-whale.zip` | 1.74 MB |
| Yandex | `onlyfans-downloader-yandex.zip` | 1.74 MB |
| Firefox ZIP | `onlyfans-downloader-firefox.zip` | 1.74 MB |
| Firefox XPI | `onlyfans-downloader-firefox-unpacked.xpi` | 1.74 MB |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | DRM-protected videos cannot be downloaded (user-facing message displayed) |
| **Site API Changed?** | <!-- TODO --> |
| **User Reports** | <!-- TODO --> |

### Business / Monetization

| Field | Value |
|---|---|
| **Pricing Model** | Freemium (entitlement-gated, trial downloads then paid license) |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | `jr6N8ZFfnZa2K90F6pDn` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNdRxTOeK7sm` |
| **Stripe Product Name** | Onlyfans Downloader |
| **Stripe Monthly Price** | USD 27.00/month [Subscription - Onlyfans Downloader] | USD 37.00/month [Subscription - Onlyfans Downloader] | USD 37.00/month [Subscription - OnlyFans Downloader] | USD 9.00/month [onlyfans-downloader monthly] |
| **Stripe One-Time Price** | USD 37.00/one_time | USD 47.00/one_time [onlyfans-downloader $47] | USD 57.00/one_time [onlyfans-downloader] |
| **Stripe Price IDs** | `price_1SdS6rDP7AOTRcvmnFgg9D3k`, `price_1SeJduDP7AOTRcvmCLZoZ9M8`, `price_1Sm9mBDP7AOTRcvmfszxoKZP`, `price_1SpfnLDP7AOTRcvmjHpejToz`, `price_1SphG8DP7AOTRcvmekJ62sSZ`, `price_1SpX5ZDP7AOTRcvmqzdg1fTx`, `price_1Symt0DP7AOTRcvmXqF2urXw` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Logger Prefixes** | `OF-CS` (content script), `OF-BG` (background), `OF-PU` (popup-enhanced) |
| **Max Log Lines** | 5000 |
| **Log Export** | Data URL export (`exportLogsAsDataUrl()`) |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#00AFF0` | Primary action/CTA (OnlyFans blue) |
| `brandAccentHover` | `#00AFF0` | Hover state (same as primary) |
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
| HLS→MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH→MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | IndexedDB-backed network/caching |
| Utils | `modules/utils/` | General utilities (15 modules) |
| YouTube | `modules/youtube/` | YouTube client/signature/SABR utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (319 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.5 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
