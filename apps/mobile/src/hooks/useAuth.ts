import { useEffect, useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, logout as logoutAction } from '@/store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import type { RootState } from '@/store';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [userId, setUserId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load userId from secure store on mount
  useEffect(() => {
    async function loadAuth() {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedToken) {
          dispatch(setToken(storedToken));
        }
      } catch {
        // Secure store not available (e.g., Expo Go limitations)
      } finally {
        setInitializing(false);
      }
    }
    loadAuth();
  }, [dispatch]);

  // Query current user from Convex
  const currentUser = useConvexQuery(
    api.auth.getCurrentUser,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );

  // Sync Convex user to Redux
  useEffect(() => {
    if (currentUser && !user) {
      dispatch(
        setUser({
          id: currentUser._id,
          email: currentUser.email,
          fullName: currentUser.fullName,
          role: currentUser.role,
          profileCompleted: currentUser.profileCompleted,
          profileImageUrl: currentUser.profileImageUrl,
        })
      );
    }
  }, [currentUser, user, dispatch]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('userId');
    } catch {
      // Ignore secure store errors
    }
    dispatch(logoutAction());
    setUserId(null);
  };

  return {
    user: currentUser,
    isAuthenticated: !!userId && (!!currentUser || !!user),
    profileCompleted: currentUser?.profileCompleted ?? false,
    logout,
    loading: initializing || (userId !== null && currentUser === undefined),
  };
}
