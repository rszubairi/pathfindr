'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useNotify(scholarshipId: string) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSubscribed = useConvexQuery(
    api.notifications.hasUserSubscribed,
    user
      ? {
          userId: user._id as Id<'users'>,
          scholarshipId: scholarshipId as Id<'scholarships'>,
        }
      : 'skip'
  );

  const subscribeMutation = useMutation(api.notifications.subscribe);
  const unsubscribeMutation = useMutation(api.notifications.unsubscribe);

  const toggleNotify = async () => {
    if (!isAuthenticated || !user) {
      router.push(
        `/register?redirect=${encodeURIComponent(`/scholarships/detail?id=${scholarshipId}`)}`
      );
      return;
    }

    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeMutation({
          userId: user._id as Id<'users'>,
          scholarshipId: scholarshipId as Id<'scholarships'>,
        });
      } else {
        await subscribeMutation({
          userId: user._id as Id<'users'>,
          scholarshipId: scholarshipId as Id<'scholarships'>,
          email: user.email,
        });
      }
    } catch (err) {
      console.error('Failed to toggle notification:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isSubscribed: !!isSubscribed,
    toggleNotify,
    loading,
  };
}
