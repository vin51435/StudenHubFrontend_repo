import { createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie } from '@src/utils/cookieGetterSetter';

const token = getCookie('accessToken');

const initialState = {
  isAuthenticated: false,
  user: null,
  token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
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
export const selectAuthToken = (state) => state.auth.token;
export default authSlice.reducer;
