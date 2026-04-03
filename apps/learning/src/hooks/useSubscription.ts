import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useSubscription() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const subscription = useConvexQuery(
    api.subscriptions.getUserSubscription,
    user ? { userId: user.id as Id<'users'> } : 'skip'
  );

  return {
    subscription: subscription ?? null,
    isSubscribed: !!subscription && subscription.status === 'active',
    tier: subscription?.tier ?? null,
    applicationsUsed: subscription?.applicationsUsed ?? 0,
    applicationsLimit: subscription?.applicationsLimit ?? 0,
    isDonated: subscription?.isDonated ?? false,
    donatedBy: subscription?.donatedBy ?? null,
    isLoading: isAuthenticated && subscription === undefined,
  };
}
