# Technical Info Matrix — SERP Notes

## Extension: `serp-notes`

### Core Identity

| Field | Value |
|---|---|
| **Extension Name** | SERP Notes |
| **Slug / ID** | `serp-notes` |
| **Gecko ID** | `serp-notes@serpapps.com` |
| **Category** | Productivity / Notes & Organization |
| **Target Site(s)** | N/A (standalone tool — works on any page via side panel and context menu) |
| **Description** | Offline-first markdown notes with SERP authentication and trial access. |

### Version & Status

| Field | Value |
|---|---|
| **Manifest Version** | 1.0.0 |
| **Package Version** | 1.0.0 |
| **Manifest Spec** | MV3 |
| **Branch Name** | `legacy/serp-notes` |
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
| **GitHub Releases Repo** | `serpapps/serp-notes` |
| **Product Page** | https://serp.ly/serp-notes |
| **Help Center** | https://help.serp.co/en/ |

### Features & Capabilities

| Field | Value |
|---|---|
| **Primary Function** | Create, organize, and sync markdown notes with AI assistance, voice transcription, and live sharing |
| **Markdown Editor** | Full markdown authoring with headings (H1-H4), bold, italic, strikethrough, bullet lists, todo/checkbox lists, code blocks, links, and inline images |
| **Side Panel** | Chrome Side Panel API — full note workspace opens alongside any web page (`sidepanel.html`) |
| **Omnibox** | Keyword `sn` — quick access from the address bar |
| **Keyboard Shortcut** | `Ctrl+Shift+Y` to toggle side panel |
| **Auth Required?** | OTP (email verification via auth.serp.co) |
| **Trial Included?** | Yes — free trial via SERP Auth entitlements (trial unit: "note") |
| **Cloud Sync** | Yes — real-time cloud sync via `notes.serp.co` API (Cloudflare D1 + R2) with debounced push (900ms) and fetch timeout (7s) |
| **Offline-First** | Yes — all notes stored locally in `chrome.storage.local`; syncs to cloud when online |
| **Serpy AI Agent** | Built-in AI assistant ("Serpy") — natural language instructions to edit, summarize, expand, rewrite, or generate note content via `/ai/assist` endpoint |
| **Voice Transcription** | Press-and-hold mic button to record audio, release to transcribe via `/ai/transcribe` endpoint (max 25s recording, 45s transcription timeout) |
| **Web Context Capture** | Auto-captures page headings, lists, tables, and code from the active tab; feeds into Serpy AI for context-aware note generation (max 24,000 chars, 900 blocks) |
| **Live Sharing** | Share individual notes via public live link (`notes.serp.co/share/{id}`) — live mode (always current) or snapshot mode (frozen at share time); view and download counters |
| **Image Support** | Insert images via URL or upload (max 5 MB; PNG, JPEG, WebP, GIF, AVIF); stored in Cloudflare R2 |
| **Snapshot Snipping** | Capture a screen region of the current tab and embed as an image in the note |
| **Folders** | Organize notes into folders; create, filter, and manage folders (default: "General") |
| **Tags** | Tag notes with custom tags; filter by tag across the workspace |
| **Pinning** | Pin important notes to the top of the list |
| **Search** | Full-text search across all notes; filter by All / Pinned / This Page (current URL domain) |
| **Wiki Links** | `[[note title]]` syntax for inter-note linking with autocomplete; backlinks panel shows linked notes |
| **Slash Commands** | `/` trigger for inline command palette |
| **Command Palette** | `Ctrl/Cmd+P` — fuzzy-search commands |
| **Live Preview** | Real-time markdown preview alongside editor |
| **Preview Mode** | Full rendered markdown preview |
| **Copy Rich Text** | Copy note as formatted rich text to clipboard |
| **Export Formats** | Markdown (.md), Plain Text (.txt), Word (.docx), HTML (.html), PDF (.pdf) |
| **Export All** | Bulk export all notes |
| **Export JSON** | Export workspace as JSON backup |
| **Import** | Import JSON workspace backup |
| **Duplicate Note** | Clone any note |
| **Context Menu** | Right-click "Save selection to current SERP note" and "Save selection as new SERP note" |
| **Badge Count** | Action badge shows number of notes matching the current page domain |
| **Desktop Notifications** | No |
| **Stats Dashboard** | Total notes, pinned count, word count, total images — displayed in header |

### Technical Details

| Field | Value |
|---|---|
| **Permissions Required** | `storage`, `downloads`, `sidePanel`, `contextMenus`, `tabs`, `activeTab`, `scripting` |
| **Host Permissions** | `<all_urls>`, `https://api.github.com/*`, `https://auth.serp.co/*`, `https://notes.serp.co/*`, `https://serp-notes-api.serpcompany.workers.dev/*` |
| **Content Scripts** | None (uses `chrome.scripting.executeScript` for snapshot overlay and web context capture) |
| **Background Service Worker?** | Yes — `background.js` (ES module type) |
| **Side Panel?** | Yes — `sidepanel.html` (primary UI surface) |
| **Offscreen Document?** | No |
| **Uses FFmpeg?** | No |
| **Uses MediaBunny?** | No |
| **UI Framework** | Vanilla JavaScript (no build framework — hand-authored popup.js, ~66K+ tokens) |
| **CSS Framework** | Custom CSS with CSS custom properties / design tokens (dark mode, `color-scheme: dark`) |
| **Markdown Rendering** | Custom markdown-to-HTML rendering in preview panel |
| **External APIs Called** | SERP Auth (`auth.serp.co`), SERP Notes API (`notes.serp.co` / `serp-notes-api.serpcompany.workers.dev`), GitHub Releases API (`api.github.com`), Cloudflare AI (for Serpy assist and transcription) |
| **Update Check** | GitHub releases (`serpapps/serp-notes`), 6-hour interval, 8s timeout |
| **CSP** | Default MV3 CSP (no custom overrides) |

### Architecture

| Component | File(s) | Purpose |
|---|---|---|
| Popup / Main UI | `popup.html` + `popup.js` | Full note workspace — editor, notes list, search, filters, folders, tags, Serpy AI bar, export, sharing, stats |
| Side Panel | `sidepanel.html` | Identical UI rendered in Chrome's side panel (uses `data-surface="sidepanel"` for layout adaptations) |
| Service Worker | `background.js` (module) | Context menus, tab badge counts, pending capture queue, snapshot capture/crop, side panel management, auth listener |
| Auth | `auth.js` + `auth-ui.js` | OTP login, entitlement checks, trial management |
| Auth Modules | `auth/auth-api.js`, `auth/auth-config.js`, `auth/auth-storage.js`, `auth/auth-telemetry.js`, `auth/auth-token.js` | Modular auth subsystem |
| Site Config | `site-config.js` | Brand colors, endpoints, feature flags, auth config, pricing text, upgrade features list |
| Update Notifier | `update-notifier.js` | GitHub release version checks |
| Trial Banner | `trial-banner.js` | Free trial remaining badge |
| Logger | `logger.js` | Structured logging with level hierarchy and background mirroring |
| Mic Permission | `mic-permission.html` + `mic-permission.js` | Dedicated page for granting microphone access (required for voice transcription) |
| Cloudflare Worker | `cloudflare/serp-notes-api/src/index.js` | Server-side API — cloud sync, live sharing, image upload (R2), AI assist, AI transcribe |
| Cloudflare D1 | `migrations/0001_init.sql`, `migrations/0002_share_links.sql` | Database schema for `notes` and `note_shares` tables |
| Cloudflare R2 | `NOTES_ASSETS` bucket | Image storage for uploaded note images |
| Cloudflare AI | `AI` binding | Powers Serpy AI assist and voice transcription |
| Styles | `styles/popup.css` | Dark-theme CSS with design tokens, responsive popup (640x600) and side panel (full viewport) layouts |

### Storage Schema

| Key | Contents |
|---|---|
| `serp-notes:workspace` | Full workspace object containing notes array, folder list, and metadata |
| `serp-notes:settings` | User preferences — sort order, pane visibility, stats collapsed state, Serpy page context enabled |
| `serp-notes:sync-debug` | Debug log entries for cloud sync troubleshooting |
| `serp-notes:pending-capture` | Queued web selection capture from context menu (text + source URL + timestamp) |
| `serp-notes:pending-snapshot-image` | Queued snapshot image data URI from screen capture |
| `serp-notes:mic-granted` | Boolean flag indicating microphone permission has been granted |
| `serp-notes:token` | Auth JWT token |
| `serp-notes:entitlements` | Auth entitlement array |
| `serp-notes:expiresAt` | Token expiry timestamp |
| `serp-notes:sessionToken` | OTP session token |
| `serp-notes:deviceId` | Unique device identifier |
| `serp-notes:email` | Authenticated user email |
| `isActivated` | Boolean activation flag |

### Note Object Structure

```json
{
  "id": "string (UUID)",
  "title": "string",
  "content": "string (markdown)",
  "pinned": "boolean",
  "folder": "string (default: General)",
  "tags": ["string"],
  "sourceUrl": "string (URL of page when note was created)",
  "createdAt": "number (Unix timestamp ms)",
  "updatedAt": "number (Unix timestamp ms)",
  "deletedAt": "number | null (soft delete timestamp)"
}
```

### Cloud Sync Architecture

| Field | Value |
|---|---|
| **Sync Model** | Offline-first with debounced cloud push |
| **Push Debounce** | 900ms after last edit |
| **Fetch Timeout** | 7,000ms |
| **Max Synced Notes** | 400 (server-side limit) |
| **Cloud Status Indicators** | idle, checking, syncing, connected, offline, error |
| **Conflict Resolution** | Last-write-wins based on `updatedAt` timestamp |

### Share Link Schema (D1)

```json
{
  "share_id": "string (UUID, primary key)",
  "user_id": "string",
  "note_id": "string",
  "mode": "live | snapshot",
  "snapshot_title": "string | null",
  "snapshot_content": "string | null",
  "is_revoked": "boolean (0/1)",
  "expires_at": "number | null",
  "created_at": "number (Unix timestamp)",
  "updated_at": "number (Unix timestamp)",
  "view_count": "number",
  "download_count": "number"
}
```

### AI / Serpy Features

| Field | Value |
|---|---|
| **Assist Endpoint** | `/ai/assist` |
| **Transcribe Endpoint** | `/ai/transcribe` |
| **Max Recording Duration** | 25 seconds |
| **Min Recording Duration** | 450ms |
| **Transcribe Timeout** | 45 seconds |
| **Transcribe Hard Timeout** | 60 seconds |
| **Page Context Max Chars** | 24,000 |
| **Page Context Max Blocks** | 900 |
| **Page Context Refresh** | 45 seconds |
| **Max Audio Upload** | 10 MB (server-side) |
| **AI Provider** | Cloudflare AI binding |
| **Serpy Output Actions** | Apply edit, Undo, Copy reply, Close |

### Popup / Side Panel UI

| Property | Value |
|---|---|
| **Stylesheets** | `styles/popup.css` |
| **Script Load Order** | `site-config.js` -> `logger.js` -> `auth.js` (module) -> `popup.js` (module) -> `auth-ui.js` (defer) -> `trial-banner.js` (defer) -> `update-notifier.js` (defer) |
| **Popup Dimensions** | 640px wide x 600px tall |
| **Side Panel Dimensions** | Full viewport width x 100vh |
| **Layout** | Split pane — notes list aside (left) + editor pane (right); collapses to single view below 760px |
| **Sections** | Boot splash, Auth/activation gate, Trial banner, Stats row (total notes, pinned, words, images), Notes list with search/filter/folders/tags, Markdown editor with formatting toolbar, Serpy AI bar, Preview panel, Backlinks panel, Footer with export/share/shortcuts |
| **Overlays / Modals** | Command palette, Export format picker, Keyboard shortcuts reference, Web context debug viewer, Insert image dialog |
| **Theme** | Dark mode — `color-scheme: dark`, CSS custom properties from `site-config.js` COLORS |

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + N` | New note |
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + Shift + X` | Strikethrough |
| `Ctrl/Cmd + Shift + L` | Bullet list |
| `Ctrl/Cmd + Shift + T` | Todo list |
| `Ctrl/Cmd + S` | Force cloud sync |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl + Shift + Y` | Open side panel |
| `/` | Slash commands |
| `[[` | Wiki link autocomplete |
| `Ctrl/Cmd + P` | Command palette |
| `Esc` | Close panel / back |

### Build & Release

| Field | Value |
|---|---|
| **Build Tool** | `build.js` (Node.js script using PowerShell `Compress-Archive`) |
| **Vite Bundled?** | No — source files shipped directly |
| **Watermarked?** | Yes (LOG_LEVEL patched to `error` in packaged builds) |
| **GitHub Release?** | Yes — `serpapps/serp-notes` |
| **Has Worktree?** | Yes — `.worktrees/serp-notes/` |

### Testing & Health

| Field | Value |
|---|---|
| **Working?** | <!-- TODO: manual test --> |
| **Last Tested Date** | <!-- TODO --> |
| **Known Issues** | <!-- TODO --> |
| **User Reports** | <!-- TODO --> |

### Business / Monetization

| Field | Value |
|---|---|
| **Pricing Model** | Freemium — free tier for testing, Pro tier at $9/month |
| **Pro Tier Includes** | Unlimited notes, up to 10,000 images stored, unlimited live shares, Serpy AI note agent, voice transcription, AI web-page notes, web context capture, cloud sync, all export formats, priority feature updates |
| **Gumroad Product ID** | Not configured (empty) |
| **GH License ID** | Not configured (empty) |
| **License Check Worker** | `serp-notes-api.serpcompany.workers.dev` |
| **Install Count** | <!-- TODO --> |
| **Revenue Priority** | <!-- TODO --> |

### Logging & Telemetry

| Field | Value |
|---|---|
| **Log Level** | `debug` (source) / `error` (packaged builds) |
| **Mirror to Background** | Yes |
| **Log Hierarchy** | `debug(10) < log(20) < warn(30) < error(40) < none(100)` |
| **Sync Debug Log** | Stored in `serp-notes:sync-debug` for cloud sync troubleshooting |

### Icons

| Icon | Size | File |
|---|---|---|
| Default 16px | 16x16 | `icons/icon16.png` |
| Default 32px | 32x32 | `icons/icon32.png` |
| Default 48px | 48x48 | `icons/icon48.png` |
| Default 128px | 128x128 | `icons/icon128.png` |
| Splash Logo | Variable | `icons/splash-logo.png` |

### Brand Colors (Site Config)

| Token | Hex | Usage |
|---|---|---|
| `brandPrimary` | `#6e747d` | Primary brand color (neutral gray) |
| `brandSecondary` | `#8d949e` | Secondary brand color |
| `brandHighlight` | `#7c838d` | Highlight / accent |
| `surfaceStart` | `#050506` | Background gradient start |
| `surfaceEnd` | `#0f1012` | Background gradient end |
| `panelSoft` | `rgba(255,255,255,0.05)` | Soft panel background |
| `panelStrong` | `rgba(255,255,255,0.12)` | Strong panel background |
| `borderSoft` | `rgba(255,255,255,0.14)` | Soft borders |
| `textMain` | `#f8fafc` | Primary text |
| `textMuted` | `#9aa2ad` | Muted / secondary text |
| `success` | `#44b974` | Success state (green) |
| `warning` | `#c89a3d` | Warning state (amber) |
| `danger` | `#d46a7a` | Danger / destructive state (rose) |
| `info` | `#a4acb7` | Info state (gray-blue) |
| `shadow` | `rgba(0, 0, 0, 0.56)` | Box shadow |

### Cloudflare Infrastructure

| Resource | Binding | Details |
|---|---|---|
| **Worker** | `serp-notes-api` | Main API worker — sync, sharing, image upload, AI endpoints |
| **D1 Database** | `DB` | Database `serp-notes` (ID: `e5637fb6-1b0b-4615-8018-95938bca5617`) |
| **R2 Bucket** | `NOTES_ASSETS` | Image storage bucket `serp-notes-assets` |
| **AI** | `AI` | Cloudflare AI binding for Serpy assist and transcription |
| **Public Share URL** | — | `https://notes.serp.co` |
| **Public Asset URL** | — | `https://notes.serp.co/assets` |
| **Worker Build** | — | `2026-02-23.1` |
| **Rate Limit** | — | 120 requests per 60-second window per client |
| **Compatibility Date** | — | 2026-02-12 |

### Dependencies (package.json)

| Package | Version | Purpose |
|---|---|---|
| (none) | — | No npm dependencies — vanilla JS extension |

### Server-Side Limits

| Limit | Value |
|---|---|
| Max synced notes | 400 |
| Max image upload | 5 MB |
| Max audio upload | 10 MB |
| Rate limit window | 60 seconds |
| Rate limit max requests | 120 |
| AI transcribe timeout | 30 seconds |
