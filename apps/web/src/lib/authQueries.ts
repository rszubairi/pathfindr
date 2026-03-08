import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useCurrentUser(userId: string | null) {
  return useConvexQuery(
    api.auth.getCurrentUser,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );
}

export function useAcademicProfile(userId: string | null) {
  return useConvexQuery(
    api.profiles.getByUserId,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );
}
