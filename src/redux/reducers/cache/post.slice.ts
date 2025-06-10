import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchInitialPosts, fetchMorePosts } from '@src/redux/reducers/cache/post.thunks';
import { IPost } from '@src/types/app';

interface PostState {
  communityId: string;
  posts: IPost[];
  page: number;
  sort: string;
  hasMore: boolean;
  loading: boolean;
}

const initialState: PostState = {
  communityId: '',
  posts: [],
  sort: 'Top',
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
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setPosts(state, action: PayloadAction<IPost[]>) {
      state.posts = action.payload;
      state.page = 1;
      state.hasMore = action.payload.length > 0;
    },
    appendPosts(state, action: PayloadAction<IPost[]>) {
      const existingIds = new Set(state.posts.map((post) => post._id));
      const newPosts = action.payload.filter((post) => !existingIds.has(post._id));
      state.posts.push(...newPosts);
    },
    updatePost(state, action: PayloadAction<IPost>) {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    clearPosts(state, action: PayloadAction<string | undefined>) {
      if (action?.payload) {
        const updatedPosts = state.posts.filter((p) => p._id !== action.payload);
        state.posts = updatedPosts;
      } else {
        state.posts = [];
        state.page = 1;
        state.hasMore = true;
      }
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
        // post is being appended to in the thunk itself
        state.page = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
        state.posts = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchInitialPosts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        // post is being appended to in the thunk itself
        state.page = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
      });
  },
});

export const { setCommunityId, setPosts, appendPosts, updatePost, clearPosts, setPostsLoading } =
  postSlice.actions;

const postReducer = postSlice.reducer;
export default postReducer;
