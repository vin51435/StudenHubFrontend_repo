import { createSlice } from '@reduxjs/toolkit';

const userEdProfileSlice = createSlice({
  name: 'userEdProfile',
  initialState: {
    user:null,
    userEdProfile:null
  },
  reducers: {
    updateUserEdProfile: (state, action) => {
      state.user = action.payload.user;
      state.userEdProfile = action.payload.userEdProfile;
    },
  },
});

export const { updateUserEdProfile } = userEdProfileSlice.actions;

export default userEdProfileSlice.reducer;
