import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DATA_DIR = join(ROOT, '~info_matrix');
const DIST = join(ROOT, 'dist');

// ── helpers ──────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

// ── data loading ─────────────────────────────────────────────────────

async function loadDownloaders() {
  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  const downloaders = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = join(DATA_DIR, entry.name);
    try {
      const [content, technical] = await Promise.all([
        readJson(join(dir, 'content-marketing-matrix.json')),
        readJson(join(dir, 'technical-info-matrix.json')),
      ]);
      downloaders.push({ slug: entry.name, content, technical });
    } catch {
      // skip folders missing data files
    }
  }

  downloaders.sort((a, b) => a.slug.localeCompare(b.slug));
  return downloaders;
}

// ── shared HTML pieces ───────────────────────────────────────────────

function htmlHead(title, description, extraHead = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<style>
:root{--bg:#0f0f0f;--surface:#1a1a1a;--border:#2a2a2a;--text:#e5e5e5;--muted:#999;--accent:#0ea5e9;--accent-hover:#38bdf8}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:var(--accent);text-decoration:none}a:hover{color:var(--accent-hover);text-decoration:underline}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
header{border-bottom:1px solid var(--border);padding:18px 0}
header .container{display:flex;align-items:center;justify-content:space-between}
header h1{font-size:1.1rem;font-weight:600}header h1 a{color:var(--text)}
.badge{display:inline-block;font-size:.7rem;padding:2px 8px;border-radius:999px;background:var(--accent);color:#fff;font-weight:600;vertical-align:middle;margin-left:8px}
main{padding:48px 0 80px}
footer{border-top:1px solid var(--border);padding:24px 0;text-align:center;color:var(--muted);font-size:.85rem}
/* index */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:32px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;transition:border-color .2s}
.card:hover{border-color:var(--accent)}
.card h3{font-size:1rem;margin-bottom:6px}
.card p{font-size:.85rem;color:var(--muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card .meta{margin-top:10px;font-size:.75rem;color:var(--muted)}
/* product */
.hero{text-align:center;padding:60px 0 40px}
.hero h2{font-size:2rem;font-weight:700;margin-bottom:12px}
.hero p{font-size:1.1rem;color:var(--muted);max-width:640px;margin:0 auto 24px}
.cta{display:inline-block;padding:12px 32px;background:var(--accent);color:#fff;border-radius:8px;font-weight:600;font-size:1rem;transition:background .2s}
.cta:hover{background:var(--accent-hover);text-decoration:none;color:#fff}
section.features{padding:40px 0}
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;margin-top:20px}
.feature{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px}
.feature h4{font-size:.95rem;margin-bottom:6px}
.feature p{font-size:.85rem;color:var(--muted)}
section.faq{padding:40px 0}
.faq-item{border-bottom:1px solid var(--border);padding:16px 0}
.faq-item h4{font-size:.95rem;margin-bottom:6px}
.faq-item p{font-size:.85rem;color:var(--muted)}
section.trust{padding:40px 0;text-align:center}
.trust ul{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:12px 24px;margin-top:16px}
.trust li{font-size:.85rem;color:var(--muted)}
.trust li::before{content:'✓ ';color:var(--accent)}
.bottom-cta{text-align:center;padding:60px 0}
.bottom-cta h3{font-size:1.4rem;margin-bottom:16px}
h2.section-title{font-size:1.3rem;text-align:center;font-weight:600}
.how-it-works{padding:40px 0}
.steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;margin-top:20px}
.step{text-align:center;padding:16px}
.step-num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;font-weight:700;font-size:.95rem;margin-bottom:10px}
.step h4{font-size:.9rem;margin-bottom:4px}
.step p{font-size:.8rem;color:var(--muted)}
.search-box{margin-top:24px;display:flex;justify-content:center}
.search-box input{width:100%;max-width:420px;padding:10px 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-size:.95rem;outline:none}
.search-box input:focus{border-color:var(--accent)}
</style>
${extraHead}
</head>`;
}

const footer = `<footer><div class="container">&copy; ${new Date().getFullYear()} SERP Apps &mdash; serpdownloaders.com</div></footer>`;

// ── index page ───────────────────────────────────────────────────────

function buildIndex(downloaders) {
  const cards = downloaders.map(d => {
    const name = escapeHtml(d.content.productPositioning?.headline || d.technical.extensionName || d.slug);
    const desc = escapeHtml(d.content.productPositioning?.elevatorPitch || '');
    const category = escapeHtml(d.technical.category || 'Downloader');
    return `<a href="/${d.slug}/" class="card" data-name="${escapeHtml(d.slug)}">
  <h3>${name}</h3>
  <p>${desc}</p>
  <div class="meta">${category}</div>
</a>`;
  }).join('\n');

  return `${htmlHead('SERP Downloaders — Browser Extensions for Every Site', 'Browse all SERP downloader browser extensions. Download videos, images, and media from 70+ sites.')}
<body>
<header><div class="container"><h1><a href="/">SERP Downloaders</a><span class="badge">${downloaders.length} extensions</span></h1></div></header>
<main><div class="container">
<h2 class="section-title">All Downloaders</h2>
<div class="search-box"><input type="text" id="q" placeholder="Search downloaders…" autocomplete="off"></div>
<div class="grid" id="grid">
${cards}
</div>
</div></main>
${footer}
<script>
document.getElementById('q').addEventListener('input',function(e){
  var q=e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(function(c){
    c.style.display=c.dataset.name.indexOf(q)!==-1?'':'none';
  });
});
</script>
</body></html>`;
}

// ── product page ─────────────────────────────────────────────────────

function buildProductPage(d) {
  const cm = d.content;
  const lp = cm.landingPageContent || {};
  const hero = lp.heroSection || {};
  const seo = cm.seoAndSearch || {};
  const store = cm.storeListingCopy || {};

  const title = seo.seoTitle || hero.headline || d.slug;
  const desc = seo.metaDescription || cm.productPositioning?.elevatorPitch || '';
  const headline = escapeHtml(hero.headline || cm.productPositioning?.headline || d.slug);
  const subheadline = escapeHtml(hero.subheadline || cm.productPositioning?.valueProposition || '');
  const ctaText = escapeHtml(hero.ctaButton || 'Try Free');
  const productPage = d.technical.storeAndDistribution?.productPage || '#';

  // features
  const featureBlocks = (lp.featureBlocks || []).map(f =>
    `<div class="feature"><h4>${escapeHtml(f.title)}</h4><p>${escapeHtml(f.description)}</p></div>`
  ).join('\n');

  // how it works
  const steps = (store.howItWorks || []).map(s =>
    `<div class="step"><div class="step-num">${s.step}</div><h4>${escapeHtml(s.title)}</h4><p>${escapeHtml(s.description)}</p></div>`
  ).join('\n');

  // FAQ
  const faqItems = (store.faq || []).map(f =>
    `<div class="faq-item"><h4>${escapeHtml(f.question)}</h4><p>${escapeHtml(f.answer)}</p></div>`
  ).join('\n');

  // trust
  const trustItems = (lp.trustSignals || []).map(t =>
    `<li>${escapeHtml(t)}</li>`
  ).join('\n');

  // bottom CTA
  const bottomCta = lp.footerCta || {};

  return `${htmlHead(title, desc)}
<body>
<header><div class="container"><h1><a href="/">SERP Downloaders</a></h1></div></header>
<main>

<div class="hero container">
<h2>${headline}</h2>
<p>${subheadline}</p>
<a class="cta" href="${escapeHtml(productPage)}">${ctaText}</a>
</div>

${featureBlocks ? `<section class="features"><div class="container">
<h2 class="section-title">Features</h2>
<div class="features-grid">${featureBlocks}</div>
</div></section>` : ''}

${steps ? `<section class="how-it-works"><div class="container">
<h2 class="section-title">How It Works</h2>
<div class="steps">${steps}</div>
</div></section>` : ''}

${faqItems ? `<section class="faq"><div class="container">
<h2 class="section-title">FAQ</h2>
${faqItems}
</div></section>` : ''}

${trustItems ? `<section class="trust"><div class="container">
<h2 class="section-title">Why SERP?</h2>
<ul>${trustItems}</ul>
</div></section>` : ''}

<div class="bottom-cta container">
<h3>${escapeHtml(bottomCta.headline || 'Ready to download?')}</h3>
<a class="cta" href="${escapeHtml(productPage)}">${escapeHtml(bottomCta.button || ctaText)}</a>
</div>

</main>
${footer}
</body></html>`;
}

// ── main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('Loading downloader data…');
  const downloaders = await loadDownloaders();
  console.log(`  Found ${downloaders.length} downloaders with data.`);

  // prepare dist/
  await mkdir(DIST, { recursive: true });

  // write index
  await writeFile(join(DIST, 'index.html'), buildIndex(downloaders));
  console.log('  ✓ index.html');

  // write product pages
  let count = 0;
  for (const d of downloaders) {
    const dir = join(DIST, d.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), buildProductPage(d));
    count++;
  }
  console.log(`  ✓ ${count} product pages`);
  console.log(`Build complete → dist/`);
}

main().catch(err => { console.error(err); process.exit(1); });
