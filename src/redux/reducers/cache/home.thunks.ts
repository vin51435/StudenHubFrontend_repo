import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '@src/libs/apiConfig';
import { RootState } from '@src/redux/store';
import { IPaginatedResponse } from '@src/types';
import { IPost } from '@src/types/app';

export const fetchHomeFeed = createAsyncThunk<
  IPaginatedResponse<IPost>,
  {
    page: number;
    sort: string;
    fresh?: boolean;
  }
>('home/fetchHomeFeed', async ({ page, sort, fresh }, { dispatch }) => {
  const res = await get<{}, IPaginatedResponse<IPost>>('FEED', {
    BASE_URLS: 'user',
    queries: [{ fresh, page: String(page) }],
  });
  return res;
});

export const fetchMoreHomeFeed = createAsyncThunk<
  IPaginatedResponse<IPost>,
  {},
  { state: RootState }
>('home/fetchMore', async ({}, { dispatch, getState }) => {
  const homeFeedCache = getState().homeCache;
  const res = await get<{}, IPaginatedResponse<IPost>>('FEED', {
    BASE_URLS: 'user',
    queries: [{ page: String(Number(homeFeedCache.page) + 1) }],
  });
  return res;
});
