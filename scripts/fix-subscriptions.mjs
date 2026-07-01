/**
 * Fix missing subscriptions after convex export/import.
 *
 * Context: convex export/import preserved all IDs except subscriptions (skipped).
 * So donatedSubscriptions.subscriptionId and referralRewards.subscriptionId in
 * the destination currently point to old source IDs that don't exist.
 *
 * This script:
 *  1. Reads subscriptions from source
 *  2. Inserts them into destination (gets new IDs)
 *  3. Patches referralRewards and donatedSubscriptions with the new IDs
 *
 * Run AFTER deploying convex/migration.ts to BOTH deployments:
 *   $env:CONVEX_DEPLOY_KEY = "<source-key>"; npx convex deploy --typecheck=disable
 *   $env:CONVEX_DEPLOY_KEY = "<dest-key>";   npx convex deploy --typecheck=disable
 *
 * Then: node scripts/fix-subscriptions.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const lines = readFileSync(resolve(__dirname, '../.env.migration'), 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
} catch {}

const SOURCE_URL = process.env.SOURCE_URL;
const SOURCE_ADMIN_KEY = process.env.SOURCE_ADMIN_KEY;
const DEST_URL = process.env.DEST_URL;
const DEST_ADMIN_KEY = process.env.DEST_ADMIN_KEY;

if (!SOURCE_ADMIN_KEY || !DEST_ADMIN_KEY) {
  console.error('❌  Missing SOURCE_ADMIN_KEY or DEST_ADMIN_KEY in .env.migration');
  process.exit(1);
}

async function query(baseUrl, key, fn, args = {}) {
  const res = await fetch(`${baseUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Convex ${key}` },
    body: JSON.stringify({ path: `migration:${fn}`, args }),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    throw new Error(`${fn}: non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (json.status === 'error') throw new Error(`${fn}: ${json.errorMessage}`);
  if (!Array.isArray(json.value)) throw new Error(`${fn}: expected array, got: ${JSON.stringify(json).slice(0, 300)}`);
  return json.value;
}

async function mutation(baseUrl, key, fn, args = {}) {
  const res = await fetch(`${baseUrl}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Convex ${key}` },
    body: JSON.stringify({ path: `migration:${fn}`, args }),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    throw new Error(`${fn}: non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (json.status === 'error') throw new Error(`${fn}: ${json.errorMessage}`);
  return json.value;
}

function strip({ _id, _creationTime, ...rest }) { return rest; }

async function main() {
  console.log('\n🔧  Fixing missing subscriptions\n');

  // Step 1: Read subscriptions from source
  process.stdout.write('Reading subscriptions from source... ');
  const srcSubs = await query(SOURCE_URL, SOURCE_ADMIN_KEY, 'exportSubscriptions');
  console.log(`${srcSubs.length} found`);

  if (srcSubs.length === 0) {
    console.log('✅  Nothing to do.');
    return;
  }

  // Step 2: Insert subscriptions into destination, build old→new ID map
  const subIdMap = new Map(); // oldId → newId
  process.stdout.write('Inserting subscriptions into destination... ');
  for (const sub of srcSubs) {
    const data = strip(sub);
    // donationId and referralRewardId reference tables already in dest with original IDs
    // so we can pass them through directly
    const newId = await mutation(DEST_URL, DEST_ADMIN_KEY, 'importSubscription', { data });
    subIdMap.set(sub._id, newId);
  }
  console.log('✓');

  // Step 3: Patch referralRewards.subscriptionId in destination
  process.stdout.write('Patching referralRewards.subscriptionId... ');
  const destReferralRewards = await query(DEST_URL, DEST_ADMIN_KEY, 'exportReferralRewards');
  let rrPatched = 0;
  for (const rr of destReferralRewards) {
    if (!rr.subscriptionId) continue;
    const newSubId = subIdMap.get(rr.subscriptionId);
    if (!newSubId) {
      console.warn(`\n  ⚠️  No new subscription ID found for referralReward ${rr._id} (old sub: ${rr.subscriptionId})`);
      continue;
    }
    await mutation(DEST_URL, DEST_ADMIN_KEY, 'patchReferralReward', {
      id: rr._id,
      subscriptionId: newSubId,
    });
    rrPatched++;
  }
  console.log(`✓ (${rrPatched} patched)`);

  // Step 4: Patch donatedSubscriptions.subscriptionId in destination
  process.stdout.write('Patching donatedSubscriptions.subscriptionId... ');
  const destDonatedSubs = await query(DEST_URL, DEST_ADMIN_KEY, 'exportDonatedSubscriptions');
  let dsPatched = 0;
  for (const ds of destDonatedSubs) {
    if (!ds.subscriptionId) continue;
    const newSubId = subIdMap.get(ds.subscriptionId);
    if (!newSubId) {
      console.warn(`\n  ⚠️  No new subscription ID found for donatedSubscription ${ds._id} (old sub: ${ds.subscriptionId})`);
      continue;
    }
    await mutation(DEST_URL, DEST_ADMIN_KEY, 'patchDonatedSubscription', {
      id: ds._id,
      subscriptionId: newSubId,
    });
    dsPatched++;
  }
  console.log(`✓ (${dsPatched} patched)`);

  console.log('\n✅  Done! Subscriptions migrated and references fixed.\n');
}

main().catch((err) => {
  console.error('\n❌', err.message);
  process.exit(1);
});
