# Technical Info Matrix — Coomer Downloader

## Extension: `coomer-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Coomer Downloader |
| **Slug / ID** | `coomer-downloader` |
| **Gecko ID** | `coomer-downloader@serpapps.com` |
| **Category** | Media Downloader (Multi-Format) |
| **Target Site(s)** | coomer.su (and legacy coomer.st, coomer.party) |
| **Description** | Download Coomer videos, images, GIFs, and post text from visible posts |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/coomer-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- TODO: no build-info.json present --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`coomer-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/coomer-downloader` |
| **Product Page** | https://serp.ly/coomer-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct media download (blob fetch fallback) + in-page anchor fallback + text-as-data-URL |
| **Media Types** | Videos (mp4, m4v, mov, webm, mkv, avi, wmv), Images (jpg, jpeg, png, gif, webp, avif, bmp), Text posts (saved as .txt) |
| **Quality Selection** | No — downloads original quality from Coomer API |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | Yes — in-page download manager (`download-manager.js`) |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — scans all visible posts on a creator page (up to 60 post IDs), extracts all media and text |
| **In-Page Player Button?** | Yes — `player-button.js` (targets `#player`, `.mainPlayerDiv`) |
| **Context Menu** | No — not configured (no `contextMenus` permission) |
| **Auto-Save** | Yes — saves to `Downloads/Coomer Downloader/{author}/{date-title}.ext` folder, no save-as dialog |
| **Desktop Notifications** | Yes (notifications permission declared) |
| **Media Detection** | API-based — fetches post data from `/api/v1/{service}/user/{username}/post/{postId}` and `/api/v1/{service}/user/{username}/posts?o={offset}` |
| **Concurrency** | 5 concurrent post detail fetches |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `notifications` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://coomer.st/*`, `https://*.coomer.st/*`, `https://coomer.party/*`, `https://*.coomer.party/*`, `https://coomer.su/*`, `https://*.coomer.su/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content.js` — injected on `coomer.st`, `coomer.party`, `coomer.su` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (media streaming support) |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | Yes — `modules/mediabunny/` |
| **HLS Library** | `modules/hls/` |
| **HLS->MP4 Transmuxer** | `modules/hls2mp4/simple-converter.mjs` (SimpleHLS2MP4Converter) |
| **DASH->MP4** | `modules/dash2mp4/` |
| **MP4Box** | `modules/mp4box.mjs` (318 KB) |
| **Reencoder** | `modules/reencoder/` |
| **Network Utils** | `modules/network/` |
| **IndexedDB** | Yes — segment caching |
| **Page Injection** | `inject.js` — monitors XMLHttpRequest + fetch() |
| **External APIs Called** | Coomer API (`coomer.su/api/v1/`), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Coomer API integration, post scanning, media/image/text asset extraction |
| Player Button | `player-button.js` | In-page download button on video player |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, blob fetch fallback, text document generation, notifications |
| Popup | `popup.html` + `popup.js` | Multi-tab UI (Videos / Images / Text), asset list, bulk download |
| Offscreen | `offscreen.html` + `offscreen.js` | Media streaming support |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Download Manager | `download-manager.js` | In-page download progress panel |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context XHR/fetch monitor |

### API-Based Media Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://coomer.st/*`, `https://*.coomer.st/*`, `https://coomer.party/*`, `https://*.coomer.party/*`, `https://coomer.su/*`, `https://*.coomer.su/*` |
| **Domain Detection** | `domainMatchesCoomer()` — checks hostname ends with `coomer.st`, `coomer.party`, or `coomer.su` |
| **Route Parsing** | `getRouteContext()` — extracts `service`, `username`, `postId` from URL path `/{service}/user/{username}/post/{postId}` |
| **Post List API** | `{origin}/api/v1/{service}/user/{username}/posts?o={offset}` |
| **Post Detail API** | `{origin}/api/v1/{service}/user/{username}/post/{postId}` |
| **Post ID Sources** | 1) URL path (single post), 2) DOM links matching `/post/(\d+)`, 3) API post listing |
| **Max Post IDs** | 60 per scan |
| **Concurrency** | 5 concurrent post detail fetches |
| **Asset Types** | `video`, `image`, `text` — inferred from file extension |
| **Video Extensions** | mp4, m4v, mov, webm, mkv, avi, wmv |
| **Image Extensions** | jpg, jpeg, png, gif, webp, avif, bmp |
| **Text Extraction** | HTML stripped from `post.content` or `post.substring` via `stripHtml()` |
| **Media URL Builder** | `buildMediaUrl(server, path, name, origin)` — constructs `{server}/data{path}?f={name}` |
| **Fallback Servers** | `n4.coomer.party`, `n4.coomer.su`, `n4.coomer.st` |
| **Media Sources** | Post file, post attachments, detail attachments, detail videos, detail previews |
| **Deduplication** | By `{type}:{url}` for media, `text:{postId}:{text}` for text |

### Asset Object Structure

```json
{
  "id": "string (type:postId:path)",
  "type": "video | image | text",
  "title": "string",
  "url": "string (media URL) | null (text type)",
  "text": "string (text type only)",
  "extension": "string",
  "source": "Post file | Post attachment | Attachment | Video attachment | Post content",
  "author": "string (username)",
  "postId": "string",
  "permalink": "string (normalized post URL)",
  "pageUrl": "string (current page URL)",
  "published": "string | null"
}
```

### Download Flow

| Step | Implementation |
|---|---|
| **Auth Gate** | `ensureDownloadAccess()` — checks activation status and trial remaining |
| **Text Downloads** | `startTextDownload()` — builds text document, encodes as data URL, triggers `chrome.downloads.download()` |
| **Media Downloads** | `startMediaDownload()` — 1) Direct `chrome.downloads.download()`, 2) Fallback: `fetchMediaBlob()` -> object URL download, 3) Fallback: delegate to content script `downloadAssetInPage` |
| **Text Document Format** | Title, separator line, post URL, text content, capture URL, timestamp |
| **Filename Pattern** | `Coomer Downloader/{author}/{date - title}.{ext}` |
| **Date Prefix** | First 10 chars of `published` field (YYYY-MM-DD) |
| **Conflict Action** | `uniquify` (auto-rename on collision) |

### Player Button Config

| Setting | Value |
|---|---|
| **Container Targets** | `#player`, `.mainPlayerDiv` |
| **Button Text** | "Download" with down arrow icon |
| **Visibility Gate** | Only visible if `isActivated = true` |
| **Reactive** | Watches `chrome.storage.onChanged` for activation updates |

### Download Manager Panel

| Setting | Value |
|---|---|
| **Position** | Fixed top-right (slides from -400px to 20px) |
| **Panel ID** | `coomer-download-manager` |
| **Card Width** | 380px |
| **Max Height** | 80vh (scrollable) |
| **Z-Index** | 10000 |
| **Border** | 2px solid var(--brand-accent) |
| **Border Radius** | 10px |
| **Font** | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |
| **Auto-Hide** | 3 seconds after completion |
| **Features** | Minimize/close buttons, per-download progress bars, speed display, cancel buttons |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup-enhanced.css` (7.9 KB), `styles/styles.css` (8.8 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header with "SERP Labs" kicker, Trial banner, Activation section, Stats grid (Videos / Images-GIFs / Text Posts), Tab bar (Videos / Images / Text), Download Visible button, Asset list, Status footer |
| **Tabs** | `videos`, `images`, `texts` — each tab filters the asset list |
| **Download Action** | "Download Visible" button downloads all assets in the active tab |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/coomer-downloader` |
| **Has Worktree?** | Yes — `.worktrees/coomer-downloader/` |
| **Approximate Build Size** | ~1.12 MB |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `coomer-downloader.zip` | ~1.12 MB |
| Chrome | `coomer-downloader-chrome.zip` | ~1.12 MB |
| Chrome Store Sanitized | `coomer-downloader-chrome-store-sanitized.zip` | ~1.12 MB |
| Brave | `coomer-downloader-brave.zip` | ~1.12 MB |
| Edge | `coomer-downloader-edge.zip` | ~1.12 MB |
| Opera | `coomer-downloader-opera.zip` | ~1.12 MB |
| Whale | `coomer-downloader-whale.zip` | ~1.12 MB |
| Yandex | `coomer-downloader-yandex.zip` | ~1.12 MB |
| Firefox ZIP | `coomer-downloader-firefox.zip` | ~1.12 MB |
| Firefox XPI | `coomer-downloader-firefox-unpacked.xpi` | ~1.12 MB |

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
| **Stripe Product ID** | `prod_TfxYLMxlfjtFuJ` |
| **Stripe Product Name** | Coomer Downloader |
| **Stripe Monthly Price** | USD 9.00/month [coomer-downloader monthly] |
| **Stripe One-Time Price** | USD 17.00/one_time |
| **Stripe Price IDs** | `price_1SibdVDP7AOTRcvmnmxmy66K`, `price_1SymsrDP7AOTRcvmvMTyqcUy` |

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
| HLS Parser | `modules/hls/` | M3U8 playlist parsing |
| HLS->MP4 | `modules/hls2mp4/` | HLS segment transmuxing (SimpleHLS2MP4Converter) |
| DASH->MP4 | `modules/dash2mp4/` | DASH stream conversion |
| MediaBunny | `modules/mediabunny/` | Audio/video codec handling |
| Reencoder | `modules/reencoder/` | Video re-encoding |
| Network | `modules/network/` | HTTP fetch utilities |
| Utils | `modules/utils/` | General utilities |
| MP4Box | `modules/mp4box.mjs` | ISOBMFF manipulation (318 KB) |
| FSBlob | `modules/FSBlob.mjs` | Virtual filesystem blob ops (4.3 KB) |
| EventEmitter | `modules/eventemitter.mjs` | Event dispatch (3.3 KB) |
| Localize | `modules/Localize.mjs` | i18n support |
| YouTube | `modules/youtube/` | YouTube utilities |

### Key Differentiator

Unlike single-format video downloaders, Coomer Downloader extracts **all media types** from creator posts: videos, images, GIFs, and text content. It uses the Coomer API to fetch post data programmatically, then builds download URLs from attachment metadata. The popup organizes assets into tabbed categories (Videos / Images-GIFs / Text Posts) with per-category counts and a "Download Visible" bulk action. Text posts are saved as formatted `.txt` documents with metadata headers. All files are organized into `Coomer Downloader/{author}/{date - title}.ext` folder structure.
