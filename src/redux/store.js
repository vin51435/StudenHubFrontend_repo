import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@src/redux/auth';
import userEdProfileReducer from './auth/userEducationProfile';

const store = configureStore({
  reducer: {
    auth: authReducer,
    userEdProfile:userEdProfileReducer
  },
});

export default store;
