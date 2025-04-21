import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import notificationReducer from './reducers/notifications';
import uiReducer from '@src/redux/reducers/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

// Export RootState and AppDispatch for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
