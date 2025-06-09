import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CommunityOp from '@src/api/communityOperations';
import { ICommunity } from '@src/types/app';

export const fetchCommunity = createAsyncThunk('community/fetch', async (slug: string) => {
  const res = await CommunityOp.fetchCommunityDetails(slug);
  return res?.data;
});

const initialState: { cache: ICommunity | null; loading: boolean; slug: string } = {
  cache: null,
  loading: true,
  slug: '',
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    updateCommunity(state, action: PayloadAction<Partial<ICommunity>>) {
      if (state.cache) {
        state.cache = {
          ...state.cache,
          ...action.payload,
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
          state.slug = community.slug;
          state.cache = community;
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
