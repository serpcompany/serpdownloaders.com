# Technical Info Matrix — Dailymotion Downloader

## Extension: `dailymotion-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Dailymotion |
| **Slug / ID** | `dailymotion-downloader` |
| **Gecko ID** | `dailymotion-downloader@serpapps.com` |
| **Category** | Video Downloader (Mainstream) |
| **Target Site(s)** | dailymotion.com and subdomains, dmcdn.net CDN |
| **Description** | Download Dailymotion videos in available qualities. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/dailymotion-downloader` |
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
| **Store-Sanitized Build?** | Yes (`dailymotion-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/dailymotion-downloader` |
| **Product Page** | https://serp.ly/dailymotion-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (chrome.downloads + offscreen fallback) + HLS Stitching (m3u8 segment download via offscreen) |
| **Quality Selection** | Yes — parsed from Dailymotion player metadata API (`/player/metadata/video/{id}`), master HLS playlist variant expansion |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | No — progress reported via popup status bar and runtime messages |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Player Button?** | No |
| **Context Menu** | Yes — "Download Dailymotion video" on page context |
| **Auto-Save** | Yes — saves to `Downloads/Dailymotion/` folder, no save-as dialog |
| **Desktop Notifications** | Yes (notifications permission granted) |
| **Video Detection** | Automatic — content script extracts video ID from URL, background fetches metadata API |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen`, `notifications`, `contextMenus` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://dailymotion.com/*`, `https://www.dailymotion.com/*`, `https://*.dailymotion.com/*`, `https://*.dmcdn.net/*` |
| **Content Scripts** | `content-scripts/content.js` — injected on `dailymotion.com` and `*.dmcdn.net` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (HLS segment processing + MP4 streaming download) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | Built-in — master playlist parsing + media segment parsing in `background-enhanced.js` |
| **HLS-to-MP4 Transmuxer** | Offscreen-based (messages: `PROCESS_HLS_SEGMENTS`, `HLS_PROCESSING_COMPLETE`) |
| **DASH-to-MP4** | No |
| **MP4Box** | Bundled in `offscreen.js` (352 KB total) |
| **Page Injection** | None — no `inject.js` |
| **External APIs Called** | Dailymotion Player Metadata API (`/player/metadata/video/{id}`), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-scripts/content.js` | Video ID extraction from URL, title/thumbnail/duration metadata scraping from page DOM and meta tags |
| Service Worker | `background-enhanced.js` (module) | Metadata API fetch, HLS playlist parsing, format extraction, download orchestration, auth gating, offscreen management, context menu |
| Popup | `popup.html` + `popup.js` | User-facing UI, video info card, quality/format selector, download trigger |
| Offscreen | `offscreen.html` + `offscreen.js` | HLS segment stitching to MP4 blob, direct MP4 streaming download |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Logger | `logger.js` | Structured logging, background mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Bootstrap | `bootstrap.js` | Extension bootstrap |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://dailymotion.com/*`, `https://www.dailymotion.com/*`, `https://*.dailymotion.com/*`, `https://*.dmcdn.net/*` |
| **Video ID Pattern** | `/video/([^/?#]+)` — alphanumeric Dailymotion video ID from URL path |
| **Video URL Pattern** | `https://(?:www\.)?dailymotion\.com/video/` |
| **Title Sources** | `meta[property="og:title"]`, `meta[name="twitter:title"]`, `h1` element, `document.title` (cleaned of " - video Dailymotion" suffix) |
| **Thumbnail Sources** | `og:image`, `og:image:secure_url`, `twitter:image`, fallback to `https://www.dailymotion.com/thumbnail/video/{id}` |
| **Duration Sources** | `meta[property="video:duration"]`, `meta[name="video:duration"]`, `meta[itemprop="duration"]`, JSON-LD `VideoObject` with ISO 8601 duration (`PT#H#M#S`) |
| **Description Sources** | `og:description`, `meta[name="description"]`, `meta[name="twitter:description"]` |
| **Metadata API** | `https://www.dailymotion.com/player/metadata/video/{videoId}` — returns qualities object, manifest URL, poster, duration, title |
| **Format Sources** | A) Metadata API `qualities` object (keyed by resolution), B) Metadata API `manifest_url` / `streaming_url` fallback, C) HLS master playlist variant expansion |

### Format Object Structure

```json
{
  "format_id": "string (e.g. '720p', 'auto-0')",
  "qualityLabel": "string (e.g. '720p', 'Auto')",
  "ext": "m3u8 | mp4",
  "format_type": "hls | http",
  "url": "string",
  "height": "number | undefined",
  "bandwidth": "number | undefined",
  "source": "metadata | master-playlist"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Playlist Parser** | Built-in `parseMasterVariants()` + `parseMediaSegments()` in background-enhanced.js |
| **Master Playlist** | Parses `#EXT-X-STREAM-INF` for RESOLUTION and BANDWIDTH, resolves variant URLs |
| **Media Playlist** | Parses `#EXTINF` durations, `#EXT-X-MAP` init segments, segment URLs |
| **Max Nesting Depth** | 3 levels of nested HLS playlists |
| **Variant Selection** | Sorted by height descending, highest quality selected |
| **Format Deduplication** | By URL — first occurrence kept |
| **Format Sorting** | By height descending, HLS before HTTP at same height |
| **Referer** | `https://www.dailymotion.com/` |
| **Credentials** | `include` (cookies sent) |
| **Cache** | `no-store` |

### Player Button Config

| Setting | Value |
|---|---|
| **In-Page Player Button** | Not included — no `player-button.js` file |

### Download Manager Panel

| Setting | Value |
|---|---|
| **In-Page Download Manager** | Not included — no `download-manager.js` file |
| **Progress Tracking** | Via popup status bar and runtime messages (`dailymotionDownloadProgress`, `dailymotionDownloadQueued`, `dailymotionDownloadComplete`, `dailymotionDownloadError`) |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-dailymotion-video` |
| **Title** | "Download Dailymotion video" |
| **Contexts** | `["page"]` |
| **URL Patterns** | `https://dailymotion.com/video/*`, `https://www.dailymotion.com/video/*`, `https://*.dailymotion.com/video/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (7.3 KB), `styles/popup-DGzZ2Wge.css` (13.8 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header (SERP Labs / Dailymotion Downloader / subtitle), Trial banner, Activation section, Stats grid (Video / Formats / Selected), Video card (thumbnail + title + meta), Download Selected button, Format list, Status footer |
| **Format Card** | Quality label, HLS/Direct pill, type/quality/source meta, Select + Download buttons |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (Node.js, uses PowerShell Compress-Archive) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/dailymotion-downloader` |
| **Has Worktree?** | Yes — `.worktrees/dailymotion-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `dailymotion-downloader.zip` | <!-- TODO --> |
| Chrome | `dailymotion-downloader-chrome.zip` | <!-- TODO --> |
| Chrome Store Sanitized | `dailymotion-downloader-chrome-store-sanitized.zip` | <!-- TODO --> |
| Brave | `dailymotion-downloader-brave.zip` | <!-- TODO --> |
| Edge | `dailymotion-downloader-edge.zip` | <!-- TODO --> |
| Opera | `dailymotion-downloader-opera.zip` | <!-- TODO --> |
| Whale | `dailymotion-downloader-whale.zip` | <!-- TODO --> |
| Yandex | `dailymotion-downloader-yandex.zip` | <!-- TODO --> |
| Firefox ZIP | `dailymotion-downloader-firefox.zip` | <!-- TODO --> |
| Firefox XPI | `dailymotion-downloader-firefox-unpacked.xpi` | <!-- TODO --> |

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
| **Stripe Product ID** | `prod_TadNBbXZ4w9iil` |
| **Stripe Product Name** | Dailymotion Downloader |
| **Stripe Monthly Price** | USD 9.00/month [dailymotion-downloader-monthly-9] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6jDP7AOTRcvmSPOaz9gI`, `price_1T6w10DP7AOTRcvmaasGwyk3` |

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

| Module | Path / File | Purpose |
|---|---|---|
| Offscreen Worker | `offscreen.js` (352 KB) | HLS segment stitching + MP4 streaming download |
| Background Legacy | `background.js` (66.6 KB) | Legacy background script (superseded by background-enhanced.js) |
| Auth Core | `auth.js` (6.9 KB) | OTP authentication module |
| Auth UI | `auth-ui.js` (15.4 KB) | Auth form rendering |
| Auth API | `auth/auth-api.js` | Auth API client |
| Auth Config | `auth/auth-config.js` | Auth configuration |
| Auth Storage | `auth/auth-storage.js` | Auth state persistence |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth usage tracking |
| Auth Token | `auth/auth-token.js` | Token management |
