import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KidProfile {
    id: string;
    userId: string;
    name: string;
    dateOfBirth: string;
    grade: string;
    learningGoals?: string[];
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface KidProfilesState {
    profiles: KidProfile[];
    selectedProfile: KidProfile | null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    error: string | null;
}

const initialState: KidProfilesState = {
    profiles: [],
    selectedProfile: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
};

const kidProfilesSlice = createSlice({
    name: 'kidProfiles',
    initialState,
    reducers: {
        // Profile list actions
        setProfiles: (state, action: PayloadAction<KidProfile[]>) => {
            state.profiles = action.payload;
            state.isLoading = false;
        },
        addProfile: (state, action: PayloadAction<KidProfile>) => {
            state.profiles.push(action.payload);
            state.isCreating = false;
        },
        updateProfile: (state, action: PayloadAction<KidProfile>) => {
            const index = state.profiles.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.profiles[index] = action.payload;
            }
            state.isUpdating = false;
        },
        removeProfile: (state, action: PayloadAction<string>) => {
            state.profiles = state.profiles.filter(p => p.id !== action.payload);
            if (state.selectedProfile?.id === action.payload) {
                state.selectedProfile = null;
            }
        },

        // Selected profile actions
        setSelectedProfile: (state, action: PayloadAction<KidProfile | null>) => {
            state.selectedProfile = action.payload;
        },

        // Loading state actions
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCreating: (state, action: PayloadAction<boolean>) => {
            state.isCreating = action.payload;
        },
        setUpdating: (state, action: PayloadAction<boolean>) => {
            state.isUpdating = action.payload;
        },

        // Error actions
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Reset
        resetKidProfilesState: () => initialState,
    },
});

export const {
    setProfiles,
    addProfile,
    updateProfile,
    removeProfile,
    setSelectedProfile,
    setLoading,
    setCreating,
    setUpdating,
    setError,
    clearError,
    resetKidProfilesState,
} = kidProfilesSlice.actions;

export default kidProfilesSlice.reducer;