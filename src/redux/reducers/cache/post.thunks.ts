import { createAsyncThunk } from '@reduxjs/toolkit';
import CommunityOp from '@src/api/communityOperations';
import { appendPosts, setCommunityId } from '@src/redux/reducers/cache/post.slice';
import { RootState } from '@src/redux/store';
import { IPaginatedResponse } from '@src/types';
import { IPost } from '@src/types/app';

export const fetchInitialPosts = createAsyncThunk<
  IPaginatedResponse<IPost>,
  { communityId: string; sort: string; range?: string; searchValue?: string }
>('posts/fetchInitial', async ({ communityId, sort, range, searchValue }, { dispatch }) => {
  dispatch(setCommunityId(communityId));
  const callFnc = searchValue ? CommunityOp.debounceGetAllPosts : CommunityOp.getAllPosts;
  const res = await callFnc(communityId, '1', sort, range, searchValue);
  return res;
});

export const fetchMorePosts = createAsyncThunk<
  IPaginatedResponse<IPost>,
  { sort: string; range?: string },
  { state: RootState }
>('posts/fetchMore', async ({ sort, range }, { dispatch, getState }) => {
  const postCache = getState().postCache;

  const res = await CommunityOp.getAllPosts(
    postCache.communityId,
    String(Number(postCache.page) + 1),
    sort,
    range
  );
  dispatch(appendPosts(res.data));
  return res;
});
