# Technical Info Matrix — SproutVideo Downloader

## Extension: `sprout-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP SproutVideo Downloader |
| **Slug / ID** | `sprout-downloader` |
| **Gecko ID** | `sprout-downloader@serpapps.com` |
| **Category** | Video Downloader (Professional / Business) |
| **Target Site(s)** | sproutvideo.com, videos.sproutvideo.com, images.sproutvideo.com, *.vids.io, *.cloudfront.net (SproutVideo CDN) |
| **Description** | Download SproutVideo videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/sprout-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-02-26T13:18:36.185Z |
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
| **GitHub Releases Repo** | `serpapps/sprout-video-downloader` |
| **Product Page** | https://serp.ly/sprout-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (offscreen streaming) + HLS Stitching (authenticated m3u8 with policy signatures) |
| **Quality Selection** | Yes — parsed from SproutVideo player data (base64-encoded), direct download entries, HLS manifests |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager/`) with inline overlay + task registry |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | No |
| **In-Page Overlay Button?** | Yes — overlay download button on detected SproutVideo players and embeds |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to Downloads folder, no save-as dialog |
| **Desktop Notifications** | No |
| **Video Detection** | Automatic — embed URL parsing, iframe scanning, base64 player data decoding, direct video URL detection, script content analysis |
| **Password-Protected Videos** | Yes — popup includes password input section for locked SproutVideo embeds |
| **Multiple Video Selection** | Yes — popup supports selecting from multiple detected videos on a single page |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*.sproutvideo.com/*`, `https://videos.sproutvideo.com/*`, `https://images.sproutvideo.com/*`, `https://*.vids.io/*`, `https://*.cloudfront.net/*` |
| **Content Scripts (Set 1)** | `site-config.js` + `logger.js` + `download-manager/inline-manager.js` — injected on `<all_urls>` at `document_start` |
| **Content Scripts (Set 2)** | `site-config.js` + `logger.js` + `content-enhanced.js` — injected on SproutVideo/vids.io domains + all URLs at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen-faststream.html` + `offscreen-faststream-legacy.js` |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/` |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — `indexed-db.js` (segment caching, web-accessible resource) |
| **FastStream** | Yes — `offscreen-faststream.html` + `offscreen-faststream-legacy.js` (preferred via `PREFER_FASTSTREAM` flag) |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), SproutVideo embed/video APIs (`videos.sproutvideo.com`, `*.vids.io`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content-enhanced.js` | SproutVideo detection, embed URL parsing, iframe scanning, base64 player data decoding, metadata extraction, overlay button injection |
| Inline Manager | `download-manager/inline-manager.js` | Early-load download manager for in-page download UI |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, player data frame extraction, HLS URL construction |
| Popup | `popup.html` + `popup-enhanced.js` | User-facing UI, quality selector, auth flow, password entry, multi-video selection |
| Offscreen | `offscreen.html` | Standard offscreen download document |
| FastStream Offscreen | `offscreen-faststream.html` + `offscreen-faststream-legacy.js` | FastStream download pipeline |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager/` (7 files) | `download-manager.js`, `download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-task-registry.js`, `inline-manager.js`, `integration-helper.js` |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |
| IndexedDB | `indexed-db.js` | Key-value store for segment caching |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://*.sproutvideo.com/*`, `https://videos.sproutvideo.com/*`, `https://*.vids.io/*`, `https://*/*` (all URLs for embedded players) |
| **Video ID Patterns** | `videos.sproutvideo.com/embed/([a-f0-9]{18})`, `[\w-]+.vids.io/videos/([a-f0-9]{18})`, `(?:embed/|videos/)([a-f0-9]{18})` from iframes |
| **Title Sources** | SproutVideo player data (`playerData.title`), `meta[property="og:title"]`, `meta[name="twitter:title"]`, `h1`, `<title>` |
| **Thumbnail Sources** | `playerData.posterframe_url`, `og:image`, `twitter:image`, `img[alt*="thumbnail"]`, `img[alt*="video"]`, `.sprout-video img`, `video[poster]` |
| **Duration Sources** | `playerData.duration` (seconds, floor to integer) |
| **Player Data Extraction** | Base64-encoded `dat`/`playerInfo`/`videoInfo` variables decoded from `<script>` content, also checked as window globals via `chrome.scripting.executeScript` across all frames (MAIN world preferred) |
| **Direct Video Detection** | `<video>` and `<source>` elements with non-blob `src` containing `cloudfront.net`, `sproutvideo`, or `.mp4` |
| **Embed Data Fields** | `videoUid`, `title`, `duration`, `posterframe_url`, `hls`, `signatures`, `base`, `s3_user_hash`, `s3_video_hash`, `downloads` |

### Format Object Structure

```json
{
  "format_id": "string (hls | source | uhd | sd | hd | etc.)",
  "url": "string",
  "ext": "mp4",
  "protocol": "m3u8_native | https",
  "format_note": "string (HLS (Authenticated) | SOURCE | UHD | etc.)",
  "quality": "number (2=source, 1=hls/uhd, 0=other)",
  "_fragmentQuery": "string (HLS fragment auth query, HLS only)",
  "_keyQuery": "string (HLS key auth query, HLS only)"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **URL Construction** | `https://{base}.videos.sproutvideo.com/{s3_user_hash}/{s3_video_hash}/video/index.m3u8?{manifestQuery}` |
| **Authentication** | Policy-based signatures from `playerData.signatures` — separate queries for manifests (m), fragments (t), and keys (k) |
| **Policy Query Builder** | `buildPolicyQuery(playerData, type)` constructs signed query strings |
| **Format Sorting** | Direct downloads preferred over HLS; sorted by quality descending, then height, then bitrate |

### Download Manager

| Setting | Value |
|---|---|
| **Task Registry** | `DownloadTaskRegistry` with configurable max concurrent downloads (default: 3) |
| **State Persistence** | `chrome.storage.local` with key `downloadManagerGlobalState` |
| **Sync Throttle** | 400ms between storage writes |
| **Entry Pruning** | Terminal entries (completed/cancelled/failed/error) pruned after 5 minutes |
| **State Sanitization** | All download entries validated and clamped (progress 0-100, required fields defaulted) |
| **Download Manager Files** | `download-manager.js`, `download-manager-config.js`, `download-manager-state.js`, `download-manager-ui.js`, `download-task-registry.js`, `inline-manager.js`, `integration-helper.js` |

### Overlay Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `.sproutvideo-player`, `.sproutvideo-video-wrapper`, `.sprout-player`, `.sprout-video`, `.video-container`, `.videoWrapper`, `iframe[src*='videos.sproutvideo.com/embed']`, `iframe[src*='vids.io']`, `video` |
| **Wrapper Selectors** | `.sproutvideo-player`, `.sprout-video`, `.sproutvideo-video-wrapper`, `.sprout-player`, `.svp-player`, `.video-container`, `.videoWrapper`, `.embed-responsive`, `.videoWrapper-16x9` |
| **Button Text** | "Download" |
| **Button Position** | Absolute, top: 12px, right: 12px |
| **Button Attribute** | `data-sprout-download-button` |
| **Visibility Gate** | Only enabled if `isActivated = true` AND `ENABLE_DOWNLOAD_MANAGER` AND `ENABLE_DOWNLOAD_OVERLAY` flags |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (10.5 KB), `styles/popup-enhanced.css` (14.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup-enhanced.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Help text banner, Header, Boot splash (loading), Activation section (email + license key), Embed detected notice, Video selection (multi-video), Password section, Status, Video info card (thumbnail + title), Quality selector, Download button, Error display |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` |
| **Build Log Level** | `error` |
| **GitHub Release?** | Yes — `serpapps/sprout-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/sprout-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `sprout-downloader.zip` | 1.29 MB |

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
| **Gumroad Product ID** | `4mxgY8SYSG1LeWAGjt0OuA==` |
| **GH License ID** | `4w1yiRAd3xeBdrKVXToA` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_TadNhJ7zdF84uR` |
| **Stripe Product Name** | Sprout Video Downloader |
| **Stripe Monthly Price** | USD 9.00/month [sprout-video-downloader $9/mo 2026-02-09] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SdS6xDP7AOTRcvmIZf2eWTA`, `price_1Syyp8DP7AOTRcvmuBqLMYgk` |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` |
| **Mirror to Background** | Yes |
| **Log Global** | `SPROUT_LOG_LEVEL` |
| **Log Hierarchy** | `debug < log < warn < error < none` |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#00ce7c` | Primary action/CTA (green) |
| `brandAccentHover` | `#00b36a` | Hover state (darker green) |
| `bgDark` | `#172126` | Main dark background |
| `bgDarker` | `#111a1e` | Secondary dark background |
| `borderDark` | `#1f2d33` | Dark borders |
| `inputBorder` | `#28414a` | Input field borders |
| `textPrimary` | `#ffffff` | Main text |
| `textMuted` | `#98afb7` | Secondary text |
| `textSubtle` | `#c4d6dd` | Subtle accent text |
| `success` | `#31d158` | Success state |
| `error` | `#ff5c5c` | Error state |
| `info` | `#23a6f0` | Info state |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e6edf0` | Light mode borders |
| `lightMutedText` | `#617380` | Light mode muted text |
| `lightPanelBg` | `#f4f8f9` | Light mode panel background |
| `lightMutedText2` | `#8da1ac` | Light mode secondary muted |
| `darkTextStrong` | `#102229` | Dark strong text |

### Feature Flags

| Flag | Default | Purpose |
|---|---|---|
| `ENABLE_DOWNLOAD_MANAGER` | `true` | Enable in-page download manager panel |
| `ENABLE_DOWNLOAD_OVERLAY` | `true` | Enable overlay download buttons on video players |
| `PREFER_FASTSTREAM` | `true` | Prefer FastStream download pipeline over standard offscreen |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS to MP4 | `modules/hls2mp4/` | HLS segment transmuxing |
| DASH to MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| YouTube | `modules/youtube/` | YouTube utility module |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops |
| EventEmitter | `modules/eventemitter.mjs` + `modules/eventemitter/` | Event dispatch |
| Localize | `modules/Localize.mjs` | i18n support |

### Web Accessible Resources

| Resource | Purpose |
|---|---|
| `offscreen-faststream.html` | FastStream offscreen document |
| `offscreen-faststream-legacy.js` | FastStream legacy download script |
| `indexed-db.js` | IndexedDB key-value helper |
