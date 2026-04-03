import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { uapReducer } from './slices/uapSlice';
import learningReducer from './slices/learningSlice';
import kidProfilesReducer from './slices/kidProfilesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uap: uapReducer,
    learning: learningReducer,
    kidProfiles: kidProfilesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;