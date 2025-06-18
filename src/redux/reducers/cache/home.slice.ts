import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchHomeFeed, fetchMoreHomeFeed } from '@src/redux/reducers/cache/home.thunks';
import { IPost } from '@src/types/app';

type feedType = 'home' | 'latest' | 'popular';

const initialState: {
  posts: IPost[];
  recentlyViewed: IPost[];
  page: number;
  hasMore: boolean;
  loading: boolean;
} = {
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
      state.page = 1;
    },
    appendHomePosts(state, action: PayloadAction<IPost[]>) {
      state.posts.push(...action.payload);
      state.page += 1;
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
        state.loading = false;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomeFeed.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMoreHomeFeed.fulfilled, (state, action) => {
        state.hasMore = action.payload.hasMore;
        state.posts.push(...action.payload.data);
      });
  },
});

export const { setHomePostsLoading, setHomePosts, appendHomePosts, updateHomePosts } =
  homeSlice.actions;

const homeReducer = homeSlice.reducer;
export default homeReducer;
