import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../types/user.types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const userJson = localStorage.getItem('authUser');
const accessToken = localStorage.getItem('accessToken');

const initialState: AuthState = {
  user: userJson ? (JSON.parse(userJson) as AuthUser) : null,
  token: accessToken,
  isAuthenticated: Boolean(userJson && accessToken)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
      localStorage.setItem('accessToken', action.payload.accessToken);

      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = Boolean(state.user);
      localStorage.setItem('accessToken', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});

export const { setAccessToken, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
