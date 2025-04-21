import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, LoginPayload } from '@src/types/redux';
import { RootState } from '@src/redux/store';
import { getCookie, setCookie } from '@src/utils/cookieGetterSetter';

const token = getCookie('accessToken');

const initialState: AuthState = {
  isAuthenticated: false,
  redirectUrl: null,
  user: null,
  token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.redirectUrl = action.payload.redirectUrl ?? null;

      if (action.payload.token) {
        state.token = action.payload.token;
        setCookie('accessToken', action.payload.token);
      }
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      setCookie('accessToken', '', { delete: true });
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export const selectAuthToken = (state: RootState) => state.auth.token;

const authReducer = authSlice.reducer;
export default authReducer;
