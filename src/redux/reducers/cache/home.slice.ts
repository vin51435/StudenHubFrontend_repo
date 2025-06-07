import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchHomeFeed } from '@src/redux/reducers/cache/home.thunks';
import { IPost } from '@src/types/app';

type feedType = 'home' | 'latest' | 'popular';

const initialState: {
  type: feedType;
  posts: IPost[];
  recentlyViewed: IPost[];
  page: number;
  hasMore: boolean;
  loading: boolean;
} = {
  type: 'home',
  posts: [],
  recentlyViewed: [],
  page: 1,
  hasMore: false,
  loading: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomePostsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHomePosts(state, action: PayloadAction<{ posts: IPost[]; type: feedType }>) {
      state.posts = action.payload.posts;
      state.type = action.payload.type;
      state.page = 1;
      state.hasMore = action.payload.posts.length > 0;
    },
    appendHomePosts(state, action: PayloadAction<IPost[]>) {
      state.posts.push(...action.payload);
      state.page += 1;
      state.hasMore = action.payload.length > 0;
    },
    updateHomePosts(state, action: PayloadAction<IPost>) {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchHomeFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeFeed.fulfilled, (state, action) => {
        state.posts = action.payload.data;
        state.type = action.payload.type as feedType;
        state.loading = false;
      })
      .addCase(fetchHomeFeed.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setHomePostsLoading, setHomePosts, appendHomePosts, updateHomePosts } =
  homeSlice.actions;

const homeReducer = homeSlice.reducer;
export default homeReducer;
