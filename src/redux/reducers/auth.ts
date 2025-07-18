import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, LoginPayload } from '@src/types/redux';
import { RootState } from '@src/redux/store';
import { getCookie, setCookie } from '@src/utils/cookieGetterSetter';
import { IUser } from '@src/types/app';

// Token is no longer used, http-only cookies are used

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
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.redirectUrl = action.payload.redirectUrl ?? null;
      if (action.payload.user) {
        state.isAuthenticated = true;
      }
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
    setRedirectUrl: (state, action: PayloadAction<string>) => {
      state.redirectUrl = action.payload;
    },
  },
});

export const { loginSuccess, logoutSuccess, setRedirectUrl, updateUser } = authSlice.actions;
export const selectAuthToken = (state: RootState) => state.auth.token;

const authReducer = authSlice.reducer;
export default authReducer;
