import { createAsyncThunk } from '@reduxjs/toolkit';
import CommunityOp from '@src/api/communityOperations';
import {
  setPosts,
  appendPosts,
  setPostsLoading,
  setCommunityId,
} from '@src/redux/reducers/cache/post.slice';

export const fetchInitialPosts = createAsyncThunk(
  'posts/fetchInitial',
  async (
    {
      communityId,
      sort,
      range,
      searchValue,
    }: { communityId: string; sort: string; range?: string; searchValue?: string },
    { dispatch }
  ) => {
    dispatch(setPostsLoading(true));
    dispatch(setCommunityId(communityId));
    const callFnc = searchValue ? CommunityOp.debounceGetAllPosts : CommunityOp.getAllPosts;
    const res = await callFnc(communityId, '1', sort, range, searchValue);
    dispatch(setPosts(res.data));
    dispatch(setPostsLoading(false));
    return res.data;
  }
);

export const fetchMorePosts = createAsyncThunk(
  'posts/fetchMore',
  async (
    {
      communityId,
      page,
      sort,
      range,
    }: { communityId: string; page: number; sort: string; range?: string },
    { dispatch }
  ) => {
    const res = await CommunityOp.getAllPosts(communityId, page.toString(), sort, range);
    dispatch(appendPosts(res.data));
    return res.data;
  }
);
