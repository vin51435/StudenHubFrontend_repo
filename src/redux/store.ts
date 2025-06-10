import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import notificationReducer from './reducers/notifications';
import uiReducer from '@src/redux/reducers/uiSlice';
import communityReducer from '@src/redux/reducers/cache/community.slice';
import postReducer from '@src/redux/reducers/cache/post.slice';
import inboxReducer from '@src/redux/reducers/cache/inbox.slice';
import homeReducer from '@src/redux/reducers/cache/home.slice';
import recentReducer from '@src/redux/reducers/cache/recents.slice';
import { popularPostsReducer } from '@src/redux/reducers/cache/popularPosts.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    ui: uiReducer,
    communityCache: communityReducer,
    postCache: postReducer,
    chatInboxCache: inboxReducer,
    homeCache: homeReducer,
    recentStore: recentReducer,
    popularFeedCache: popularPostsReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

// Export RootState and AppDispatch for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
