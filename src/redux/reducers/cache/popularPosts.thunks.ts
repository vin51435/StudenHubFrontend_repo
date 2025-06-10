import { createAsyncThunk } from '@reduxjs/toolkit';
import UserOp from '@src/api/userOperations';
import { appendPopularPosts } from '@src/redux/reducers/cache/popularPosts.slice';
import { RootState } from '@src/redux/store';
import { IPaginatedResponse } from '@src/types';
import { IPost } from '@src/types/app';

export const fetchPopularFeedThunk = createAsyncThunk<IPaginatedResponse<IPost>, { sort: string }>(
  'popularPosts/fetch',
  async ({ sort }) => {
    const res = await UserOp.fetchGlobalPopularFeed({ sortField: sort, page: '1', fresh: true });
    return res;
  }
);

export const fetchMorePopularFeedThunk = createAsyncThunk<
  IPaginatedResponse<IPost>,
  { sort: string },
  { state: RootState }
>('popularPosts/fetchMore', async ({ sort }, { getState, dispatch }) => {
  const popularPostsCache = getState().popularFeedCache;
  const res = await UserOp.fetchGlobalPopularFeed({
    sortField: sort,
    page: String(Number(popularPostsCache.page) + 1),
  });
  dispatch(appendPopularPosts(res.data));
  return res;
});
