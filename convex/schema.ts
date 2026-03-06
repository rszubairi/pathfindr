import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  scholarships: defineTable({
    name: v.string(),
    provider: v.string(),
    providerType: v.union(
      v.literal('government'),
      v.literal('university'),
      v.literal('corporate'),
      v.literal('ngo'),
      v.literal('foundation'),
      v.literal('individual')
    ),
    value: v.number(),
    currency: v.string(),
    eligibleFields: v.array(v.string()),
    eligibleCountries: v.array(v.string()),
    deadline: v.string(),
    eligibilityCriteria: v.any(),
    matchScore: v.optional(v.number()),
    status: v.union(v.literal('active'), v.literal('closed'), v.literal('pending')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_status', ['status'])
    .index('by_deadline', ['deadline'])
    .index('by_value', ['value'])
    .index('by_created_at', ['createdAt'])
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['status'],
    })
    .searchIndex('search_provider', {
      searchField: 'provider',
      filterFields: ['status'],
    }),
});
