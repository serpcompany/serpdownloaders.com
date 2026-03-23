# Content & Marketing Info Matrix — Facebook Downloader

## Extension: `facebook-downloader`

### Product Positioning

| Field | Value |
|---|---|
| **Headline / Tagline** | Download Facebook Videos, Images & Text — One Click From Any Post |
| **Elevator Pitch** | Facebook Downloader by SERP is a browser extension that saves videos, images, and post text from Facebook.com. Navigate to any feed, profile, or video page, and the extension automatically detects downloadable media. Click the in-page overlay button or use the popup to pick what you want. Videos download as MP4, images save at full resolution, and post text exports as plain text. 3 free downloads included. |
| **Value Proposition** | Purpose-built for Facebook with multi-source video detection (inline playable_url keys, DOM video, feed permalink traversal), automatic DNR header injection for CDN access, and a three-tier download fallback chain. Downloads videos, images, and text from posts, reels, and watch pages. In-page overlay buttons appear directly on every post — no popup needed. |
| **Target Audience** | Facebook users who want to save videos, images, or text posts for offline viewing. Content creators who need to archive their own posts. Non-technical users who want a simple, reliable download solution for Facebook. |
| **Use Cases** | 1. Save a Facebook video or reel for offline viewing. 2. Download all visible images from a feed or album. 3. Export post text to a text file. 4. Bulk download all visible assets of one type (videos, images, or text). 5. Use in-page overlay buttons to download directly without opening the popup. 6. Archive your own Facebook posts and media. |
| **Pain Points Addressed** | 1. Facebook uses complex streaming (DASH manifests, multiple playable_url keys, CDN restrictions) — can't right-click and save. 2. Facebook aggressively blocks direct CDN access with Origin/Referer checks. 3. Generic downloaders often miss Facebook's inline data URLs. 4. Users don't want desktop apps or command-line tools. 5. No easy way to save post text or bulk-download images from a feed. 6. Mobile and desktop Facebook serve different URL structures. |

### Store Listing Copy

| Field | Value |
|---|---|
| **Short Description (132 char)** | Download videos, images, and text from Facebook.com. Auto-detects media, converts to MP4. Choose quality. 3 free downloads. |
| **Changelog / What's New** | v3.0.0 — Multi-source video detection, in-page overlay buttons for videos/images/text, tabbed popup with bulk download, DNR header rules for CDN access, three-tier download fallback. |

#### Full Description (Long Form)

> Facebook Downloader by SERP makes it easy to save videos, images, and post text from Facebook.com to your computer.
>
> **How it works:** Go to any page on Facebook — your feed, a profile, a watch page, or a reel. The extension scans visible posts and detects all downloadable media. Overlay download buttons appear directly on videos and images. Or open the extension popup to see a tabbed list of all detected videos, images, and text posts, then download individually or in bulk.
>
> The extension handles Facebook's complex streaming infrastructure automatically — it extracts playable URLs from inline data, resolves feed permalinks, falls back through multiple download methods, and injects the correct Origin/Referer headers for CDN access. Videos save as standard MP4 files. No external tools, no command line, no technical knowledge required.
>
> **Key features:**
> - Automatic video detection from multiple sources (inline data keys, DOM video, feed permalinks)
> - In-page overlay buttons on every video and image
> - Downloads videos, images, and post text
> - Tabbed popup showing detected Videos, Images, and Text with counts
> - Bulk "Download Visible" for all assets of the active type
> - Quality selection from all available resolutions (HD, SD)
> - Three-tier download fallback (direct URL, authenticated fetch, page-side download)
> - DNR header rules for reliable Facebook CDN access
> - Auto-saves to organized `Facebook Downloader/` subfolder
> - Dark-themed UI with Facebook blue accents
> - 3 free downloads to try before you buy
>
> **Getting started:**
> 1. Install the extension
> 2. Go to Facebook.com and browse any page
> 3. Click overlay buttons on posts, or open the extension popup
> 4. Select assets and download — videos save as MP4, images at full resolution
>
> Sign in with your email to unlock 3 free trial downloads. Upgrade to a license for unlimited downloads.
>
> Supports Chrome, Edge, Brave, Opera, Firefox, and more.

#### Feature Bullet Points

- Multi-source video detection — inline playable_url keys, DOM video elements, feed permalink traversal, regex extraction
- In-page overlay buttons on every video and image — download without opening the popup
- Tabbed popup with Videos, Images, and Text tabs — see counts and download individually or in bulk
- Bulk "Download Visible" — download all videos, images, or text from the visible feed at once
- Quality detection from Facebook's multiple video sources (HD/SD)
- Three-tier download fallback — direct URL, authenticated fetch, page-side download
- DNR header injection for reliable Facebook CDN access
- Exports post text as plain text files
- Auto-saves to organized `Facebook Downloader/{author}/` subfolder in Downloads
- Dark UI with Facebook blue accents — clean and unobtrusive
- MutationObserver watches the feed — new posts get buttons automatically
- 3 free trial downloads — no credit card required

#### How It Works

1. **Install** — Add Facebook Downloader by SERP to your browser
2. **Browse** — Navigate to Facebook.com — feed, profile, watch page, or reel
3. **Click** — Use the in-page overlay button on any post, the extension popup, or the "Download Visible" bulk action
4. **Download** — Videos save as MP4, images at full resolution, text as plain files — all to your Downloads/Facebook Downloader folder

#### FAQ

**Q: How do I download a video from Facebook?**
**A:** Go to any Facebook page with video content. The extension automatically detects videos and places a "Download video" button on each one. You can also open the extension popup and click Download on any listed video.

**Q: Can I download images too?**
**A:** Yes. The extension detects all Facebook images above 180x180 pixels. Each image gets a download icon overlay, and you can also download them from the Images tab in the popup.

**Q: Can I save post text?**
**A:** Yes. Switch to the Text tab in the popup to see extracted post messages. Click Download to save as a .txt file. The extension auto-expands "See more" to capture full text.

**Q: What quality options are available?**
**A:** The extension detects all available quality levels from Facebook's inline data — typically HD (playable_url_quality_hd) and SD (playable_url). The highest quality is preferred automatically.

**Q: What format are downloaded videos?**
**A:** All videos are saved as standard MP4 files that play on any device or media player.

**Q: Where are my downloads saved?**
**A:** Files save to a `Facebook Downloader` subfolder inside your browser's default Downloads directory, organized by author/source.

**Q: How many free downloads do I get?**
**A:** 3 free trial downloads after signing in with your email. Purchase a license for unlimited downloads.

**Q: Does this work on Firefox?**
**A:** Yes — supports Chrome, Edge, Brave, Opera, and Firefox.

**Q: Why isn't the extension finding videos in my feed?**
**A:** Scroll the feed so posts load into the DOM. For feed videos that show only a permalink (no direct URL yet), the extension can resolve the video by opening the permalink in a background tab.

**Q: Can I download Facebook Reels?**
**A:** Yes. The extension detects reels both on dedicated reel pages and in the feed.

**Q: Is my data safe?**
**A:** Yes. All processing happens locally in your browser. Authentication uses secure OTP — no passwords stored. The extension only communicates with auth.serp.co for activation.

### SEO & Search

| Field | Value |
|---|---|
| **Primary Keywords** | facebook downloader, download facebook videos, facebook video download, save facebook videos |
| **Long-Tail Keywords** | how to download videos from facebook, facebook video downloader chrome extension, download facebook videos to mp4, save facebook reels, download facebook images, facebook post text downloader |
| **SEO Title (60 char)** | Facebook Downloader — Save Videos, Images & Text | SERP |
| **Meta Description (155 char)** | Download videos, images, and text from Facebook.com. Auto-detects streams, converts to MP4. Chrome, Firefox, Edge. 3 free downloads included. |
| **URL Slug** | `/facebook-downloader` |
| **Schema Markup Type** | SoftwareApplication |

### Ad Copy & Campaigns

| Field | Value |
|---|---|
| **Google Ads Headline (30 char)** | Download Facebook Videos Easy |
| **Google Ads Description (90 char)** | Save Facebook videos as MP4, images, and text. In-page buttons. Quality selection. 3 free downloads. |
| **Social Media Hook** | Can't save videos from Facebook? This extension adds download buttons right on every post. Videos, images, text — one click, done. |
| **CTA (Call to Action)** | Try 3 Free Downloads |
| **Competitor Comparisons** | Multi-source detection (inline data keys, DOM, feed permalinks, regex) catches Facebook streams that generic tools miss. DNR header injection for CDN access. Three-tier fallback. In-page overlay buttons, bulk download, and text export — features most Facebook downloaders lack. |

#### Ad Angles

1. **Simplicity** — "Download buttons appear right on every Facebook post. Click and save."
2. **Comprehensive** — "Videos, images, and text. One extension downloads everything from Facebook."
3. **Reliability** — "Three download fallbacks. DNR header injection. Never fails on Facebook's CDN."
4. **No Tools Needed** — "No desktop software. No command line. Just a browser extension."
5. **Free Trial** — "3 free downloads. No credit card. Try it now."

### Blog / Article Content

| Field | Value |
|---|---|
| **Supported Formats / Qualities** | MP4 video output. HD/SD quality levels. Full-resolution images (JPG, PNG, WebP, GIF, AVIF). Plain text export for posts. |
| **Limitations / Disclaimers** | Must browse Facebook so posts load into the DOM. Quality depends on source. Requires email sign-in for trial. Internet connection required. Users responsible for download rights. Private/restricted content requires appropriate Facebook login. |
| **Social Proof / Testimonials** | <!-- TODO --> |
| **Related Extensions (Cross-Sell)** | SERP Video Downloader, M3U8 Downloader, TikTok Downloader, YouTube Downloader, Vimeo Downloader |

#### Article Title Ideas

1. How to Download Videos from Facebook (Step-by-Step Guide)
2. Facebook Downloader: Save Videos, Images & Text with One Click
3. How to Save Facebook Videos as MP4 — No Software Required
4. Best Facebook Download Extensions Compared
5. Download Facebook Reels and Videos in Any Quality — Chrome & Firefox
6. How to Export Facebook Post Text to a File

#### Tutorial Outline

1. **Introduction** — Why downloading from Facebook is tricky and how this extension solves it
2. **Prerequisites** — Chrome, Edge, Brave, Firefox, or Opera. Internet connection. Facebook account.
3. **Step 1: Install** — Add from extension store
4. **Step 2: Sign In** — Email + OTP verification
5. **Step 3: Browse Facebook** — Navigate to feed, profile, watch page, or reel
6. **Step 4: Download** — In-page overlay buttons, popup, or "Download Visible" bulk action
7. **Tips & Tricks** — Scroll feed for more detections. Use tabs to switch between videos/images/text. Shift+click Rescan for a fresh sweep. Auto-saves to organized folder.
8. **Troubleshooting** — Scroll posts into view. Refresh if needed. Check extension is enabled. For feed-only permalinks, the extension resolves in a background tab.

### Visual Assets

| Field | Value |
|---|---|
| **Screenshot Descriptions** | See list below |
| **Icon / Logo Variants** | Default icon: 16, 32, 48, 128px. No highlight variant. |
| **Banner / Hero Image Spec** | 1280x800 — dark background (#0F1626), popup screenshot, Facebook blue accent (#0A8FDC) |
| **GIF Demo Description** | 10-second loop: Facebook feed scrolling -> overlay buttons appear on posts -> click "Download video" -> popup opens showing Videos/Images/Text tabs with counts -> bulk download -> files appear in Downloads folder |

#### Screenshot List

1. Extension popup showing Videos tab with detected videos and download buttons
2. Extension popup showing Images tab with thumbnail grid
3. In-page overlay buttons on a Facebook video post ("Download video" button)
4. In-page per-image download icon on a photo post
5. Email sign-in / OTP verification screen
6. Text tab showing extracted post text with export option

### Landing Page Content

#### Hero Section

**Headline:** Download Videos, Images & Text from Facebook — One Click From Any Post

**Subheadline:** In-page download buttons. Multi-source video detection. HD/SD quality. Bulk download. No software to install.

**CTA Button:** Try 3 Free Downloads

#### Feature Blocks

1. **In-Page Overlay Buttons** — Download buttons appear directly on every video and image. Click and save without opening the popup.
2. **Multi-Source Video Detection** — Extracts playable URLs from Facebook's inline data, DOM video elements, feed permalinks, and regex patterns. Catches streams that generic tools miss.
3. **Videos, Images & Text** — Not just videos. Download full-resolution images and export post text as plain files. Tabbed popup with counts.
4. **Bulk Download** — "Download Visible" grabs all assets of the active type at once. Scroll the feed, rescan, repeat.
5. **Reliable CDN Access** — DNR header injection and three-tier download fallback ensure downloads succeed where others fail.

#### Trust Signals

- Works on Chrome, Edge, Brave, Opera, and Firefox
- Secure OTP sign-in — no passwords stored
- All processing happens locally in your browser
- Auto-saves to organized Downloads/Facebook Downloader/ folder
- MutationObserver watches the feed — new posts get buttons automatically

#### Footer CTA

**Headline:** Ready to start downloading from Facebook?

**Button:** Install Free — 3 Downloads Included

### Tone & Brand

| Field | Value |
|---|---|
| **Voice / Tone** | Direct, minimal, professional. Focus on utility and reliability. Avoid hype language. |
| **Banned Words / Phrases** | "piracy", "illegal", "bypass", "crack", "hack Facebook", "steal". Don't reference specific user content or private data. |
| **Required Disclaimers** | "Users are responsible for ensuring they have the right to download content. This extension is intended for downloading content you own or have permission to download." |
| **Brand Color Hex** | Primary: `#0A8FDC` (Facebook blue). Background: `#0F1626` (dark navy). |
| **Target Platform Branding** | Use "Facebook" as the site name. Reference as "Facebook.com" for the website. |
