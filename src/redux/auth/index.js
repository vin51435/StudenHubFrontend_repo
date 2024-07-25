import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Check for token in localStorage
const token = localStorage.getItem('accessToken');
const user = token ? jwtDecode(token) : null;

const initialState = {
  isAuthenticated: !!token, // Set to true if token exists
  user: user, // Set to user if token exists
};

// const initialState = {
//   isAuthenticated: false,
//   user: null,
// };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
