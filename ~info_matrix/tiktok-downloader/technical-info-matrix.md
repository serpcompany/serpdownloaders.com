# Technical Info Matrix — TikTok Downloader

## Extension: `tiktok-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for TikTok |
| **Slug / ID** | `tiktok-downloader` |
| **Gecko ID** | `tiktok-downloader@serpapps.com` |
| **Category** | Video Downloader (Social Media) |
| **Target Site(s)** | tiktok.com and subdomains, tiktokcdn.com, tiktokv.com, byteoversea.com, musical.ly |
| **Description** | Download TikTok videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/tiktok-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:34:17.851Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`tiktok-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/tiktok-video-downloader` |
| **Product Page** | https://serp.ly/tiktok-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (fetch + data URL download), page-initiated download fallback, DNR Referer injection |
| **Quality Selection** | Yes — bitrateInfo multi-quality from embedded JSON (SIGI_STATE, UNIVERSAL_DATA, NEXT_DATA), playAddr, downloadAddr |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | No — uses browser save-as dialog |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No — uses download overlay system on feed cards and single video pages |
| **Download Overlays** | Yes — per-video download overlay buttons on feed cards, user profile grids, music/hashtag pages, and single video pages |
| **Context Menu** | No |
| **Auto-Save** | No — uses `saveAs: true` dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — multi-strategy: SIGI_STATE, __UNIVERSAL_DATA_FOR_REHYDRATION__, __NEXT_DATA__, HTML5 video element, script tag regex, network cache, fetch/XHR interception, Performance API, React Fiber extraction, page-world inject.js hooks |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `contextMenus`, `tabs`, `scripting`, `cookies`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.tiktok.com/*`, `https://*.tiktok.com/*`, `https://*.tiktokcdn.com/*`, `https://*.tiktokv.com/*`, `https://*.byteoversea.com/*`, `https://*.musical.ly/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content.js` — injected on `tiktok.com` at `document_start` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | No |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | None |
| **HLS->MP4 Transmuxer** | None |
| **DASH->MP4** | None |
| **MP4Box** | None |
| **Reencoder** | None |
| **Network Utils** | None (uses native fetch) |
| **IndexedDB** | Yes — `TikTokDownloaderDB` with `fileStore` object store |
| **Page Injection** | `inject.js` — hooks Response.prototype.json/text/arrayBuffer and XMLHttpRequest to capture TikTok feed API JSON payloads; posts `TT_FEED_ITEMS` messages; handles `TT_PAGE_DOWNLOAD` and `TT_PAGE_BLOB_DOWNLOAD` page-world downloads |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad API (`api.gumroad.com`), TikTok Web API (`www.tiktok.com/api/item/detail/`, `m.tiktok.com/api/item/detail/`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **DNR Rules** | Dynamic — temporary Referer rules injected per-download to force `Referer: https://www.tiktok.com/` on CDN hosts |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Multi-strategy video detection, feed card overlay system, single video overlay, fetch/XHR interception, React Fiber extraction, SPA navigation monitoring |
| Service Worker | `background-enhanced.js` (module) | Download orchestration with TikTok auth/cookies, web extraction fallback, API fallback, DNR Referer rules, activation gating |
| Popup | `popup.html` + `popup.js` + `popup-enhanced.js` | User-facing UI, video info display, overlay toggle, activation flow |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Logger | `logger.js` | Structured logging with level gating and console patching |
| Site Config | `site-config.js` | Brand colors (TikTok red/cyan), endpoints, feature flags, CSS variable injection |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-world Response/XHR hooks to capture feed JSON, page-context download handler |
| IndexedDB | `indexed-db.js` | Key-value storage for background service worker |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.tiktok.com/*`, `https://*.tiktok.com/*` |
| **Video ID Patterns** | `/video/(\d+)` (19-digit numeric ID from URL), `data.id`, `data.aweme_id`, `data.awemeId`, `data.itemId`, `data.item_id`, `data.video.id`, `data.video.vid` |
| **Title Sources** | `meta[property="og:title"]`, `meta[name="twitter:title"]`, `[data-e2e="browse-video-desc"]`, `[data-e2e="video-desc"]`, `title`, `h1`, `videoData.desc` |
| **Thumbnail Sources** | `og:image`, `twitter:image`, `og:image:secure_url`, `twitter:image:src`, `video[poster]`, `video.cover.url_list`, `video.originCover.url_list`, `video.dynamicCover.url_list` |
| **Duration Sources** | `<video>` element `.duration`, `videoData.video.duration` |
| **Extra Metadata** | Author (`[data-e2e="video-author-uniqueid"]`), Description (`[data-e2e="video-desc"]`), Likes (`[data-e2e="like-count"]`), feed index (`data-scroll-index`) |
| **Extraction Strategies** | 1) SIGI_STATE / sigi-persisted-data, 2) __UNIVERSAL_DATA_FOR_REHYDRATION__, 3) __NEXT_DATA__, 4) HTML5 video element (non-blob), 5) Network cache (`window.__tiktokVideoUrl`), 6) Script tag regex for MP4/CDN URLs |
| **Background Extraction** | Web page fetch + embedded JSON parse (universal, sigi, next), TikTok API fallback (`/api/item/detail/`) |
| **Script URL Regex** | `/https?:\/\/[^\s"']+\.mp4[^\s"']*/gi`, `/https?:\/\/[^\s"']*tiktok[^\s"']*\.mp4[^\s"']*/gi`, `/https?:\/\/[^\s"']*muscdn[^\s"']*\.mp4[^\s"']*/gi`, `/https?:\/\/[^\s"']*byteoversea[^\s"']*\.mp4[^\s"']*/gi`, `/https?:\/\/[^\s"']*tiktokcdn[^\s"']*\.mp4[^\s"']*/gi`, `/https?:\/\/[^\s"']*tiktokv\.com[^\s"']*/gi`, `/https?:\/\/v\d+-webapp[^\s"']*tiktok[^\s"']*/gi` |
| **CDN Detection** | fetch/XHR interception for `.mp4` and `mime_type=video_mp4` URLs; Performance API resource entries |
| **Feed API Patterns** | `/api/(preload|recommend|post|aweme|item|feed|user|search|browse|music|challenge)/(item|item_list|detail|list|feed|aweme|posts?)` |
| **Inject Message Type** | `TT_FEED_ITEMS` (feed item structs), `TT_PAGE_DOWNLOAD` (page-world download), `TT_PAGE_BLOB_DOWNLOAD` (blob download) |

### Format Object Structure

```json
{
  "url": "string",
  "format_id": "string (main | download | GearName | play_addr | download_addr | direct_from_content | content_format)",
  "format_note": "string | null",
  "quality": "string | null",
  "width": "number | null",
  "height": "number | null",
  "filesize": "number | null",
  "bitrate": "number | null",
  "preference": "number",
  "cookies": "object | null",
  "http_headers": "object | null"
}
```

### Cookie Handling

| Parameter | Value |
|---|---|
| **Cookie Source** | Browser cookie store via `chrome.cookies.getAll` for `.tiktok.com` and `www.tiktok.com` |
| **Priority Cookies** | `ttwid`, `sid_tt`, `msToken`, `tt_csrf_token`, `passport_csrf_token`, `s_v_web_id`, `tt_webid`, `odin_tt`, `cmpl_token`, `tt_webid_v2` |
| **HTML Cookie Extraction** | `tt_chain_token` from inline scripts and `document.cookie` assignments |
| **Referer** | `https://www.tiktok.com/` (injected via DNR dynamic rules) |
| **User-Agent** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36` |
| **Origin** | `https://www.tiktok.com` |

### Download Overlay System

| Setting | Value |
|---|---|
| **Feed Card Overlays** | Yes — download status bubble + download button on each feed card |
| **Single Video Overlays** | Yes — positioned absolute top-right (15px, 15px) on video container |
| **Overlay Class** | `.tiktok-download-overlay`, `.single-video-overlay` |
| **Overlay Toggle** | Popup toggle stored in `chrome.storage.sync` key `tiktokOverlayEnabled` |
| **Video Container Selectors** | `[data-e2e="recommend-list-item-container"]`, `[data-e2e="user-post-item"]`, `[data-e2e="music-item"]`, `.css-fxdm8v-DivItemContainer.e1ymawm01` |
| **Single Video Container Selectors** | `[data-e2e="video-detail-container"]`, `[data-e2e="single-video-feed"]`, CSS class containers, video parent |
| **Video Section Selectors** | `[data-e2e="feed-video"]`, `section[role="button"]`, various CSS class containers |
| **IntersectionObserver** | Yes — `rootMargin: 100px`, `threshold: 0.1` |
| **MutationObserver** | Yes — watches for VIDEO, SCRIPT#SIGI_STATE, SCRIPT#__UNIVERSAL_DATA_FOR_REHYDRATION__, SCRIPT#__NEXT_DATA__ additions |
| **SPA Navigation** | URL polling (1s interval), `history.pushState`/`replaceState` override, `hashchange`/`popstate` listeners |
| **Hard Refresh** | Yes — on navigation from user/category page to video/photo page |
| **Click Detection** | Capture-phase click listener to proactively hide overlays on video/photo link clicks |
| **Debug Panel** | Alt+Shift+L toggles feed DOM tracker panel (fixed bottom-right, 360px wide) |
| **React Fiber Extraction** | Yes — walks `__reactFiber$` tree to find `itemStruct.video` data |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (17.7 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header, Help text display, Boot splash, Activation section (email + license key), Main content (status, overlay toggle), Footer |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/tiktok-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/tiktok-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `tiktok-downloader.zip` | 0.71 MB |
| Chrome | `tiktok-downloader-chrome.zip` | 0.72 MB |
| Chrome Store Sanitized | `tiktok-downloader-chrome-store-sanitized.zip` | 0.72 MB |
| Brave | `tiktok-downloader-brave.zip` | 0.72 MB |
| Edge | `tiktok-downloader-edge.zip` | 0.72 MB |
| Opera | `tiktok-downloader-opera.zip` | 0.72 MB |
| Whale | `tiktok-downloader-whale.zip` | 0.72 MB |
| Yandex | `tiktok-downloader-yandex.zip` | 0.72 MB |
| Firefox ZIP | `tiktok-downloader-firefox.zip` | 0.75 MB |
| Firefox XPI | `tiktok-downloader-firefox-unpacked.xpi` | 0.73 MB |

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
| **Gumroad Product ID** | `i-IoFAg7PcsSLBpn6ydXFg==` |
| **GH License ID** | `DR1MlJ8MWHfiUSKrlqzV` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNHfVFiv2Dd6` |
| **Stripe Product Name** | Tiktok Downloader |
| **Stripe Monthly Price** | USD 9.00/month [tiktok-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6yDP7AOTRcvm66nWvCXX`, `price_1T6w18DP7AOTRcvmE2Adn1Cl` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < info(20) < warn(30) < error(40) < silent(90)` |
| **Content Script Logger** | `[TTD]` prefix with mirror via `ttd_log` background message |
| **Logger Singleton** | `TikTokLogger` / `__TIKTOK_LOGGER_SINGLETON__` with console patching |

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
| `brandAccent` | `#FF3B5C` | Primary action/CTA (TikTok red) |
| `brandAccentHover` | `#E42B4A` | Hover state (darker red) |
| `brandAccentAlt` | `#25F4EE` | Secondary accent (TikTok cyan) |
| `bgDark` | `#1b1b1b` | Main dark background |
| `bgDarker` | `#2a2a2a` | Secondary dark background |
| `bgLight` | `#000000` | Light mode override (black) |
| `bgPanel` | `#080808` | Panel background |
| `borderDark` | `#333` | Dark borders |
| `borderCard` | `#1A1A1A` | Card borders |
| `inputBorder` | `#555` | Input field borders |
| `borderInput` | `#262626` | Alternative input borders |
| `textPrimary` | `#FFFFFF` | Main text |
| `textMuted` | `#9A9CA6` | Secondary text |
| `textSubtle` | `#cccccc` | Subtle accent text |
| `textSecondary` | `#E5E5E5` | Secondary text |
| `textMetadata` | `#A8ADB8` | Metadata text |
| `success` | `#25F4EE` | Success state (TikTok cyan) |
| `successAlt` | `#25F4EE` | Alternative success |
| `error` | `#FF3B5C` | Error state (TikTok red) |
| `info` | `#25F4EE` | Info state (TikTok cyan) |
| `warning` | `#F97316` | Warning state (orange) |
| `brandGradientStart` | `#FF3B5C` | Gradient start (red) |
| `brandGradientEnd` | `#25F4EE` | Gradient end (cyan) |
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
| Auth API | `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume |
| Auth Storage | `auth/auth-storage.js` | Device ID generation, stored auth reading |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging and dump |
| Auth Token | `auth/auth-token.js` | Entitlement name resolution and checking |
| IndexedDB | `indexed-db.js` | Key-value store (set, get, remove) for background worker |
