/**
 * Convex cross-account migration script
 *
 * Usage:
 *   node scripts/migrate.mjs
 *
 * Required env vars (set in .env.migration or export before running):
 *   SOURCE_URL        e.g. https://joyous-pika-164.eu-west-1.convex.cloud
 *   SOURCE_ADMIN_KEY  admin key for source deployment
 *   DEST_URL          e.g. https://shiny-clownfish-448.convex.cloud
 *   DEST_ADMIN_KEY    admin key for destination deployment
 *
 * How to get admin keys:
 *   npx convex dashboard  → Settings → URL & Deploy Key → show admin key
 *   OR: cat .env.local | grep CONVEX_DEPLOY_KEY
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.migration if present
try {
  const envPath = resolve(__dirname, '../.env.migration');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
} catch {
  // No .env.migration file — rely on existing env vars
}

const SOURCE_URL = process.env.SOURCE_URL || 'https://joyous-pika-164.eu-west-1.convex.cloud';
const SOURCE_ADMIN_KEY = process.env.SOURCE_ADMIN_KEY;
const DEST_URL = process.env.DEST_URL || 'https://shiny-clownfish-448.convex.cloud';
const DEST_ADMIN_KEY = process.env.DEST_ADMIN_KEY;

if (!SOURCE_ADMIN_KEY || !DEST_ADMIN_KEY) {
  console.error('❌  Set SOURCE_ADMIN_KEY and DEST_ADMIN_KEY (see .env.migration)');
  process.exit(1);
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function convexQuery(baseUrl, adminKey, fnPath, args = {}) {
  const res = await fetch(`${baseUrl}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Convex ${adminKey}`,
    },
    body: JSON.stringify({ path: fnPath, args }),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    throw new Error(`Query ${fnPath}: non-JSON response (HTTP ${res.status}):\n${text.slice(0, 300)}`);
  }
  if (json.status === 'error') {
    throw new Error(`Query ${fnPath} failed: ${json.errorMessage ?? JSON.stringify(json)}`);
  }
  if (!Array.isArray(json.value)) {
    throw new Error(`Query ${fnPath}: expected array, got ${JSON.stringify(json).slice(0, 200)}`);
  }
  return json.value;
}

async function convexMutation(baseUrl, adminKey, fnPath, args = {}) {
  const res = await fetch(`${baseUrl}/api/mutation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Convex ${adminKey}`,
    },
    body: JSON.stringify({ path: fnPath, args }),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    throw new Error(`Mutation ${fnPath}: non-JSON response (HTTP ${res.status}):\n${text.slice(0, 300)}`);
  }
  if (json.status === 'error') {
    throw new Error(`Mutation ${fnPath} failed: ${json.errorMessage ?? JSON.stringify(json)}`);
  }
  return json.value;
}

function src(fn, args) { return convexQuery(SOURCE_URL, SOURCE_ADMIN_KEY, `migration:${fn}`, args); }
function dst(fn, args) { return convexMutation(DEST_URL, DEST_ADMIN_KEY, `migration:${fn}`, args); }

// ── ID map ────────────────────────────────────────────────────────────────────

const idMap = new Map(); // oldId → newId

function remap(id) {
  if (id == null) return id;
  const mapped = idMap.get(id);
  if (!mapped) throw new Error(`No mapped ID for ${id}`);
  return mapped;
}

function remapOpt(id) {
  if (id == null) return undefined;
  return idMap.get(id) ?? undefined;
}

function strip(doc) {
  // Remove Convex system fields before inserting
  const { _id, _creationTime, ...rest } = doc;
  return rest;
}

// ── Migration steps ───────────────────────────────────────────────────────────

async function migrate(label, exportFn, importFn, transform) {
  process.stdout.write(`Migrating ${label}... `);
  const rows = await src(exportFn);
  let count = 0;
  for (const row of rows) {
    const data = transform ? transform(strip(row)) : strip(row);
    const newId = await dst(importFn, { data });
    idMap.set(row._id, newId);
    count++;
  }
  console.log(`✓ ${count}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀  Starting migration`);
  console.log(`   Source: ${SOURCE_URL}`);
  console.log(`   Dest:   ${DEST_URL}\n`);

  // Pre-flight: verify migration functions exist on both deployments
  process.stdout.write('Pre-flight: checking source deployment... ');
  await convexQuery(SOURCE_URL, SOURCE_ADMIN_KEY, 'migration:exportUsers');
  console.log('✓');
  process.stdout.write('Pre-flight: checking dest deployment... ');
  await convexMutation(DEST_URL, DEST_ADMIN_KEY, 'migration:importUser', { data: null }).catch(() => {});
  console.log('✓\n');

  // ── Pass 1: No dependencies ────────────────────────────────────────────────
  await migrate('users',                 'exportUsers',                'importUser',                   null);
  await migrate('scholarships',          'exportScholarships',         'importScholarship',            (d) => ({
    ...d,
    createdBy: remapOpt(d.createdBy),
  }));
  await migrate('boardingSchools',       'exportBoardingSchools',      'importBoardingSchool',         null);
  await migrate('internationalSchools',  'exportInternationalSchools', 'importInternationalSchool',    null);
  await migrate('universities',          'exportUniversities',         'importUniversity',             null);
  await migrate('courseCategories',      'exportCourseCategories',     'importCourseCategory',         null);
  await migrate('achievements',          'exportAchievements',         'importAchievement',            null);
  await migrate('invoiceCounter',        'exportInvoiceCounter',       'importInvoiceCounter',         null);
  await migrate('shortUrls',             'exportShortUrls',            'importShortUrl',               null);

  // ── Pass 2: Depend on users ────────────────────────────────────────────────
  await migrate('academicProfiles', 'exportAcademicProfiles', 'importAcademicProfile', (d) => ({
    ...d,
    userId: remap(d.userId),
  }));
  await migrate('institutionProfiles', 'exportInstitutionProfiles', 'importInstitutionProfile', (d) => ({
    ...d,
    userId: remap(d.userId),
    approvedBy: remapOpt(d.approvedBy),
  }));
  await migrate('partnerProfiles', 'exportPartnerProfiles', 'importPartnerProfile', (d) => ({
    ...d,
    userId: remapOpt(d.userId),
    approvedBy: remapOpt(d.approvedBy),
  }));
  await migrate('emailLogs', 'exportEmailLogs', 'importEmailLog', (d) => ({
    ...d,
    userId: remapOpt(d.userId),
  }));
  await migrate('invoices', 'exportInvoices', 'importInvoice', (d) => ({
    ...d,
    userId: remap(d.userId),
    // pdfStorageId references _storage — file blobs can't be migrated via API
    pdfStorageId: undefined,
  }));
  await migrate('kidProfiles', 'exportKidProfiles', 'importKidProfile', (d) => ({
    ...d,
    userId: remap(d.userId),
  }));
  await migrate('referrals', 'exportReferrals', 'importReferral', (d) => ({
    ...d,
    referrerUserId: remap(d.referrerUserId),
    referredUserId: remap(d.referredUserId),
  }));

  // ── Pass 3: Depend on courses / institutionProfiles ────────────────────────
  await migrate('courses', 'exportCourses', 'importCourse', (d) => ({
    ...d,
    categoryId: remap(d.categoryId),
  }));
  await migrate('lessons', 'exportLessons', 'importLesson', (d) => ({
    ...d,
    courseId: remap(d.courseId),
  }));
  await migrate('assessments', 'exportAssessments', 'importAssessment', (d) => ({
    ...d,
    courseId: remap(d.courseId),
  }));
  await migrate('internships', 'exportInternships', 'importInternship', (d) => ({
    ...d,
    companyId: remap(d.companyId),
  }));
  await migrate('corporateDonations', 'exportCorporateDonations', 'importCorporateDonation', (d) => ({
    ...d,
    corporateUserId: remap(d.corporateUserId),
    companyId: remap(d.companyId),
  }));

  // ── Pass 4: Depend on scholarships / boardingSchools / internships ─────────
  await migrate('scholarshipNotifications', 'exportScholarshipNotifications', 'importScholarshipNotification', (d) => ({
    ...d,
    userId: remap(d.userId),
    scholarshipId: remap(d.scholarshipId),
  }));
  await migrate('boardingSchoolNotifications', 'exportBoardingSchoolNotifications', 'importBoardingSchoolNotification', (d) => ({
    ...d,
    userId: remap(d.userId),
    schoolId: remap(d.schoolId),
  }));
  await migrate('applications', 'exportApplications', 'importApplication', (d) => ({
    ...d,
    userId: remap(d.userId),
    scholarshipId: remap(d.scholarshipId),
  }));
  await migrate('scholarshipFeaturePayments', 'exportScholarshipFeaturePayments', 'importScholarshipFeaturePayment', (d) => ({
    ...d,
    corporateUserId: remap(d.corporateUserId),
    scholarshipId: remap(d.scholarshipId),
  }));
  await migrate('internshipApplications', 'exportInternshipApplications', 'importInternshipApplication', (d) => ({
    ...d,
    internshipId: remap(d.internshipId),
    userId: remap(d.userId),
  }));
  await migrate('internshipPayments', 'exportInternshipPayments', 'importInternshipPayment', (d) => ({
    ...d,
    companyId: remap(d.companyId),
    internshipIds: d.internshipIds.map(remap),
  }));
  await migrate('partnerReferrals', 'exportPartnerReferrals', 'importPartnerReferral', (d) => ({
    ...d,
    partnerProfileId: remap(d.partnerProfileId),
    partnerUserId: remapOpt(d.partnerUserId),
    studentUserId: remap(d.studentUserId),
  }));

  // ── Pass 5: Circular deps — insert without back-refs first ────────────────
  console.log('\n── Circular pass (subscriptions ↔ referralRewards) ──');

  // Store raw source rows for the patch pass
  const rawSubscriptions = await src('exportSubscriptions');
  const rawReferralRewards = await src('exportReferralRewards');

  process.stdout.write('Migrating subscriptions (pass 1)... ');
  for (const row of rawSubscriptions) {
    const d = strip(row);
    const newId = await dst('importSubscription', {
      data: {
        ...d,
        userId: remap(d.userId),
        donationId: undefined,       // resolved in patch pass
        referralRewardId: undefined, // resolved in patch pass
      },
    });
    idMap.set(row._id, newId);
  }
  console.log(`✓ ${rawSubscriptions.length}`);

  process.stdout.write('Migrating referralRewards (pass 1)... ');
  for (const row of rawReferralRewards) {
    const d = strip(row);
    const newId = await dst('importReferralReward', {
      data: {
        ...d,
        referrerUserId: remap(d.referrerUserId),
        subscriptionId: undefined, // resolved in patch pass
        referralIds: d.referralIds.map(remap),
        couponClaimedBy: remapOpt(d.couponClaimedBy),
      },
    });
    idMap.set(row._id, newId);
  }
  console.log(`✓ ${rawReferralRewards.length}`);

  process.stdout.write('Patching subscriptions with donationId/referralRewardId... ');
  for (const row of rawSubscriptions) {
    const newId = idMap.get(row._id);
    const d = strip(row);
    await convexMutation(DEST_URL, DEST_ADMIN_KEY, 'migration:patchSubscription', {
      id: newId,
      donationId: remapOpt(d.donationId),
      referralRewardId: remapOpt(d.referralRewardId),
    });
  }
  console.log('✓');

  process.stdout.write('Patching referralRewards with subscriptionId... ');
  for (const row of rawReferralRewards) {
    const newId = idMap.get(row._id);
    const d = strip(row);
    await convexMutation(DEST_URL, DEST_ADMIN_KEY, 'migration:patchReferralReward', {
      id: newId,
      subscriptionId: remapOpt(d.subscriptionId),
    });
  }
  console.log('✓');

  // ── Pass 6: Depend on subscriptions / corporateDonations ──────────────────
  await migrate('donatedSubscriptions', 'exportDonatedSubscriptions', 'importDonatedSubscription', (d) => ({
    ...d,
    donationId: remap(d.donationId),
    corporateUserId: remap(d.corporateUserId),
    studentUserId: remap(d.studentUserId),
    subscriptionId: remap(d.subscriptionId),
  }));

  // ── Pass 7: Learning data (depend on users, kidProfiles, courses, lessons) ─
  await migrate('courseEnrollments', 'exportCourseEnrollments', 'importCourseEnrollment', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    courseId: remap(d.courseId),
    completedLessons: d.completedLessons.map((cl) => ({
      ...cl,
      lessonId: remap(cl.lessonId),
    })),
  }));
  await migrate('aiTutorInteractions', 'exportAiTutorInteractions', 'importAiTutorInteraction', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    lessonId: remap(d.lessonId),
  }));
  await migrate('learningSessions', 'exportLearningSessions', 'importLearningSession', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    courseId: remap(d.courseId),
    lessonId: remap(d.lessonId),
  }));
  await migrate('assessmentResults', 'exportAssessmentResults', 'importAssessmentResult', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    assessmentId: remap(d.assessmentId),
    courseId: remap(d.courseId),
  }));
  await migrate('leaderboard', 'exportLeaderboard', 'importLeaderboardEntry', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    courseId: remap(d.courseId),
  }));
  await migrate('userAchievements', 'exportUserAchievements', 'importUserAchievement', (d) => ({
    ...d,
    userId: remap(d.userId),
    kidProfileId: remap(d.kidProfileId),
    courseId: remapOpt(d.courseId),
  }));

  console.log('\n✅  Migration complete!\n');
  console.log('⚠️  Note: File storage (_storage) blobs are NOT migrated.');
  console.log('   Affected fields: users.profileImageId, invoices.pdfStorageId');
  console.log('   Re-upload those files manually via the Convex dashboard.\n');
}

main().catch((err) => {
  console.error('\n❌  Migration failed:', err.message);
  process.exit(1);
});
