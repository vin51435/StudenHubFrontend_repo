import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserOp from '@src/api/userOperations';
import {
  fetchMorePopularFeedThunk,
  fetchPopularFeedThunk,
} from '@src/redux/reducers/cache/popularPosts.thunks';
import { IPost } from '@src/types/app';

interface GlobalPopularPostState {
  posts: IPost[];
  loading: boolean;
  page: number;
  hasMore: boolean;
}

const initialState: GlobalPopularPostState = {
  posts: [],
  loading: false,
  page: 1,
  hasMore: true,
};

const popularPostsSlice = createSlice({
  name: 'popularPosts',
  initialState,
  reducers: {
    setPopularPosts(state, action: PayloadAction<IPost[]>) {
      state.posts = action.payload;
      state.loading = false;
    },
    setPopularLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    appendPopularPosts(state, action: PayloadAction<IPost[]>) {
      const existingIds = new Set(state.posts.map((post) => post._id));
      const newPosts = action.payload.filter((post) => !existingIds.has(post._id));
      state.posts.push(...newPosts);
    },
    updatePopularPosts(state, action: PayloadAction<Partial<IPost>>) {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload,
        };
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPopularFeedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularFeedThunk.fulfilled, (state, action) => {
        state.posts = action.payload.data;
        state.page = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
        state.loading = false;
      })
      .addCase(fetchPopularFeedThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMorePopularFeedThunk.fulfilled, (state, action) => {
        // page is appended in thunk itself
        state.page = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
      });
  },
});

export const { setPopularPosts, setPopularLoading, appendPopularPosts, updatePopularPosts } =
  popularPostsSlice.actions;

export const popularPostsReducer = popularPostsSlice.reducer;
export default popularPostsSlice;
