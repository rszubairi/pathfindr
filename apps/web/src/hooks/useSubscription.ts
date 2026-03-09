'use client';

import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from './useAuth';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useSubscription() {
  const { user, isAuthenticated } = useAuth();

  const subscription = useConvexQuery(
    api.subscriptions.getUserSubscription,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  return {
    subscription: subscription ?? null,
    isSubscribed: !!subscription && subscription.status === 'active',
    tier: subscription?.tier ?? null,
    applicationsUsed: subscription?.applicationsUsed ?? 0,
    applicationsLimit: subscription?.applicationsLimit ?? 0,
    isLoading: isAuthenticated && subscription === undefined,
  };
}
