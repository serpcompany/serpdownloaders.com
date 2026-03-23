# Technical Info Matrix — 123Movies Downloader

## Extension: `123movies-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP 123Movies Downloader |
| **Slug / ID** | `123movies-downloader` |
| **Gecko ID** | `123movies-downloader@serpapps.com` |
| **Category** | Video Downloader |
| **Target Site(s)** | 123movies.com and all variants/mirrors (regex: `/^[\w.-]*(?:123movies\|123-movies)[\w.-]*$/i`) |
| **Description** | Download videos from web sites or just collect them in your video list without downloading them. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/123movies-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T16:59:43.989Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`123movies-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/123movies-downloader` |
| **Product Page** | https://serp.ly/123movies-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 → MP4 transmux), Direct MP4 fallback |
| **Quality Selection** | Yes — automatic best-bandwidth + manual dropdown (e.g. "720p (HLS)", "480p (High)") |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — modular in-page download manager |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **Video Detection** | Automatic — detects playback on matching hosts, extracts from og/meta tags + LD+JSON |
| **Chromecast Support** | Legacy references in locale strings (may be deprecated) |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `webRequest`, `webNavigation`, `downloads`, `tabs`, `storage`, `offscreen`, `scripting`, `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `http://*/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `content.js` — injected on all URLs, all frames, at `document_start` |
| **Background Service Worker?** | Yes — `background.js` (1,883 lines, 72 KB) |
| **Offscreen Document?** | Yes — `offscreen-hls.html` + `offscreen-hls.js` (HLS→MP4 transmux) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | `hls.mjs` (407 KB — full HLS.js) |
| **HLS→MP4 Transmuxer** | `hls2mp4/` module (MP4Generator, transmuxer, simple-converter) |
| **IndexedDB** | Yes — `VDPDownloaderDB` / `segmentStore` for segment caching |
| **Page Bridge** | `page-bridge.js` for cross-context CORS fetch |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **Forbidden Hosts** | youtube.com, tiktok.com, instagram.com, vk.com, dailymotion.com |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` (54 KB, 1,574 lines) | Video detection, HLS parsing, segment fetch, page bridge |
| Service Worker | `background.js` (72 KB, 1,883 lines) | Download orchestration, auth gating, message routing, CORS rules |
| Popup | `popup.html` + `popup.js` (45 KB bundled) | User-facing UI, quality selection, auth flow |
| Offscreen | `offscreen-hls.html` + `offscreen-hls.js` (45 KB) | HLS→MP4 conversion in isolated context |
| Auth | `auth.js` (27 KB) + `auth-ui.js` (22 KB) | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (5 files, ~76 KB total) | In-page download progress UI, state sync, config |
| Logger | `logger.js` (6.2 KB) | Structured logging, bg mirroring, emoji stripping |
| Site Config | `site-config.js` (4.7 KB) | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` (13 KB) | GitHub release version checks |
| Trial Banner | `trial-banner.js` (6.3 KB) | Free trial remaining badge |

### Download Manager Config

| Setting | Value |
|---|---|
| **Position** | Right |
| **Theme** | Dark |
| **Max Visible** | 10 downloads |
| **Auto-Hide Delay** | 8,000ms after complete |
| **Primary Color** | `#8dca5e` |
| **Background** | `#1b1b1b` |
| **CSS Prefix** | `vdp123movies` |
| **Panel ID** | `vdp123movies-download-manager` |
| **Z-Index** | 2147483647 (max) |

### Message Handlers (Service Worker)

| Message | Purpose |
|---|---|
| `action:downloadVideo` | Initiate download from popup |
| `action:getVideoFormats` | Fetch available quality formats |
| `action:getDownloadProgress` | Poll HLS download status |
| `action:startHlsDownload` | Begin HLS processing |
| `HLS_FRAME_READY` | Content script ready for HLS |
| `HLS_REGISTER_CONTEXT` | Register page context for CORS |
| `HLS_PAGE_FETCH` | Fetch via page bridge |
| `HLS_PROGRESS` | Segment download progress |
| `HLS_ERROR` | HLS download error |
| `HLS_SAVED` | HLS download complete |
| `OFFSCREEN_LOG` | Offscreen → background logging |
| `OFFSCREEN_DOWNLOAD_BLOB` | Receive completed MP4 blob |
| `DOWNLOAD_HELPER_REQUEST` | Blob download token request |
| `auth/check` | Verify activation status |
| `auth/login` | OTP login |
| `auth/verify` | OTP verification |
| `msgSetIcon` | Set highlight icon (video detected) |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Build Size (Standard ZIP)** | 302.8 KB |
| **Build Size (Chrome)** | 297.4 KB |
| **Build Size (Firefox XPI)** | 305.2 KB |
| **Build Size (Firefox ZIP)** | 324.0 KB |
| **Build Size (Chrome Store Sanitized)** | 297.4 KB |
| **Watermarked?** | Yes (hardened build pipeline) |
| **GitHub Release?** | Yes — `serpapps/123movies-downloader` |
| **Has Worktree?** | Yes — `.worktrees/123movies-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `123movies-downloader.zip` | 302.8 KB |
| Chrome | `123movies-downloader-chrome.zip` | 297.4 KB |
| Chrome Store Sanitized | `123movies-downloader-chrome-store-sanitized.zip` | 297.4 KB |
| Brave | `123movies-downloader-brave.zip` | 297.4 KB |
| Edge | `123movies-downloader-edge.zip` | 297.4 KB |
| Opera | `123movies-downloader-opera.zip` | 297.4 KB |
| Whale | `123movies-downloader-whale.zip` | 297.4 KB |
| Yandex | `123movies-downloader-yandex.zip` | 297.4 KB |
| Firefox ZIP | `123movies-downloader-firefox.zip` | 324.0 KB |
| Firefox XPI | `123movies-downloader-firefox-unpacked.xpi` | 305.2 KB |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | <!-- TODO --> |
| **Site API Changed?** | <!-- TODO: check if 123movies mirrors are still active --> |
| **User Reports** | <!-- TODO --> |

### Business / Monetization

| Field | Value |
|---|---|
| **Pricing Model** | Freemium (3 free downloads, then $9/month subscription) |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | Not configured (empty) |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNrEU3Zz1yAe` |
| **Stripe Product Name** | 123movies Downloader |
| **Stripe Monthly Price** | USD 9.00/month [123movies-downloader-monthly-9] |
| **Stripe One-Time Price** | (discontinued) |
| **Stripe Price IDs** | `price_1SdS6cDP7AOTRcvm3EeOELFV`, `price_1T6w1EDP7AOTRcvmGyzJkHN2` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` (most verbose) |
| **Mirror to Background** | Yes |
| **Full Manifest Logging** | Yes |
| **Telemetry Buffer Limit** | 300 events |
| **Remote Telemetry** | Auth errors sent to `auth.serp.co/telemetry/auth` |
| **Sensitive Data** | Redacted (token, authorization, cookie fields) |

### Icons

| Icon | Size | File Size |
|---|---|---|
| Default 16px | 16x16 | 323 B |
| Default 32px | 32x32 | 577 B |
| Default 48px | 48x48 | 844 B |
| Default 64px | 64x64 | 981 B |
| Default 96px | 96x96 | 1.5 KB |
| Default 128px | 128x128 | 1.9 KB |
| Highlight 16px | 16x16 | 578 B |
| Highlight 32px | 32x32 | 1.1 KB |
| Highlight 48px | 48x48 | 1.7 KB |
| Highlight 64px | 64x64 | 2.1 KB |
| Highlight 96px | 96x96 | 3.3 KB |
| Highlight 128px | 128x128 | 4.4 KB |
| **Total Icon Payload** | | **~23 KB** |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#8dca5e` | Primary action/CTA (green) |
| `brandAccentHover` | `#7cb850` | Hover state |
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

### Feature Flags

| Flag | Value |
|---|---|
| `ENABLE_SIDE_PANEL` | `false` |
| `ENABLE_STARTPAGE` | `false` |
