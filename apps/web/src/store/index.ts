import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { uapReducer } from './slices/uapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uap: uapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
