/**
 * fetchUniversityLogos.mjs
 *
 * Fetches logos for every university in universityProfiles using:
 *   1. Clearbit Logo API  (https://logo.clearbit.com/{domain})
 *   2. Favicon fallback   (https://{domain}/favicon.ico)
 *
 * Saves PNGs to:  apps/web/public/logos/universities/{slug}.png
 *
 * Run from the repo root:
 *   node apps/web/scripts/fetchUniversityLogos.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/logos/universities');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── University list ─────────────────────────────────────────────────────────
// slug must match UniversityProfile.slug in universityProfiles.ts
const universities = [
  // United States
  { slug: 'mit',                           domain: 'mit.edu' },
  { slug: 'harvard',                        domain: 'harvard.edu' },
  { slug: 'stanford',                       domain: 'stanford.edu' },
  // United Kingdom
  { slug: 'imperial-college-london',        domain: 'imperial.ac.uk' },
  { slug: 'university-of-oxford',           domain: 'ox.ac.uk' },
  { slug: 'university-of-cambridge',        domain: 'cam.ac.uk' },
  // Germany
  { slug: 'technical-university-munich',    domain: 'tum.de' },
  // Malaysia
  { slug: 'universiti-malaya',              domain: 'um.edu.my' },
  { slug: 'universiti-putra-malaysia',      domain: 'upm.edu.my' },
  { slug: 'universiti-teknologi-malaysia',  domain: 'utm.my' },
  { slug: 'universiti-kebangsaan-malaysia', domain: 'ukm.my' },
  { slug: 'universiti-sains-malaysia',      domain: 'usm.my' },
  { slug: 'taylors-university',             domain: 'taylors.edu.my' },
  // Indonesia
  { slug: 'universitas-indonesia',          domain: 'ui.ac.id' },
  // Pakistan
  { slug: 'quaid-i-azam-university',        domain: 'qau.edu.pk' },
  { slug: 'nust',                           domain: 'nust.edu.pk' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fetch(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PathfindrBot/1.0)' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        return fetch(res.headers.location, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] ?? '' }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function isValidImage(buf, contentType) {
  if (contentType && contentType.includes('text/html')) return false;
  // PNG magic
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  // JPEG magic
  if (buf[0] === 0xFF && buf[1] === 0xD8) return true;
  // ICO magic
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01) return true;
  // SVG
  const str = buf.slice(0, 100).toString('utf8');
  if (str.includes('<svg') || contentType?.includes('svg')) return true;
  return false;
}

function extFor(contentType, buf) {
  if (contentType?.includes('svg')) return '.svg';
  if (buf[0] === 0xFF && buf[1] === 0xD8) return '.jpg';
  if (buf[0] === 0x00 && buf[1] === 0x00) return '.ico';
  return '.png';
}

// ── Main ─────────────────────────────────────────────────────────────────────
const results = [];

for (const uni of universities) {
  const clearbitUrl = `https://logo.clearbit.com/${uni.domain}?size=200`;
  const faviconUrl  = `https://${uni.domain}/favicon.ico`;
  const destBase    = path.join(OUT_DIR, uni.slug);

  // Skip if already downloaded
  const existing = ['.png', '.jpg', '.svg', '.ico'].find(ext => fs.existsSync(destBase + ext));
  if (existing) {
    console.log(`⏭  ${uni.slug} — already exists (${uni.slug}${existing})`);
    results.push({ slug: uni.slug, path: `/logos/universities/${uni.slug}${existing}`, source: 'cached' });
    continue;
  }

  let saved = false;

  // 1. Try Clearbit
  try {
    const { buffer, contentType } = await fetch(clearbitUrl);
    if (isValidImage(buffer, contentType)) {
      const ext = extFor(contentType, buffer);
      fs.writeFileSync(destBase + ext, buffer);
      console.log(`✅  ${uni.slug} — Clearbit (${(buffer.length / 1024).toFixed(1)} KB)`);
      results.push({ slug: uni.slug, path: `/logos/universities/${uni.slug}${ext}`, source: 'clearbit' });
      saved = true;
    }
  } catch (e) {
    // fall through
  }

  // 2. Fallback: favicon
  if (!saved) {
    try {
      const { buffer, contentType } = await fetch(faviconUrl);
      if (isValidImage(buffer, contentType)) {
        const ext = extFor(contentType, buffer);
        fs.writeFileSync(destBase + ext, buffer);
        console.log(`🔄  ${uni.slug} — favicon fallback (${(buffer.length / 1024).toFixed(1)} KB)`);
        results.push({ slug: uni.slug, path: `/logos/universities/${uni.slug}${ext}`, source: 'favicon' });
        saved = true;
      }
    } catch (e) {
      // fall through
    }
  }

  if (!saved) {
    console.log(`❌  ${uni.slug} — no logo found`);
    results.push({ slug: uni.slug, path: null, source: 'none' });
  }

  // Be polite — small delay between requests
  await new Promise(r => setTimeout(r, 300));
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n── Summary ─────────────────────────────────────────────');
const succeeded = results.filter(r => r.path);
const failed    = results.filter(r => !r.path);
console.log(`✅  ${succeeded.length} logos saved`);
if (failed.length) console.log(`❌  ${failed.length} missing: ${failed.map(r => r.slug).join(', ')}`);

// ── Print logo map for copy-paste into universityProfiles.ts ────────────────
console.log('\n── Logo paths to paste into universityProfiles.ts ──────');
for (const r of succeeded) {
  console.log(`  '${r.slug}': '${r.path}',`);
}
