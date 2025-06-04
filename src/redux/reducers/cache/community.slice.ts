import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CommunityOp from '@src/api/communityOperations';
import { ICommunity } from '@src/types/app';

export const fetchCommunity = createAsyncThunk('community/fetch', async (slug: string) => {
  const res = await CommunityOp.fetchCommunityDetails(slug);
  return res?.data;
});

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    cache: {} as Record<string, ICommunity>,
    loading: false,
  },
  reducers: {
    updateCommunity(state, action) {
      const { slug, updates } = action.payload;
      if (state.cache[slug]) {
        state.cache[slug] = {
          ...state.cache[slug],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunity.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        const community = action.payload;
        if (community) {
          state.cache[community.slug] = community;
        }
        state.loading = false;
      })
      .addCase(fetchCommunity.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateCommunity } = communitySlice.actions;

const communityReducer = communitySlice.reducer;
export default communityReducer;
