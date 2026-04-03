/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminDashboard from "../adminDashboard.js";
import type * as adminInstitutions from "../adminInstitutions.js";
import type * as adminSubscriptions from "../adminSubscriptions.js";
import type * as adminUsers from "../adminUsers.js";
import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as boardingSchoolNotifications from "../boardingSchoolNotifications.js";
import type * as boardingSchools from "../boardingSchools.js";
import type * as corporateDonationActions from "../corporateDonationActions.js";
import type * as corporateDonations from "../corporateDonations.js";
import type * as crons from "../crons.js";
import type * as emailLogs from "../emailLogs.js";
import type * as http from "../http.js";
import type * as institutionAuth from "../institutionAuth.js";
import type * as institutionAuthActions from "../institutionAuthActions.js";
import type * as institutionScholarships from "../institutionScholarships.js";
import type * as internationalSchools from "../internationalSchools.js";
import type * as internationalSchoolsSeed from "../internationalSchoolsSeed.js";
import type * as internshipApplications from "../internshipApplications.js";
import type * as internshipPayments from "../internshipPayments.js";
import type * as internships from "../internships.js";
import type * as notificationActions from "../notificationActions.js";
import type * as notifications from "../notifications.js";
import type * as profiles from "../profiles.js";
import type * as referrals from "../referrals.js";
import type * as scholarshipFeaturePayments from "../scholarshipFeaturePayments.js";
import type * as scholarships from "../scholarships.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as seedDataBoardingSchools from "../seedDataBoardingSchools.js";
import type * as seedDataSPM2025 from "../seedDataSPM2025.js";
import type * as seedDataScholarshipsGCC from "../seedDataScholarshipsGCC.js";
import type * as seedDataScraped from "../seedDataScraped.js";
import type * as seedDataUniversities from "../seedDataUniversities.js";
import type * as seedFeatured from "../seedFeatured.js";
import type * as seedScholarships from "../seedScholarships.js";
import type * as seedUniversities from "../seedUniversities.js";
import type * as shortUrls from "../shortUrls.js";
import type * as storage from "../storage.js";
import type * as stripeActions from "../stripeActions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as updateRankings from "../updateRankings.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminDashboard: typeof adminDashboard;
  adminInstitutions: typeof adminInstitutions;
  adminSubscriptions: typeof adminSubscriptions;
  adminUsers: typeof adminUsers;
  auth: typeof auth;
  authActions: typeof authActions;
  boardingSchoolNotifications: typeof boardingSchoolNotifications;
  boardingSchools: typeof boardingSchools;
  corporateDonationActions: typeof corporateDonationActions;
  corporateDonations: typeof corporateDonations;
  crons: typeof crons;
  emailLogs: typeof emailLogs;
  http: typeof http;
  institutionAuth: typeof institutionAuth;
  institutionAuthActions: typeof institutionAuthActions;
  institutionScholarships: typeof institutionScholarships;
  internationalSchools: typeof internationalSchools;
  internationalSchoolsSeed: typeof internationalSchoolsSeed;
  internshipApplications: typeof internshipApplications;
  internshipPayments: typeof internshipPayments;
  internships: typeof internships;
  notificationActions: typeof notificationActions;
  notifications: typeof notifications;
  profiles: typeof profiles;
  referrals: typeof referrals;
  scholarshipFeaturePayments: typeof scholarshipFeaturePayments;
  scholarships: typeof scholarships;
  seed: typeof seed;
  seedData: typeof seedData;
  seedDataBoardingSchools: typeof seedDataBoardingSchools;
  seedDataSPM2025: typeof seedDataSPM2025;
  seedDataScholarshipsGCC: typeof seedDataScholarshipsGCC;
  seedDataScraped: typeof seedDataScraped;
  seedDataUniversities: typeof seedDataUniversities;
  seedFeatured: typeof seedFeatured;
  seedScholarships: typeof seedScholarships;
  seedUniversities: typeof seedUniversities;
  shortUrls: typeof shortUrls;
  storage: typeof storage;
  stripeActions: typeof stripeActions;
  subscriptions: typeof subscriptions;
  updateRankings: typeof updateRankings;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
