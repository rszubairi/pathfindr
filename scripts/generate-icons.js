#!/usr/bin/env node
/**
 * Generates iOS app icon (1024x1024) and Android adaptive icon (1024x1024)
 * from the Pathfindr logo, using the brand primary colour as background.
 *
 * Usage: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const path = require('path');

const BRAND_BLUE = { r: 37, g: 99, b: 235 }; // #2563eb
const ICON_SIZE = 1024;
const LOGO_SRC = path.resolve(__dirname, '../apps/mobile/assets/images/logo.png');
const OUT_DIR  = path.resolve(__dirname, '../apps/mobile/assets');

/**
 * Takes a cropped logo buffer (blue cap on transparent bg) and returns a
 * white-tinted version at the target width, preserving the original alpha mask.
 */
async function makeWhiteCap(srcBuffer, targetWidth) {
  const resized = await sharp(srcBuffer)
    .resize(targetWidth, undefined, { fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .toBuffer();

  const { width, height } = await sharp(resized).metadata();

  // Extract alpha channel so we keep the exact shape of the cap
  const alpha = await sharp(resized).extractChannel('alpha').toBuffer();

  // White RGB canvas same size, then re-attach the original alpha
  const whiteRgb = await sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  }).png().toBuffer();

  return sharp(whiteRgb).joinChannel(alpha).toBuffer();
}

async function main() {
  // ── 1. Load logo and get its dimensions ──────────────────────────────────
  const logo = sharp(LOGO_SRC);
  const { width: logoW, height: logoH } = await logo.metadata();

  // The logo.png is 400×300: cap occupies the top ~65 %, text the bottom 35 %.
  // Crop just the cap, then trim transparent padding for a tight bounding box.
  const capHeight = Math.round(logoH * 0.66);
  const capCropRaw = await sharp(LOGO_SRC)
    .extract({ left: 0, top: 0, width: logoW, height: capHeight })
    .toBuffer();
  // Trim transparent padding in a second pass so the cap fills its bounding box
  const capCrop = await sharp(capCropRaw).trim().toBuffer();

  // ── 2. Resize & tint cap white (cap is blue, would be invisible on blue bg)
  const targetCapW = Math.round(ICON_SIZE * 0.62);
  const resizedCap = await makeWhiteCap(capCrop, targetCapW);

  const { width: capW, height: capH } = await sharp(resizedCap).metadata();

  // Centre the cap on the square icon
  const left = Math.round((ICON_SIZE - capW) / 2);
  const top  = Math.round((ICON_SIZE - capH) / 2);

  // ── 3. Composite cap onto brand-blue background → icon.png ───────────────
  await sharp({
    create: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      channels: 3,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: resizedCap, left, top }])
    .png()
    .toFile(path.join(OUT_DIR, 'icon.png'));

  console.log('✓  icon.png (1024×1024) written');

  // ── 4. Android adaptive icon — cap slightly smaller (80 %) for safe zone ──
  const adaptiveCapW = Math.round(ICON_SIZE * 0.50);
  const adaptiveCap = await makeWhiteCap(capCrop, adaptiveCapW);

  const { width: aCapW, height: aCapH } = await sharp(adaptiveCap).metadata();
  const aLeft = Math.round((ICON_SIZE - aCapW) / 2);
  const aTop  = Math.round((ICON_SIZE - aCapH) / 2);

  await sharp({
    create: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      channels: 3,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: adaptiveCap, left: aLeft, top: aTop }])
    .png()
    .toFile(path.join(OUT_DIR, 'adaptive-icon.png'));

  console.log('✓  adaptive-icon.png (1024×1024) written');

  // ── 5. favicon (web) — 48×48 ─────────────────────────────────────────────
  await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 3,
      background: BRAND_BLUE,
    },
  })
    .composite([{
      input: await makeWhiteCap(capCrop, 30),
      left: 9,
      top: 9,
    }])
    .png()
    .toFile(path.join(OUT_DIR, 'favicon.png'));

  console.log('✓  favicon.png (48×48) written');

  console.log('\nDone. Commit the updated assets and rebuild with EAS.');
}

main().catch(err => { console.error(err); process.exit(1); });
