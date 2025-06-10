import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserOp from '@src/api/userOperations';
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

export const fetchPopularFeedThunk = createAsyncThunk(
  'popularPosts/fetch',
  async ({}, { dispatch }) => {
    const res = await UserOp.fetchGlobalPopularFeed();
    return res.data;
  }
);

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
      state.posts.push(...action.payload);
      state.page += 1;
      state.hasMore = action.payload.length > 0;
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
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPopularFeedThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPopularPosts, setPopularLoading, appendPopularPosts, updatePopularPosts } =
  popularPostsSlice.actions;

export const popularPostsReducer = popularPostsSlice.reducer;
export default popularPostsSlice;
