/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as boardingSchools from "../boardingSchools.js";
import type * as http from "../http.js";
import type * as profiles from "../profiles.js";
import type * as scholarships from "../scholarships.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as seedDataBoardingSchools from "../seedDataBoardingSchools.js";
import type * as seedDataScraped from "../seedDataScraped.js";
import type * as stripeActions from "../stripeActions.js";
import type * as subscriptions from "../subscriptions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authActions: typeof authActions;
  boardingSchools: typeof boardingSchools;
  http: typeof http;
  profiles: typeof profiles;
  scholarships: typeof scholarships;
  seed: typeof seed;
  seedData: typeof seedData;
  seedDataBoardingSchools: typeof seedDataBoardingSchools;
  seedDataScraped: typeof seedDataScraped;
  stripeActions: typeof stripeActions;
  subscriptions: typeof subscriptions;
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
