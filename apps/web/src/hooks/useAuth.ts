'use client';

import { useEffect, useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, setToken, logout as logoutAction } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // Read userId from localStorage on mount (client-side only)
  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  // Query current user from Convex
  const currentUser = useConvexQuery(
    api.auth.getCurrentUser,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );

  // Sync Convex user data to Redux
  useEffect(() => {
    if (currentUser && !user) {
      dispatch(
        setUser({
          id: currentUser._id,
          email: currentUser.email,
          fullName: currentUser.fullName,
          role: currentUser.role,
        })
      );

      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        dispatch(setToken(storedToken));
      }
    }
  }, [currentUser, user, dispatch]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch(logoutAction());
    setUserId(null);
    router.push('/');
  };

  return {
    user: currentUser,
    isAuthenticated: !!userId && (!!currentUser || !!user),
    profileCompleted: currentUser?.profileCompleted ?? false,
    logout,
    loading: userId !== null && currentUser === undefined,
  };
}
