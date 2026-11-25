import { createSlice } from '@reduxjs/toolkit';
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from '../utils/authStorage';

const existingSession = loadAuthSession();

const initialState = {
  isAuthenticated: Boolean(existingSession),
  user: existingSession ? existingSession.user : null,
  rememberMe: existingSession ? existingSession.rememberMe : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, rememberMe } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.rememberMe = Boolean(rememberMe);
      saveAuthSession(user, Boolean(rememberMe));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.rememberMe = false;
      clearAuthSession();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
