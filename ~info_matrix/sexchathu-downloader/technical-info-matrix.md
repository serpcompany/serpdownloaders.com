# Technical Info Matrix — SexChatHU Downloader

## Extension: `sexchathu-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP SexChatHU Downloader |
| **Slug / ID** | `sexchathu-downloader` |
| **Gecko ID** | `sexchathu-downloader@serpapps.com` |
| **Category** | Live Stream Downloader (Adult) |
| **Target Site(s)** | sexchat.hu and subdomains |
| **Description** | Download SexChatHU live streams and recordings |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/sexchathu-downloader` |
| **Last Updated** | 2026-03-06 |
| **Build Date** | 2026-03-04T17:30:56.759Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`sexchathu-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/sexchathu-video-downloader` |
| **Product Page** | https://serp.ly/sexchathu-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | HLS Stitching (m3u8 segment to MP4 transmux) + Direct MP4 (offscreen streaming) + Live Capture (continuous HLS recording) |
| **Quality Selection** | Yes — parsed from HLS master playlist variants via SEXCHATHU API + CDN host probing |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | Yes — continuous HLS live capture with start/stop controls |
| **VR Support?** | Yes — detects VR camera settings (stereoPacking, frameFormat, horizontalAngle), appends VR suffix to filename |
| **Bulk Download?** | No |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`) |
| **Context Menu** | Yes — "Download SexChatHU Stream" on page and video contexts |
| **Auto-Save** | Yes — saves to `Downloads/SEXCHATHU/` folder, no save-as dialog |
| **Desktop Notifications** | Yes (permission declared) |
| **Video Detection** | API-driven — SexChatHU room list API + chat API (apn2.com), inject.js HLS discovery, CDN host probing |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `tabs`, `scripting`, `offscreen` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://*/*`, `https://sexchat.hu/*`, `https://www.sexchat.hu/*`, `https://chat.a.apn2.com/*`, `https://*.sexchat.hu/*` |
| **Content Scripts** | `site-config.js` → `logger.js` → `download-manager.js` → `content.js` → `player-button.js` — injected on `sexchat.hu` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (MP4 streaming + HLS transmux + Live capture) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS→MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH→MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (311 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — SexChatHU adapter: room list API, chat API, HLS host discovery, posts `SEXCHATHU_PAGE_DATA` messages |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), SexChatHU Room List (`sexchat.hu/ajax/api/roomList/babes`), SexChatHU Chat API (`chat.a.apn2.com/chat-api/index.php/room/getRoom`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Video/stream detection, room metadata extraction, page data relay |
| Player Button | `player-button.js` | In-page download button on video player with quality popover |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, offscreen management, context menu, SEXCHATHU API integration, Mouflon key decryption, VR metadata |
| Popup | `popup.html` + `popup.js` | User-facing UI, quality selector, live capture start/stop, auth flow |
| Offscreen | `offscreen.html` + `offscreen.js` | MP4 streaming download + HLS segment transmuxing + Live capture recording |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel with live capture segment counter |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context SexChatHU adapter — room list API, chat API, HLS discovery |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://sexchat.hu/*`, `https://www.sexchat.hu/*`, `https://*.sexchat.hu/*` |
| **Stream Detection** | API-driven: room list → chat API → HLS address extraction |
| **Room List API** | `https://sexchat.hu/ajax/api/roomList/babes` — finds model by screenname |
| **Chat API** | `https://chat.a.apn2.com/chat-api/index.php/room/getRoom?tokenID=guest&roomID=<id>` — retrieves onlineParams with HLS address |
| **Username Extraction** | URL path parsing: `/mypage/<lang>/<username>`, fallback path segment scanning |
| **Title Sources** | `displayName`, `modelName`, `modelUsername`, `document.title` |
| **Thumbnail Sources** | `meta[property="og:image"]` |
| **Page Type Detection** | `/videos?/` path → VOD, otherwise → live |
| **VOD Video Pattern** | `/<username>/videos/<videoId>` |
| **CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **HLS Discovery** | Performance API resource entries, `__PRELOADED_STATE__`, `__INITIAL_STATE__`, script regex, inject.js multi-source collection |
| **Inject Message Type** | `SEXCHATHU_PAGE_DATA` |
| **Inject Request Type** | `REQUEST_SEXCHATHU_DATA` |

### Format Object Structure

```json
{
  "quality": "string",
  "url": "string",
  "type": "hls | mp4",
  "format": "string",
  "height": "number | null",
  "requestUrl": "string | null",
  "extraParams": "object | null"
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
| **Live Poll Interval** | 1,400ms |
| **Live Idle Limit (with data)** | 35 |
| **Live Idle Limit (no data)** | 12 |
| **Live Max Playlist Errors** | 8 |
| **Live First Batch Limit** | 8 |
| **Live Tick Tail Limit** | 4 |
| **Referer** | `https://sexchat.hu/` |
| **Credential Mode** | `include` for sexchat.hu, doppiocdn.*, stripcdn*, sc-cdn.net, strpst.com |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `[data-testid="video-player"]`, `.player__video-wrapper`, `.video-player__wrapper`, `.media-player`, `#player-root`, `.video-player`, nearest video container |
| **Button Text** | "Download" with arrow icon |
| **Quality Popover** | Yes — format list with quality and type labels |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `SEXCHATHU-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress, speed display, cancel, live capture segment counter + elapsed time |

### Context Menu

| Field | Value |
|---|---|
| **Menu ID** | `download-sexchathu-video` |
| **Title** | "Download SexChatHU Stream" |
| **Contexts** | `["page", "video"]` |
| **URL Patterns** | `https://sexchat.hu/*`, `https://*.sexchat.hu/*`, `https://m.sexchat.hu/*` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/styles.css` (8.5 KB), `styles/popup-enhanced.css` (17.7 KB) |
| **Script Load Order** | `site-config.js` → `logger.js` → `auth.js` (module) → `popup.js` (defer) → `auth-ui.js` (defer) → `trial-banner.js` (defer) → `popup-ui-overrides.js` (defer) → `update-notifier.js` (defer) |
| **Sections** | Header, Quick help banner, Activation section, Loading spinner, Error state, Video info card (with VR badge), Quality selector, Live capture hint, Live capture status, Download button (Start/Stop for live), Progress bar |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/sexchathu-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/sexchathu-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `sexchathu-downloader.zip` | 1.24 MB |
| Chrome | `sexchathu-downloader-chrome.zip` | 1.15 MB |
| Chrome Store Sanitized | `sexchathu-downloader-chrome-store-sanitized.zip` | 1.15 MB |
| Brave | `sexchathu-downloader-brave.zip` | 1.15 MB |
| Edge | `sexchathu-downloader-edge.zip` | 1.15 MB |
| Opera | `sexchathu-downloader-opera.zip` | 1.15 MB |
| Whale | `sexchathu-downloader-whale.zip` | 1.15 MB |
| Yandex | `sexchathu-downloader-yandex.zip` | 1.15 MB |
| Firefox ZIP | `sexchathu-downloader-firefox.zip` | 1.16 MB |
| Firefox XPI | `sexchathu-downloader-firefox-unpacked.xpi` | 1.15 MB |

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
| **GH License ID** | `xTBDv7Igej2iWM7JjbSb` |
| **License Check Worker** | `https://ghl-check-license-worker-v2.farleythecoder.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |
| **Stripe Product ID** | `prod_U5nh5xUohqJgDX` |
| **Stripe Product Name** | SexChatHU Downloader |
| **Stripe Monthly Price** | USD 9.00/month [sexchathu-downloader-monthly-9] |
| **Stripe One-Time Price** | (none) |
| **Stripe Price IDs** | `price_1T7c6CDP7AOTRcvmwtvVYnrq` |

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
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brandAccent` | `#ff4f70` | Primary action/CTA (rose/pink) |
| `brandAccentHover` | `#e63d5d` | Hover state (darker rose) |
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
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (311 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.2 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.3 KB) |
| Localize | `modules/Localize.mjs` | i18n support |

### SEXCHATHU-Specific Technical Details

| Feature | Implementation |
|---|---|
| **Mouflon Key Decryption** | Decrypts encoded filenames from Mouflon CDN URIs using fallback keys |
| **Mouflon Fallback Keys** | `Ook7quaiNgiyuhai` → `EQueeGh2kaewa3ch` |
| **Meta Cache TTL** | 15,000ms (15 seconds) |
| **Config Cache TTL** | 300,000ms (5 minutes) |
| **VR Frame Format Map** | FISHEYE→F, PANORAMIC→P, CIRCULAR→C |
| **Default CDN Hosts** | `doppiocdn.com`, `doppiocdn.net`, `stripcdnm.com`, `stripcdnmd.com`, `stripcdntmp.com`, `sc-cdn.net` |
| **Credential Domains** | `sexchat.hu`, `doppiocdn.*`, `stripcdn*`, `sc-cdn.net`, `strpst.com` |
| **VOD API** | `https://sexchat.hu/api/front/v2/users/<id>/videos` |
| **Config API** | `https://sexchat.hu/api/front/v2/config` (cached 5 min) |
