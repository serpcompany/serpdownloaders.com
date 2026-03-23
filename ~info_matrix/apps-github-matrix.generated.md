# SERP Apps GitHub Matrix

Generated on March 17, 2026.

## Scope

- Compared the 75 apps listed in `all-apps-in-repo.md` against the `serpapps` GitHub org.
- Repo existence was checked against the authenticated org member view in Playwright, which exposed 371 repos.
- README metrics were pulled from GitHub READMEs where accessible; `reddit-downloader` required the authenticated browser session because it was not visible in the public API.
- Embedded image counts include both Markdown image syntax and HTML `<img>` tags, so badges and screenshots both count.
- Release status means whether a repo has a current public/member-visible GitHub release page, not whether code was merely pushed recently.

## Executive Summary

- 60 of 75 apps have a matching GitHub repo in the org. 15 do not match any repo name, normalized name, or simple canonical variant in the authenticated org view.
- 39 matches are exact. 21 require a renamed/canonical match.
- 8 matched repos are missing releases.
- 1 matched repo is missing a README: `stripchat-downloader` -> `stripchat-video-downloader`.
- 9 READMEs are under 250 words.
- 41 READMEs have no embedded images at all.
- 24 READMEs are missing install/setup coverage.
- 11 READMEs are missing usage/how-to coverage.
- 6 READMEs are missing FAQ/troubleshooting coverage.
- 41 READMEs are missing a license section in the README text.
- 9 READMEs have no screenshot/demo signal at all.

## List vs Local Repo Gaps

- In the app list but not present as a local product folder: `onlyfans-bulk-downloader`.
- Present locally but not in the app list: `serp-video-downloader`, `udemy-downloader`.
- `onlyfans-bulk-downloader` currently maps to `onlyfans-downloader` on GitHub and has no separate local folder.

## Apps Missing From GitHub Org

- `cam4-downloader`
- `camscom-downloader`
- `dreamcam-downloader`
- `dreamcam-vr-downloader`
- `fansly-live-downloader`
- `flirt4free-downloader`
- `linkedin-downloader`; nearest visible repo: `linkedin-learning-downloader (not an exact equivalent)`
- `mindvalley-downloader`
- `sexchathu-downloader`
- `streamate-downloader`; nearest visible repo: `stream-downloader (not an exact equivalent)`
- `stripchat-vr-downloader`
- `tellatv-downloader`
- `twitter-x-downloader`; nearest visible repo: `twitter-video-downloader (not an exact equivalent)`
- `xhamsterlive-downloader`
- `xlovecam-downloader`

## Renamed or Canonical GitHub Matches

| App List Name | GitHub Repo | Match Type |
| --- | --- | --- |
| `alphaporno-downloader` | [`alpha-porno-downloader`](https://github.com/serpapps/alpha-porno-downloader) | normalized |
| `beeg-downloader` | [`beeg-video-downloader`](https://github.com/serpapps/beeg-video-downloader) | canonical |
| `facebook-downloader` | [`facebook-video-downloader`](https://github.com/serpapps/facebook-video-downloader) | canonical |
| `kajabi-downloader` | [`kajabi-video-downloader`](https://github.com/serpapps/kajabi-video-downloader) | canonical |
| `loom-downloader` | [`loom-video-downloader`](https://github.com/serpapps/loom-video-downloader) | canonical |
| `onlyfans-bulk-downloader` | [`onlyfans-downloader`](https://github.com/serpapps/onlyfans-downloader) | canonical |
| `pornhub-downloader` | [`pornhub-video-downloader`](https://github.com/serpapps/pornhub-video-downloader) | canonical |
| `redtube-downloader` | [`redtube-video-downloader`](https://github.com/serpapps/redtube-video-downloader) | canonical |
| `spankbang-downloader` | [`spankbang-video-downloader`](https://github.com/serpapps/spankbang-video-downloader) | canonical |
| `sprout-downloader` | [`sprout-video-downloader`](https://github.com/serpapps/sprout-video-downloader) | canonical |
| `stripchat-downloader` | [`stripchat-video-downloader`](https://github.com/serpapps/stripchat-video-downloader) | canonical |
| `tiktok-downloader` | [`tiktok-video-downloader`](https://github.com/serpapps/tiktok-video-downloader) | canonical |
| `tnaflix-downloader` | [`tnaflix-video-downloader`](https://github.com/serpapps/tnaflix-video-downloader) | canonical |
| `vimeo-downloader` | [`vimeo-video-downloader`](https://github.com/serpapps/vimeo-video-downloader) | canonical |
| `whop-downloader` | [`whop-video-downloader`](https://github.com/serpapps/whop-video-downloader) | canonical |
| `wistia-downloader` | [`wistia-video-downloader`](https://github.com/serpapps/wistia-video-downloader) | canonical |
| `xhamster-downloader` | [`xhamster-video-downloader`](https://github.com/serpapps/xhamster-video-downloader) | canonical |
| `xnxx-downloader` | [`xnxx-video-downloader`](https://github.com/serpapps/xnxx-video-downloader) | canonical |
| `xvideos-downloader` | [`xvideos-video-downloader`](https://github.com/serpapps/xvideos-video-downloader) | canonical |
| `youporn-downloader` | [`youporn-video-downloader`](https://github.com/serpapps/youporn-video-downloader) | canonical |

## Missing Releases

- `bongacams-downloader` -> `bongacams-downloader`
- `camsoda-downloader` -> `camsoda-downloader`
- `chaturbate-downloader` -> `chaturbate-downloader`
- `facebook-downloader` -> `facebook-video-downloader`
- `instagram-downloader` -> `instagram-downloader`
- `myfreecams-downloader` -> `myfreecams-downloader`
- `pinterest-downloader` -> `pinterest-downloader`
- `reddit-downloader` -> `reddit-downloader`

## README Hotspots

### Most Incomplete READMEs

| App | GitHub Repo | Gap Count | Gaps |
| --- | --- | ---: | --- |
| `facebook-downloader` | facebook-video-downloader | 8 | missing release, short README, no embedded images, install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section |
| `instagram-downloader` | instagram-downloader | 8 | missing release, short README, no embedded images, install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section |
| `reddit-downloader` | reddit-downloader | 8 | missing release, short README, no embedded images, install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section |
| `gohighlevel-downloader` | gohighlevel-downloader | 7 | short README, no embedded images, install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section |
| `gokollab-downloader` | gokollab-downloader | 7 | short README, no embedded images, install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section |
| `chaturbate-downloader` | chaturbate-downloader | 4 | missing release, no embedded images, screenshots/demo, license section |
| `myfreecams-downloader` | myfreecams-downloader | 4 | missing release, no embedded images, screenshots/demo, license section |
| `ashemaletube-downloader` | ashemaletube-downloader | 3 | no embedded images, install/setup, license section |
| `bongacams-downloader` | bongacams-downloader | 3 | missing release, short README, license section |
| `boyfriendtv-downloader` | boyfriendtv-downloader | 3 | no embedded images, install/setup, license section |
| `camsoda-downloader` | camsoda-downloader | 3 | missing release, short README, license section |
| `coomer-downloader` | coomer-downloader | 3 | no embedded images, install/setup, license section |

### Most Embedded Images

| App | GitHub Repo | Images | Words |
| --- | --- | ---: | ---: |
| `skool-downloader` | skool-downloader | 12 | 2268 |
| `vimeo-downloader` | vimeo-video-downloader | 11 | 1956 |
| `youtube-downloader` | youtube-downloader | 6 | 990 |
| `loom-downloader` | loom-video-downloader | 3 | 3011 |
| `circle-downloader` | circle-downloader | 2 | 1791 |
| `xvideos-downloader` | xvideos-video-downloader | 1 | 2151 |
| `sprout-downloader` | sprout-video-downloader | 1 | 1937 |
| `onlyfans-bulk-downloader` | onlyfans-downloader | 1 | 1652 |
| `onlyfans-downloader` | onlyfans-downloader | 1 | 1652 |
| `123movies-downloader` | 123movies-downloader | 1 | 1615 |

## Full Matrix

| App | GitHub Repo | Match | Local Dir | Release | README | Images | Words | Missing Core Docs | Other Gaps |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- |
| `123movies-downloader` | [`123movies-downloader`](https://github.com/serpapps/123movies-downloader) | exact | exact | v4.0.1 | yes | 1 | 1615 | license section | - |
| `alphaporno-downloader` | [`alpha-porno-downloader`](https://github.com/serpapps/alpha-porno-downloader) | normalized | exact | v4.0.1 | yes | 1 | 1499 | usage/how-to | - |
| `ashemaletube-downloader` | [`ashemaletube-downloader`](https://github.com/serpapps/ashemaletube-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `beeg-downloader` | [`beeg-video-downloader`](https://github.com/serpapps/beeg-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 1591 | license section | no embedded images |
| `bongacams-downloader` | [`bongacams-downloader`](https://github.com/serpapps/bongacams-downloader) | exact | exact | none | yes | 1 | 159 | license section | missing release, short README |
| `boyfriendtv-downloader` | [`boyfriendtv-downloader`](https://github.com/serpapps/boyfriendtv-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `cam4-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `camscom-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `camsoda-downloader` | [`camsoda-downloader`](https://github.com/serpapps/camsoda-downloader) | exact | exact | none | yes | 1 | 161 | license section | missing release, short README |
| `chaturbate-downloader` | [`chaturbate-downloader`](https://github.com/serpapps/chaturbate-downloader) | exact | exact | none | yes | 0 | 1981 | screenshots/demo, license section | missing release, no embedded images |
| `circle-downloader` | [`circle-downloader`](https://github.com/serpapps/circle-downloader) | exact | exact | v4.0.2 | yes | 2 | 1791 | - | - |
| `clientclub-downloader` | [`clientclub-downloader`](https://github.com/serpapps/clientclub-downloader) | exact | exact | v4.0.1 | yes | 1 | 161 | license section | short README |
| `coomer-downloader` | [`coomer-downloader`](https://github.com/serpapps/coomer-downloader) | exact | exact | v4.0.1 | yes | 0 | 774 | install/setup, license section | no embedded images |
| `dailymotion-downloader` | [`dailymotion-downloader`](https://github.com/serpapps/dailymotion-downloader) | exact | exact | v4.0.1 | yes | 1 | 633 | install/setup, license section | - |
| `dreamcam-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `dreamcam-vr-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `eporner-downloader` | [`eporner-downloader`](https://github.com/serpapps/eporner-downloader) | exact | exact | v4.0.1 | yes | 0 | 1976 | faq/troubleshooting, license section | no embedded images |
| `erome-downloader` | [`erome-downloader`](https://github.com/serpapps/erome-downloader) | exact | exact | v4.0.1 | yes | 0 | 2158 | screenshots/demo, license section | no embedded images |
| `erothots-downloader` | [`erothots-downloader`](https://github.com/serpapps/erothots-downloader) | exact | exact | v4.0.1 | yes | 0 | 768 | install/setup, license section | no embedded images |
| `facebook-downloader` | [`facebook-video-downloader`](https://github.com/serpapps/facebook-video-downloader) | canonical | exact | none | yes | 0 | 16 | install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section | missing release, short README, no embedded images |
| `fansly-live-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `flirt4free-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `gohighlevel-downloader` | [`gohighlevel-downloader`](https://github.com/serpapps/gohighlevel-downloader) | exact | exact | v4.0.1 | yes | 0 | 16 | install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section | short README, no embedded images |
| `gokollab-downloader` | [`gokollab-downloader`](https://github.com/serpapps/gokollab-downloader) | exact | exact | v4.0.1 | yes | 0 | 16 | install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section | short README, no embedded images |
| `hdzog-downloader` | [`hdzog-downloader`](https://github.com/serpapps/hdzog-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `hentaihaven-downloader` | [`hentaihaven-downloader`](https://github.com/serpapps/hentaihaven-downloader) | exact | exact | v4.0.1 | yes | 0 | 1055 | install/setup, license section | no embedded images |
| `instagram-downloader` | [`instagram-downloader`](https://github.com/serpapps/instagram-downloader) | exact | exact | none | yes | 0 | 16 | install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section | missing release, short README, no embedded images |
| `justforfans-downloader` | [`justforfans-downloader`](https://github.com/serpapps/justforfans-downloader) | exact | exact | v4.0.2 | yes | 0 | 1646 | usage/how-to | no embedded images |
| `kajabi-downloader` | [`kajabi-video-downloader`](https://github.com/serpapps/kajabi-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 577 | usage/how-to, screenshots/demo | no embedded images |
| `linkedin-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `loom-downloader` | [`loom-video-downloader`](https://github.com/serpapps/loom-video-downloader) | canonical | exact | v4.0.1 | yes | 3 | 3011 | - | - |
| `luxuretv-downloader` | [`luxuretv-downloader`](https://github.com/serpapps/luxuretv-downloader) | exact | exact | v4.0.1 | yes | 0 | 1062 | install/setup, license section | no embedded images |
| `m3u8-downloader` | [`m3u8-downloader`](https://github.com/serpapps/m3u8-downloader) | exact | exact | v4.0.1 | yes | 0 | 2482 | - | no embedded images |
| `manyvids-downloader` | [`manyvids-downloader`](https://github.com/serpapps/manyvids-downloader) | exact | exact | v4.0.1 | yes | 0 | 824 | install/setup, license section | no embedded images |
| `mindvalley-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `motherless-downloader` | [`motherless-downloader`](https://github.com/serpapps/motherless-downloader) | exact | exact | v4.0.1 | yes | 0 | 784 | license section | no embedded images |
| `myfreecams-downloader` | [`myfreecams-downloader`](https://github.com/serpapps/myfreecams-downloader) | exact | exact | none | yes | 0 | 2158 | screenshots/demo, license section | missing release, no embedded images |
| `nhentai-downloader` | [`nhentai-downloader`](https://github.com/serpapps/nhentai-downloader) | exact | exact | v4.0.1 | yes | 0 | 758 | install/setup, license section | no embedded images |
| `onlyfans-bulk-downloader` | [`onlyfans-downloader`](https://github.com/serpapps/onlyfans-downloader) | canonical | alt: onlyfans-downloader | v4.0.1 | yes | 1 | 1652 | usage/how-to | - |
| `onlyfans-downloader` | [`onlyfans-downloader`](https://github.com/serpapps/onlyfans-downloader) | exact | exact | v4.0.1 | yes | 1 | 1652 | usage/how-to | - |
| `pinterest-downloader` | [`pinterest-downloader`](https://github.com/serpapps/pinterest-downloader) | exact | exact | none | yes | 1 | 160 | license section | missing release, short README |
| `pornhub-downloader` | [`pornhub-video-downloader`](https://github.com/serpapps/pornhub-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 4095 | - | no embedded images |
| `porntrex-downloader` | [`porntrex-downloader`](https://github.com/serpapps/porntrex-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `reddit-downloader` | [`reddit-downloader`](https://github.com/serpapps/reddit-downloader) | exact | exact | none | yes | 0 | 7 | install/setup, usage/how-to, screenshots/demo, faq/troubleshooting, license section | missing release, short README, no embedded images |
| `redgifs-downloader` | [`redgifs-downloader`](https://github.com/serpapps/redgifs-downloader) | exact | exact | v4.0.1 | yes | 0 | 1514 | license section | no embedded images |
| `redtube-downloader` | [`redtube-video-downloader`](https://github.com/serpapps/redtube-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 2006 | license section | no embedded images |
| `sexchathu-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `skool-downloader` | [`skool-downloader`](https://github.com/serpapps/skool-downloader) | exact | exact | v4.0.5 | yes | 12 | 2268 | - | - |
| `spankbang-downloader` | [`spankbang-video-downloader`](https://github.com/serpapps/spankbang-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 1526 | license section | no embedded images |
| `sprout-downloader` | [`sprout-video-downloader`](https://github.com/serpapps/sprout-video-downloader) | canonical | exact | v4.0.2 | yes | 1 | 1937 | - | - |
| `streamate-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `stripchat-downloader` | [`stripchat-video-downloader`](https://github.com/serpapps/stripchat-video-downloader) | canonical | exact | v4.0.1 | no | 0 | 0 | README missing | missing README |
| `stripchat-vr-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `tellatv-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `thinkific-downloader` | [`thinkific-downloader`](https://github.com/serpapps/thinkific-downloader) | exact | exact | v4.0.3 | yes | 0 | 1699 | license section | no embedded images |
| `thisvid-downloader` | [`thisvid-downloader`](https://github.com/serpapps/thisvid-downloader) | exact | exact | v4.0.1 | yes | 0 | 1074 | install/setup, license section | no embedded images |
| `tiktok-downloader` | [`tiktok-video-downloader`](https://github.com/serpapps/tiktok-video-downloader) | canonical | exact | v4.0.1 | yes | 1 | 599 | install/setup | - |
| `tnaflix-downloader` | [`tnaflix-video-downloader`](https://github.com/serpapps/tnaflix-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 1461 | license section | no embedded images |
| `tokyomotion-downloader` | [`tokyomotion-downloader`](https://github.com/serpapps/tokyomotion-downloader) | exact | exact | v4.0.1 | yes | 0 | 1057 | install/setup, license section | no embedded images |
| `twitter-x-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `txxx-downloader` | [`txxx-downloader`](https://github.com/serpapps/txxx-downloader) | exact | exact | v4.0.1 | yes | 0 | 1076 | install/setup, license section | no embedded images |
| `upornia-downloader` | [`upornia-downloader`](https://github.com/serpapps/upornia-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `vimeo-downloader` | [`vimeo-video-downloader`](https://github.com/serpapps/vimeo-video-downloader) | canonical | exact | v4.0.1 | yes | 11 | 1956 | - | - |
| `whop-downloader` | [`whop-video-downloader`](https://github.com/serpapps/whop-video-downloader) | canonical | exact | v4.0.1 | yes | 1 | 1532 | usage/how-to | - |
| `wistia-downloader` | [`wistia-video-downloader`](https://github.com/serpapps/wistia-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 2775 | - | no embedded images |
| `xfantazy-downloader` | [`xfantazy-downloader`](https://github.com/serpapps/xfantazy-downloader) | exact | exact | v4.0.1 | yes | 0 | 1061 | install/setup, license section | no embedded images |
| `xhamster-downloader` | [`xhamster-video-downloader`](https://github.com/serpapps/xhamster-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 1624 | license section | no embedded images |
| `xhamsterlive-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `xlovecam-downloader` | - | missing | exact | - | - | 0 | 0 | README missing | missing GitHub repo |
| `xnxx-downloader` | [`xnxx-video-downloader`](https://github.com/serpapps/xnxx-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 1755 | license section | no embedded images |
| `xvideos-downloader` | [`xvideos-video-downloader`](https://github.com/serpapps/xvideos-video-downloader) | canonical | exact | v4.0.1 | yes | 1 | 2151 | - | - |
| `yespornplease-downloader` | [`yespornplease-downloader`](https://github.com/serpapps/yespornplease-downloader) | exact | exact | v4.0.1 | yes | 0 | 1077 | install/setup, license section | no embedded images |
| `youjizz-downloader` | [`youjizz-downloader`](https://github.com/serpapps/youjizz-downloader) | exact | exact | v4.0.1 | yes | 0 | 820 | install/setup, license section | no embedded images |
| `youporn-downloader` | [`youporn-video-downloader`](https://github.com/serpapps/youporn-video-downloader) | canonical | exact | v4.0.1 | yes | 0 | 2697 | - | no embedded images |
| `youtube-downloader` | [`youtube-downloader`](https://github.com/serpapps/youtube-downloader) | exact | exact | v4.0.1 | yes | 6 | 990 | - | - |

## Notes

- README gap detection is heuristic. It looks for section keywords plus rendered image presence, so it is good for triage rather than legal-grade auditing.
- A README can still mention license terms without using a dedicated `License` heading; those still show as missing if the heading/body signal was weak.
- For repos visible only in the authenticated org view, metadata such as stars or push dates was not always available from the public API, so this report prioritizes existence, releases, and README coverage.