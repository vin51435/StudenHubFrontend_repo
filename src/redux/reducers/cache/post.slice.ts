import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchInitialPosts, fetchMorePosts } from '@src/redux/reducers/cache/post.thunks';
import { IPost } from '@src/types/app';

interface PostState {
  communityId: string;
  posts: IPost[];
  page: number;
  hasMore: boolean;
  loading: boolean;
}

const initialState: PostState = {
  communityId: '',
  posts: [],
  page: 1,
  hasMore: true,
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCommunityId(state, action: PayloadAction<string>) {
      state.communityId = action.payload;
    },
    setPosts(state, action: PayloadAction<IPost[]>) {
      state.posts = action.payload;
      state.page = 1;
      state.hasMore = action.payload.length > 0;
    },
    appendPosts(state, action: PayloadAction<IPost[]>) {
      state.posts.push(...action.payload);
      state.page += 1;
      state.hasMore = action.payload.length > 0;
    },
    updatePost(state, action: PayloadAction<IPost>) {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    clearPosts(state) {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    setPostsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInitialPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchInitialPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCommunityId, setPosts, appendPosts, updatePost, clearPosts, setPostsLoading } =
  postSlice.actions;

const postReducer = postSlice.reducer;
export default postReducer;
