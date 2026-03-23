# Technical Info Matrix — OnlyFans Bulk Downloader

## Extension: `onlyfans-bulk-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP OnlyFans Bulk Downloader |
| **Slug / ID** | `onlyfans-bulk-downloader` |
| **Gecko ID** | `onlyfans-bulk-downloader@serpapps.com` |
| **Category** | Bulk Media Downloader (Adult / Creator Platform) |
| **Target Site(s)** | onlyfans.com and subdomains |
| **Description** | Download OnlyFans profile videos, photos and more. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/onlyfans-bulk-downloader` |
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
| **Store-Sanitized Build?** | <!-- TODO --> |
| **GitHub Releases Repo** | `serpapps/onlyfans-bulk-downloader` |
| **Product Page** | https://serp.ly/onlyfans-bulk-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct file download via `chrome.downloads.download()` — images as JPG, videos as MP4 |
| **Bulk Download?** | Yes — core feature. Multi-creator batch download with configurable rate limiting, concurrency control, and download queue |
| **Media Types** | Photos (JPG, JPEG, PNG, GIF, WebP, AVIF), Videos (MP4, MOV, M4V, WebM, MKV, AVI, M3U8, MPD) |
| **Media Type Filter** | Yes — All Media, Photos Only, Videos Only |
| **Quality Selection** | No — downloads source quality directly from OnlyFans CDN |
| **Auth Required?** | OTP (email verification via auth.serp.co) + active OnlyFans session (cookies) |
| **Trial Downloads** | Yes — freemium trial via SERP auth entitlements |
| **Has Download Manager?** | Yes — dedicated progress page (`progress.html`) with queue management |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **In-Page Overlay Buttons?** | Yes — download buttons injected on media containers (images and videos) on OnlyFans pages |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `Downloads/OnlyFans/` folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Creator Selection** | Yes — fetches subscription list from OnlyFans API, allows multi-select |
| **Rate Limiter** | Yes — three presets: Conservative (20-30/min), Balanced (40-50/min), Aggressive (60-80/min) |
| **Concurrency Control** | Yes — configurable concurrent downloads (1-8) via progress UI |
| **Queue System** | Yes — persistent download queue with pause, resume, stop, cancel, retry capabilities |
| **Dynamic Rules** | Yes — `dynamicRules.json` for OnlyFans API request signing (static_param, checksum_indexes, format) |
| **Chat Media Download** | Yes — chat selection and chat list pages for downloading media from DMs |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `storage`, `cookies`, `downloads`, `tabs` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://onlyfans.com/*`, `https://www.onlyfans.com/*`, `https://*.onlyfans.com/*` |
| **Content Scripts** | `content-scripts/content.js` — injected on `onlyfans.com` at `document_idle`, `all_frames: true` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | No |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | No |
| **IndexedDB** | No |
| **Page Injection** | Content script injects download overlay buttons on media elements via MutationObserver |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), OnlyFans API (`onlyfans.com` — subscriptions, posts, user data, chat media) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **GH License ID** | `jr6N8ZFfnZa2K90F6pDn` |
| **CSP** | Default MV3 |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-scripts/content.js` | In-page media overlay buttons (download image/video), MutationObserver-based media detection |
| Service Worker | `background-enhanced.js` (module) | Auth gating, download orchestration (`downloadFile`, `downloadImage`, `downloadVideo`), bulk operation trial management |
| Popup | `popup.html` + `popup.js` | Auth flow (OTP), navigation hub to Settings, Selection, Progress pages |
| Settings | `settings.html` + `settings.js` | OnlyFans sign-in check, dynamic rules loading, rate limiter preset selection, setup completion |
| Selection | `selection.html` + `selection.js` | Fetches OnlyFans subscriptions, creator multi-select with avatars, media type filter |
| List Builder | `list.html` + `list.js` | Fetches posts from selected creators, extracts media URLs, builds download queue |
| Progress | `progress.html` + `progress.js` | Download queue dashboard with progress bars, concurrency control, pause/resume/stop/cancel/retry |
| Chat Selection | `chats.html` + `chats.js` | Select chat conversations for media download |
| Chat List | `chatlist.html` + `chatlist.js` | Browse and download media from chat messages |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| Config Module | `config-BKia6imP.js` | React runtime, paths, storage keys |
| API Module | `api-BDPCBKjU.js` | OnlyFans API wrappers (subscriptions, posts, user data) |
| Queue Module | `queue-Dj02yI2e.js` | Persistent download queue (DownloadQueue class) |
| Rate Limiter | `RateLimiter-C7Y5pLpb.js` | Configurable rate limiting with presets, jitter, backoff |
| Harness Module | `harness-BDpCB9YO.js` | OnlyFans login detection, dynamic rules loading |
| Selection Store | `selection-O4A74MfB.js` | Creator selection persistence |
| Chat Selection | `chat_selection-BAJ8ZE37.js` | Chat selection persistence |

### Content Script — Media Overlay

| Feature | Implementation |
|---|---|
| **Site Match** | `https://onlyfans.com/*`, `https://*.onlyfans.com/*` |
| **All Frames** | Yes |
| **Run At** | `document_idle` |
| **Auth Gate** | Checks `auth/check` message before booting overlay |
| **Detection Method** | MutationObserver on `document.documentElement` (childList + subtree), scroll/resize/hashchange/popstate events |
| **Debounce** | 200ms timeout on event-driven re-scans |
| **Media Container Selectors** | `.b-post__media__item-inner`, `.video-wrapper`, `.video-js`, `[data-component="PostMedia"]`, `[data-component="PostMediaVideo"]`, `[data-component="PostMediaImage"]`, `img`, `video`, `.vjs-poster`, `.pswp__container`, `#pswp__items`, `[role="dialog"]` variants, lightbox/modal/MediaViewer variants, `.pswp__item`, `.pswp__zoom-wrap`, `.pswp__img` |
| **Lightbox/Modal Support** | Yes — PhotoSwipe (`.pswp`), `[role="dialog"]`, `div[class*="lightbox"]`, `div[class*="modal"]`, `div[class*="MediaViewer"]` |
| **Overlay Position** | Absolute top-right (8px inset), z-index 2147483643. Lightbox/modal uses top-center with `translateX(-50%)` |
| **Button Size** | 34x34px, 8px border-radius, semi-transparent dark background |
| **Button Hover** | `rgba(0, 175, 240, 0.25)` (OnlyFans brand blue tint) |
| **Image Download** | Extracts `currentSrc` or `src`, sends `downloadImage` message to background |
| **Video Download** | Finds `<video>` in container, extracts `currentSrc` or `src`, sends `downloadVideo` message to background |

### Bulk Download Workflow

| Step | Page | Description |
|---|---|---|
| 1 | Settings (`settings.html`) | Verify OnlyFans sign-in, load dynamic rules, configure rate limiter preset, save settings |
| 2 | Selection (`selection.html`) | Fetch subscriptions from OnlyFans API (50 per page), display creators with avatars, multi-select, choose media type filter |
| 3 | List Builder (`list.html`) | Iterate selected creators, fetch posts via OnlyFans API, extract media URLs (images/videos), build download queue items |
| 4 | Progress (`progress.html`) | Process download queue with rate limiting, show real-time progress, concurrency control (1-8), pause/resume/stop/cancel/retry |

### Rate Limiter Presets

| Preset | Min Delay | Max Delay | Max Req/Min | Jitter | Backoff Multiplier | Max Backoff |
|---|---|---|---|---|---|---|
| **Conservative** | 2,000ms | 3,000ms | 25 | Yes | 2x | 30,000ms |
| **Balanced** | 1,000ms | 1,500ms | 45 | Yes | 1.5x | 20,000ms |
| **Aggressive** | 500ms | 1,000ms | 70 | Yes | 1.2x | 10,000ms |

### Download Queue Features

| Feature | Value |
|---|---|
| **Persistence** | `chrome.storage.local` key `od_queue` |
| **Concurrency** | User-configurable 1-8 concurrent downloads |
| **Item States** | `pending`, `running`, `done`, `error`, `cancelled` |
| **Controls** | Pause, Resume, Stop (pause + cancel running), Cancel All (clear queue), Clear Finished, Retry Cancelled |
| **Progress Display** | Per-item status, overall progress bar with percentage, count of done/running/pending/error/cancelled |
| **Auto-Refresh** | 1-second polling interval for state updates |
| **Storage Listener** | `chrome.storage.onChanged` for real-time `od_queue` updates |

### Background — Bulk Operation Trial Semantics

| Feature | Value |
|---|---|
| **Paid Users** | Always allowed, never consumes trial |
| **Trial Users** | Consumes one trial credit per "operation" (burst of downloads) |
| **Operation Tracking** | `activeDownloadIds` Set tracks running `chrome.downloads` IDs |
| **Operation End** | When all tracked download IDs complete or interrupt, `trialOperationActive` resets |
| **Message Actions** | `downloadFile`, `downloadImage`, `downloadVideo` |
| **File Naming** | `OnlyFans/{sanitizedBaseName}.jpg` (images), `OnlyFans/{sanitizedBaseName}.mp4` (videos), `OnlyFans/{sanitizedBaseName}` (generic) |
| **Filename Sanitization** | Removes `<>:"/\|?*`, control chars, collapses whitespace to `_`, max 200 chars |

### Dynamic Rules (OnlyFans API Auth)

| Field | Value |
|---|---|
| **File** | `dynamicRules.json` |
| **Purpose** | OnlyFans API request signing parameters |
| **Contents** | `static_param`, `format`, `checksum_indexes`, `checksum_constant` |
| **Loading** | Fetched at settings page load; stored via harness module |

### Media Detection & Extraction (List Builder)

| Feature | Implementation |
|---|---|
| **Video Extensions** | `mp4`, `mov`, `m4v`, `webm`, `mkv`, `avi`, `m3u8`, `mpd` |
| **Image Extensions** | `jpg`, `jpeg`, `png`, `gif`, `webp`, `avif` |
| **Video Priority** | mp4(80) > mov(70) > m4v(68) > webm(65) > mkv(62) > avi(58) > m3u8(35) > mpd(34) |
| **Image Priority** | jpg/jpeg(60) > png(58) > webp(57) > avif(56) > gif(45) |
| **Source Fields** | `media.files.full`, `media.files.source`, `media.type`, `media.mediaType`, `media.mimetype` |
| **API Endpoint** | OnlyFans posts API with pagination (offset-based) |
| **Subscription Fetch** | 50 per page via OnlyFans subscriptions API |

### Storage Keys

| Key | Purpose |
|---|---|
| `od_setupCompleted` | Settings setup completion flag |
| `od_selection` | Selected creators list |
| `od_queue` | Download queue state |
| `od_mediaType` | Media type filter (all/photos/videos) |
| `isActivated` | Legacy activation flag |
| `rateLimiterPreset` | Selected rate limiter preset |
| `authEmail` | Last entered email for auth |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-BsjAn_JX.css` (3.6 KB), `styles/popup-enhanced.css` (14.4 KB) |
| **Script Load Order** | `auth.js` (module) → `popup.js` (module) → `config-BKia6imP.js` (preload) → `auth-ui.js` → `trial-banner.js` → `site-config.js` → `popup-ui-overrides.js` → `update-notifier.js` |
| **Framework** | React (via `config-BKia6imP.js` bundle) |
| **Sections** | Header ("OnlyFans Downloader"), DEV mode banner (conditional), Auth section (OTP), Navigation links: 1. Configure Settings, 2. Select Creators, 3. View Downloads |
| **Navigation Gates** | Steps 2 and 3 disabled until `od_setupCompleted` is true |

### Multi-Page App Structure

| Page | HTML | JS | Purpose |
|---|---|---|---|
| Popup | `popup.html` | `popup.js` | Auth + navigation hub |
| Settings | `settings.html` | `settings.js` | Setup wizard (OF login, rules, rate limit, save) |
| Selection | `selection.html` | `selection.js` | Creator subscription browser + multi-select |
| List | `list.html` | `list.js` | Post enumeration + download queue builder |
| Progress | `progress.html` | `progress.js` | Queue dashboard + download execution |
| Chat Selection | `chats.html` | `chats.js` | Chat conversation selector |
| Chat List | `chatlist.html` | `chatlist.js` | Chat media browser + download |

### Feature Flags (SiteConfig.FLAGS)

| Flag | Default | Purpose |
|---|---|---|
| `ENABLE_DOWNLOAD_MANAGER` | `true` | Enable download manager functionality |
| `ENABLE_DOWNLOAD_OVERLAY` | `true` | Enable in-page media overlay buttons |
| `PREFER_FASTSTREAM` | `true` | Prefer fast streaming download method |

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
| **Pricing Model** | Freemium (trial downloads per operation, then paid license) |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | `jr6N8ZFfnZa2K90F6pDn` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNdRxTOeK7sm`, `prod_U5nhbkIqVotD4O` |
| **Stripe Product Name** | Onlyfans Bulk Downloader, Onlyfans Downloader |
| **Stripe Monthly Price** | USD 27.00/month [Subscription - Onlyfans Downloader] | USD 37.00/month [Subscription - Onlyfans Downloader] | USD 37.00/month [Subscription - OnlyFans Downloader] | USD 9.00/month [onlyfans-bulk-downloader-monthly-9] | USD 9.00/month [onlyfans-downloader monthly] |
| **Stripe One-Time Price** | USD 37.00/one_time | USD 47.00/one_time [onlyfans-downloader $47] | USD 57.00/one_time [onlyfans-downloader] |
| **Stripe Price IDs** | `price_1SdS6rDP7AOTRcvmnFgg9D3k`, `price_1SeJduDP7AOTRcvmCLZoZ9M8`, `price_1Sm9mBDP7AOTRcvmfszxoKZP`, `price_1SpfnLDP7AOTRcvmjHpejToz`, `price_1SphG8DP7AOTRcvmekJ62sSZ`, `price_1SpX5ZDP7AOTRcvmqzdg1fTx`, `price_1Symt0DP7AOTRcvmXqF2urXw`, `price_1T7c6CDP7AOTRcvm1Fmnxivn` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level (site-config.js)** | `debug` |
| **Log Level (background/content bundles)** | `error` |
| **Mirror to Background** | Yes |
| **Rate Limiter Logging** | Yes — `[RateLimiter]` prefixed console output |
| **Content Script Logging** | `OF overlay:` prefixed debug messages |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icon16.png` |
| Default 32px | 32x32 | `icon32.png` |
| Default 48px | 48x48 | `icon48.png` |
| Default 128px | 128x128 | `icon128.png` |

### Brand Colors (Background/Content Build)

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

### Brand Colors (site-config.js — Popup)

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

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | Vite + esbuild (minified bundles with content hashes) |
| **Watermarked?** | <!-- TODO --> |
| **GitHub Release?** | Yes — `serpapps/onlyfans-bulk-downloader` |
| **Has Worktree?** | Yes — `.worktrees/onlyfans-bulk-downloader/` |
| **React Bundled?** | Yes — React runtime included in `config-BKia6imP.js` |
| **Module Preloads** | `config-BKia6imP.js`, `RateLimiter-C7Y5pLpb.js`, `harness-BDpCB9YO.js`, `api-BDPCBKjU.js`, `selection-O4A74MfB.js`, `queue-Dj02yI2e.js`, `chat_selection-BAJ8ZE37.js` |

### Auth Module Structure

| File | Purpose |
|---|---|
| `auth.js` | Main auth entry — imports and re-exports auth subsystem |
| `auth-ui.js` | OTP UI rendering and interaction |
| `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume |
| `auth/auth-config.js` | Auth configuration (site name, entitlement name) |
| `auth/auth-storage.js` | Device ID generation, stored auth reading |
| `auth/auth-telemetry.js` | Auth event logging and telemetry |
| `auth/auth-token.js` | JWT parsing, entitlement checking |
