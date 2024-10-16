import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@src/redux/reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
