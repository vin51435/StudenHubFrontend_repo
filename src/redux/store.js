import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@src/redux/reducer';
import notificationReducer from '@src/redux/reducer/notification';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer
  },
});

export default store;
