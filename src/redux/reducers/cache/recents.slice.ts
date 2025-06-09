import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from '@src/types/app';
import { localStorageUtil } from '@src/utils/localStorageUtil';
const { get, set } = localStorageUtil;

const recentPostKey = 'recent_posts';
const recentSearchKey = 'recent_search';

const recentPostLimit = 10;
const recentSearchLimit = 10;

export type RecentPostsState = Pick<
  IPost,
  | '_id'
  | 'title'
  | 'slug'
  | 'mediaUrls'
  | 'netVotes'
  | 'commentsCount'
  | 'communityId'
  | 'createdAt'
>;

type SearchType = 'community' | 'post';

interface RecentSearches {
  string: string;
  id: string;
  type: SearchType;
  slug?: string;
}

interface RecentState {
  searches: RecentSearches[];
  posts: RecentPostsState[];
}

const initialState: RecentState = {
  searches: get<RecentSearches[]>(recentSearchKey) ?? [],
  posts: get<RecentPostsState[]>(recentPostKey) ?? [],
};

const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    appendRecentSearch(state, action: PayloadAction<RecentSearches>) {
      console.log('appendRecentSearch', action.payload);
      const newSearch = {
        ...action.payload,
        string: action.payload.string.trim(),
      };

      const newSearchStrLower = newSearch.string.toLowerCase();

      state.searches = state.searches.filter((s) => s.string.toLowerCase() !== newSearchStrLower);

      state.searches.unshift(newSearch);

      if (state.searches.length > recentSearchLimit) {
        state.searches.pop();
      }

      console.log('state.searches', state.searches);
      set(recentSearchKey, state.searches);
    },

    appendRecentPost(state, action: PayloadAction<RecentPostsState>) {
      const newPost = action.payload;
      state.posts = state.posts.filter((p) => p._id !== newPost._id);
      state.posts.unshift(newPost);
      if (state.posts.length > recentPostLimit) {
        state.posts.pop();
      }
      set(recentPostKey, state.posts);
    },
    clearRecentSearches(state, action: PayloadAction<string>) {
      if (action?.payload) {
        state.searches = state.searches.filter((s) => s.string !== action.payload);
      } else {
        state.searches = [];
      }
      set(recentSearchKey, state.searches);
    },
    clearRecentPosts(state) {
      state.posts = [];
      set(recentPostKey, state.posts);
    },
  },
});

export const { appendRecentSearch, appendRecentPost, clearRecentSearches, clearRecentPosts } =
  recentSlice.actions;

const recentReducer = recentSlice.reducer;
export default recentReducer;
