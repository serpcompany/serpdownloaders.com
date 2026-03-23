# Technical Info Matrix — LinkedIn Downloader

## Extension: `linkedin-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP LinkedIn DL |
| **Slug / ID** | `linkedin-downloader` |
| **Gecko ID** | `linkedin-downloader@serpapps.com` |
| **Category** | Media Downloader (Professional / Social) |
| **Target Site(s)** | linkedin.com and subdomains |
| **Description** | Download LinkedIn feed/post videos, images, and post text from visible content. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/linkedin-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | <!-- TODO: run build to generate --> |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`linkedin-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/linkedin-downloader` |
| **Product Page** | https://serp.ly/linkedin-learning-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct media download (chrome.downloads API) + blob fetch fallback + in-page anchor fallback |
| **Quality Selection** | No — downloads the source quality as served by LinkedIn CDN |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | No |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — "Download Visible" button downloads all detected assets from the current feed view |
| **In-Page Player Button?** | No |
| **Context Menu** | No |
| **Auto-Save** | Yes — saves to `LinkedIn Downloader/{author}/` folder, no save-as dialog |
| **Desktop Notifications** | Yes (permission declared) |
| **Media Detection** | Automatic — HTML5 `<video>` elements, `data-sources` attributes, Performance API resource entries, feed post images |
| **Asset Types** | Videos, Images, Text Posts |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `tabs`, `scripting`, `notifications` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://linkedin.com/*`, `https://*.linkedin.com/*`, `https://media.licdn.com/*`, `https://*.media.licdn.com/*`, `https://dms.licdn.com/*`, `https://*.dms.licdn.com/*` |
| **Content Scripts** | `site-config.js` -> `logger.js` -> `content.js` — injected on `linkedin.com` at `document_idle` |
| **Background Service Worker?** | Yes — `background-enhanced.js` (ES module type) |
| **Offscreen Document?** | No |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **HLS Library** | None |
| **HLS->MP4 Transmuxer** | None |
| **DASH->MP4** | None |
| **MP4Box** | None |
| **Reencoder** | None |
| **Network Utils** | None |
| **IndexedDB** | No |
| **Page Injection** | No — no `inject.js` |
| **External APIs Called** | SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self'; object-src 'self';` |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script | `content.js` | Feed/post scanning, video/image/text extraction, post card parsing, Performance API stream detection |
| Service Worker | `background-enhanced.js` (module) | Download orchestration, auth gating, blob fetch fallback, text document generation, filename building |
| Popup | `popup.html` + `popup.js` | User-facing UI, asset list with tabs (Videos/Images/Text), bulk download, rescan |
| Auth | `auth.js` + `auth/` (auth-api, auth-config, auth-storage, auth-telemetry, auth-token) | OTP login, entitlement checks, trial management |
| Logger | `logger.js` | Structured logging, bg mirroring |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Auth UI | `auth-ui.js` | Auth screen rendering |
| Popup UI Overrides | `popup-ui-overrides.js` | Popup customizations |

### Media Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://linkedin.com/*`, `https://*.linkedin.com/*` |
| **Supported Pages** | `/feed`, `/feed/update/`, `/posts/`, `/video/`, `/recent-activity/`, any page with `[data-view-name="feed-full-update"]` |
| **Post Card Selectors** | `[data-view-name="feed-full-update"]`, fallback to `main li` with media content, fallback to `main` |
| **Max Posts Scanned** | 80 |
| **Activity ID Pattern** | `activity:(\d+)` extracted from URN attributes and permalink URLs |
| **Permalink Patterns** | `/feed/update/urn:li:activity:\d+`, `/posts/[^/?#]+`, `/video/` |
| **Author Sources** | Profile links (`/in/`, `/company/`, `/school/`), anchor text, fallback "LinkedIn Creator" |
| **Post Text Sources** | `[data-view-name="feed-commentary"]`, `.update-components-text`, longest `<p>`/`<span>` over 40 chars |
| **Title Generation** | First 70 chars of post text, fallback `{author} post {index}` |
| **Image Detection** | `<img>` elements filtered by size (>=120px natural dimensions), CDN pattern `media.licdn.com/dms/image/`, content patterns (`feedshare-`, `article-share-`, `videocover-`) |
| **Image Exclusions** | `profile-displayphoto`, `profile-displaybackgroundimage`, `company-logo`, `ghost`, `emoji`, `sprite`, `icon`, `ads` |
| **Video Sources** | A) HTML5 `<video>` elements (currentSrc, src attribute), B) `data-sources` JSON attribute parsing, C) Performance API resource entries |
| **Video Stream Patterns** | `dms.licdn.com/playlist/vid/dash/`, `.mp4` |
| **Video ID Extraction** | `/playlist/vid/(?:dash|v2)/([^/?#]+)` |
| **CDN Domains** | `media.licdn.com`, `dms.licdn.com` |
| **Redirect Handling** | Decodes LinkedIn `/redir/redirect?url=` wrappers |

### Asset Object Structure

```json
{
  "id": "string (type:source:activityId:index:url)",
  "type": "video | image | text",
  "title": "string",
  "url": "string (media URL or null for text)",
  "text": "string (text posts only)",
  "extension": "string (mp4, jpg, etc.)",
  "source": "string (Video element | In-page blob stream | Embedded source metadata | Detected stream request | Feed image | Post content)",
  "author": "string",
  "permalink": "string (post URL)",
  "pageUrl": "string (current page URL)",
  "thumbnail": "string | null (video poster)",
  "published": "null"
}
```

### Download Pipeline

| Step | Implementation |
|---|---|
| **Auth Check** | `ensureDownloadAccess()` — verifies activation + trial/license status |
| **Text Downloads** | Builds plain-text document with title, post URL, text content, capture timestamp; downloads via data URL |
| **Media Downloads** | 1) Direct `chrome.downloads.download()`, 2) Fallback: fetch blob with referrer + create object URL, 3) Fallback: delegate to in-page anchor click |
| **Blob URL Handling** | Blob URLs delegated to content script `downloadAssetInPage` — creates `<a>` anchor and triggers click |
| **Filename Format** | `LinkedIn Downloader/{author}/{date} - {title}.{ext}` |
| **Filename Sanitization** | Strips `\/:*?"<>|`, collapses whitespace, max 72 chars author / 96 chars title |
| **Extension Normalization** | Videos: m3u8/mpd/txt/json/xml -> mp4. Images: validates jpg/jpeg/png/gif/webp/avif/bmp, defaults jpg |
| **Conflict Action** | `uniquify` (appends number if file exists) |
| **Object URL Cleanup** | Tracks object URLs by download ID, revokes on complete/interrupted |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheet** | `styles/popup-enhanced.css` (14.9 KB) |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (defer) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `popup-ui-overrides.js` (defer) -> `update-notifier.js` (defer) |
| **Sections** | Header (SERP Labs / LinkedIn Downloader), Trial banner, Activation section, Stats grid (Videos/Images/Text counts), Tab bar (Videos/Images/Text), Download Visible button, Asset list, Status footer |
| **Tab System** | Three tabs: Videos, Images, Text — switches visible asset list |
| **Rescan Button** | "Rescan" / "Scanning..." toggle — re-injects content script and extracts assets |
| **Bulk Download** | "Download Visible" — downloads all assets in current tab |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (canonical legacy build script, uses PowerShell Compress-Archive) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/linkedin-downloader` |
| **Has Worktree?** | Yes — `.worktrees/linkedin-downloader/` |

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
| **Stripe Product ID** | `prod_U56DaBYhYD2iBd` |
| **Stripe Product Name** | Linkedin Learning Downloader |
| **Stripe Monthly Price** | USD 9.00/month [linkedin-learning-downloader-monthly-9] |
| **Stripe One-Time Price** | None |
| **Stripe Price IDs** | `price_1T6w0uDP7AOTRcvmwD5G8xSQ` |

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
| `brandAccent` | `#0077b5` | Primary action/CTA (LinkedIn blue) |
| `brandAccentHover` | `#005e93` | Hover state (darker LinkedIn blue) |
| `bgDark` | `#1b1b1b` | Main dark background |
| `bgDarker` | `#2a2a2a` | Secondary dark background |
| `borderDark` | `#333` | Dark borders |
| `inputBorder` | `#555` | Input field borders |
| `textPrimary` | `#ffffff` | Main text |
| `textMuted` | `#999999` | Secondary text |
| `textSubtle` | `#cccccc` | Subtle accent text |
| `success` | `#4caf50` | Success state |
| `error` | `#f44336` | Error state |
| `info` | `#0077b5` | Info state (matches LinkedIn blue) |
| `lightBg` | `#ffffff` | Light mode background |
| `lightBorder` | `#e9ecef` | Light mode borders |
| `lightMutedText` | `#6c757d` | Light mode muted text |
| `lightPanelBg` | `#f8f9fa` | Light mode panel background |
| `lightMutedText2` | `#95a5a6` | Light mode secondary muted |
| `darkTextStrong` | `#2c3e50` | Dark strong text |

### Modules Included

| Module | Path | Purpose |
|---|---|---|
| Auth API | `auth/auth-api.js` | OTP sign-in, entitlement check, trial status/consume |
| Auth Config | `auth/auth-config.js` | Auth endpoint configuration |
| Auth Storage | `auth/auth-storage.js` | Device ID, stored auth token management |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging |
| Auth Token | `auth/auth-token.js` | Entitlement resolution and validation |
