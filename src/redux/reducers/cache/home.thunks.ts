import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '@src/libs/apiConfig';
import { setHomePosts, setHomePostsLoading } from '@src/redux/reducers/cache/home.slice';
import { IPaginatedResponse } from '@src/types';
import { IPost } from '@src/types/app';

export const fetchHomeFeed = createAsyncThunk(
  '',
  async (
    {
      page,
      sort,
    }: {
      page: number;
      sort: string;
    },
    { dispatch }
  ) => {
    const res = await get<{}, IPaginatedResponse<IPost>>('FEED', { BASE_URLS: 'user' });
    const data = { ...res, type: 'feed' };
    return data;
  }
);
