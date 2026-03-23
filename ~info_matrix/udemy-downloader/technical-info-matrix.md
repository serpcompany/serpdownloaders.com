# Technical Info Matrix — Udemy Downloader

## Extension: `udemy-downloader`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | Video Downloader for Udemy |
| **Slug / ID** | `udemy-downloader` |
| **Gecko ID** | `udemy-downloader@serpapps.com` |
| **Category** | Video Downloader (Education / Course) |
| **Target Site(s)** | udemy.com and subdomains |
| **Description** | Download Udemy course videos directly to your computer |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 4.0.1 |
| **Package Version** | 2.1.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/udemy-downloader` |
| **Last Updated** | 2026-03-05 |
| **Build Date** | 2026-03-04T17:35:49.784Z |
| **Development Status** | Active |

### Store & Distribution

| Field | Value |
|---|---|
| **Chrome Web Store URL** | <!-- TODO --> |
| **Firefox Add-ons URL** | <!-- TODO --> |
| **Edge Add-ons URL** | <!-- TODO --> |
| **Safari Available?** | No |
| **Chrome Store Status** | <!-- TODO --> |
| **Store-Sanitized Build?** | Yes (`udemy-downloader-chrome-store-sanitized.zip`) |
| **GitHub Releases Repo** | `serpapps/udemy-video-downloader` |
| **Product Page** | https://serp.ly/udemy-video-downloader |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Download Method** | Direct MP4 (Udemy API download_urls / stream_urls), HLS Stitching (m3u8 segment merge), DASH Stitching (mpd segment + ffmpeg.wasm audio/video merge) |
| **Quality Selection** | Yes — auto-selects best quality from Udemy API (2160p, 1080p, 720p, 480p, 360p, 240p) |
| **Auth Required?** | OTP (email verification via auth.serp.co) + Udemy login (cookies) |
| **Trial Downloads** | 3 free downloads per device |
| **Has Download Manager?** | No — uses save-as dialog via `chrome.downloads` |
| **Live Stream Support?** | No |
| **VR Support?** | No |
| **Bulk Download?** | Yes — course curriculum listing with per-lecture checkbox selection and "Download All" |
| **In-Page Player Button?** | Yes — injected download button on video player control bar (`content-udemy.js`) |
| **Context Menu** | No |
| **Auto-Save** | No — uses `saveAs: true` dialog |
| **Desktop Notifications** | Yes (permission requested) |
| **Video Detection** | Automatic — Udemy API (lecture asset data), URL pattern matching, DOM attribute extraction, script tag parsing, SPA navigation observer |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `downloads`, `activeTab`, `storage`, `notifications`, `contextMenus`, `clipboardRead`, `tabs`, `scripting`, `offscreen`, `cookies`, `nativeMessaging` |
| **Host Permissions** | `https://api.github.com/*`, `https://auth.serp.co/*`, `https://www.udemy.com/*`, `https://*.udemy.com/*`, `https://www.gstatic.com/*`, `https://img-c.udemycdn.com/*`, `https://*.cloudfront.net/*`, `https://unpkg.com/*`, `https://api.gumroad.com/*` |
| **Content Scripts** | `content-udemy.js` — injected on `https://www.udemy.com/*`, `https://*.udemy.com/*` at `document_start` |
| **Background Service Worker?** | Yes — `background-udemy.js` (ES module type) |
| **Offscreen Document?** | Yes — `offscreen.html` + `offscreen.js` (ffmpeg.wasm audio/video merging) |
| **Uses FFmpeg?** | Yes — `ffmpeg.wasm` via offscreen document for DASH audio+video merge |
| **Uses MediaBunny?** | No |
| **HLS Library** | Built-in M3U8 parser (inline `parseM3U8` function in background) |
| **HLS->MP4 Transmuxer** | None — HLS segments merged as raw blob |
| **DASH->MP4** | Built-in MPD parser (inline `parseXML` function in background) + ffmpeg.wasm merge |
| **MP4Box** | No |
| **Reencoder** | No |
| **Network Utils** | No |
| **IndexedDB** | Yes — `indexed-db.js` (LoomDownloaderDB / fileStore) for ffmpeg.wasm blob staging |
| **Page Injection** | `inject.js` — monitors fetch() responses for JSON data containing video URLs |
| **External APIs Called** | Udemy API (`api-2.0`), Udemy Cookies (auth headers), SERP Auth (`auth.serp.co`), GitHub Releases API (`api.github.com`), Gumroad License API (`api.gumroad.com`) |
| **Update Check** | GitHub releases, 6-hour interval, 8s timeout |
| **CSP** | `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` |
| **Sandbox CSP** | `sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; child-src 'self';` |
| **Native Messaging** | Yes — `com.serpcompany.extensions.companion` (optional desktop companion for yt-dlp/ffmpeg) |
| **Options Page** | Yes — `options.html` + `options.js` (download folder, quality, naming, history, debug mode) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Content Script (Udemy) | `content-udemy.js` | Lecture/course detection, URL extraction, auth check, curriculum sidebar parsing, SPA navigation observer, in-page download button injection |
| Content Script (Generic) | `content.js` | Loom-heritage generic video element/data attribute/script tag extraction |
| Content Script (Enhanced) | `content-enhanced.js` | Loom-heritage share URL detection |
| Service Worker | `background-udemy.js` (module) | Udemy API integration, cookie-based auth headers, course/lecture data fetching, download orchestration (direct/HLS/DASH), ffmpeg.wasm offscreen merge, auth gating |
| Service Worker (Legacy) | `background-enhanced.js` | Loom-heritage GraphQL API, HLS/DASH download pipelines, offscreen management |
| Popup (Udemy) | `popup-udemy.html` + `popup-udemy.js` | Udemy-specific UI: auth check, lecture info, course lecture list, download/download-all, progress bar |
| Popup (Legacy) | `popup.html` + `popup.js` + `popup-enhanced.js` | Loom-heritage popup with URL input, process, download |
| Offscreen | `offscreen.html` + `offscreen.js` | ffmpeg.wasm loading, audio+video WebM merge via IndexedDB blob transfer |
| Auth | `auth.js` + `auth-ui.js` + `auth/` | OTP login, entitlement checks, trial management (SERP Auth) |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, auth config |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Inject | `inject.js` | Page-context fetch() monitor, logs JSON responses |
| Options | `options.html` + `options.js` | Settings page (download folder, quality, naming, notifications, debug, history) |
| History | `history.html` + `history.js` | Download history viewer with search, filter, sort, export |
| IndexedDB | `indexed-db.js` | Key-value blob storage for ffmpeg.wasm merge pipeline |
| Native Messaging | `native-messaging-helper.js` | Optional desktop companion app communication (yt-dlp, ffmpeg) |
| Worker | `worker.js` | Minimal ffmpeg-core.js importScripts worker |

### Video Detection & Extraction

| Feature | Implementation |
|---|---|
| **Site Match** | `https://www.udemy.com/*`, `https://*.udemy.com/*` |
| **Video ID Patterns** | `/lecture/(\d+)` (URL path), `/#/lecture/(\d+)` (legacy hash), `/learn/v4/t/lecture/(\d+)` (v4 path) |
| **Course ID Sources** | `[data-course-id]`, `[data-clp-course-id]`, script regex (`course_id`, `courseId`, `ud.target.id`), Udemy course page HTML fetch |
| **Title Sources** | `h1[data-purpose="lecture-title"]`, `.lecture-title`, `.curriculum-item-title--lecture`, `h1`, Udemy API `lecture.title` |
| **Thumbnail Sources** | `meta[property="og:image"]`, `video[poster]`, Udemy API `asset.thumbnail_url` |
| **Duration Sources** | `<video>` element, Udemy API `asset.data.duration` |
| **Extra Metadata** | Course title (`[data-purpose="course-title"]`), Instructor (`[data-purpose="instructor-name"]`), Progress bar, Chapter index, Udemy login status (DOM + cookies) |
| **Format Sources** | A) Udemy API `download_urls.Video`, B) Udemy API `stream_urls.Video`, C) Udemy API `data.outputs`, D) `view_html` `<source>` tags, E) `view_html` videojs-setup-data |
| **Auth Cookie Names** | `access_token`, `client_id`, `csrftoken` |
| **API Endpoints** | `/api-2.0/users/me/subscribed-courses/{courseId}/lectures/{lectureId}`, `/api-2.0/courses/{courseId}/cached-subscriber-curriculum-items`, `/api-2.0/courses/{courseId}/lectures/{lectureId}` |

### Format Object Structure

```json
{
  "type": "direct | hls | dash",
  "url": "string",
  "title": "string",
  "quality": "2160 | 1080 | 720 | 480 | 360 | 240 | null"
}
```

### HLS Processing Specs

| Parameter | Value |
|---|---|
| **Parser** | Built-in `parseM3U8` (inline in background-udemy.js) |
| **Master Playlist Support** | Yes — variant playlist resolution |
| **Segment Merge** | Raw blob concatenation (Blob type: `video/webm`) |
| **Output Format** | `.mp4` filename (content may be webm) |

### DASH Processing Specs

| Parameter | Value |
|---|---|
| **Parser** | Built-in `parseXML` (regex-based AdaptationSet/Representation extraction) |
| **Merge Tool** | ffmpeg.wasm via offscreen document |
| **Merge Command** | `-i video.webm -i audio.webm -c copy output.webm` |
| **Fallback** | Separate audio + video file downloads on merge failure |
| **Offscreen Timeout** | 5 minutes (300,000ms) for large files |

### In-Page Download Button

| Setting | Value |
|---|---|
| **Container Targets** | `.video-player-controls`, `.control-bar`, `.vjs-control-bar`, `.lecture-actions` |
| **Button Text** | "Download" with down-arrow emoji |
| **Button Class** | `udemy-downloader-button` |
| **Button Style** | Blue (#007bff), white text, 8px/16px padding, 4px border-radius |
| **Visibility Gate** | Only on lecture pages where user is logged in to Udemy |
| **Injection Method** | `setTimeout(injectDownloadButton, 2000)` + `setInterval(injectDownloadButton, 5000)` |

### Popup UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles.css` (8.3 KB) |
| **Script Load Order (Udemy popup)** | `popup-udemy.js` → `site-config.js` → `update-notifier.js` |
| **Script Load Order (Legacy popup)** | `popup-enhanced.js` → `auth-ui.js` → `trial-banner.js` |
| **Sections** | Header, Activation section (OTP email + code), Auth section (Udemy login status), URL input, Video info card, Download button, Progress bar, Course lectures list with checkboxes, Download All button, Settings/Help footer |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build-crossbrowser-hardened.mjs` via esbuild + `build.js` (javascript-obfuscator + archiver) |
| **Watermarked?** | Yes |
| **GitHub Release?** | Yes — `serpapps/udemy-video-downloader` |
| **Has Worktree?** | Yes — `.worktrees/udemy-downloader/` |

#### Platform Builds

| Platform | File | Size |
|---|---|---|
| Standard | `udemy-downloader.zip` | 0.16 MB |
| Chrome | `udemy-downloader-chrome.zip` | 0.12 MB |
| Chrome Store Sanitized | `udemy-downloader-chrome-store-sanitized.zip` | 0.12 MB |
| Brave | `udemy-downloader-brave.zip` | 0.12 MB |
| Edge | `udemy-downloader-edge.zip` | 0.12 MB |
| Opera | `udemy-downloader-opera.zip` | 0.12 MB |
| Whale | `udemy-downloader-whale.zip` | 0.12 MB |
| Yandex | `udemy-downloader-yandex.zip` | 0.12 MB |
| Firefox ZIP | `udemy-downloader-firefox.zip` | 0.14 MB |
| Firefox XPI | `udemy-downloader-firefox-unpacked.xpi` | 0.13 MB |

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
| **Gumroad Product ID** | `jPNoqM4WfByKfeeBAepxAA==` (legacy popup reference) |
| **GH License ID** | Not configured (empty) |
| **License Check Worker** | Not configured (empty) |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |

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

### Auth Module Structure

| Module | Path | Purpose |
|---|---|---|
| Auth Config | `auth/auth-config.js` | Base URL, entitlement name, storage prefix |
| Auth API | `auth/auth-api.js` | OTP request, login, entitlement check, trial status/consume |
| Auth Storage | `auth/auth-storage.js` | Device ID generation, stored auth reading |
| Auth Token | `auth/auth-token.js` | Entitlement matching, name resolution |
| Auth Telemetry | `auth/auth-telemetry.js` | Auth event logging, dump, clear |

### Udemy API Integration

| API Call | Endpoint | Purpose |
|---|---|---|
| Lecture Data | `GET /api-2.0/users/me/subscribed-courses/{courseId}/lectures/{lectureId}` | Title, description, asset (stream URLs, download URLs, captions, DRM status) |
| Lecture Data (alt) | `GET /api-2.0/courses/{courseId}/lectures/{lectureId}` | Fallback for 403 errors (free/unenrolled courses) |
| Course Curriculum | `GET /api-2.0/courses/{courseId}/cached-subscriber-curriculum-items` | Chapter/lecture listing for bulk download |
| Auth Check | Cookie check for `access_token` on `udemy.com` | Verify Udemy login status |
| Auth Headers | Cookies: `client_id`, `access_token`, `csrftoken` | `X-Udemy-Client-Id`, `X-Udemy-Bearer-Token`, `X-Udemy-Authorization`, `X-CSRFToken` |

### Reference Source

| Field | Value |
|---|---|
| **yt-dlp Extractor** | `source/udemy.py` (UdemyIE + UdemyCourseIE) |
| **yt-dlp URL Pattern** | `https?://(?:[^/]+\.)?udemy\.com/(?:[^#]+\#/lecture/\|lecture/view/?\?lectureId=\|[^/]+/learn/v4/t/lecture/)(?P<id>\d+)` |
| **yt-dlp Login URL** | `https://www.udemy.com/join/login-popup/` |
