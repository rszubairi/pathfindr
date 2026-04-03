import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UAP {
  id?: string;
  profileCompleteness: number;
  personalDetails: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

interface UAPState {
  profile: UAP | null;
  loading: boolean;
  error: string | null;
}

const initialState: UAPState = {
  profile: null,
  loading: false,
  error: null,
};

const uapSlice = createSlice({
  name: 'uap',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UAP>) {
      state.profile = action.payload;
    },
    updateProfileField(state, action: PayloadAction<Partial<UAP>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setProfile, updateProfileField, setLoading, setError } = uapSlice.actions;
export const uapReducer = uapSlice.reducer;
