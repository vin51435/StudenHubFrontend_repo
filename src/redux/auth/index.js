import { createSlice } from '@reduxjs/toolkit';
import { cookieExpiry } from '@src/config/config';
import { getCookie, setCookie } from '@src/utils/cookieGetterSetter';
import { jwtDecode } from 'jwt-decode';

// Check for token in cookie
const token = getCookie('accessToken');
// const user = token ? jwtDecode(token) : null;

const initialState = {
  isAuthenticated: false,
  user: {},
  token,
};

/* 
const initialState = {
  isAuthenticated: !!token, // Set to true if token exists
  user: user, // Set to user if token exists
  token: token, // Store token in state
};
*/

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      setCookie('accessToken', action.payload.token);
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
