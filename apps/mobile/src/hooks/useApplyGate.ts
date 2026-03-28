import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSubscription } from './useSubscription';
import type { Id } from '../../../../convex/_generated/dataModel';

export type GateReason = 'auth' | 'subscribe' | 'limit_reached' | 'already_applied';

export type GateResult =
  | { allowed: true }
  | { allowed: false; reason: GateReason };

export function useApplyGate(scholarshipId: string) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {
    isSubscribed,
    tier,
    applicationsUsed,
    applicationsLimit,
    isLoading: subLoading,
  } = useSubscription();

  const alreadyApplied = useConvexQuery(
    api.subscriptions.hasUserApplied,
    user
      ? {
          userId: user.id as Id<'users'>,
          scholarshipId: scholarshipId as Id<'scholarships'>,
        }
      : 'skip'
  );

  const createApplicationMutation = useMutation(api.subscriptions.createApplication);

  function checkGate(): GateResult {
    if (!isAuthenticated) return { allowed: false, reason: 'auth' };
    if (!isSubscribed) return { allowed: false, reason: 'subscribe' };
    if (alreadyApplied) return { allowed: false, reason: 'already_applied' };
    if (applicationsUsed >= applicationsLimit)
      return { allowed: false, reason: 'limit_reached' };
    return { allowed: true };
  }

  async function apply() {
    if (!user) throw new Error('Not authenticated');
    await createApplicationMutation({
      userId: user.id as Id<'users'>,
      scholarshipId: scholarshipId as Id<'scholarships'>,
    });
  }

  return {
    checkGate,
    apply,
    alreadyApplied: !!alreadyApplied,
    loading: subLoading || (isAuthenticated && alreadyApplied === undefined),
    tier,
    applicationsUsed,
    applicationsLimit,
    isSubscribed,
    isAuthenticated,
  };
}
